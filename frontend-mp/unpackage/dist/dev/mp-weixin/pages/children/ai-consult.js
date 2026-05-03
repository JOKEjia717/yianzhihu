"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      messages: [],
      inputMessage: "",
      scrollTop: 0,
      isLoading: false,
      sessionId: "123",
      streamResponse: "",
      tempImagePath: ""
      // 临时存储选中的图片路径
    };
  },
  onLoad() {
    this.messages.push({
      content: "您好！我是您的AI助手，请问有什么可以帮您？",
      type: "ai",
      timestamp: Date.now()
    });
  },
  methods: new UTSJSONObject({
    goBack() {
      common_vendor.index.navigateBack(new UTSJSONObject({
        delta: 1
      }));
    },
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.tempImagePath = res.tempFilePaths[0];
          if (this.inputMessage.trim()) {
            this.sendMessage();
          }
        }
      }));
    },
    sendMessage() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.inputMessage.trim() && !this.tempImagePath) {
          common_vendor.index.showToast({
            title: "请输入内容或选择图片",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        const userMessage = {
          content: this.inputMessage,
          type: "user",
          timestamp: Date.now()
        };
        if (this.tempImagePath) {
          userMessage.imageUrl = this.tempImagePath;
        }
        this.messages.push(userMessage);
        const tempMessage = this.inputMessage;
        this.inputMessage = "";
        const tempImage = this.tempImagePath;
        this.tempImagePath = "";
        this.scrollToBottom();
        try {
          this.isLoading = true;
          const aiMessage = {
            content: "",
            type: "ai",
            timestamp: Date.now()
          };
          this.messages.push(aiMessage);
          if (tempImage) {
            yield this.uploadImage(tempImage, tempMessage);
          } else {
            this.handleStreamResponse(tempMessage);
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: error.message || "发送失败，请重试",
            icon: "none"
          });
          if (this.messages.length > 0 && this.messages[this.messages.length - 1].content === "") {
            UTS.arrayPop(this.messages);
          }
          this.isLoading = false;
        }
      });
    },
    // 上传图片
    uploadImage(imagePath, message) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          if (this.messages.length > 0) {
            this.messages[this.messages.length - 1].content = "正在分析图片，请稍候...";
          }
          common_vendor.index.showLoading({
            title: "正在分析图片...",
            mask: true
          });
          common_vendor.index.uploadFile({
            url: "http://localhost:8080/deepSeek/imagesQuestion",
            filePath: imagePath,
            name: "file",
            formData: new UTSJSONObject({
              msg: message
            }),
            header: new UTSJSONObject({
              "accessToken": common_vendor.index.getStorageSync("accessToken") || "",
              "refreshToken": common_vendor.index.getStorageSync("refreshToken") || ""
            }),
            success: (uploadFileRes) => {
              try {
                const response = UTS.JSON.parse(uploadFileRes.data);
                if (response.code === 1) {
                  this.pollImageResult(response.data);
                } else {
                  common_vendor.index.showToast({
                    title: response.msg || "图片分析失败",
                    icon: "none"
                  });
                  this.isLoading = false;
                }
              } catch (error) {
                common_vendor.index.showToast({
                  title: "解析响应失败",
                  icon: "none"
                });
                this.isLoading = false;
              }
            },
            fail: (error) => {
              common_vendor.index.showToast({
                title: "图片上传失败",
                icon: "none"
              });
              this.isLoading = false;
            },
            complete: () => {
              common_vendor.index.hideLoading();
            }
          });
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "图片上传失败",
            icon: "none"
          });
          this.isLoading = false;
        }
      });
    },
    // 轮询获取图片分析结果
    pollImageResult(taskId) {
      const self = this;
      let retryCount = 0;
      const maxRetries = 20;
      const poll = () => {
        if (retryCount >= maxRetries) {
          common_vendor.index.showToast({
            title: "获取结果超时",
            icon: "none"
          });
          self.isLoading = false;
          return null;
        }
        common_vendor.index.request({
          url: `http://localhost:8080/deepSeek/getPictureAns?taskId=${taskId}`,
          method: "GET",
          header: new UTSJSONObject({
            "accessToken": common_vendor.index.getStorageSync("accessToken") || "",
            "refreshToken": common_vendor.index.getStorageSync("refreshToken") || ""
          }),
          success: (res) => {
            const response = res.data;
            if (response.code === 1) {
              const answer = response.data;
              let currentIndex = 0;
              const interval = setInterval(() => {
                if (currentIndex < answer.length) {
                  if (self.messages.length > 0) {
                    self.messages[self.messages.length - 1].content = answer.substring(0, currentIndex + 1);
                  }
                  currentIndex++;
                  self.scrollToBottom();
                } else {
                  clearInterval(interval);
                  self.isLoading = false;
                }
              }, 50);
            } else if (response.code === 0) {
              retryCount++;
              setTimeout(poll, 1e3);
            } else {
              common_vendor.index.showToast({
                title: response.msg || "获取结果失败",
                icon: "none"
              });
              self.isLoading = false;
            }
          },
          fail: (error) => {
            common_vendor.index.showToast({
              title: "获取结果失败",
              icon: "none"
            });
            self.isLoading = false;
          }
        });
      };
      poll();
    },
    handleStreamResponse(userInput) {
      this.streamResponse = "";
      const url = `http://localhost:8080/deepSeek/stream?content=${encodeURIComponent(userInput)}&sessionId=${this.sessionId}`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "text/event-stream");
      const accessToken = common_vendor.index.getStorageSync("accessToken");
      const refreshToken = common_vendor.index.getStorageSync("refreshToken");
      if (accessToken) {
        xhr.setRequestHeader("accessToken", accessToken);
      }
      if (refreshToken) {
        xhr.setRequestHeader("refreshToken", refreshToken);
      }
      const self = this;
      let buffer = "";
      xhr.responseType = "text";
      xhr.onprogress = function() {
        const newData = xhr.responseText.substring(buffer.length);
        buffer = xhr.responseText;
        if (newData.trim()) {
          const lines = newData.split("\n");
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("data:")) {
              if (line === "data:[DONE]") {
                continue;
              }
              try {
                const dataContent = line.substring(5);
                const jsonData = UTS.JSON.parse(dataContent);
                if (jsonData.choices && jsonData.choices.length > 0 && jsonData.choices[0].delta && jsonData.choices[0].delta.content !== void 0) {
                  const content = jsonData.choices[0].delta.content;
                  self.streamResponse += content;
                  if (self.messages.length > 0) {
                    self.messages[self.messages.length - 1].content = self.streamResponse;
                  }
                  self.scrollToBottom();
                }
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/children/ai-consult.uvue:373", "解析响应数据失败:", error);
              }
            }
          }
        }
      };
      xhr.onload = function() {
        if (xhr.status === 200) {
          self.isLoading = false;
        } else {
          common_vendor.index.showToast({
            title: "获取响应失败",
            icon: "none"
          });
          self.isLoading = false;
        }
      };
      xhr.onerror = function() {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
        self.isLoading = false;
      };
      xhr.send();
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollTop = 9999999;
      }, 100);
    },
    loadMoreMessages() {
      common_vendor.index.__f__("log", "at pages/children/ai-consult.uvue:416", "加载更多消息");
    },
    // 取消选中图片
    removeImage() {
      this.tempImagePath = "";
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.messages, (message, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(message.content),
        b: message.imageUrl
      }, message.imageUrl ? {
        c: message.imageUrl
      } : {}, {
        d: index,
        e: common_vendor.n(message.type)
      });
    }),
    c: $data.scrollTop,
    d: common_vendor.o((...args) => $options.loadMoreMessages && $options.loadMoreMessages(...args)),
    e: $data.tempImagePath
  }, $data.tempImagePath ? {
    f: $data.tempImagePath,
    g: common_vendor.o((...args) => $options.removeImage && $options.removeImage(...args))
  } : {}, {
    h: common_assets._imports_0$7,
    i: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    j: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    k: $data.inputMessage,
    l: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    m: common_vendor.t($data.isLoading ? "回复中..." : "发送"),
    n: $data.isLoading,
    o: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    p: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/ai-consult.js.map
