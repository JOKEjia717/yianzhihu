"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      cartItems: [],
      loading: false,
      isEditMode: false,
      animateItem: -1,
      elderList: [],
      selectedElderId: "",
      elderIndex: 0,
      selectedElderName: "",
      colorList: ["#F1FAF5", "#E6F9F0", "#F9F6E6", "#F6F1FA", "#F1F6FA", "#F9F1F1", "#F1F9F3", "#F1F3F9"]
    };
  },
  onShow() {
    this.loadCartData();
    this.loadElderData();
  },
  computed: new UTSJSONObject({
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }
  }),
  methods: new UTSJSONObject({
    navigateBack() {
      common_vendor.index.navigateBack(new UTSJSONObject({
        delta: 1,
        fail: () => {
          common_vendor.index.switchTab({ url: "/pages/children/mine" });
        }
      }));
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    navigateToMall() {
      common_vendor.index.switchTab({ url: "/pages/children/mall" });
    },
    loadCartData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          this.loading = true;
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({ title: "请先登录", icon: "none" });
            setTimeout(() => {
              return common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }, 1500);
            return Promise.resolve(null);
          }
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/goods/cart/get",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (res.statusCode === 200) {
            const response = res.data;
            if (response.code === 1) {
              this.cartItems = response.data.map((item = null) => {
                return new UTSJSONObject({
                  id: item.id,
                  itemId: String(item.itemId),
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: item.num
                });
              });
            } else {
              common_vendor.index.showToast({ title: response.msg || "获取数据失败", icon: "none" });
            }
          } else {
            common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.showToast({ title: "获取数据失败", icon: "none" });
        } finally {
          this.loading = false;
        }
      });
    },
    loadElderData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/elder/getByChildrenId",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (res.statusCode === 200) {
            const response = res.data;
            if (response.code === 1) {
              this.elderList = response.data;
              if (this.elderList.length > 0 && !this.selectedElderId) {
                this.selectElder(this.elderList[0].elderId);
              }
            } else {
              common_vendor.index.showToast({ title: response.msg || "获取老人数据失败", icon: "none" });
            }
          } else {
            common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.showToast({ title: "获取老人数据失败", icon: "none" });
        }
      });
    },
    selectElder(elderId) {
      this.selectedElderId = elderId;
      const elder = UTS.arrayFind(this.elderList, (e) => {
        return e.elderId === elderId;
      });
      if (elder) {
        this.selectedElderName = elder.name;
        this.loadCartData();
      }
    },
    validateQuantity(index) {
      if (this.cartItems[index].quantity < 1) {
        this.cartItems[index].quantity = 1;
      }
    },
    updateQuantity(index, delta) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const item = this.cartItems[index];
        try {
          this.cartItems[index].quantity += delta;
          this.animateItem = item.id;
          setTimeout(() => {
            return this.animateItem = -1;
          }, 300);
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const url = delta > 0 ? `http://localhost:8080/goods/cart/add?id=${encodeURIComponent(item.itemId)}` : `http://localhost:8080/goods/cart/less?id=${encodeURIComponent(item.itemId)}`;
          const res = yield common_vendor.index.request({
            url,
            method: "PUT",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (res.statusCode === 200) {
            const response = res.data;
            if (response.code !== 1) {
              this.cartItems[index].quantity -= delta;
              common_vendor.index.showToast({ title: response.msg || "操作失败", icon: "none" });
            } else {
              yield this.loadCartData();
            }
          } else {
            this.cartItems[index].quantity -= delta;
            common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
          }
        } catch (error) {
          this.cartItems[index].quantity -= delta;
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        }
      });
    },
    deleteItem(id) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.showLoading({ title: "删除中..." });
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const res = yield common_vendor.index.request({
            url: `http://localhost:8080/goods/cart/delete?id=${id}&elderId=${this.selectedElderId}`,
            method: "DELETE",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (res.statusCode === 200) {
            const response = res.data;
            if (response.code === 1) {
              this.cartItems = this.cartItems.filter((item) => {
                return item.id !== id;
              });
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
            } else {
              common_vendor.index.showToast({ title: response.msg || "删除失败", icon: "none" });
            }
          } else {
            common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.showToast({ title: "删除失败", icon: "none" });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    },
    handleCheckout() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.selectedElderId) {
          common_vendor.index.showToast({ title: "请先选择老人", icon: "none" });
          return Promise.resolve(null);
        }
        if (this.cartItems.length === 0) {
          common_vendor.index.showToast({ title: "购物车为空", icon: "none" });
          return Promise.resolve(null);
        }
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const orderDtolist = this.cartItems.map((item) => {
            return new UTSJSONObject({
              itemId: item.itemId,
              totalPrice: item.price * item.quantity,
              name: item.name,
              image: item.image || "",
              num: item.quantity
            });
          });
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/goods/order/add",
            method: "POST",
            header: new UTSJSONObject({
              "Content-Type": "application/json",
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            data: new UTSJSONObject({
              elderId: this.selectedElderId,
              orderDtolist
            })
          });
          if (res.statusCode === 200 && res.data && res.data.code === 1) {
            const orderId = res.data.data;
            common_vendor.index.__f__("log", "at pages/children/cart.uvue:404", "创建订单成功，订单ID:", orderId);
            common_vendor.index.setStorageSync("orderId", orderId);
            common_vendor.index.setStorageSync("orderInfo", new UTSJSONObject({
              items: orderDtolist,
              totalAmount: this.totalPrice,
              elderId: this.selectedElderId,
              elderName: this.selectedElderName
            }));
            common_vendor.index.navigateTo({ url: "/pages/children/payment" });
          } else {
            common_vendor.index.showToast({ title: res.data.msg || "下单失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.showToast({ title: "创建订单失败", icon: "none" });
        }
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.navigateBack && $options.navigateBack(...args)),
    b: common_vendor.t($data.isEditMode ? "完成" : "编辑"),
    c: common_vendor.o((...args) => $options.toggleEditMode && $options.toggleEditMode(...args)),
    d: $data.loading
  }, $data.loading ? {
    e: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: i
      };
    })
  } : $data.cartItems.length === 0 ? {
    g: common_assets._imports_0$4,
    h: common_vendor.o((...args) => $options.navigateToMall && $options.navigateToMall(...args))
  } : {
    i: common_vendor.f($data.elderList, (elder, k0, i0) => {
      return common_vendor.e({
        a: elder.photo || "/static/images/default-avatar.png",
        b: common_vendor.t(elder.name),
        c: common_vendor.t(elder.age),
        d: $data.selectedElderId === elder.elderId
      }, $data.selectedElderId === elder.elderId ? {} : {}, {
        e: elder.elderId,
        f: $data.selectedElderId === elder.elderId ? 1 : "",
        g: common_vendor.o(($event) => $options.selectElder(elder.elderId), elder.elderId)
      });
    }),
    j: common_vendor.f($data.cartItems, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.updateQuantity(index, -1), item.id),
        b: common_vendor.o(($event) => $options.validateQuantity(index), item.id),
        c: item.quantity,
        d: common_vendor.o(($event) => item.quantity = $event.detail.value, item.id),
        e: common_vendor.o(($event) => $options.updateQuantity(index, 1), item.id),
        f: item.image || "/static/images/default-product.jpg",
        g: common_vendor.t(item.name),
        h: common_vendor.t(item.price.toFixed(2))
      }, $data.isEditMode ? {
        i: common_vendor.o(($event) => $options.deleteItem(item.id), item.id)
      } : {}, {
        j: item.id,
        k: $data.colorList[index % $data.colorList.length],
        l: $data.animateItem === item.id ? 1 : ""
      });
    }),
    k: $data.isEditMode
  }, {
    f: $data.cartItems.length === 0,
    l: common_vendor.t($options.totalPrice.toFixed(2)),
    m: common_vendor.t($data.cartItems.length > 0 ? `(${$data.cartItems.length})` : ""),
    n: !$data.selectedElderId || $data.cartItems.length === 0,
    o: common_vendor.o((...args) => $options.handleCheckout && $options.handleCheckout(...args)),
    p: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/cart.js.map
