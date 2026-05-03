"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      nursingHome: {
        nursingHomeId: "",
        name: "",
        address: "",
        photo: "",
        director: "",
        honors: "",
        deanId: "",
        createdTime: "",
        isEnable: 0
      }
    };
  },
  onLoad() {
    this.fetchNursingHomeInfo();
  },
  methods: new UTSJSONObject({
    // 格式化日�?
    formatDate(dateStr) {
      if (!dateStr)
        return "暂无";
      try {
        if (UTS.isInstanceOf(dateStr, Date)) {
          const year = dateStr.getFullYear();
          const month = (dateStr.getMonth() + 1).toString().padStart(2, "0");
          const day = dateStr.getDate().toString().padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return dateStr.substring(0, 10);
      } catch (e) {
        if (typeof dateStr === "string") {
          return dateStr;
        }
        return "暂无";
      }
    },
    fetchNursingHomeInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "未登录或登录已过�?",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/dean/login"
            });
            return Promise.resolve(null);
          }
          common_vendor.index.showLoading({
            title: "加载�?..."
          });
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/home/nursingHome",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/dean/index.uvue:252", "获取养老院信息完整响应:", result);
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.nursingHome = response.data;
            common_vendor.index.__f__("log", "at pages/dean/index.uvue:257", "养老院信息:", this.nursingHome);
          } else {
            common_vendor.index.__f__("error", "at pages/dean/index.uvue:259", "获取数据失败, 响应详情:", response);
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/dean/index.uvue:267", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    redirectTo(url) {
      common_vendor.index.redirectTo({
        url
      });
    },
    makeCall() {
      common_vendor.index.showToast({
        title: "暂无电话号码",
        icon: "none"
      });
    },
    openMap() {
      common_vendor.index.showToast({
        title: "地图功能开发中",
        icon: "none"
      });
    },
    shareInfo() {
      common_vendor.index.share(new UTSJSONObject({
        provider: "weixin",
        title: this.nursingHome.name,
        summary: `院长: ${this.nursingHome.director}, 地址: ${this.nursingHome.address}`,
        success: () => {
          common_vendor.index.showToast({
            title: "分享成功"
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "分享失败",
            icon: "none"
          });
        }
      }));
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.nursingHome.photo,
    b: common_vendor.t($data.nursingHome.name),
    c: common_vendor.t($data.nursingHome.isEnable === 1 ? "正常营业" : "暂停营业"),
    d: $data.nursingHome.isEnable === 1 ? 1 : "",
    e: $data.nursingHome.honors
  }, $data.nursingHome.honors ? {
    f: common_assets._imports_0$8,
    g: common_vendor.t($data.nursingHome.honors)
  } : {}, {
    h: common_assets._imports_1$3,
    i: common_vendor.t($options.formatDate(/* @__PURE__ */ new Date())),
    j: common_assets._imports_2$2,
    k: common_vendor.t($data.nursingHome.director || "12345678998"),
    l: common_assets._imports_3$3,
    m: common_assets._imports_4$1,
    n: common_vendor.t($data.nursingHome.address || "暂无"),
    o: common_assets._imports_3$2,
    p: common_vendor.t($options.formatDate($data.nursingHome.createdTime)),
    q: common_assets._imports_6$1,
    r: common_vendor.t($data.nursingHome.nursingHomeId || "暂无"),
    s: common_assets._imports_7,
    t: common_vendor.o((...args) => $options.makeCall && $options.makeCall(...args)),
    v: common_assets._imports_8,
    w: common_vendor.o((...args) => $options.openMap && $options.openMap(...args)),
    x: common_assets._imports_9,
    y: common_vendor.o((...args) => $options.shareInfo && $options.shareInfo(...args)),
    z: common_assets._imports_7$1,
    A: common_assets._imports_8$1,
    B: common_vendor.o(($event) => $options.redirectTo("/pages/dean/dispute")),
    C: common_assets._imports_9$1,
    D: common_vendor.o(($event) => $options.redirectTo("/pages/dean/staff")),
    E: common_assets._imports_10,
    F: common_vendor.o(($event) => $options.redirectTo("/pages/dean/activity")),
    G: common_assets._imports_11,
    H: common_vendor.o(($event) => $options.redirectTo("/pages/dean/management")),
    I: common_assets._imports_12,
    J: common_vendor.o(($event) => $options.redirectTo("/pages/dean/profile")),
    K: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/index.js.map
