"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      // 通用
      currentTab: "list",
      // 高德地图Key
      amapKey: "1db93ddf57523eb18a461389935cee31",
      // 列表搜索相关数据
      nursingHomes: [],
      searchParams: {
        pageNo: 1,
        pageSize: 10,
        name: "",
        address: ""
      },
      total: 0,
      loading: false,
      colors: [
        "rgba(135, 206, 235, 0.2)",
        "rgba(144, 238, 144, 0.2)",
        "rgba(255, 182, 193, 0.2)",
        "rgba(230, 230, 250, 0.2)",
        "rgba(255, 218, 185, 0.2)",
        "rgba(176, 224, 230, 0.2)"
        // 粉蓝色
      ],
      // 地图搜索相关数据
      mapSearchQuery: "养老院",
      latitude: 29.82819,
      longitude: 106.4784,
      markers: [],
      searchResults: [],
      mapLoading: false,
      isResultExpanded: false,
      isSearchHidden: false,
      lastScrollTop: 0,
      hasSearched: false,
      currentLocation: new UTSJSONObject({
        latitude: 29.82819,
        longitude: 106.4784
      }),
      searchAttempts: 0,
      maxSearchAttempts: 3,
      mapUrl: ""
    };
  },
  onLoad(options) {
    this.loadNursingHomes();
    this.getCurrentLocation();
    common_vendor.index.onWindowResize(() => {
      if (this.currentTab === "map") {
        const query = common_vendor.index.createSelectorQuery();
        query.select(".result-list").boundingClientRect((rect = null) => {
          if (rect) {
            const currentScrollTop = rect.top;
            this.isSearchHidden = currentScrollTop < this.lastScrollTop;
            this.lastScrollTop = currentScrollTop;
          }
        }).exec();
      }
    });
  },
  methods: new UTSJSONObject({
    // 通用方法
    switchTab(tab) {
      this.currentTab = tab;
      if (tab === "map") {
        this.getCurrentLocation();
        setTimeout(() => {
          this.handleMapSearch(false);
        }, 1e3);
      }
    },
    // 列表搜索相关方法
    getCardColor(index) {
      return this.colors[index % this.colors.length];
    },
    handleCardClick(nursingHomeId) {
      common_vendor.index.__f__("log", "at pages/children/discover.uvue:257", "点击养老院卡片，ID:", nursingHomeId);
      common_vendor.index.navigateTo({
        url: `/pages/children/nursing-detail?nursingHomeId=${nursingHomeId}`,
        success: () => {
          common_vendor.index.__f__("log", "at pages/children/discover.uvue:261", "页面跳转成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/discover.uvue:264", "页面跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    handleSearch() {
      this.searchParams.pageNo = 1;
      this.loadNursingHomes();
    },
    loadNursingHomes() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.loading)
          return Promise.resolve(null);
        this.loading = true;
        try {
          const res = yield utils_request.request.get("/home/list", new UTSJSONObject({
            data: this.searchParams
          }));
          if (res.statusCode === 200 && res.data.code === 1) {
            const _a = res.data.data, total = _a.total, list = _a.list;
            this.total = total;
            if (this.searchParams.pageNo === 1) {
              this.nursingHomes = list;
            } else {
              this.nursingHomes = [...this.nursingHomes, ...list];
            }
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        } finally {
          this.loading = false;
        }
      });
    },
    loadMore() {
      if (this.nursingHomes.length >= this.total)
        return null;
      this.searchParams.pageNo++;
      this.loadNursingHomes();
    },
    // 地图搜索相关方法
    handleMapSearch() {
      if (this.mapLoading)
        return null;
      if (!this.mapSearchQuery.trim()) {
        this.mapSearchQuery = "养老院";
      }
      if (this.currentLocation.latitude === 0 || this.currentLocation.longitude === 0) {
        common_vendor.index.showToast({
          title: "正在获取位置信息，请稍后再试",
          icon: "none"
        });
        return null;
      }
      if (this.searchAttempts >= this.maxSearchAttempts) {
        this.searchAttempts = 0;
        common_vendor.index.showToast({
          title: "未找到相关养老院，请尝试其他区域",
          icon: "none",
          duration: 2e3
        });
        return null;
      }
      this.mapLoading = true;
      this.hasSearched = true;
      this.searchAroundByAmap();
      const baseUrl = "/pages/children/map.html";
      const query = this.mapSearchQuery.trim();
      this.mapUrl = `${baseUrl}?query=${encodeURIComponent(query)}&lat=${this.currentLocation.latitude}&lng=${this.currentLocation.longitude}`;
    },
    searchAroundByAmap() {
      common_vendor.index.__f__("log", "at pages/children/discover.uvue:355", "发送高德地图搜索请求，参数：", new UTSJSONObject({
        经度: this.currentLocation.longitude,
        纬度: this.currentLocation.latitude,
        查询: this.mapSearchQuery,
        尝试次数: this.searchAttempts + 1
      }));
      const url = `https://restapi.amap.com/v3/place/around?key=${this.amapKey}&location=${this.currentLocation.longitude},${this.currentLocation.latitude}&keywords=${encodeURIComponent(this.mapSearchQuery)}&radius=5000&extensions=all&offset=20&page=1`;
      common_vendor.index.request({
        url,
        method: "GET",
        success: (res = null) => {
          common_vendor.index.__f__("log", "at pages/children/discover.uvue:370", "高德地图搜索结果：", res);
          if (res.statusCode === 200) {
            const amapRes = res.data;
            if (amapRes.status === "1" && amapRes.pois && amapRes.pois.length > 0) {
              this.searchAttempts = 0;
              this.processAmapResults(amapRes.pois);
            } else {
              this.searchAttempts++;
              this.adjustLocationAndRetry();
            }
          } else {
            this.searchAttempts++;
            this.adjustLocationAndRetry();
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/children/discover.uvue:391", "高德地图搜索失败：", err);
          this.searchAttempts++;
          this.adjustLocationAndRetry();
          common_vendor.index.showToast({
            title: "搜索失败，请检查网络",
            icon: "none"
          });
        },
        complete: () => {
          this.mapLoading = false;
        }
      });
    },
    processAmapResults(pois) {
      this.searchResults = pois.map((poi) => {
        const location = poi.location.split(",");
        const longitude = Number(location[0]) || 0;
        const latitude = Number(location[1]) || 0;
        return {
          id: poi.id || "",
          name: poi.name || "未知名称",
          address: poi.address || "未知地址",
          distance: Number(poi.distance) || 0,
          latitude,
          longitude,
          tel: poi.tel || "",
          type: poi.type || ""
        };
      });
      this.updateMapMarkers();
    },
    adjustLocationAndRetry() {
      const adjustment = 0.01 + Math.random() * 0.04;
      const direction = Math.random() < 0.5 ? 1 : -1;
      if (Math.random() < 0.5) {
        this.currentLocation.longitude += adjustment * direction;
      } else {
        this.currentLocation.latitude += adjustment * direction;
      }
      const mapContext = common_vendor.index.createMapContext("map");
      mapContext.moveToLocation(new UTSJSONObject({
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude
      }));
      common_vendor.index.showToast({
        title: `正在搜索新位置...`,
        icon: "loading",
        duration: 1500
      });
      setTimeout(() => {
        this.handleMapSearch(true);
      }, 1500);
    },
    updateMapMarkers() {
      this.markers = [];
      this.markers = this.searchResults.map((place, index) => {
        return new UTSJSONObject({
          id: index,
          latitude: place.latitude,
          longitude: place.longitude,
          title: place.name,
          iconPath: "/static/images/marker.png",
          width: 32,
          height: 32,
          callout: new UTSJSONObject({
            content: place.name,
            padding: 8,
            borderRadius: 4,
            display: "ALWAYS"
          })
        });
      });
      this.markers.push(new UTSJSONObject({
        id: this.markers.length,
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        title: "当前位置",
        iconPath: "/static/images/location.png",
        width: 32,
        height: 32,
        callout: new UTSJSONObject({
          content: "当前位置",
          padding: 8,
          borderRadius: 4,
          display: "ALWAYS"
        })
      }));
      const mapContext = common_vendor.index.createMapContext("map");
      mapContext.includePoints({
        points: this.markers,
        padding: [80, 80, 80, 80]
      });
    },
    getCurrentLocation() {
      common_vendor.index.getLocation(new UTSJSONObject({
        type: "gcj02",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/children/discover.uvue:512", "获取位置成功：", res);
          this.currentLocation.latitude = res.latitude;
          this.currentLocation.longitude = res.longitude;
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          if (this.currentTab === "map") {
            const mapContext = common_vendor.index.createMapContext("map");
            mapContext.moveToLocation(new UTSJSONObject({
              latitude: this.currentLocation.latitude,
              longitude: this.currentLocation.longitude
            }));
          }
        }
      }));
    },
    onMarkerTap(e = null) {
      const marker = this.markers[e.detail.markerId];
      if (marker) {
        const place = this.searchResults[e.detail.markerId];
        if (place) {
          this.selectPlace(place);
        }
      }
    },
    selectPlace(place) {
      const feedback = new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      feedback.then(() => {
        common_vendor.index.showModal(new UTSJSONObject({
          title: place.name,
          content: `地址：${place.address}
距离：${(place.distance / 1e3).toFixed(2)}km${place.tel ? "\n电话：" + place.tel : ""}`,
          showCancel: true,
          cancelText: "关闭",
          confirmText: "查看详情",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.showToast({
                title: "功能开发中",
                icon: "none"
              });
            }
          }
        }));
      });
    },
    toggleResultExpand() {
      this.isResultExpanded = !this.isResultExpanded;
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentTab === "list" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab("list")),
    c: $data.currentTab === "map" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("map")),
    e: $data.currentTab === "list"
  }, $data.currentTab === "list" ? {
    f: common_assets._imports_0$2,
    g: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    h: $data.searchParams.name,
    i: common_vendor.o(($event) => $data.searchParams.name = $event.detail.value),
    j: common_assets._imports_4$1,
    k: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    l: $data.searchParams.address,
    m: common_vendor.o(($event) => $data.searchParams.address = $event.detail.value),
    n: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    o: common_vendor.f($data.nursingHomes, (item, index, i0) => {
      return {
        a: item.photo.split(",")[0],
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.address),
        d: item.nursingHomeId,
        e: $options.getCardColor(index),
        f: common_vendor.o(($event) => $options.handleCardClick(item.nursingHomeId), item.nursingHomeId)
      };
    }),
    p: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    q: $data.currentTab === "map"
  }, $data.currentTab === "map" ? common_vendor.e({
    r: common_vendor.o((...args) => $options.handleMapSearch && $options.handleMapSearch(...args)),
    s: $data.mapSearchQuery,
    t: common_vendor.o(($event) => $data.mapSearchQuery = $event.detail.value),
    v: common_vendor.o((...args) => $options.handleMapSearch && $options.handleMapSearch(...args)),
    w: $data.isSearchHidden ? 1 : "",
    x: $data.mapUrl,
    y: common_vendor.o((...args) => _ctx.handleMapMessage && _ctx.handleMapMessage(...args)),
    z: common_vendor.o((...args) => $options.toggleResultExpand && $options.toggleResultExpand(...args)),
    A: common_vendor.f($data.searchResults, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t((item.distance / 1e3).toFixed(2)),
        c: common_vendor.t(item.address),
        d: item.tel
      }, item.tel ? {
        e: common_vendor.t(item.tel)
      } : {}, {
        f: item.type
      }, item.type ? {
        g: common_vendor.t(item.type)
      } : {}, {
        h: index,
        i: index * 0.1 + "s"
      });
    }),
    B: $data.searchResults.length === 0 && !$data.mapLoading
  }, $data.searchResults.length === 0 && !$data.mapLoading ? {} : {}, {
    C: $data.mapLoading ? 0.5 : 1,
    D: $data.isResultExpanded ? 1 : ""
  }) : {}, {
    E: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/discover.js.map
