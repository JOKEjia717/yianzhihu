"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const NurseTabbar = () => "../../components/nurse-tabbar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    NurseTabbar
  },
  data() {
    return {
      elders: [],
      elderNames: [],
      currentElderIndex: 0,
      selectedElderId: "",
      selectedChildrenId: "",
      deanId: "",
      nurseInfo: new UTSJSONObject({
        name: "",
        avatar: "",
        phone: "",
        specialty: ""
      }),
      mealDate: "",
      clothingDate: "",
      livingDate: "",
      healthDate: "",
      healthTimes: [],
      currentHealthTimeIndex: 0,
      mealData: {},
      clothingData: {},
      livingData: {},
      healthData: {},
      healthIds: [],
      currentDailyId: "",
      showHealthModal: false,
      healthForm: {
        report: "",
        caretakerComment: ""
      },
      isSubmitting: false,
      // AI按钮位置数据
      isMoving: false,
      btnPosition: {
        left: -1,
        top: -1
      }
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/nurse/index.uvue:330", "页面加载开始");
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.deanId = userInfo.deanId;
      this.nurseInfo = {
        name: userInfo.name,
        avatar: userInfo.avatar,
        phone: userInfo.phone,
        specialty: userInfo.specialty
      };
      common_vendor.index.__f__("log", "at pages/nurse/index.uvue:340", "用户信息已加载:", this.nurseInfo);
    } else {
      common_vendor.index.__f__("log", "at pages/nurse/index.uvue:342", "未找到用户信息");
      common_vendor.index.redirectTo({
        url: "/pages/nurse/login"
      });
      return null;
    }
    this.fetchElders();
    this.setDefaultDates();
    this.fetchHealthIds();
    this.loadBtnPosition();
  },
  methods: {
    setDefaultDates() {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;
      this.mealDate = todayStr;
      this.clothingDate = todayStr;
      this.livingDate = todayStr;
    },
    fetchElders() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:368", "开始获取老人列表");
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.__f__("log", "at pages/nurse/index.uvue:373", "未找到token");
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/nurse/login"
            });
            return Promise.resolve(null);
          }
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/elder/elders",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:399", "老人列表接口返回:", result);
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.elders = response.data;
            this.elderNames = this.elders.map((elder) => {
              return elder.name;
            });
            common_vendor.index.__f__("log", "at pages/nurse/index.uvue:404", "老人列表数据:", this.elders);
            if (this.elders.length > 0) {
              this.selectedElderId = this.elders[0].elderId;
              this.selectedChildrenId = this.elders[0].childrenId.toString();
              common_vendor.index.__f__("log", "at pages/nurse/index.uvue:409", "已选择老人:", this.selectedElderId);
              this.fetchHealthIds();
              this.fetchDailyData("meal");
              this.fetchDailyData("clothing");
              this.fetchDailyData("living");
            } else {
              common_vendor.index.__f__("log", "at pages/nurse/index.uvue:418", "老人列表为空");
            }
          } else {
            common_vendor.index.__f__("log", "at pages/nurse/index.uvue:421", "获取老人列表失败:", response);
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:429", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    fetchDailyData(type) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/nurse/index.uvue:437", "开始获取日常数据:", type, "老人ID:", this.selectedElderId);
        if (!this.selectedElderId) {
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:439", "未选择老人，跳过获取日常数据");
          return Promise.resolve(null);
        }
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          let date = "";
          switch (type) {
            case "meal":
              date = this.mealDate;
              break;
            case "clothing":
              date = this.clothingDate;
              break;
            case "living":
              date = this.livingDate;
              break;
          }
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:460", "准备请求日常数据:", new UTSJSONObject({
            type,
            date,
            elderId: this.selectedElderId
          }));
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/daily/day",
            method: "POST",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken,
              "Content-Type": "application/json"
            }),
            data: new UTSJSONObject({
              date,
              elderId: this.selectedElderId
            })
          });
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:480", "日常数据接口返回:", result);
          const response = result.data;
          if (response.code === 1 && response.data) {
            const dailyData = response.data;
            this.currentDailyId = dailyData.dailyId;
            common_vendor.index.__f__("log", "at pages/nurse/index.uvue:486", "获取到日常数据:", dailyData);
            switch (type) {
              case "meal":
                this.mealData = dailyData;
                break;
              case "clothing":
                this.clothingData = dailyData;
                break;
              case "living":
                this.livingData = dailyData;
                break;
            }
          } else {
            common_vendor.index.__f__("log", "at pages/nurse/index.uvue:500", "获取日常数据失败:", response);
            switch (type) {
              case "meal":
                this.mealData = {};
                break;
              case "clothing":
                this.clothingData = {};
                break;
              case "living":
                this.livingData = {};
                break;
            }
            this.currentDailyId = "";
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:515", "获取日常数据失败:", error);
          switch (type) {
            case "meal":
              this.mealData = {};
              break;
            case "clothing":
              this.clothingData = {};
              break;
            case "living":
              this.livingData = {};
              break;
          }
          this.currentDailyId = "";
        }
      });
    },
    fetchHealthIds() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId)
          return Promise.resolve(null);
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/health/getHealthIds",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            data: new UTSJSONObject({
              elderId: this.selectedElderId
            })
          });
          const response = result.data;
          if (response.code === 1 && response.data) {
            const healthIdsData = response.data;
            this.healthIds = healthIdsData.healthId.sort((a, b) => {
              return parseInt(b) - parseInt(a);
            });
            this.healthTimes = this.healthIds.map((id) => {
              return `第${id}次`;
            });
            this.currentHealthTimeIndex = 0;
            this.fetchHealthData();
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:562", "获取健康ID列表失败:", error);
        }
      });
    },
    fetchHealthData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId || !this.healthIds[this.currentHealthTimeIndex])
          return Promise.resolve(null);
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/health/getHealthByNumber",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            data: new UTSJSONObject({
              elderId: this.selectedElderId,
              number: this.healthIds[this.currentHealthTimeIndex]
            })
          });
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.healthData = response.data;
          } else {
            this.healthData = {};
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:592", "获取健康数据失败:", error);
          this.healthData = {};
        }
      });
    },
    handleElderChange(e = null) {
      this.currentElderIndex = parseInt(e.detail.value);
      if (this.elders[this.currentElderIndex]) {
        this.selectedElderId = this.elders[this.currentElderIndex].elderId;
        this.selectedChildrenId = this.elders[this.currentElderIndex].childrenId.toString();
        this.fetchDailyData("meal");
        this.fetchDailyData("clothing");
        this.fetchDailyData("living");
        this.fetchHealthIds();
      }
    },
    handleMealDateChange(e = null) {
      this.mealDate = e.detail.value;
      this.fetchDailyData("meal");
    },
    handleClothingDateChange(e = null) {
      this.clothingDate = e.detail.value;
      this.fetchDailyData("clothing");
    },
    handleLivingDateChange(e = null) {
      this.livingDate = e.detail.value;
      this.fetchDailyData("living");
    },
    handleHealthTimeChange(e = null) {
      this.currentHealthTimeIndex = parseInt(e.detail.value);
      this.fetchHealthData();
    },
    handleBack() {
      common_vendor.index.removeStorageSync("accessToken");
      common_vendor.index.removeStorageSync("refreshToken");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.redirectTo({
        url: "/pages/index/index",
        success: () => {
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:631", "成功跳转到登录页");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:634", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    },
    handleUpload(type) {
      if (!this.selectedElderId) {
        common_vendor.index.showToast({
          title: "请先选择老人",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showModal(new UTSJSONObject({
            title: "确认上传",
            content: "是否保存此照片？",
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.saveUpload(type, tempFilePath);
              }
            }
          }));
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      }));
    },
    saveUpload(type, filePath) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.currentDailyId) {
          common_vendor.index.showToast({
            title: "无效的数据ID",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          const formData = new UTSJSONObject(
            {
              "dailyId": this.currentDailyId,
              "breakfastPhotos": null,
              "lunchPhotos": null,
              "dinnerPhotos": null,
              "clothingPhotos": null,
              "lodgingPhotos": null
            }
            // 使用uni.uploadFile发送multipart/form-data请求
          );
          const uploadResult = yield common_vendor.index.uploadFile({
            url: "http://localhost:8080/daily/update",
            filePath,
            name: type === "clothing" ? "clothingPhotos" : "lodgingPhotos",
            formData,
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          const response = UTS.JSON.parse(uploadResult.data);
          if (response.code === 1) {
            common_vendor.index.showToast({
              title: "上传成功",
              icon: "success"
            });
            this.fetchDailyData(type);
          } else {
            common_vendor.index.showToast({
              title: response.msg || "上传失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:735", "上传失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    switchTab(url) {
      if (url === "/pages/nurse/activity") {
        common_vendor.index.setStorageSync("currentDeanId", this.deanId);
      }
      common_vendor.index.switchTab({
        url,
        fail: (err = null) => {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:752", "切换标签页失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    // 添加图片预览方法
    previewImage(url) {
      if (!url)
        return null;
      common_vendor.index.previewImage({
        urls: [url],
        current: url,
        indicator: "number",
        loop: false,
        success: () => {
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:769", "图片预览成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:772", "图片预览失败:", err);
          common_vendor.index.showToast({
            title: "图片预览失败",
            icon: "none"
          });
        }
      });
    },
    // 添加每日三餐上传方法
    handleMealUpload() {
      if (!this.selectedElderId) {
        common_vendor.index.showToast({
          title: "请先选择老人",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.showActionSheet({
        itemList: ["早餐", "午餐", "晚餐"],
        success: (res) => {
          const mealTypes = ["breakfast", "lunch", "dinner"];
          this.handleSingleMealUpload(mealTypes[res.tapIndex]);
        }
      });
    },
    // 处理单餐上传
    handleSingleMealUpload(mealType) {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showModal({
            title: "确认上传",
            content: "是否保存此照片？",
            success: (modalRes) => {
              if (modalRes.confirm) {
                const files = new UTSJSONObject({
                  type: mealType,
                  breakfastPhotos: mealType === "breakfast" ? tempFilePath : null,
                  lunchPhotos: mealType === "lunch" ? tempFilePath : null,
                  dinnerPhotos: mealType === "dinner" ? tempFilePath : null
                });
                this.saveMealUpload(files);
              }
            }
          });
        }
      });
    },
    // 保存餐饮照片
    saveMealUpload(files = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.currentDailyId) {
          common_vendor.index.showToast({
            title: "无效的数据ID",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          const formData = new UTSJSONObject(
            {
              "dailyId": this.currentDailyId,
              "breakfastPhotos": files.breakfastPhotos || null,
              "lunchPhotos": files.lunchPhotos || null,
              "dinnerPhotos": files.dinnerPhotos || null,
              "clothingPhotos": null,
              "lodgingPhotos": null
            }
            // 根据类型获取对应的文件路径和name
          );
          let filePath = null;
          let fieldName = "";
          switch (files.type) {
            case "breakfast":
              filePath = files.breakfastPhotos;
              fieldName = "breakfastPhotos";
              break;
            case "lunch":
              filePath = files.lunchPhotos;
              fieldName = "lunchPhotos";
              break;
            case "dinner":
              filePath = files.dinnerPhotos;
              fieldName = "dinnerPhotos";
              break;
          }
          const uploadResult = yield common_vendor.index.uploadFile({
            url: "http://localhost:8080/daily/update",
            filePath,
            name: fieldName,
            formData,
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          const response = UTS.JSON.parse(uploadResult.data);
          if (response.code === 1) {
            common_vendor.index.showToast({
              title: "上传成功",
              icon: "success"
            });
            this.fetchDailyData("meal");
          } else {
            common_vendor.index.showToast({
              title: response.msg || "上传失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:903", "上传失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    showHealthUploadModal() {
      this.showHealthModal = true;
    },
    closeHealthModal() {
      this.showHealthModal = false;
      this.healthForm = {
        report: "",
        caretakerComment: ""
      };
    },
    submitHealthInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.healthForm.report || !this.healthForm.caretakerComment) {
          common_vendor.index.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        this.isSubmitting = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const maxNumber = this.healthIds.length > 0 ? Math.max(...this.healthIds.map((id) => {
            return parseInt(id);
          })) + 1 : 1;
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/health/addHealthInfo",
            method: "POST",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken,
              "Content-Type": "application/json"
            }),
            data: new UTSJSONObject({
              elderId: this.selectedElderId,
              report: this.healthForm.report,
              caretakerComment: this.healthForm.caretakerComment,
              number: maxNumber.toString()
            })
          });
          const response = result.data;
          if (response.code === 1) {
            common_vendor.index.showToast({
              title: "上传成功",
              icon: "success"
            });
            this.closeHealthModal();
            this.fetchHealthIds();
          } else {
            common_vendor.index.showToast({
              title: response.msg || "上传失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:972", "上传健康信息失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        } finally {
          this.isSubmitting = false;
        }
      });
    },
    // AI咨询按钮拖拽逻辑
    loadBtnPosition() {
      try {
        const position = common_vendor.index.getStorageSync("aiConsultBtnPosition");
        if (position) {
          const pos = UTS.JSON.parse(position);
          this.btnPosition = pos;
        } else {
          const systemInfo = common_vendor.index.getSystemInfoSync();
          this.btnPosition = {
            left: systemInfo.windowWidth - 140,
            top: systemInfo.windowHeight - 220
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/nurse/index.uvue:997", "获取按钮位置失败:", error);
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.btnPosition = {
          left: systemInfo.windowWidth - 140,
          top: systemInfo.windowHeight - 220
        };
      }
    },
    startMoveBtn(e = null) {
      this.isMoving = true;
      common_vendor.index.showToast({
        title: "按住拖动",
        icon: "none",
        duration: 1e3
      });
    },
    moveBtn(e = null) {
      if (!this.isMoving)
        return null;
      e.stopPropagation();
      e.preventDefault();
      const touch = e.touches[0];
      this.btnPosition.left = touch.clientX - 50;
      this.btnPosition.top = touch.clientY - 50;
    },
    endMoveBtn() {
      if (!this.isMoving)
        return null;
      this.isMoving = false;
      try {
        common_vendor.index.setStorageSync("aiConsultBtnPosition", UTS.JSON.stringify(this.btnPosition));
        common_vendor.index.showToast({
          title: "位置已保存",
          icon: "success",
          duration: 1e3
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/nurse/index.uvue:1039", "保存按钮位置失败:", error);
      }
    },
    goToAiConsult() {
      if (this.isMoving)
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/children/ai-consult",
        success: () => {
          common_vendor.index.__f__("log", "at pages/nurse/index.uvue:1050", "成功跳转至AI咨询页面");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/nurse/index.uvue:1053", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    }
  }
});
if (!Array) {
  const _component_nurse_tabbar = common_vendor.resolveComponent("nurse-tabbar");
  _component_nurse_tabbar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleBack && $options.handleBack(...args)),
    b: common_vendor.t($data.elderNames[$data.currentElderIndex] || "选择老人"),
    c: common_assets._imports_1$2,
    d: $data.elderNames,
    e: common_vendor.o((...args) => $options.handleElderChange && $options.handleElderChange(...args)),
    f: $data.currentElderIndex,
    g: common_assets._imports_1,
    h: common_assets._imports_2,
    i: common_assets._imports_3,
    j: common_vendor.t($data.mealDate || "选择日期"),
    k: $data.mealDate,
    l: common_vendor.o((...args) => $options.handleMealDateChange && $options.handleMealDateChange(...args)),
    m: common_vendor.o((...args) => $options.handleMealUpload && $options.handleMealUpload(...args)),
    n: $data.mealData.breakfastPhotos || $data.mealData.lunchPhotos || $data.mealData.dinnerPhotos
  }, $data.mealData.breakfastPhotos || $data.mealData.lunchPhotos || $data.mealData.dinnerPhotos ? common_vendor.e({
    o: $data.mealData.breakfastPhotos
  }, $data.mealData.breakfastPhotos ? {
    p: $data.mealData.breakfastPhotos,
    q: common_vendor.o(($event) => $options.previewImage($data.mealData.breakfastPhotos))
  } : {}, {
    r: $data.mealData.lunchPhotos
  }, $data.mealData.lunchPhotos ? {
    s: $data.mealData.lunchPhotos,
    t: common_vendor.o(($event) => $options.previewImage($data.mealData.lunchPhotos))
  } : {}, {
    v: $data.mealData.dinnerPhotos
  }, $data.mealData.dinnerPhotos ? {
    w: $data.mealData.dinnerPhotos,
    x: common_vendor.o(($event) => $options.previewImage($data.mealData.dinnerPhotos))
  } : {}) : {}, {
    y: common_vendor.t($data.clothingDate || "选择日期"),
    z: $data.clothingDate,
    A: common_vendor.o((...args) => $options.handleClothingDateChange && $options.handleClothingDateChange(...args)),
    B: common_vendor.o(($event) => $options.handleUpload("clothing")),
    C: $data.clothingData.clothingPhotos
  }, $data.clothingData.clothingPhotos ? {
    D: $data.clothingData.clothingPhotos,
    E: common_vendor.o(($event) => $options.previewImage($data.clothingData.clothingPhotos))
  } : {}, {
    F: common_vendor.t($data.livingDate || "选择日期"),
    G: $data.livingDate,
    H: common_vendor.o((...args) => $options.handleLivingDateChange && $options.handleLivingDateChange(...args)),
    I: common_vendor.o(($event) => $options.handleUpload("living")),
    J: $data.livingData.lodgingPhotos
  }, $data.livingData.lodgingPhotos ? {
    K: $data.livingData.lodgingPhotos,
    L: common_vendor.o(($event) => $options.previewImage($data.livingData.lodgingPhotos))
  } : {}, {
    M: common_vendor.t($data.healthTimes[$data.currentHealthTimeIndex] || "选择次数"),
    N: $data.healthTimes,
    O: common_vendor.o((...args) => $options.handleHealthTimeChange && $options.handleHealthTimeChange(...args)),
    P: $data.currentHealthTimeIndex,
    Q: common_vendor.o((...args) => $options.showHealthUploadModal && $options.showHealthUploadModal(...args)),
    R: $data.healthData.assessDate || $data.healthData.report || $data.healthData.caretakerComment
  }, $data.healthData.assessDate || $data.healthData.report || $data.healthData.caretakerComment ? common_vendor.e({
    S: $data.healthData.assessDate
  }, $data.healthData.assessDate ? {
    T: common_vendor.t($data.healthData.assessDate.split("T")[0])
  } : {}, {
    U: $data.healthData.report
  }, $data.healthData.report ? {
    V: common_vendor.t($data.healthData.report)
  } : {}, {
    W: $data.healthData.caretakerComment
  }, $data.healthData.caretakerComment ? {
    X: common_vendor.t($data.healthData.caretakerComment)
  } : {}) : {}, {
    Y: $data.showHealthModal
  }, $data.showHealthModal ? {
    Z: common_vendor.o((...args) => $options.closeHealthModal && $options.closeHealthModal(...args)),
    aa: $data.healthForm.report,
    ab: common_vendor.o(($event) => $data.healthForm.report = $event.detail.value),
    ac: $data.healthForm.caretakerComment,
    ad: common_vendor.o(($event) => $data.healthForm.caretakerComment = $event.detail.value),
    ae: common_vendor.o((...args) => $options.closeHealthModal && $options.closeHealthModal(...args)),
    af: common_vendor.t($data.isSubmitting ? "提交中..." : "确认"),
    ag: common_vendor.o((...args) => $options.submitHealthInfo && $options.submitHealthInfo(...args)),
    ah: $data.isSubmitting
  } : {}, {
    ai: common_assets._imports_4$2,
    aj: $data.isMoving
  }, $data.isMoving ? {} : {}, {
    ak: $data.btnPosition.left + "px",
    al: $data.btnPosition.top + "px",
    am: common_vendor.o((...args) => $options.goToAiConsult && $options.goToAiConsult(...args)),
    an: common_vendor.o((...args) => $options.startMoveBtn && $options.startMoveBtn(...args)),
    ao: common_vendor.o((...args) => $options.moveBtn && $options.moveBtn(...args)),
    ap: common_vendor.o((...args) => $options.endMoveBtn && $options.endMoveBtn(...args)),
    aq: common_vendor.p({
      ["current-path"]: "/pages/nurse/index"
    }),
    ar: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/nurse/index.js.map
