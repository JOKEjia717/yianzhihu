"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      formData: {
        account: "",
        password: ""
      }
    };
  },
  methods: new UTSJSONObject({
    handleLogin() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.formData.account || !this.formData.password) {
          common_vendor.index.showToast({
            title: "请输入账号和密码",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          const res = yield utils_request.request.post("/children/loginByUsername", new UTSJSONObject({
            data: new UTSJSONObject({
              account: this.formData.account,
              password: this.formData.password
            })
          }));
          if (res.statusCode === 200 && res.data.code === 1) {
            const _a = res.data.data, accessToken = _a.accessToken, refreshToken = _a.refreshToken;
            utils_request.updateTokens(accessToken, refreshToken);
            common_vendor.index.setStorageSync("userInfo", res.data.data);
            common_vendor.index.switchTab({
              url: "/pages/children/index"
            });
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "登录失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: error.message || "登录失败",
            icon: "none"
          });
        }
      });
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args)),
    c: $data.formData.account,
    d: common_vendor.o(($event) => $data.formData.account = $event.detail.value),
    e: $data.formData.password,
    f: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    g: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
