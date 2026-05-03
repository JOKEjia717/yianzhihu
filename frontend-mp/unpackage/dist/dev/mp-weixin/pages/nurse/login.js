"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      account: "",
      password: "",
      isLoading: false
    };
  },
  onLoad() {
    common_vendor.index.removeStorageSync("accessToken");
    common_vendor.index.removeStorageSync("refreshToken");
    common_vendor.index.removeStorageSync("userInfo");
  },
  methods: {
    handleLogin() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.account || !this.password) {
          common_vendor.index.showToast({
            title: "请输入账号和密码",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        this.isLoading = true;
        try {
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/caretaker/login",
            method: "POST",
            header: new UTSJSONObject({
              "Content-Type": "application/json"
            }),
            data: new UTSJSONObject({
              account: this.account,
              password: this.password
            })
          });
          const response = result.data;
          if (response.code === 1 && response.data) {
            common_vendor.index.setStorageSync("accessToken", response.data.accessToken);
            common_vendor.index.setStorageSync("refreshToken", response.data.refreshToken);
            const userInfo = new UTSJSONObject({
              caretakerId: response.data.caretakerId,
              deanId: response.data.deanId,
              name: response.data.name,
              avatar: response.data.avatar,
              phone: response.data.phone,
              specialty: response.data.specialty,
              isEnable: response.data.isEnable
            });
            common_vendor.index.setStorageSync("userInfo", userInfo);
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/nurse/index",
                success: () => {
                  common_vendor.index.__f__("log", "at pages/nurse/login.uvue:131", "跳转成功");
                },
                fail: (err) => {
                  common_vendor.index.__f__("error", "at pages/nurse/login.uvue:134", "跳转失败:", err);
                  common_vendor.index.showToast({
                    title: "跳转失败",
                    icon: "none"
                  });
                }
              });
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: response.msg || "登录失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/login.uvue:149", "请求错误:", error);
          common_vendor.index.showToast({
            title: "登录失败",
            icon: "none"
          });
        } finally {
          this.isLoading = false;
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.account,
    c: common_vendor.o(($event) => $data.account = $event.detail.value),
    d: $data.password,
    e: common_vendor.o(($event) => $data.password = $event.detail.value),
    f: common_vendor.t($data.isLoading ? "登录中..." : "确认"),
    g: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    h: $data.isLoading,
    i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/nurse/login.js.map
