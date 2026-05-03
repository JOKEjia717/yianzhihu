"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      orders: [],
      showModal: false,
      currentOrder: null
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/children/order-list.uvue:159", "order-list 页面加载");
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", (data = null) => {
      common_vendor.index.__f__("log", "at pages/children/order-list.uvue:162", "Received orders data:", data);
      if (data && data.orders) {
        this.orders = data.orders;
        common_vendor.index.__f__("log", "at pages/children/order-list.uvue:165", "Orders set:", this.orders);
      } else {
        common_vendor.index.__f__("error", "at pages/children/order-list.uvue:167", "No orders data received");
      }
    });
  },
  methods: new UTSJSONObject({
    getStatusText(status) {
      switch (status) {
        case 1:
          return "待付款";
        case 2:
          return "订单超时";
        case 3:
          return "已付款";
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
    },
    formatDate(timeStr) {
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    cancelOrder(orderId) {
      const order = UTS.arrayFind(this.orders, (o) => {
        return o.id === orderId;
      });
      if (!order || !order.bizOrderNo) {
        common_vendor.index.showToast({
          title: "订单信息不完整",
          icon: "error"
        });
        return null;
      }
      common_vendor.index.showModal(new UTSJSONObject({
        title: "提示",
        content: "确定要取消该订单吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `http://localhost:8080/goods/order/delete/?id=${order.bizOrderNo}`,
              method: "PUT",
              header: new UTSJSONObject({
                "accessToken": common_vendor.index.getStorageSync("accessToken"),
                "refreshToken": common_vendor.index.getStorageSync("refreshToken")
              }),
              success: (res2 = null) => {
                if (res2.statusCode === 200 && res2.data.code === 1) {
                  common_vendor.index.showToast({
                    title: "订单已取消",
                    icon: "success"
                  });
                  const orderIndex = this.orders.findIndex((order2) => {
                    return order2.id === orderId;
                  });
                  if (orderIndex !== -1) {
                    this.orders[orderIndex].status = 4;
                  }
                } else {
                  common_vendor.index.showToast({
                    title: "取消失败",
                    icon: "error"
                  });
                }
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "取消失败",
                  icon: "error"
                });
              }
            });
          }
        }
      }));
    },
    refundOrder(orderId) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "申请退款",
        content: "确定要申请退款吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: "http://localhost:8080/goods/order/refund",
              method: "POST",
              data: new UTSJSONObject({
                orderId
              }),
              header: new UTSJSONObject({
                "accessToken": common_vendor.index.getStorageSync("accessToken"),
                "refreshToken": common_vendor.index.getStorageSync("refreshToken")
              }),
              success: (res2 = null) => {
                if (res2.statusCode === 200 && res2.data.code === 1) {
                  common_vendor.index.showToast({
                    title: "退款申请已提交",
                    icon: "success"
                  });
                  const orderIndex = this.orders.findIndex((order) => {
                    return order.id === orderId;
                  });
                  if (orderIndex !== -1) {
                    this.orders[orderIndex].status = 5;
                  }
                } else {
                  common_vendor.index.showToast({
                    title: "申请失败",
                    icon: "error"
                  });
                }
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "申请失败",
                  icon: "error"
                });
              }
            });
          }
        }
      }));
    },
    goToOrderDetail(itemId) {
      const order = UTS.arrayFind(this.orders, (o) => {
        return o.payOrderItemVoList.some((item) => {
          return item.id === itemId;
        });
      });
      if (order && order.bizOrderNo) {
        common_vendor.index.navigateTo({
          url: `/pages/children/order-detail?id=${order.bizOrderNo}`
        });
      } else {
        common_vendor.index.showToast({
          title: "订单信息不完整",
          icon: "error"
        });
      }
    },
    showOrderDetail(itemId) {
      common_vendor.index.request({
        url: `http://localhost:8080/goods/order/get?ids=${itemId}`,
        method: "GET",
        header: new UTSJSONObject({
          "accessToken": common_vendor.index.getStorageSync("accessToken"),
          "refreshToken": common_vendor.index.getStorageSync("refreshToken")
        }),
        success: (res = null) => {
          if (res.statusCode === 200 && res.data.code === 1) {
            this.currentOrder = res.data.data;
            this.showModal = true;
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
    closeModal() {
      this.showModal = false;
      this.currentOrder = null;
    },
    reOrder(order) {
      const orderDtoList = order.payOrderItemVoList.map((item) => {
        return new UTSJSONObject({
          totalPrice: item.price,
          itemId: item.itemId,
          name: item.name,
          image: item.image,
          num: 1
          // 默认数量为1
        });
      });
      common_vendor.index.showModal(new UTSJSONObject({
        title: "提示",
        content: "确定要重新下单吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "提交中..."
            });
            common_vendor.index.request({
              url: "http://localhost:8080/goods/order/add",
              method: "POST",
              header: new UTSJSONObject({
                "accessToken": common_vendor.index.getStorageSync("accessToken"),
                "refreshToken": common_vendor.index.getStorageSync("refreshToken"),
                "Content-Type": "application/json"
              }),
              data: new UTSJSONObject({
                orderDtoList
              }),
              success: (res2 = null) => {
                common_vendor.index.hideLoading();
                if (res2.statusCode === 200 && res2.data.code === 0) {
                  common_vendor.index.showToast({
                    title: "下单成功",
                    icon: "success",
                    success: () => {
                      this.refreshOrders();
                    }
                  });
                } else {
                  common_vendor.index.showToast({
                    title: "下单失败",
                    icon: "error"
                  });
                }
              },
              fail: () => {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "下单失败",
                  icon: "error"
                });
              }
            });
          }
        }
      }));
    },
    // 添加刷新订单列表的方法
    refreshOrders() {
      common_vendor.index.request({
        url: "http://localhost:8080/goods/order/list",
        method: "GET",
        header: new UTSJSONObject({
          "accessToken": common_vendor.index.getStorageSync("accessToken"),
          "refreshToken": common_vendor.index.getStorageSync("refreshToken")
        }),
        success: (res = null) => {
          if (res.statusCode === 200 && res.data.code === 1) {
            this.orders = res.data.data;
          }
        }
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.orders.length === 0
  }, $data.orders.length === 0 ? {
    b: common_assets._imports_0$6
  } : {
    c: common_vendor.f($data.orders, (order, index, i0) => {
      return {
        a: common_vendor.t($options.getStatusText(order.status)),
        b: common_vendor.n($options.getStatusClass(order.status)),
        c: common_vendor.f(order.payOrderItemVoList, (item, itemIndex, i1) => {
          return {
            a: item.image || "/static/images/default-product.png",
            b: common_vendor.o(($event) => $options.goToOrderDetail(item.id), itemIndex),
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.price.toFixed(2)),
            e: itemIndex
          };
        }),
        d: common_vendor.t(order.payOrderItemVoList.length),
        e: order.id
      };
    })
  }, {
    d: $data.showModal
  }, $data.showModal ? common_vendor.e({
    e: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args)),
    f: $data.currentOrder
  }, $data.currentOrder ? {
    g: common_vendor.t($data.currentOrder.bizOrderNo),
    h: common_vendor.t($options.getStatusText($data.currentOrder.status)),
    i: common_vendor.n($options.getStatusClass($data.currentOrder.status)),
    j: common_vendor.t($data.currentOrder.amount.toFixed(2)),
    k: common_vendor.f($data.currentOrder.payOrderItemVoList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price.toFixed(2)),
        d: index
      };
    })
  } : {}, {
    l: common_vendor.o(() => {
    }),
    m: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  }) : {}, {
    n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/order-list.js.map
