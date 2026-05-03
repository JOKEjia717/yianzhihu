"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  methods: new UTSJSONObject({
    goToDeanLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/dean/login"
      });
    },
    goToChildrenLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    goToNurseLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/nurse/login"
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToDeanLogin && $options.goToDeanLogin(...args)),
    b: common_vendor.o((...args) => $options.goToChildrenLogin && $options.goToChildrenLogin(...args)),
    c: common_vendor.o((...args) => $options.goToNurseLogin && $options.goToNurseLogin(...args)),
    d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
