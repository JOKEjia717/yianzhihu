"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const ActivitySkeleton = () => "./components/ActivitySkeleton.js";
const NurseTabbar = () => "../../components/nurse-tabbar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    ActivitySkeleton,
    NurseTabbar
  },
  data() {
    return {
      activities: [],
      deanId: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      currentIndex: 0,
      isAnimating: false,
      headerOpacity: 1,
      scrollTop: 0,
      lastScrollTop: 0,
      showSearch: false,
      showFilter: false,
      searchText: "",
      startDate: "",
      endDate: "",
      selectedStatus: "",
      statusList: [
        { label: "全部", value: "" },
        { label: "未开始", value: "upcoming" },
        { label: "进行中", value: "ongoing" },
        { label: "已结束", value: "ended" }
      ],
      imageLoaded: false,
      sharing: false,
      registering: false,
      isRefreshing: false,
      showError: false,
      errorMessage: "",
      retryCount: 0,
      maxRetries: 3,
      imageCache: /* @__PURE__ */ new Map(),
      isScrolling: false,
      touchStartY: 0,
      cardOffsets: /* @__PURE__ */ new Map(),
      elders: [],
      elderNames: [],
      currentElderIndex: 0,
      selectedElderId: "",
      selectedChildrenId: "",
      showElderSelectModal: false,
      currentActivity: null
    };
  },
  computed: new UTSJSONObject({
    filteredActivities() {
      let result = this.activities;
      if (this.searchText) {
        result = result.filter((activity) => {
          return activity.name.toLowerCase().includes(this.searchText.toLowerCase()) || activity.description.toLowerCase().includes(this.searchText.toLowerCase());
        });
      }
      if (this.startDate && this.endDate) {
        result = result.filter((activity) => {
          const activityDate = new Date(activity.startTime).getTime();
          const start = new Date(this.startDate).getTime();
          const end = new Date(this.endDate).getTime();
          return activityDate >= start && activityDate <= end;
        });
      }
      if (this.selectedStatus) {
        const now = (/* @__PURE__ */ new Date()).getTime();
        result = result.filter((activity) => {
          const start = new Date(activity.startTime).getTime();
          const end = new Date(activity.endTime).getTime();
          switch (this.selectedStatus) {
            case "upcoming":
              return start > now;
            case "ongoing":
              return start <= now && end >= now;
            case "ended":
              return end < now;
            default:
              return true;
          }
        });
      }
      return result;
    }
  }),
  onLoad() {
    this.deanId = common_vendor.index.getStorageSync("currentDeanId");
    this.loadActivities();
    this.fetchElders();
  },
  methods: new UTSJSONObject({
    loadActivities() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.loading)
          return Promise.resolve(null);
        this.loading = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          const deanId = userInfo === null || userInfo === void 0 ? void 0 : userInfo.deanId;
          if (!accessToken || !refreshToken) {
            common_vendor.index.redirectTo({
              url: "/pages/nurse/login"
            });
            return Promise.resolve(null);
          }
          if (!deanId) {
            common_vendor.index.showToast({
              title: "获取院长信息失败",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/activity/pageDetail",
            method: "GET",
            data: new UTSJSONObject({
              page: this.currentPage,
              pageSize: this.pageSize,
              deanId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (result.data.code === 1 && result.data.data) {
            const data = result.data.data;
            const activitiesWithCount = yield Promise.all(data.records.map((activity) => {
              return common_vendor.__awaiter(this, void 0, void 0, function* () {
                const count = yield this.fetchActivityCount(activity.activityId);
                return new UTSJSONObject(Object.assign(Object.assign({}, activity), { participantCount: count }));
              });
            }));
            this.activities = [...this.activities, ...activitiesWithCount];
            this.total = data.total;
            this.currentPage++;
            if (this.selectedElderId) {
              yield this.fetchActivityApplications(this.selectedElderId);
            }
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/activity.uvue:462", "获取活动列表失败:", error);
          common_vendor.index.showToast({
            title: "获取活动列表失败",
            icon: "none"
          });
        } finally {
          this.loading = false;
        }
      });
    },
    // 下拉刷新
    onPullDownRefresh() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.currentPage = 1;
        this.activities = [];
        yield this.loadActivities();
        common_vendor.index.stopPullDownRefresh();
      });
    },
    // 上拉加载更多
    onReachBottom() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.activities.length < this.total) {
          yield this.loadActivities();
        }
      });
    },
    formatDate(timeStr) {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}月${day}日`;
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    getActivityTag(activity) {
      const now = (/* @__PURE__ */ new Date()).getTime();
      const start = new Date(activity.startTime).getTime();
      const end = new Date(activity.endTime).getTime();
      if (start > now)
        return "未开始";
      if (end < now)
        return "已结束";
      return "进行中";
    },
    handleBack() {
      common_vendor.index.navigateBack();
    },
    handleSwiperChange(e = null) {
      this.currentIndex = e.detail.current;
      this.scrollTop = 0;
      if (this.currentIndex === this.activities.length - 2) {
        this.loadActivities();
      }
    },
    handleAnimationFinish() {
      this.isAnimating = false;
    },
    handleTransition(e = null) {
      this.isAnimating = true;
    },
    handleScroll(e = null) {
      const scrollTop = e.detail.scrollTop;
      this.headerOpacity = Math.max(0, Math.min(1, 1 - scrollTop / 100));
      this.lastScrollTop = scrollTop;
      const cardHeight = 1e3;
      const newIndex = Math.floor(scrollTop / cardHeight);
      if (newIndex >= 0 && newIndex < this.filteredActivities.length) {
        this.currentIndex = newIndex;
      }
      this.updateCardOffsets();
    },
    updateCardOffsets() {
      const scrollTop = this.lastScrollTop;
      const cardHeight = 1e3;
      this.filteredActivities.forEach((_, index) => {
        const cardTop = index * cardHeight;
        const offset = Math.max(0, Math.min(50, (scrollTop - cardTop) / 20));
        this.cardOffsets.set(index, offset);
      });
    },
    getCardOffset(index) {
      return this.cardOffsets.get(index) || 0;
    },
    getCardOpacity(index) {
      const scrollTop = this.lastScrollTop;
      const cardHeight = 1e3;
      const cardTop = index * cardHeight;
      const distance = Math.abs(scrollTop - cardTop);
      return Math.max(0.8, Math.min(1, 1 - distance / (cardHeight * 2)));
    },
    isCardEntering(index) {
      return this.currentIndex === index && this.cardOffsets.get(index) === 0;
    },
    handleScrollToLower() {
      if (this.currentIndex === this.activities.length - 1) {
        this.loadActivities();
      }
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.searchText = "";
      }
    },
    handleSearch() {
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    clearFilter() {
      this.startDate = "";
      this.endDate = "";
      this.selectedStatus = "";
    },
    handleStartDateChange(e = null) {
      this.startDate = e.detail.value;
    },
    handleEndDateChange(e = null) {
      this.endDate = e.detail.value;
    },
    selectStatus(status) {
      this.selectedStatus = status;
    },
    applyFilter() {
      this.showFilter = false;
    },
    toggleLike(index) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.activities[index].isLiked) {
          common_vendor.index.vibrateShort();
          this.activities[index].likeCount = (this.activities[index].likeCount || 0) + 1;
        } else {
          this.activities[index].likeCount = (this.activities[index].likeCount || 1) - 1;
        }
        this.activities[index].isLiked = !this.activities[index].isLiked;
      });
    },
    toggleCollect(index) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.activities[index].isCollected) {
          common_vendor.index.vibrateShort();
          this.activities[index].collectCount = (this.activities[index].collectCount || 0) + 1;
        } else {
          this.activities[index].collectCount = (this.activities[index].collectCount || 1) - 1;
        }
        this.activities[index].isCollected = !this.activities[index].isCollected;
      });
    },
    toggleDescription(index) {
      this.activities[index].isExpanded = !this.activities[index].isExpanded;
    },
    handleImageLoad() {
      this.imageLoaded = true;
    },
    previewImage(url) {
      if (!url || !this.imageCache.get(url))
        return null;
      common_vendor.index.previewImage({
        urls: [url],
        current: 0
      });
    },
    shareActivity(activity) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.sharing = true;
        try {
          yield common_vendor.index.showShareMenu(new UTSJSONObject({
            withShareTicket: true
          }));
        } catch (error) {
          common_vendor.index.showToast({
            title: "分享失败",
            icon: "none"
          });
        } finally {
          this.sharing = false;
        }
      });
    },
    handleRefresh() {
      this.isRefreshing = true;
      this.retryCount = 0;
      this.loadActivities();
    },
    handleRetry() {
      this.retryCount = 0;
      this.loadActivities();
    },
    handleTouchStart(e = null) {
      this.touchStartY = e.touches[0].clientY;
      this.isScrolling = true;
    },
    handleTouchEnd(e = null) {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - this.touchStartY;
      if (Math.abs(deltaY) < 10) {
        this.isScrolling = false;
        return null;
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, 100);
    },
    fetchElders() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/nurse/login"
            });
            return Promise.resolve(null);
          }
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/elder/elders",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken,
              "Content-Type": "application/json",
              "Accept": "application/json"
            })
          });
          common_vendor.index.hideLoading();
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.elders = response.data.map((elder = null) => {
              return new UTSJSONObject(Object.assign(Object.assign({}, elder), { elderId: elder.elderId.toString(), caretakerId: elder.caretakerId.toString(), childrenId: elder.childrenId.toString() }));
            });
            this.elderNames = this.elders.map((elder) => {
              return elder.name;
            });
            if (this.elders.length > 0) {
              this.selectedElderId = this.elders[0].elderId;
              this.selectedChildrenId = this.elders[0].childrenId;
              this.currentElderIndex = 0;
            }
          } else {
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/nurse/activity.uvue:764", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    handleElderChange(e = null) {
      this.currentElderIndex = parseInt(e.detail.value);
      if (this.elders[this.currentElderIndex]) {
        this.selectedElderId = this.elders[this.currentElderIndex].elderId;
        this.selectedChildrenId = this.elders[this.currentElderIndex].childrenId;
        this.fetchActivityApplications(this.selectedElderId);
      }
    },
    registerActivity(activity) {
      var _a;
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (activity.registered || this.registering)
          return Promise.resolve(null);
        this.registering = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          const caretakerId = (_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.caretakerId) === null || _a === void 0 ? void 0 : _a.toString();
          if (!accessToken || !refreshToken || !caretakerId) {
            common_vendor.index.showToast({
              title: "获取用户信息失败",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          if (this.currentElderIndex < 0 || !this.elders[this.currentElderIndex]) {
            common_vendor.index.showToast({
              title: "请先选择老人",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          const selectedElder = this.elders[this.currentElderIndex];
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/activity/apply",
            method: "POST",
            data: new UTSJSONObject({
              activityId: activity.activityId.toString(),
              caretakerId: caretakerId.toString(),
              childrenId: selectedElder.childrenId.toString(),
              elderId: selectedElder.elderId.toString()
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken,
              "Content-Type": "application/json",
              "Accept": "application/json"
            })
          });
          if (result.data.code === 1) {
            activity.registered = true;
            activity.applicationStatus = 0;
            activity.participantCount = (activity.participantCount || 0) + 1;
            common_vendor.index.showToast({
              title: "报名成功",
              icon: "success"
            });
          } else {
            common_vendor.index.showToast({
              title: result.data.msg || "报名失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/activity.uvue:844", "报名失败:", error);
          common_vendor.index.showToast({
            title: "报名失败",
            icon: "none"
          });
        } finally {
          this.registering = false;
        }
      });
    },
    closeElderSelect() {
      this.showElderSelectModal = false;
      this.currentActivity = null;
    },
    selectElder(elder) {
      this.selectedElderId = elder.elderId;
      this.selectedChildrenId = elder.childrenId;
      this.closeElderSelect();
    },
    // 获取老人的活动申请记录
    fetchActivityApplications(elderId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            return Promise.resolve(null);
          }
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/activity/byElderId",
            method: "GET",
            data: new UTSJSONObject({
              elderId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken,
              "Content-Type": "application/json",
              "Accept": "application/json"
            })
          });
          if (result.data.code === 1 && result.data.data) {
            const applications = result.data.data;
            this.activities = this.activities.map((activity) => {
              const application = UTS.arrayFind(applications, (app) => {
                return app.activityId === activity.activityId;
              });
              if (application) {
                return Object.assign(Object.assign({}, activity), { registered: true, applicationStatus: application.ispass });
              }
              return activity;
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/activity.uvue:906", "获取申请记录失败:", error);
        }
      });
    },
    // 获取按钮文本
    getActionButtonText(activity) {
      if (!activity.registered) {
        return "立即报名";
      }
      switch (activity.applicationStatus) {
        case 0:
          return "已申请";
        case 1:
          return "报名成功";
        case 2:
          return "报名拒绝";
        default:
          return "立即报名";
      }
    },
    // 获取按钮图标
    getActionButtonIcon(activity) {
      if (!activity.registered) {
        return "/static/images/register.png";
      }
      switch (activity.applicationStatus) {
        case 0:
          return "/static/images/pending.png";
        case 1:
          return "/static/images/success.png";
        case 2:
          return "/static/images/rejected.png";
        default:
          return "/static/images/register.png";
      }
    },
    // 获取单个活动的报名人数
    fetchActivityCount(activityId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            return 0;
          }
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/activity/count",
            method: "GET",
            data: new UTSJSONObject({
              activityId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (result.data.code === 1) {
            return parseInt(result.data.data) || 0;
          }
          return 0;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/activity.uvue:973", "获取活动报名人数失败:", error);
          return 0;
        }
      });
    }
  })
}));
if (!Array) {
  const _component_activity_skeleton = common_vendor.resolveComponent("activity-skeleton");
  const _component_nurse_tabbar = common_vendor.resolveComponent("nurse-tabbar");
  (_component_activity_skeleton + _component_nurse_tabbar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.elderNames[$data.currentElderIndex] || "选择老人"),
    b: common_assets._imports_1$2,
    c: $data.elderNames,
    d: common_vendor.o((...args) => $options.handleElderChange && $options.handleElderChange(...args)),
    e: $data.currentElderIndex,
    f: $data.showSearch
  }, $data.showSearch ? {
    g: common_vendor.o([($event) => $data.searchText = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    h: $data.searchText,
    i: common_vendor.o((...args) => $options.toggleSearch && $options.toggleSearch(...args))
  } : {}, {
    j: $data.showFilter
  }, $data.showFilter ? {
    k: common_vendor.o((...args) => $options.clearFilter && $options.clearFilter(...args)),
    l: common_vendor.t($data.startDate || "开始日期"),
    m: $data.startDate,
    n: common_vendor.o((...args) => $options.handleStartDateChange && $options.handleStartDateChange(...args)),
    o: common_vendor.t($data.endDate || "结束日期"),
    p: $data.endDate,
    q: common_vendor.o((...args) => $options.handleEndDateChange && $options.handleEndDateChange(...args)),
    r: common_vendor.f($data.statusList, (status, k0, i0) => {
      return {
        a: common_vendor.t(status.label),
        b: status.value,
        c: common_vendor.n({
          active: $data.selectedStatus === status.value
        }),
        d: common_vendor.o(($event) => $options.selectStatus(status.value), status.value)
      };
    }),
    s: common_vendor.o((...args) => $options.applyFilter && $options.applyFilter(...args))
  } : {}, {
    t: common_vendor.t($data.currentIndex + 1),
    v: `${($data.currentIndex + 1) * 100 / $options.filteredActivities.length}%`,
    w: common_vendor.t($options.filteredActivities.length),
    x: $data.loading && !$data.activities.length
  }, $data.loading && !$data.activities.length ? {} : {}, {
    y: common_vendor.f($options.filteredActivities, (activity, index, i0) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.n(`color-${index % 5}`),
        b: common_vendor.t($options.getActivityTag(activity)),
        c: common_vendor.t(activity.name),
        d: common_vendor.f(activity.images || [activity.activityData], (image, imgIndex, i1) => {
          return {
            a: image || "/static/images/default-activity.png",
            b: common_vendor.o((...args) => $options.handleImageLoad && $options.handleImageLoad(...args), imgIndex),
            c: imgIndex
          };
        }),
        e: ((_a = activity.images) == null ? void 0 : _a.length) > 1,
        f: ((_b = activity.images) == null ? void 0 : _b.length) > 1
      }, ((_c = activity.images) == null ? void 0 : _c.length) > 1 ? {
        g: common_vendor.t(activity.images.length)
      } : {}, {
        h: common_vendor.o(($event) => $options.previewImage(activity.activityData), index),
        i: common_vendor.t($options.formatDate(activity.startTime)),
        j: common_vendor.t($options.formatTime(activity.startTime)),
        k: common_vendor.t($options.formatTime(activity.endTime)),
        l: common_vendor.t(activity.location || "活动室"),
        m: common_vendor.t(activity.description),
        n: activity.isExpanded ? 1 : "",
        o: common_vendor.o(($event) => $options.toggleDescription(index), index),
        p: activity.description.length > 100
      }, activity.description.length > 100 ? {
        q: common_vendor.t(activity.isExpanded ? "收起" : "展开"),
        r: common_vendor.o(($event) => $options.toggleDescription(index), index)
      } : {}, {
        s: common_vendor.t(activity.participantCount || 0),
        t: $options.getActionButtonIcon(activity),
        v: common_vendor.t($options.getActionButtonText(activity)),
        w: common_vendor.o(($event) => $options.registerActivity(activity), index),
        x: activity.registered,
        y: activity.registered && activity.applicationStatus === 0 ? 1 : "",
        z: activity.registered && activity.applicationStatus === 1 ? 1 : "",
        A: activity.registered && activity.applicationStatus === 2 ? 1 : "",
        B: index,
        C: $data.currentIndex === index ? 1 : "",
        D: $options.isCardEntering(index) ? 1 : "",
        E: `translateY(${$options.getCardOffset(index)}px)`,
        F: $options.getCardOpacity(index)
      });
    }),
    z: !$data.imageLoaded ? 1 : "",
    A: common_assets._imports_3$2,
    B: common_assets._imports_4$1,
    C: common_vendor.o((...args) => $options.handleScroll && $options.handleScroll(...args)),
    D: $data.scrollTop,
    E: common_vendor.o((...args) => $options.handleScrollToLower && $options.handleScrollToLower(...args)),
    F: common_vendor.o((...args) => $options.handleRefresh && $options.handleRefresh(...args)),
    G: $data.isRefreshing,
    H: $data.showError
  }, $data.showError ? {
    I: common_vendor.t($data.errorMessage),
    J: common_vendor.o((...args) => $options.handleRetry && $options.handleRetry(...args))
  } : {}, {
    K: common_vendor.p({
      ["current-path"]: "/pages/nurse/activity"
    }),
    L: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/nurse/activity.js.map
