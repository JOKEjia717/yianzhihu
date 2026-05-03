"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      name: "",
      account: "",
      password: "",
      phone: "",
      isLoading: false
    };
  },
  methods: new UTSJSONObject({
    validateForm() {
      if (!this.name.trim()) {
        common_vendor.index.showToast({
          title: "请输入姓名",
          icon: "none"
        });
        return false;
      }
      if (!this.account.trim()) {
        common_vendor.index.showToast({
          title: "请输入账号",
          icon: "none"
        });
        return false;
      }
      if (!this.password) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return false;
      }
      if (this.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return false;
      }
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    handleRegister() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.validateForm()) {
          return Promise.resolve(null);
        }
        if (this.isLoading) {
          return Promise.resolve(null);
        }
        this.isLoading = true;
        try {
          const res = yield api_user.register({
            name: this.name.trim(),
            account: this.account.trim(),
            password: this.password,
            phone: this.phone
          });
          if (res.statusCode === 200 && res.data.code === 1) {
            const _a = res.data.data, accessToken = _a.accessToken, refreshToken = _a.refreshToken;
            utils_request.updateTokens(accessToken, refreshToken);
            common_vendor.index.setStorageSync("userInfo", res.data.data);
            common_vendor.index.showToast({
              title: "注册成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/children/index"
              });
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "注册失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: error.message || "注册失败，请稍后重试",
            icon: "none"
          });
        } finally {
          this.isLoading = false;
        }
      });
    },
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args)),
    c: $data.name,
    d: common_vendor.o(($event) => $data.name = $event.detail.value),
    e: $data.account,
    f: common_vendor.o(($event) => $data.account = $event.detail.value),
    g: $data.password,
    h: common_vendor.o(($event) => $data.password = $event.detail.value),
    i: $data.phone,
    j: common_vendor.o(($event) => $data.phone = $event.detail.value),
    k: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    l: $data.isLoading,
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
