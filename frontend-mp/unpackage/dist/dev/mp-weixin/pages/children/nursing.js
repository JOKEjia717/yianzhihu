"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
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
      mealData: {},
      clothingData: {},
      livingData: {},
      currentDailyId: "",
      healthIds: [],
      currentHealthIndex: 0,
      healthData: new UTSJSONObject({
        healthId: null,
        assessDate: "",
        report: "",
        caretakerComment: "",
        number: null
      })
    };
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.deanId = userInfo.deanId;
      this.nurseInfo = {
        name: userInfo.name,
        avatar: userInfo.avatar,
        phone: userInfo.phone,
        specialty: userInfo.specialty
      };
    }
    this.initData();
  },
  methods: new UTSJSONObject({
    initData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          yield this.fetchElders();
          this.setDefaultDates();
          yield this.fetchHealthIds();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:259", "初始化数据失败:", error);
        }
      });
    },
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
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
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
          common_vendor.index.__f__("log", "at pages/children/nursing.uvue:293", "开始获取老人列表");
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/elder/getByChildrenId",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.__f__("log", "at pages/children/nursing.uvue:304", "老人列表响应:", result);
          common_vendor.index.hideLoading();
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.elders = response.data;
            this.elderNames = this.elders.map((elder) => {
              return elder.name;
            });
            if (this.elders.length > 0) {
              this.selectedElderId = this.elders[0].elderId;
              this.selectedChildrenId = this.elders[0].childrenId.toString();
              common_vendor.index.__f__("log", "at pages/children/nursing.uvue:317", "已选择老人:", this.selectedElderId);
              yield this.fetchDailyData("meal");
              yield this.fetchDailyData("clothing");
              yield this.fetchDailyData("living");
              yield this.fetchHealthIds();
            } else {
              common_vendor.index.showToast({
                title: "暂无老人数据",
                icon: "none"
              });
            }
          } else {
            common_vendor.index.showToast({
              title: response.msg || "获取数据失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:338", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    fetchDailyData(type) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId)
          return Promise.resolve(null);
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
          const response = result.data;
          if (response.code === 1 && response.data) {
            const dailyData = response.data;
            this.currentDailyId = dailyData.dailyId;
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
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:411", "获取日常数据失败:", error);
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
            const data = response.data;
            if (data.healthId && data.healthId.length > 0) {
              this.healthIds = data.healthId.reverse();
              this.currentHealthIndex = 0;
              yield this.fetchHealthData();
            } else {
              this.healthIds = [];
              this.currentHealthIndex = 0;
              this.healthData = {
                healthId: null,
                assessDate: "",
                report: "",
                caretakerComment: "",
                number: null
              };
            }
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:467", "获取健康记录ID失败:", error);
          this.healthIds = [];
          this.currentHealthIndex = 0;
          this.healthData = {
            healthId: null,
            assessDate: "",
            report: "",
            caretakerComment: "",
            number: null
          };
        }
      });
    },
    fetchHealthData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId || this.healthIds.length === 0)
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
              number: this.healthIds[this.currentHealthIndex]
            })
          });
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.healthData = response.data;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:510", "获取健康记录数据失败:", error);
          this.healthData = {
            healthId: null,
            assessDate: "",
            report: "",
            caretakerComment: "",
            number: null
          };
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
    handleBack() {
      common_vendor.index.removeStorageSync("accessToken");
      common_vendor.index.removeStorageSync("refreshToken");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.redirectTo({
        url: "/pages/nurse/login",
        success: () => {
          common_vendor.index.__f__("log", "at pages/children/nursing.uvue:551", "成功跳转到登录页");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:554", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    },
    handleTabClick(tab) {
      if (tab === "nursing") {
        this.fetchElders();
      } else {
        common_vendor.index.switchTab({
          url: `/pages/nurse/${tab}`
        });
      }
    },
    previewImage(url) {
      if (!url)
        return null;
      common_vendor.index.previewImage({
        urls: [url],
        current: url,
        indicator: "number",
        loop: false,
        success: () => {
          common_vendor.index.__f__("log", "at pages/children/nursing.uvue:581", "图片预览成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/nursing.uvue:584", "图片预览失败:", err);
          common_vendor.index.showToast({
            title: "图片预览失败",
            icon: "none"
          });
        }
      });
    },
    handleHealthChange(e = null) {
      this.currentHealthIndex = parseInt(e.detail.value);
      this.fetchHealthData();
    },
    goToActivityApproval() {
      if (this.selectedElderId) {
        common_vendor.index.navigateTo({
          url: `/pages/children/activity-approval?elderId=${this.selectedElderId}&elderName=${this.elderNames[this.currentElderIndex]}`,
          success: () => {
            common_vendor.index.__f__("log", "at pages/children/nursing.uvue:601", "成功跳转到活动申请页面");
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/children/nursing.uvue:604", "跳转失败:", err);
            common_vendor.index.showToast({
              title: "跳转失败",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请先选择老人",
          icon: "none"
        });
      }
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleBack && $options.handleBack(...args)),
    b: common_vendor.o((...args) => $options.goToActivityApproval && $options.goToActivityApproval(...args)),
    c: common_vendor.t($data.elderNames[$data.currentElderIndex] || "选择老人"),
    d: $data.elderNames,
    e: common_vendor.o((...args) => $options.handleElderChange && $options.handleElderChange(...args)),
    f: $data.currentElderIndex,
    g: common_assets._imports_1,
    h: common_assets._imports_2,
    i: common_assets._imports_3,
    j: common_vendor.t($data.mealDate || "选择日期"),
    k: $data.mealDate,
    l: common_vendor.o((...args) => $options.handleMealDateChange && $options.handleMealDateChange(...args)),
    m: $data.mealData.breakfastPhotos || $data.mealData.lunchPhotos || $data.mealData.dinnerPhotos
  }, $data.mealData.breakfastPhotos || $data.mealData.lunchPhotos || $data.mealData.dinnerPhotos ? common_vendor.e({
    n: $data.mealData.breakfastPhotos
  }, $data.mealData.breakfastPhotos ? {
    o: $data.mealData.breakfastPhotos,
    p: common_vendor.o(($event) => $options.previewImage($data.mealData.breakfastPhotos))
  } : {}, {
    q: $data.mealData.lunchPhotos
  }, $data.mealData.lunchPhotos ? {
    r: $data.mealData.lunchPhotos,
    s: common_vendor.o(($event) => $options.previewImage($data.mealData.lunchPhotos))
  } : {}, {
    t: $data.mealData.dinnerPhotos
  }, $data.mealData.dinnerPhotos ? {
    v: $data.mealData.dinnerPhotos,
    w: common_vendor.o(($event) => $options.previewImage($data.mealData.dinnerPhotos))
  } : {}) : {}, {
    x: common_vendor.t($data.clothingDate || "选择日期"),
    y: $data.clothingDate,
    z: common_vendor.o((...args) => $options.handleClothingDateChange && $options.handleClothingDateChange(...args)),
    A: $data.clothingData.clothingPhotos
  }, $data.clothingData.clothingPhotos ? {
    B: $data.clothingData.clothingPhotos,
    C: common_vendor.o(($event) => $options.previewImage($data.clothingData.clothingPhotos))
  } : {}, {
    D: common_vendor.t($data.livingDate || "选择日期"),
    E: $data.livingDate,
    F: common_vendor.o((...args) => $options.handleLivingDateChange && $options.handleLivingDateChange(...args)),
    G: $data.livingData.lodgingPhotos
  }, $data.livingData.lodgingPhotos ? {
    H: $data.livingData.lodgingPhotos,
    I: common_vendor.o(($event) => $options.previewImage($data.livingData.lodgingPhotos))
  } : {}, {
    J: common_vendor.t($data.healthIds.length > 0 ? `第${$data.healthIds[$data.currentHealthIndex]}次` : "暂无记录"),
    K: $data.healthIds.map((id) => `第${id}次`),
    L: $data.currentHealthIndex,
    M: common_vendor.o((...args) => $options.handleHealthChange && $options.handleHealthChange(...args)),
    N: $data.healthData.assessDate
  }, $data.healthData.assessDate ? {
    O: common_vendor.t($data.healthData.assessDate.split("T")[0]),
    P: common_vendor.t($data.healthData.report),
    Q: common_vendor.t($data.healthData.caretakerComment)
  } : {}, {
    R: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/nursing.js.map
