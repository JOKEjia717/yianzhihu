"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      orderAmount: 0,
      selectedMethod: 1,
      orderId: "",
      paymentMethods: [
        {
          id: 1,
          name: "余额支付",
          icon: "/static/images/wechat-pay.png",
          description: "推荐使用余额支付"
        }
      ]
    };
  },
  onLoad(options = null) {
    const orderInfo = common_vendor.index.getStorageSync("orderInfo");
    if (orderInfo && orderInfo.totalAmount) {
      this.orderAmount = orderInfo.totalAmount;
    } else if (options.amount) {
      this.orderAmount = Number(options.amount);
    }
    if (options.id) {
      this.orderId = options.id;
    } else if (orderInfo && orderInfo.orderId) {
      this.orderId = orderInfo.orderId;
    }
  },
  methods: new UTSJSONObject({
    navigateBack() {
      common_vendor.index.navigateBack(new UTSJSONObject({
        delta: 1,
        fail: () => {
          common_vendor.index.switchTab({ url: "/pages/children/cart" });
        }
      }));
    },
    selectMethod(methodId) {
      this.selectedMethod = methodId;
    },
    handlePayment() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const orderId = common_vendor.index.getStorageSync("orderId");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({ title: "请先登录", icon: "none" });
            setTimeout(() => {
              return common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }, 1500);
            return Promise.resolve(null);
          }
          common_vendor.index.__f__("log", "at pages/children/payment.uvue:119", "即将发起支付请求，订单ID:", orderId);
          const res = yield common_vendor.index.request({
            url: `http://localhost:8080/goods/pay/ipay?id=${orderId}`,
            method: "POST",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken,
              "Content-Type": "application/json"
            })
          });
          common_vendor.index.__f__("log", "at pages/children/payment.uvue:132", "支付接口响应:", res);
          if (res.statusCode === 200) {
            const response = res.data;
            if (response.code === 1) {
              try {
                const deleteRes = yield common_vendor.index.request({
                  url: "http://localhost:8080/goods/cart/delete",
                  method: "DELETE",
                  header: new UTSJSONObject({
                    "accessToken": accessToken,
                    "refreshToken": refreshToken,
                    "Content-Type": "application/json"
                  })
                });
                common_vendor.index.__f__("log", "at pages/children/payment.uvue:148", "删除购物车响应:", deleteRes);
              } catch (deleteError) {
                common_vendor.index.__f__("log", "at pages/children/payment.uvue:150", "删除购物车失败:", deleteError);
              }
              common_vendor.index.showToast({ title: "支付成功", icon: "success" });
              setTimeout(() => {
                common_vendor.index.switchTab({ url: "/pages/children/mall" });
              }, 1500);
            } else {
              common_vendor.index.showToast({ title: response.msg || "支付失败", icon: "none" });
            }
          } else {
            common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("log", "at pages/children/payment.uvue:164", "支付失败:", error);
          common_vendor.index.showToast({ title: "支付失败", icon: "none" });
        }
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.navigateBack && $options.navigateBack(...args)),
    b: common_vendor.t($data.orderAmount),
    c: common_vendor.f($data.paymentMethods, (method, k0, i0) => {
      return {
        a: method.icon,
        b: common_vendor.t(method.name),
        c: common_vendor.t(method.description),
        d: common_vendor.t($data.selectedMethod === method.id ? "✓" : ""),
        e: method.id,
        f: $data.selectedMethod === method.id ? 1 : "",
        g: common_vendor.o(($event) => $options.selectMethod(method.id), method.id)
      };
    }),
    d: common_vendor.o((...args) => $options.handlePayment && $options.handlePayment(...args)),
    e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/payment.js.map
