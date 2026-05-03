"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      userInfo: {
        avatar: "",
        nickname: "",
        phone: "",
        childrenId: "",
        isEnable: 0
      },
      showPopup: false,
      formData: {
        avatar: "",
        tempAvatarPath: "",
        nickname: "",
        phone: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    };
  },
  onShow() {
    this.loadUserInfo();
  },
  methods: {
    goToCart() {
      const accessToken = common_vendor.index.getStorageSync("accessToken");
      if (!accessToken) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1500
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
        }, 1500);
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/children/cart",
        success: () => {
          common_vendor.index.__f__("log", "at pages/children/mine.uvue:147", "跳转成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/mine.uvue:150", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面加载失败",
            icon: "none"
          });
        }
      });
    },
    loadUserInfo() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = {
          avatar: userInfo.avatar ? userInfo.avatar : "/static/images/default-avatar.png",
          nickname: userInfo.name || "未设置昵称",
          phone: userInfo.phone || "未绑定手机号",
          childrenId: userInfo.childrenId || "",
          isEnable: userInfo.isEnable || 0
        };
      } else {
        this.userInfo.avatar = "/static/images/default-avatar.png";
      }
    },
    showEditForm() {
      this.formData = {
        avatar: this.userInfo.avatar,
        tempAvatarPath: "",
        nickname: this.userInfo.nickname,
        phone: this.userInfo.phone,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      };
      this.showPopup = true;
    },
    hideEditForm() {
      this.showPopup = false;
    },
    chooseAvatar() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield common_vendor.index.chooseImage(new UTSJSONObject({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"]
          }));
          if (res.tempFilePaths.length > 0) {
            this.formData.avatar = res.tempFilePaths[0];
            this.formData.tempAvatarPath = res.tempFilePaths[0];
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    submitForm() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.formData.nickname) {
          common_vendor.index.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!this.formData.phone) {
          common_vendor.index.showToast({
            title: "请输入手机号",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
          common_vendor.index.showToast({
            title: "手机号格式不正确",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (this.formData.newPassword && !this.formData.oldPassword) {
          common_vendor.index.showToast({
            title: "请输入原密码",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (this.formData.newPassword && this.formData.newPassword !== this.formData.confirmPassword) {
          common_vendor.index.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          if (this.formData.tempAvatarPath) {
            try {
              const accessToken_1 = common_vendor.index.getStorageSync("accessToken");
              const refreshToken_1 = common_vendor.index.getStorageSync("refreshToken");
              const uploadRes = yield common_vendor.index.uploadFile({
                url: "http://localhost:8080/children/avatar",
                filePath: this.formData.tempAvatarPath,
                name: "image",
                formData: new UTSJSONObject({}),
                header: new UTSJSONObject({
                  "accessToken": accessToken_1,
                  "refreshToken": refreshToken_1
                })
              });
              if (uploadRes.statusCode !== 200) {
                common_vendor.index.showToast({
                  title: "头像上传失败",
                  icon: "none"
                });
              } else {
                const responseData_1 = UTS.JSON.parse(uploadRes.data);
                if (responseData_1.code === 1) {
                  const userInfo = common_vendor.index.getStorageSync("userInfo");
                  if (userInfo) {
                    userInfo.avatar = this.formData.avatar;
                    common_vendor.index.setStorageSync("userInfo", userInfo);
                  }
                  common_vendor.index.showToast({
                    title: "更新成功",
                    icon: "success",
                    duration: 2e3
                  });
                } else {
                  common_vendor.index.showToast({
                    title: responseData_1.msg || "更新失败",
                    icon: "none"
                  });
                }
              }
            } catch (error) {
              common_vendor.index.showToast({
                title: "头像上传失败",
                icon: "none"
              });
            }
          }
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const updateData = new UTSJSONObject({
            name: this.formData.nickname,
            phone: this.formData.phone
          });
          if (this.formData.newPassword) {
            Object.assign(updateData, new UTSJSONObject({
              oldPassword: this.formData.oldPassword,
              newPassword: this.formData.newPassword
            }));
          }
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/children/update/info",
            method: "POST",
            data: updateData,
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          const responseData = res.data;
          if (responseData.code === 1) {
            const userInfo = common_vendor.index.getStorageSync("userInfo");
            if (userInfo) {
              userInfo.name = this.formData.nickname;
              userInfo.phone = this.formData.phone;
              common_vendor.index.setStorageSync("userInfo", userInfo);
            }
            common_vendor.index.showToast({
              title: "更新成功",
              icon: "success",
              duration: 2e3
            });
            this.hideEditForm();
            this.loadUserInfo();
          } else {
            common_vendor.index.showToast({
              title: responseData.msg || "更新失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "更新失败",
            icon: "none"
          });
        }
      });
    },
    goToCart() {
      common_vendor.index.navigateTo({ url: "/pages/children/cart" });
    },
    goToOrders() {
      common_vendor.index.__f__("log", "at pages/children/mine.uvue:359", "开始获取订单数据...");
      const accessToken = common_vendor.index.getStorageSync("accessToken");
      const refreshToken = common_vendor.index.getStorageSync("refreshToken");
      common_vendor.index.request({
        url: "http://localhost:8080/goods/order/list",
        method: "GET",
        header: new UTSJSONObject({
          "accessToken": accessToken,
          "refreshToken": refreshToken
        }),
        success: (res = null) => {
          common_vendor.index.__f__("log", "at pages/children/mine.uvue:370", "获取到的订单数据:", res);
          if (res.statusCode === 200 && res.data.code === 1) {
            const orders = res.data.data;
            common_vendor.index.__f__("log", "at pages/children/mine.uvue:373", "准备跳转到订单列表页面");
            common_vendor.index.navigateTo({
              url: "/pages/children/order-list",
              success: (res2) => {
                common_vendor.index.__f__("log", "at pages/children/mine.uvue:377", "页面跳转成功");
                res2.eventChannel.emit("acceptDataFromOpenerPage", new UTSJSONObject({ orders }));
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/children/mine.uvue:381", "页面跳转失败:", err);
              }
            });
          } else {
            common_vendor.index.__f__("error", "at pages/children/mine.uvue:385", "获取订单数据失败:", res.data.msg);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/mine.uvue:389", "请求失败:", err);
        }
      });
    },
    goToAIConsult() {
      const accessToken = common_vendor.index.getStorageSync("accessToken");
      if (!accessToken) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1500
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
        }, 1500);
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/children/ai-consult",
        success: () => {
          common_vendor.index.__f__("log", "at pages/children/mine.uvue:412", "跳转到AI咨询页面成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/mine.uvue:415", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面加载失败",
            icon: "none"
          });
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar || "/static/images/default-avatar.png",
    b: common_vendor.t($data.userInfo.nickname || "未设置昵称"),
    c: common_vendor.t($data.userInfo.phone || "未绑定手机号"),
    d: common_vendor.o((...args) => $options.showEditForm && $options.showEditForm(...args)),
    e: common_assets._imports_0$3,
    f: common_vendor.o((...args) => $options.goToCart && $options.goToCart(...args)),
    g: common_assets._imports_1$1,
    h: common_vendor.o((...args) => $options.goToOrders && $options.goToOrders(...args)),
    i: common_assets._imports_4$2,
    j: common_vendor.o((...args) => $options.goToAIConsult && $options.goToAIConsult(...args)),
    k: $data.showPopup
  }, $data.showPopup ? {
    l: common_vendor.o((...args) => $options.hideEditForm && $options.hideEditForm(...args)),
    m: common_vendor.o((...args) => $options.hideEditForm && $options.hideEditForm(...args)),
    n: $data.formData.avatar || $data.userInfo.avatar || "/static/images/default-avatar.png",
    o: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    p: $data.formData.nickname,
    q: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    r: $data.formData.phone,
    s: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    t: $data.formData.oldPassword,
    v: common_vendor.o(($event) => $data.formData.oldPassword = $event.detail.value),
    w: $data.formData.newPassword,
    x: common_vendor.o(($event) => $data.formData.newPassword = $event.detail.value),
    y: $data.formData.confirmPassword,
    z: common_vendor.o(($event) => $data.formData.confirmPassword = $event.detail.value),
    A: common_vendor.o((...args) => $options.hideEditForm && $options.hideEditForm(...args)),
    B: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  } : {}, {
    C: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/mine.js.map
