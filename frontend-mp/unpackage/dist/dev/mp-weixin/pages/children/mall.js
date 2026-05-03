"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      searchKey: "",
      isLoading: false,
      searchParams: {
        pageNo: 1,
        pageSize: 10,
        itemName: "",
        isAsc: true
      },
      total: 0,
      products: [],
      functionItems: [
        { icon: "/static/images/icon-popular.png", name: "热门促销", type: "popular" },
        { icon: "/static/images/icon-reserve.png", name: "预售", type: "reserve" },
        { icon: "/static/images/icon-new.png", name: "生鲜", type: "fresh" },
        { icon: "/static/images/icon-drink.png", name: "乳品", type: "video" },
        { icon: "/static/images/icon-care.png", name: "护工到家", type: "care" },
        { icon: "/static/images/icon-money.png", name: "服务", type: "service" },
        { icon: "/static/images/icon-frsh.png", name: "便利店", type: "store" },
        { icon: "/static/images/icon-self.png", name: "老人专区", type: "elderly" },
        { icon: "/static/images/icon-recommend.png", name: "推荐", type: "recommend" },
        { icon: "/static/images/icon-more.png", name: "更多", type: "more" }
      ],
      showPriceFilter: false,
      tempPriceRange: {
        min: null,
        max: null
      },
      priceRanges: [
        { min: null, max: 100, text: "100元以下" },
        { min: 100, max: 500, text: "100-500元" },
        { min: 500, max: 1e3, text: "500-1000元" },
        { min: 1e3, max: 2e3, text: "1000-2000元" },
        { min: 2e3, max: null, text: "2000元以上" }
      ]
    };
  },
  onLoad() {
    this.fetchProducts();
  },
  methods: {
    handleAddCart(item) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const accessToken = common_vendor.index.getStorageSync("accessToken");
        const refreshToken = common_vendor.index.getStorageSync("refreshToken");
        if (!accessToken || !refreshToken) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
          }, 1500);
          return Promise.resolve(null);
        }
        const params = new UTSJSONObject({
          itemId: item.id.toString(),
          name: item.name,
          price: item.price.toFixed(2),
          num: 1
          // 默认添加1件，可按需调整
        });
        try {
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/goods/cart/save",
            method: "POST",
            header: new UTSJSONObject({
              "Content-Type": "application/json",
              "accessToken": accessToken,
              "refreshToken": refreshToken
            }),
            data: UTS.JSON.stringify(params)
          });
          const response = res.data;
          if (response.code === 1) {
            common_vendor.index.showToast({
              title: "已加入购物车",
              icon: "success"
            });
          } else {
            common_vendor.index.showToast({
              title: response.msg || "操作失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "网络异常，请稍后重试",
            icon: "none"
          });
        }
      });
    },
    fetchProducts() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.isLoading)
          return Promise.resolve(null);
        this.isLoading = true;
        try {
          const queryParams = Object.entries(this.searchParams).filter((_a) => {
            var _b = common_vendor.__read(_a, 2), _ = _b[0], value = _b[1];
            return value !== void 0;
          }).map((_a) => {
            var _b = common_vendor.__read(_a, 2), key = _b[0], value = _b[1];
            return `${key}=${encodeURIComponent(String(value))}`;
          }).join("&");
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const res = yield common_vendor.index.request({
            url: `http://localhost:8080/goods/search?${queryParams}`,
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          const response = res.data;
          if (response.code === 1 && response.data) {
            if (this.searchParams.pageNo === 1) {
              this.products = response.data.list;
            } else {
              this.products = [...this.products, ...response.data.list];
            }
            this.total = response.data.total;
          } else {
            common_vendor.index.showToast({
              title: "获取商品列表失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        } finally {
          this.isLoading = false;
        }
      });
    },
    handleSearch() {
      this.searchParams.pageNo = 1;
      this.searchParams.itemName = this.searchKey;
      this.fetchProducts();
    },
    handleFunction(type) {
      common_vendor.index.__f__("log", "at pages/children/mall.uvue:329", "功能点击：", type);
    },
    loadMore() {
      if (this.isLoading)
        return null;
      if (this.products.length >= this.total) {
        common_vendor.index.showToast({
          title: "没有更多商品了",
          icon: "none"
        });
        return null;
      }
      this.searchParams.pageNo += 1;
      this.fetchProducts();
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/children/product-detail?id=${id}`
      });
    },
    isSelectedRange(range) {
      return this.tempPriceRange.min === range.min && this.tempPriceRange.max === range.max;
    },
    selectPriceRange(range) {
      this.tempPriceRange = Object.assign({}, range);
    },
    resetPriceFilter() {
      this.tempPriceRange.min = null;
      this.tempPriceRange.max = null;
      this.searchParams.minPrice = void 0;
      this.searchParams.maxPrice = void 0;
      this.showPriceFilter = false;
      this.searchParams.pageNo = 1;
      this.fetchProducts();
    },
    confirmPriceFilter() {
      var _a, _b;
      if (this.tempPriceRange.min !== null && this.tempPriceRange.max !== null && this.tempPriceRange.min > this.tempPriceRange.max) {
        common_vendor.index.showToast({
          title: "价格区间不合法",
          icon: "none"
        });
        return null;
      }
      this.searchParams.minPrice = (_a = this.tempPriceRange.min) !== null && _a !== void 0 ? _a : void 0;
      this.searchParams.maxPrice = (_b = this.tempPriceRange.max) !== null && _b !== void 0 ? _b : void 0;
      this.searchParams.pageNo = 1;
      this.showPriceFilter = false;
      this.fetchProducts();
    },
    getStatusClass(status) {
      switch (status) {
        case 0:
          return "status-normal";
        case 1:
          return "status-offline";
        case 2:
          return "status-deleted";
        default:
          return "";
      }
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return "正常";
        case 1:
          return "下架";
        case 2:
          return "已删除";
        default:
          return "";
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.showPriceFilter = true),
    b: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    c: $data.searchKey,
    d: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    f: $data.showPriceFilter
  }, $data.showPriceFilter ? {
    g: common_vendor.o(($event) => $data.showPriceFilter = false),
    h: $data.tempPriceRange.min,
    i: common_vendor.o(($event) => $data.tempPriceRange.min = $event.detail.value),
    j: $data.tempPriceRange.max,
    k: common_vendor.o(($event) => $data.tempPriceRange.max = $event.detail.value),
    l: common_vendor.f($data.priceRanges, (range, index, i0) => {
      return {
        a: common_vendor.t(range.text),
        b: index,
        c: $options.isSelectedRange(range) ? 1 : "",
        d: common_vendor.o(($event) => $options.selectPriceRange(range), index)
      };
    }),
    m: common_vendor.o((...args) => $options.resetPriceFilter && $options.resetPriceFilter(...args)),
    n: common_vendor.o((...args) => $options.confirmPriceFilter && $options.confirmPriceFilter(...args)),
    o: common_vendor.o(() => {
    }),
    p: common_vendor.o(($event) => $data.showPriceFilter = false)
  } : {}, {
    q: common_assets._imports_0$1,
    r: common_vendor.f($data.functionItems, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.handleFunction(item.type), index)
      };
    }),
    s: common_vendor.f($data.products, (item, k0, i0) => {
      return common_vendor.e({
        a: item.image || "/static/images/default-product.jpg",
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.sold),
        e: common_vendor.t($options.getStatusText(item.status)),
        f: common_vendor.n($options.getStatusClass(item.status)),
        g: item.status === 0
      }, item.status === 0 ? {
        h: common_vendor.o(($event) => $options.handleAddCart(item), item.id)
      } : {}, {
        i: item.id,
        j: common_vendor.o(($event) => $options.goToDetail(item.id), item.id)
      });
    }),
    t: $data.isLoading
  }, $data.isLoading ? {} : $data.products.length >= $data.total && $data.products.length > 0 ? {} : {}, {
    v: $data.products.length >= $data.total && $data.products.length > 0,
    w: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/mall.js.map
