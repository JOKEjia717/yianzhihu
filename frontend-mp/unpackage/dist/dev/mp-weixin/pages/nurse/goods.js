"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const NurseTabbar = () => "../../components/nurse-tabbar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    NurseTabbar
  },
  data() {
    return {
      elders: [],
      elderNames: [],
      currentElderIndex: 0,
      selectedElderId: "",
      items: [],
      logistics: [],
      currentMode: "items"
    };
  },
  onLoad() {
    this.fetchElders();
  },
  methods: new UTSJSONObject({
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
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/elder/elders",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.elders = response.data;
            this.elderNames = this.elders.map((elder) => {
              return elder.name;
            });
            if (this.elders.length > 0) {
              this.selectedElderId = this.elders[0].elderId;
              this.fetchItems();
            }
          } else {
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/goods.uvue:224", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    fetchItems() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId)
          return Promise.resolve(null);
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield common_vendor.index.request({
            url: `http://localhost:8080/personal-item/items/${this.selectedElderId}`,
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.items = response.data;
          } else {
            this.items = [];
            common_vendor.index.showToast({
              title: "获取物品列表失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/goods.uvue:265", "获取物品列表失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    handleElderChange(e = null) {
      this.currentElderIndex = parseInt(e.detail.value);
      if (this.elders[this.currentElderIndex]) {
        this.selectedElderId = this.elders[this.currentElderIndex].elderId;
        if (this.currentMode === "items") {
          this.fetchItems();
        } else {
          this.fetchLogistics();
        }
      }
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return "正常";
        case 1:
          return "损坏";
        case 2:
          return "丢失";
        case 3:
          return "已报废";
        default:
          return "未知";
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 0:
          return "status-pending";
        case 1:
          return "status-normal";
        case 2:
          return "status-repairing";
        case 3:
          return "status-scrapped";
        default:
          return "status-unknown";
      }
    },
    switchTab(url) {
      common_vendor.index.switchTab({
        url,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/nurse/goods.uvue:315", "切换标签页失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    fetchLogistics() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId)
          return Promise.resolve(null);
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield common_vendor.index.request({
            url: `http://localhost:8080/goods/order/logistics`,
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            data: new UTSJSONObject({
              elderId: this.selectedElderId
            })
          });
          common_vendor.index.hideLoading();
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.logistics = response.data;
          } else {
            this.logistics = [];
            common_vendor.index.showToast({
              title: "获取物流信息失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/goods.uvue:360", "获取物流信息失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    switchMode() {
      this.currentMode = this.currentMode === "items" ? "logistics" : "items";
      if (this.currentMode === "logistics") {
        this.fetchLogistics();
      } else {
        this.fetchItems();
      }
    },
    formatTime(time) {
      if (!time)
        return "";
      const date = new Date(time);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
  })
}));
if (!Array) {
  const _component_nurse_tabbar = common_vendor.resolveComponent("nurse-tabbar");
  _component_nurse_tabbar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.currentMode === "items" ? "物品管理" : "物流管理"),
    b: common_vendor.o((...args) => $options.switchMode && $options.switchMode(...args)),
    c: common_assets._imports_0$5,
    d: common_vendor.t($data.elderNames[$data.currentElderIndex] || "选择老人"),
    e: common_assets._imports_1$2,
    f: $data.elderNames,
    g: common_vendor.o((...args) => $options.handleElderChange && $options.handleElderChange(...args)),
    h: $data.currentElderIndex,
    i: common_assets._imports_2$1,
    j: common_vendor.t($data.currentMode === "items" ? "物流" : "物品"),
    k: $data.currentMode === "items"
  }, $data.currentMode === "items" ? common_vendor.e({
    l: $data.items.length > 0
  }, $data.items.length > 0 ? {
    m: common_vendor.f($data.items, (item, k0, i0) => {
      return common_vendor.e({
        a: item.photo
      }, item.photo ? {
        b: item.photo
      } : {}, {
        c: common_vendor.t(item.itemName),
        d: common_vendor.t($options.getStatusText(item.status)),
        e: common_vendor.n($options.getStatusClass(item.status)),
        f: common_vendor.t(item.lastCheck),
        g: common_vendor.t(item.notes || "无"),
        h: item.personalItemId
      });
    })
  } : {}) : {}, {
    n: $data.currentMode === "logistics"
  }, $data.currentMode === "logistics" ? common_vendor.e({
    o: $data.logistics.length > 0
  }, $data.logistics.length > 0 ? {
    p: common_vendor.f($data.logistics, (logistic, k0, i0) => {
      return {
        a: common_vendor.t(logistic.logisticsCompany),
        b: common_vendor.t($options.formatTime(logistic.createTime)),
        c: common_vendor.t(logistic.contact),
        d: common_vendor.t(logistic.mobile),
        e: common_vendor.t(logistic.address || "暂无地址信息"),
        f: logistic.logisticsId
      };
    })
  } : {}) : {}, {
    q: common_vendor.p({
      ["current-path"]: "/pages/nurse/goods"
    }),
    r: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/nurse/goods.js.map
