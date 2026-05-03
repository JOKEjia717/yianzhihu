"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      orderDetail: null
    };
  },
  onLoad(options = null) {
    const itemId = options.id;
    if (itemId) {
      this.getOrderDetail(itemId);
    }
  },
  methods: new UTSJSONObject({
    getOrderDetail(itemId) {
      common_vendor.index.request({
        url: "http://localhost:8080/goods/order/get",
        method: "GET",
        data: new UTSJSONObject({
          ids: itemId
        }),
        header: new UTSJSONObject({
          "accessToken": common_vendor.index.getStorageSync("accessToken"),
          "refreshToken": common_vendor.index.getStorageSync("refreshToken")
        }),
        success: (res = null) => {
          if (res.statusCode === 200 && res.data.code === 1) {
            this.orderDetail = res.data.data;
          } else {
            common_vendor.index.showToast({
              title: "获取订单详情失败",
              icon: "error"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "获取订单详情失败",
            icon: "error"
          });
        }
      });
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return "待付款";
        case 2:
          return "已付款";
        case 3:
          return "已完成";
        case 4:
          return "已取消";
        case 5:
          return "退款中";
        case 6:
          return "已退款";
        default:
          return "未知状态";
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 1:
          return "status-pending";
        case 2:
          return "status-paid";
        case 3:
          return "status-completed";
        case 4:
          return "status-cancelled";
        case 5:
          return "status-refunding";
        case 6:
          return "status-refunded";
        default:
          return "";
      }
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.orderDetail
  }, $data.orderDetail ? {
    b: common_vendor.t($data.orderDetail.bizOrderNo),
    c: common_vendor.t($options.getStatusText($data.orderDetail.status)),
    d: common_vendor.n($options.getStatusClass($data.orderDetail.status)),
    e: common_vendor.t($data.orderDetail.amount.toFixed(2)),
    f: common_vendor.f($data.orderDetail.payOrderItemVoList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price.toFixed(2)),
        d: index
      };
    })
  } : {}, {
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/order-detail.js.map
