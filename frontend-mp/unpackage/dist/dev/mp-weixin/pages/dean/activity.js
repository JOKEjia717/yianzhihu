"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      searchKey: "",
      deanId: "",
      page: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      currentActivityIndex: 0,
      activityList: [],
      elderlyList: [],
      // 添加活动模态框状态
      showAddModal: false,
      newActivity: new UTSJSONObject({
        name: "",
        startTime: "",
        endTime: "",
        description: "",
        activityData: "",
        tags: []
      }),
      availableTags: ["健康", "娱乐", "学习", "运动", "文化", "手工", "美食", "户外活动", "室内活动", "亲子活动", "节日活动", "兴趣小组"],
      selectedTags: [],
      // 添加按钮拖动相关数据
      isMoving: false,
      btnPosition: {
        left: -1,
        top: -1
      }
    };
  },
  onLoad() {
    this.fetchActivities();
    this.loadBtnPosition();
  },
  computed: new UTSJSONObject({
    filteredElderlyList() {
      if (!this.searchKey.trim()) {
        return this.elderlyList;
      }
      return this.elderlyList.filter((elderly) => {
        return elderly.name.includes(this.searchKey) || elderly.emergencyContact.includes(this.searchKey);
      });
    },
    currentActivity() {
      if (this.activityList.length === 0) {
        return null;
      }
      return this.activityList[this.currentActivityIndex];
    },
    // 格式化开始时间，仅显示日期和时间
    formattedStartTime() {
      if (!this.currentActivity)
        return "";
      const startTime = this.currentActivity.startTime;
      return this.formatDateTime(startTime);
    },
    // 格式化结束时间，仅显示时间
    formattedEndTime() {
      if (!this.currentActivity)
        return "";
      const endTime = this.currentActivity.endTime;
      return this.formatTime(endTime);
    },
    // 获取活动的默认标签
    activityTags() {
      if (!this.currentActivity)
        return [];
      if (this.currentActivity.tags && this.currentActivity.tags.length > 0) {
        return this.currentActivity.tags;
      }
      const tags = [];
      if (this.currentActivity.name.includes("春游")) {
        tags.push("春游");
      } else if (this.currentActivity.name.includes("夏令营")) {
        tags.push("夏令营");
      } else if (this.currentActivity.name.includes("秋游")) {
        tags.push("秋游");
      } else if (this.currentActivity.name.includes("冬")) {
        tags.push("冬令营");
      }
      const time = new Date(this.currentActivity.startTime);
      const hour = time.getHours();
      if (hour >= 6 && hour < 12) {
        tags.push("上午");
      } else if (hour >= 12 && hour < 18) {
        tags.push("下午");
      } else {
        tags.push("晚上");
      }
      tags.push("园区活动");
      return tags;
    }
  }),
  methods: {
    fetchActivities() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          this.loading = true;
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          if (userInfo) {
            this.deanId = userInfo.deanId || "";
          }
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/activity/pageDetail",
            method: "GET",
            data: new UTSJSONObject({
              page: this.page.toString(),
              pageSize: this.pageSize.toString(),
              deanId: this.deanId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          this.loading = false;
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.activityList = response.data.records;
            this.total = response.data.total;
            this.activityList.forEach((activity) => {
              if (!activity.activityData || activity.activityData.includes("/path/to/")) {
                if (activity.name.includes("春游")) {
                  activity.activityData = "/static/images/spring.jpg";
                } else if (activity.name.includes("夏令营")) {
                  activity.activityData = "/static/images/summer.jpg";
                } else if (activity.name.includes("秋游")) {
                  activity.activityData = "/static/images/autumn.jpg";
                } else if (activity.name.includes("冬")) {
                  activity.activityData = "/static/images/winter.jpg";
                } else {
                  activity.activityData = "/static/images/activity.jpg";
                }
              }
            });
            common_vendor.index.__f__("log", "at pages/dean/activity.uvue:422", "获取活动列表成功:", this.activityList);
            if (this.activityList.length > 0) {
              this.fetchActivityElders();
            }
          } else {
            common_vendor.index.showToast({
              title: "获取活动列表失败",
              icon: "none"
            });
          }
        } catch (error) {
          this.loading = false;
          common_vendor.index.__f__("error", "at pages/dean/activity.uvue:436", "请求失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    fetchActivityElders() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.currentActivity || !this.currentActivity.activityId) {
          common_vendor.index.__f__("error", "at pages/dean/activity.uvue:446", "无法获取老人信息：当前活动ID不存在");
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/activity/getElder",
            method: "GET",
            data: new UTSJSONObject({
              activityId: this.currentActivity.activityId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          common_vendor.index.hideLoading();
          const response = result.data;
          if (response.code === 1 && response.data) {
            this.elderlyList = response.data.map((elderly, index) => {
              const emergencyContact = `${elderly.childrenName} (子女) ${elderly.childrenPhone}`;
              const randomStatus = Math.random() > 0.2 ? "good" : "warning";
              const avatarUrl = elderly.photo || "/static/images/default-avatar.png";
              return {
                id: (index + 1).toString(),
                name: elderly.name,
                avatar: avatarUrl,
                healthStatus: randomStatus,
                emergencyContact
              };
            });
            common_vendor.index.__f__("log", "at pages/dean/activity.uvue:505", "获取参与老人信息成功:", this.elderlyList);
          } else {
            common_vendor.index.__f__("error", "at pages/dean/activity.uvue:507", "获取参与老人信息失败:", response);
            common_vendor.index.showToast({
              title: "获取参与老人信息失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/dean/activity.uvue:515", "请求参与老人信息失败:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    searchActivity() {
      common_vendor.index.__f__("log", "at pages/dean/activity.uvue:525", "搜索关键词:", this.searchKey);
    },
    changeActivity() {
      if (this.activityList.length <= 1) {
        common_vendor.index.showToast({
          title: "没有更多活动",
          icon: "none"
        });
        return null;
      }
      let newIndex = this.currentActivityIndex;
      while (newIndex === this.currentActivityIndex) {
        newIndex = Math.floor(Math.random() * this.activityList.length);
      }
      this.currentActivityIndex = newIndex;
      common_vendor.index.__f__("log", "at pages/dean/activity.uvue:545", "切换到新活动:", this.currentActivity ? this.currentActivity.name : "无活动");
      this.fetchActivityElders();
    },
    queryElderlyDetail(id) {
      const elderly = UTS.arrayFind(this.elderlyList, (item) => {
        return item.id === id;
      });
      if (elderly) {
        common_vendor.index.__f__("log", "at pages/dean/activity.uvue:555", "查询老人:", elderly.name, "健康状态:", elderly.healthStatus);
        common_vendor.index.navigateTo({
          url: `/pages/dean/elderly-detail?id=${id}&status=${elderly.healthStatus}`
        });
      }
    },
    redirectTo(url) {
      common_vendor.index.redirectTo({
        url
      });
    },
    // 格式化日期时间，返回 yyyy-MM-dd HH:mm 格式
    formatDateTime(dateTimeStr) {
      try {
        const date = new Date(dateTimeStr);
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      } catch (e) {
        return dateTimeStr;
      }
    },
    // 格式化时间，返回 HH:mm 格式
    formatTime(dateTimeStr) {
      try {
        const date = new Date(dateTimeStr);
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        return `${hours}:${minutes}`;
      } catch (e) {
        return dateTimeStr;
      }
    },
    // 数字补零
    padZero(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    // 加载按钮位置
    loadBtnPosition() {
      try {
        const position = common_vendor.index.getStorageSync("activityAddBtnPosition");
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
        common_vendor.index.__f__("error", "at pages/dean/activity.uvue:613", "获取按钮位置失败:", error);
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.btnPosition = {
          left: systemInfo.windowWidth - 140,
          top: systemInfo.windowHeight - 220
        };
      }
    },
    // 开始移动按钮
    startMoveBtn(e = null) {
      this.isMoving = true;
      common_vendor.index.showToast({
        title: "按住拖动",
        icon: "none",
        duration: 1e3
      });
    },
    // 移动按钮
    moveBtn(e = null) {
      if (!this.isMoving)
        return null;
      e.stopPropagation();
      e.preventDefault();
      const touch = e.touches[0];
      this.btnPosition.left = touch.clientX - 50;
      this.btnPosition.top = touch.clientY - 50;
    },
    // 结束移动按钮
    endMoveBtn() {
      if (!this.isMoving)
        return null;
      this.isMoving = false;
      try {
        common_vendor.index.setStorageSync("activityAddBtnPosition", UTS.JSON.stringify(this.btnPosition));
        common_vendor.index.showToast({
          title: "位置已保存",
          icon: "success",
          duration: 1e3
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/dean/activity.uvue:661", "保存按钮位置失败:", error);
      }
    },
    // 显示添加活动模态框（更新，增加检查是否处于移动模式）
    showAddActivityModal() {
      if (this.isMoving)
        return null;
      this.showAddModal = true;
      this.resetNewActivity();
    },
    // 隐藏添加活动模态框
    hideAddActivityModal() {
      this.showAddModal = false;
    },
    // 重置新建活动信息
    resetNewActivity() {
      this.newActivity = {
        name: "",
        startTime: "",
        endTime: "",
        description: "",
        activityData: "",
        tags: []
      };
      this.selectedTags = [];
    },
    // 选择开始时间
    showStartTimePicker() {
      common_vendor.index.showDatePicker(new UTSJSONObject({
        type: "datetime",
        success: (res = null) => {
          this.newActivity.startTime = res.value;
        }
      }));
    },
    // 选择结束时间
    showEndTimePicker() {
      common_vendor.index.showDatePicker(new UTSJSONObject({
        type: "datetime",
        success: (res = null) => {
          this.newActivity.endTime = res.value;
        }
      }));
    },
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.newActivity.activityData = res.tempFilePaths[0];
        }
      }));
    },
    // 切换标签选择
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
      } else {
        this.selectedTags.push(tag);
      }
    },
    // 提交新活动
    submitNewActivity() {
      if (!this.newActivity.name) {
        common_vendor.index.showToast({
          title: "请输入活动名称",
          icon: "none"
        });
        return null;
      }
      if (!this.newActivity.startTime) {
        common_vendor.index.showToast({
          title: "请选择开始时间",
          icon: "none"
        });
        return null;
      }
      if (!this.newActivity.endTime) {
        common_vendor.index.showToast({
          title: "请选择结束时间",
          icon: "none"
        });
        return null;
      }
      const activityData = new UTSJSONObject(
        {
          nursingHomeId: this.deanId,
          name: this.newActivity.name,
          startTime: this.newActivity.startTime,
          endTime: this.newActivity.endTime,
          description: this.newActivity.description,
          activityData: this.newActivity.activityData,
          tags: this.selectedTags
        }
        // 显示加载
      );
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      const accessToken = common_vendor.index.getStorageSync("accessToken");
      const refreshToken = common_vendor.index.getStorageSync("refreshToken");
      common_vendor.index.request({
        url: "http://localhost:8080/activity/add",
        method: "POST",
        data: activityData,
        header: new UTSJSONObject({
          "accessToken": accessToken,
          "refreshToken": refreshToken,
          "Content-Type": "application/json"
        }),
        success: (res = null) => {
          common_vendor.index.hideLoading();
          if (res.statusCode === 200 && res.data.code === 1) {
            common_vendor.index.showToast({
              title: "添加活动成功",
              icon: "success"
            });
            this.hideAddActivityModal();
            this.fetchActivities();
          } else {
            common_vendor.index.showToast({
              title: "提交失败",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "提交失败",
            icon: "none"
          });
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$9,
    b: common_vendor.o([($event) => $data.searchKey = $event.detail.value, (...args) => $options.searchActivity && $options.searchActivity(...args)]),
    c: $data.searchKey,
    d: $data.isMoving
  }, $data.isMoving ? {} : {}, {
    e: $data.btnPosition.left + "px",
    f: $data.btnPosition.top + "px",
    g: common_vendor.o((...args) => $options.showAddActivityModal && $options.showAddActivityModal(...args)),
    h: common_vendor.o((...args) => $options.startMoveBtn && $options.startMoveBtn(...args)),
    i: common_vendor.o((...args) => $options.moveBtn && $options.moveBtn(...args)),
    j: common_vendor.o((...args) => $options.endMoveBtn && $options.endMoveBtn(...args)),
    k: common_vendor.o((...args) => $options.changeActivity && $options.changeActivity(...args)),
    l: $data.loading
  }, $data.loading ? {} : !$options.currentActivity ? {} : {
    n: $options.currentActivity.activityData,
    o: common_vendor.t($options.currentActivity.name),
    p: common_vendor.t($options.formattedStartTime),
    q: common_vendor.t($options.formattedEndTime),
    r: common_vendor.t($options.currentActivity.description),
    s: common_vendor.f($options.activityTags, (tag, k0, i0) => {
      return {
        a: common_vendor.t(tag),
        b: tag
      };
    })
  }, {
    m: !$options.currentActivity,
    t: common_assets._imports_1$4,
    v: common_assets._imports_2$3,
    w: common_assets._imports_3$2,
    x: common_vendor.f($options.filteredElderlyList, (elderly, index, i0) => {
      return {
        a: elderly.avatar || "/static/images/default-avatar.png",
        b: common_vendor.t(elderly.name),
        c: common_vendor.t(elderly.healthStatus === "good" ? "健康" : "需关注"),
        d: common_vendor.n(elderly.healthStatus === "good" ? "good" : "warning"),
        e: common_vendor.t(elderly.emergencyContact),
        f: common_vendor.n(elderly.healthStatus === "good" ? "good" : "warning"),
        g: common_vendor.o(($event) => $options.queryElderlyDetail(elderly.id), elderly.id),
        h: elderly.id
      };
    }),
    y: common_assets._imports_7$1,
    z: common_vendor.o(($event) => $options.redirectTo("/pages/dean/index")),
    A: common_assets._imports_8$1,
    B: common_vendor.o(($event) => $options.redirectTo("/pages/dean/dispute")),
    C: common_assets._imports_9$1,
    D: common_vendor.o(($event) => $options.redirectTo("/pages/dean/staff")),
    E: common_assets._imports_10,
    F: common_vendor.o(($event) => $options.redirectTo("/pages/dean/activity")),
    G: common_assets._imports_11,
    H: common_vendor.o(($event) => $options.redirectTo("/pages/dean/management")),
    I: common_assets._imports_12,
    J: common_vendor.o(($event) => $options.redirectTo("/pages/dean/profile")),
    K: $data.showAddModal
  }, $data.showAddModal ? common_vendor.e({
    L: common_vendor.o((...args) => $options.hideAddActivityModal && $options.hideAddActivityModal(...args)),
    M: $data.newActivity.name,
    N: common_vendor.o(($event) => $data.newActivity.name = $event.detail.value),
    O: common_vendor.t($data.newActivity.startTime || "请选择开始时间"),
    P: common_vendor.o((...args) => $options.showStartTimePicker && $options.showStartTimePicker(...args)),
    Q: common_vendor.t($data.newActivity.endTime || "请选择结束时间"),
    R: common_vendor.o((...args) => $options.showEndTimePicker && $options.showEndTimePicker(...args)),
    S: $data.newActivity.description,
    T: common_vendor.o(($event) => $data.newActivity.description = $event.detail.value),
    U: $data.newActivity.activityData
  }, $data.newActivity.activityData ? {
    V: $data.newActivity.activityData
  } : {}, {
    W: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    X: common_vendor.f($data.availableTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: common_vendor.n($data.selectedTags.includes(tag) ? "tag-selected" : ""),
        d: common_vendor.o(($event) => $options.toggleTag(tag), index)
      };
    }),
    Y: common_vendor.o((...args) => $options.hideAddActivityModal && $options.hideAddActivityModal(...args)),
    Z: common_vendor.o((...args) => $options.submitNewActivity && $options.submitNewActivity(...args)),
    aa: common_vendor.o(() => {
    }),
    ab: common_vendor.o((...args) => $options.hideAddActivityModal && $options.hideAddActivityModal(...args))
  }) : {}, {
    ac: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/activity.js.map
