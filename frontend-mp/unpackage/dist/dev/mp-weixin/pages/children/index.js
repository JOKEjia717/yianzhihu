"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      currentTab: "home",
      currentBannerIndex: 0
    };
  },
  methods: new UTSJSONObject({
    handleBannerChange(e = null) {
      this.currentBannerIndex = e.detail.current;
    },
    switchTab(tab) {
      this.currentTab = tab;
      switch (tab) {
        case "nursing":
          common_vendor.index.navigateTo({ url: "/pages/children/nursing" });
          break;
        case "mall":
          common_vendor.index.navigateTo({ url: "/pages/children/mall" });
          break;
        case "discover":
          common_vendor.index.navigateTo({ url: "/pages/children/discover" });
          break;
        case "mine":
          common_vendor.index.navigateTo({ url: "/pages/children/mine" });
          break;
      }
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_1,
    b: common_assets._imports_2,
    c: common_assets._imports_3,
    d: common_vendor.o((...args) => $options.handleBannerChange && $options.handleBannerChange(...args)),
    e: common_assets._imports_3$1,
    f: common_assets._imports_4,
    g: common_assets._imports_5,
    h: common_assets._imports_6,
    i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/index.js.map
