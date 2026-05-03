"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      loading: false,
      loadingElderly: false,
      applications: [],
      elderlies: []
    };
  },
  onLoad() {
    this.fetchApplications();
    this.fetchAllElderly();
  },
  methods: new UTSJSONObject({
    fetchApplications() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.loading = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/dean/login"
            });
            this.loading = false;
            return Promise.resolve(null);
          }
          common_vendor.index.request({
            url: "http://localhost:8080/elder/getByElder",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            success: (res) => {
              const response = res.data;
              if (response.code === 1 && response.data) {
                this.applications = response.data;
              } else {
                common_vendor.index.showToast({
                  title: "获取申请数据失败",
                  icon: "none"
                });
              }
              this.loading = false;
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/dean/management.uvue:209", "请求失败:", err);
              common_vendor.index.showToast({
                title: "网络请求失败",
                icon: "none"
              });
              this.loading = false;
            }
          });
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/dean/management.uvue:218", "获取申请数据出错:", error);
          common_vendor.index.showToast({
            title: "获取数据出错",
            icon: "none"
          });
          this.loading = false;
        }
      });
    },
    fetchAllElderly() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.loadingElderly = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/dean/login"
            });
            this.loadingElderly = false;
            return Promise.resolve(null);
          }
          common_vendor.index.request({
            url: "http://localhost:8080/elder/getAllElder",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            success: (res) => {
              const response = res.data;
              if (response.code === 1 && response.data) {
                this.elderlies = response.data;
              } else {
                common_vendor.index.showToast({
                  title: "获取老人数据失败",
                  icon: "none"
                });
              }
              this.loadingElderly = false;
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/dean/management.uvue:269", "请求失败:", err);
              common_vendor.index.showToast({
                title: "网络请求失败",
                icon: "none"
              });
              this.loadingElderly = false;
            }
          });
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/dean/management.uvue:278", "获取老人数据出错:", error);
          common_vendor.index.showToast({
            title: "获取数据出错",
            icon: "none"
          });
          this.loadingElderly = false;
        }
      });
    },
    // 同意申请
    approveApplication(item) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认",
        content: `确定同意 ${item.name} 的入园申请吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "已同意申请",
              icon: "success"
            });
          }
        }
      }));
    },
    // 拒绝申请
    rejectApplication(item) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认",
        content: `确定拒绝 ${item.name} 的入园申请吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "已拒绝申请",
              icon: "success"
            });
          }
        }
      }));
    },
    // 查看申请详情
    viewApplicationDetail(item) {
      common_vendor.index.showToast({
        title: "查看详情功能开发中",
        icon: "none"
      });
    },
    // 跳转到院下老人页面
    navigateToElderly() {
      common_vendor.index.navigateTo({
        url: "/pages/dean/elderly"
      });
    },
    // 页面跳转
    redirectTo(url) {
      common_vendor.index.redirectTo({
        url
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : $data.applications.length === 0 ? {} : {
    c: common_vendor.f($data.applications, (item, index, i0) => {
      return common_vendor.e({
        a: item.photo
      }, item.photo ? {
        b: item.photo
      } : {}, {
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.gender === 1 ? "男" : "女"),
        e: common_vendor.t(item.age),
        f: common_vendor.t(item.childrenPhone),
        g: common_vendor.t(item.applicationTime),
        h: common_vendor.o(($event) => $options.approveApplication(item), index),
        i: common_vendor.o(($event) => $options.rejectApplication(item), index),
        j: index
      });
    })
  }, {
    b: $data.applications.length === 0,
    d: $data.loadingElderly
  }, $data.loadingElderly ? {} : $data.elderlies.length === 0 ? {} : {
    f: common_vendor.f($data.elderlies, (item, index, i0) => {
      return common_vendor.e({
        a: item.photo
      }, item.photo ? {
        b: item.photo
      } : {}, {
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.gender === 1 ? "男" : "女"),
        e: common_vendor.t(item.age),
        f: common_vendor.t(item.childrenName),
        g: common_vendor.t(item.childrenPhone),
        h: common_vendor.t(item.applicationTime),
        i: index
      });
    })
  }, {
    e: $data.elderlies.length === 0,
    g: common_assets._imports_7$1,
    h: common_vendor.o(($event) => $options.redirectTo("/pages/dean/index")),
    i: common_assets._imports_8$1,
    j: common_vendor.o(($event) => $options.redirectTo("/pages/dean/dispute")),
    k: common_assets._imports_9$1,
    l: common_vendor.o(($event) => $options.redirectTo("/pages/dean/staff")),
    m: common_assets._imports_10,
    n: common_vendor.o(($event) => $options.redirectTo("/pages/dean/activity")),
    o: common_assets._imports_11,
    p: common_vendor.o(($event) => $options.redirectTo("/pages/dean/management")),
    q: common_assets._imports_12,
    r: common_vendor.o(($event) => $options.redirectTo("/pages/dean/profile")),
    s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/management.js.map
