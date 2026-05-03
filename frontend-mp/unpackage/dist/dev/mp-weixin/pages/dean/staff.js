"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      searchKey: "",
      pageNo: 1,
      pageSize: 6,
      staffList: [],
      total: 0,
      pages: 0,
      loading: false,
      isMoving: false,
      btnPosition: {
        left: -1,
        top: -1
      },
      defaultPosition: new UTSJSONObject({
        right: 40,
        bottom: 120
      }),
      allStaffList: [],
      loadedStaffIds: /* @__PURE__ */ new Set()
      // 存储已加载的员工ID集合
    };
  },
  onLoad() {
    this.fetchStaffList();
    this.loadBtnPosition();
  },
  computed: new UTSJSONObject({
    filteredStaffList() {
      if (!this.searchKey.trim()) {
        return this.staffList;
      }
      return this.staffList.filter((staff) => {
        return staff.name.includes(this.searchKey) || staff.specialty.includes(this.searchKey) || staff.phone.includes(this.searchKey);
      });
    }
  }),
  methods: new UTSJSONObject({
    fetchStaffList() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          this.loading = true;
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/dean/login"
            });
            return Promise.resolve(null);
          }
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/dean/caretaker/page",
            method: "GET",
            data: new UTSJSONObject({
              pageNo: this.pageNo.toString(),
              pageSize: this.pageSize.toString(),
              name: "",
              phone: "",
              specialty: ""
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          this.loading = false;
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.total = response.data.total;
            this.pages = response.data.pages;
            this.handlePagination(response.data.list);
          } else {
            common_vendor.index.showToast({
              title: "获取员工列表失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          this.loading = false;
          common_vendor.index.__f__("error", "at pages/dean/staff.uvue:222", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    // 新的分页处理逻辑
    handlePagination(newStaffList) {
      common_vendor.index.__f__("log", "at pages/dean/staff.uvue:233", `第${this.pageNo}页数据:`, newStaffList);
      if (this.pageNo === 1) {
        this.loadedStaffIds.clear();
        this.allStaffList = [];
      }
      newStaffList.forEach((staff) => {
        if (!this.loadedStaffIds.has(staff.caretakerId)) {
          this.allStaffList.push(staff);
          this.loadedStaffIds.add(staff.caretakerId);
        } else {
          common_vendor.index.__f__("log", "at pages/dean/staff.uvue:247", "过滤掉重复数据:", staff.name, staff.caretakerId);
        }
      });
      this.updateDisplayedData();
      common_vendor.index.__f__("log", "at pages/dean/staff.uvue:255", "当前显示的员工列表:", this.staffList.length);
      common_vendor.index.__f__("log", "at pages/dean/staff.uvue:256", "已加载的员工总数:", this.allStaffList.length);
      common_vendor.index.__f__("log", "at pages/dean/staff.uvue:257", "应有的员工总数:", this.total);
      if (this.allStaffList.length < this.total && this.pageNo < this.pages) {
        common_vendor.index.__f__("log", "at pages/dean/staff.uvue:262", "还有更多数据可加载");
      } else if (this.allStaffList.length >= this.total) {
        common_vendor.index.__f__("log", "at pages/dean/staff.uvue:264", "已加载全部员工数据");
        this.updateDisplayedData();
      }
    },
    // 更新当前页面显示的数据
    updateDisplayedData() {
      const displayCount = Math.min(this.pageSize, this.allStaffList.length);
      if (this.pageNo === 1) {
        this.staffList = this.allStaffList.slice(0, displayCount);
        return null;
      }
      const afterFirstPage = this.allStaffList.slice(this.pageSize);
      common_vendor.index.__f__("log", "at pages/dean/staff.uvue:286", "第一页之后的数据:", afterFirstPage);
      if (afterFirstPage.length > 0) {
        this.staffList = afterFirstPage;
      } else if (this.pageNo > 1 && afterFirstPage.length === 0) {
        common_vendor.index.showToast({
          title: "没有更多员工数据",
          icon: "none"
        });
      }
    },
    loadBtnPosition() {
      try {
        const position = common_vendor.index.getStorageSync("addBtnPosition");
        if (position) {
          const pos = UTS.JSON.parse(position);
          this.btnPosition = pos;
        } else {
          const systemInfo = common_vendor.index.getSystemInfoSync();
          this.btnPosition = {
            left: systemInfo.windowWidth - 140,
            top: systemInfo.windowHeight - 220
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/dean/staff.uvue:314", "获取按钮位置失败:", error);
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.btnPosition = {
          left: systemInfo.windowWidth - 140,
          top: systemInfo.windowHeight - 220
        };
      }
    },
    startMoveBtn(e = null) {
      this.isMoving = true;
      common_vendor.index.showToast({
        title: "按住拖动",
        icon: "none",
        duration: 1e3
      });
    },
    moveBtn(e = null) {
      if (!this.isMoving)
        return null;
      e.stopPropagation();
      e.preventDefault();
      const touch = e.touches[0];
      this.btnPosition.left = touch.clientX - 50;
      this.btnPosition.top = touch.clientY - 50;
    },
    endMoveBtn() {
      if (!this.isMoving)
        return null;
      this.isMoving = false;
      try {
        common_vendor.index.setStorageSync("addBtnPosition", UTS.JSON.stringify(this.btnPosition));
        common_vendor.index.showToast({
          title: "位置已保存",
          icon: "success",
          duration: 1e3
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/dean/staff.uvue:356", "保存按钮位置失败:", error);
      }
    },
    prevPage() {
      if (this.pageNo > 1) {
        this.pageNo--;
        this.updateDisplayedData();
      }
    },
    nextPage() {
      if (this.pageNo < this.pages) {
        this.pageNo++;
        const needFetch = this.pageNo > 1 && this.allStaffList.length <= this.pageSize;
        if (needFetch) {
          this.fetchStaffList();
        } else {
          this.updateDisplayedData();
        }
      }
    },
    searchStaff() {
      common_vendor.index.__f__("log", "at pages/dean/staff.uvue:383", "搜索关键词:", this.searchKey);
    },
    viewStaffDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/dean/staff-detail?id=${id}`
      });
    },
    addNewStaff() {
      if (this.isMoving)
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/dean/staff-add"
      });
    },
    redirectTo(url) {
      common_vendor.index.redirectTo({
        url
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$9,
    b: common_vendor.o([($event) => $data.searchKey = $event.detail.value, (...args) => $options.searchStaff && $options.searchStaff(...args)]),
    c: $data.searchKey,
    d: common_vendor.f($options.filteredStaffList, (staff, index, i0) => {
      return {
        a: staff.avatar || "/static/images/default-avatar.png",
        b: common_vendor.t(staff.name),
        c: common_vendor.t(staff.specialty),
        d: common_vendor.t(staff.phone),
        e: common_vendor.o(($event) => $options.viewStaffDetail(staff.caretakerId), staff.caretakerId),
        f: staff.caretakerId
      };
    }),
    e: $data.total > 0
  }, $data.total > 0 ? {
    f: common_vendor.n({
      "disabled": $data.pageNo <= 1
    }),
    g: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    h: common_vendor.t($data.pageNo),
    i: common_vendor.t($data.pages),
    j: common_vendor.t($data.total),
    k: common_vendor.n({
      "disabled": $data.pageNo >= $data.pages
    }),
    l: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args))
  } : {}, {
    m: $data.staffList.length === 0 && !$data.loading
  }, $data.staffList.length === 0 && !$data.loading ? {} : {}, {
    n: $data.isMoving
  }, $data.isMoving ? {} : {}, {
    o: $data.btnPosition.left + "px",
    p: $data.btnPosition.top + "px",
    q: common_vendor.o((...args) => $options.addNewStaff && $options.addNewStaff(...args)),
    r: common_vendor.o((...args) => $options.startMoveBtn && $options.startMoveBtn(...args)),
    s: common_vendor.o((...args) => $options.moveBtn && $options.moveBtn(...args)),
    t: common_vendor.o((...args) => $options.endMoveBtn && $options.endMoveBtn(...args)),
    v: common_assets._imports_7$1,
    w: common_vendor.o(($event) => $options.redirectTo("/pages/dean/index")),
    x: common_assets._imports_8$1,
    y: common_vendor.o(($event) => $options.redirectTo("/pages/dean/dispute")),
    z: common_assets._imports_9$1,
    A: common_vendor.o(($event) => $options.redirectTo("/pages/dean/staff")),
    B: common_assets._imports_10,
    C: common_vendor.o(($event) => $options.redirectTo("/pages/dean/activity")),
    D: common_assets._imports_11,
    E: common_vendor.o(($event) => $options.redirectTo("/pages/dean/management")),
    F: common_assets._imports_12,
    G: common_vendor.o(($event) => $options.redirectTo("/pages/dean/profile")),
    H: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/staff.js.map
