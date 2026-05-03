"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  props: {
    currentPath: new UTSJSONObject({
      type: String,
      default: ""
    })
  },
  methods: new UTSJSONObject({
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          common_vendor.index.__f__("error", "at components/nurse-tabbar.uvue:35", "页面跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.currentPath === "/pages/nurse/index" ? "/static/images/home-active.png" : "/static/images/home.png",
    b: $props.currentPath === "/pages/nurse/index" ? 1 : "",
    c: common_vendor.o(($event) => $options.navigateTo("/pages/nurse/index")),
    d: $props.currentPath === "/pages/nurse/activity" ? "/static/images/activity-active.png" : "/static/images/activity.png",
    e: $props.currentPath === "/pages/nurse/activity" ? 1 : "",
    f: common_vendor.o(($event) => $options.navigateTo("/pages/nurse/activity")),
    g: $props.currentPath === "/pages/nurse/goods" ? "/static/images/goods-active.png" : "/static/images/goods.png",
    h: $props.currentPath === "/pages/nurse/goods" ? 1 : "",
    i: common_vendor.o(($event) => $options.navigateTo("/pages/nurse/goods")),
    j: $props.currentPath === "/pages/nurse/my" ? "/static/images/mine-active.png" : "/static/images/mine.png",
    k: $props.currentPath === "/pages/nurse/my" ? 1 : "",
    l: common_vendor.o(($event) => $options.navigateTo("/pages/nurse/my")),
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/nurse-tabbar.js.map
