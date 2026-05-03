"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      currentTime: "",
      userName: "胡永龙",
      userRole: "",
      timerID: 0,
      // 问题反馈弹窗相关数据
      showPopup: false,
      feedbackType: "",
      feedbackTitle: "",
      feedbackContent: "",
      feedbackLevel: 1,
      levelOptions: [
        { label: "低", value: 1 },
        { label: "中", value: 2 },
        { label: "高", value: 3 },
        { label: "紧急", value: 4 }
      ]
    };
  },
  onLoad() {
    this.updateTime();
    this.fetchUserInfo();
    this.timerID = setInterval(() => {
      this.updateTime();
    }, 1e3);
  },
  onUnload() {
    clearInterval(this.timerID);
  },
  methods: new UTSJSONObject({
    updateTime() {
      const now = /* @__PURE__ */ new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      this.currentTime = `${hours}:${minutes}`;
    },
    fetchUserInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "未登录或登录已过期",
              icon: "none"
            });
            common_vendor.index.redirectTo({
              url: "/pages/dean/login"
            });
            return Promise.resolve(null);
          }
          this.userName = "胡永龙";
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/dean/profile.uvue:227", "获取用户信息失败:", error);
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      });
    },
    showDataInfo() {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "数据说明",
        content: "此处显示数据相关说明和帮助信息",
        showCancel: false
      }));
    },
    // 显示问题反馈弹窗
    showFeedbackPopup(type) {
      this.feedbackType = type;
      this.showPopup = true;
      this.feedbackTitle = "";
      this.feedbackContent = "";
      this.feedbackLevel = 1;
    },
    // 关闭问题反馈弹窗
    closePopup() {
      this.showPopup = false;
    },
    // 选择问题等级
    selectLevel(level) {
      this.feedbackLevel = level;
    },
    // 提交问题反馈
    submitFeedback() {
      if (!this.feedbackTitle.trim()) {
        common_vendor.index.showToast({
          title: "请输入问题标题",
          icon: "none"
        });
        return null;
      }
      if (!this.feedbackContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入问题详情",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认提交",
        content: "您确定要提交此问题反馈吗？",
        success: (res) => {
          if (res.confirm) {
            setTimeout(() => {
              common_vendor.index.showToast({
                title: "提交成功",
                icon: "success"
              });
              this.closePopup();
            }, 500);
          }
        }
      }));
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
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
    b: common_assets._imports_1$5,
    c: common_assets._imports_2$4,
    d: common_assets._imports_2$4,
    e: common_vendor.o((...args) => $options.showDataInfo && $options.showDataInfo(...args)),
    f: common_assets._imports_3$4,
    g: common_vendor.o(($event) => $options.showFeedbackPopup("院长板块")),
    h: common_assets._imports_4$3,
    i: common_vendor.o(($event) => $options.showFeedbackPopup("管理后台")),
    j: common_assets._imports_5$1,
    k: common_assets._imports_2$4,
    l: common_vendor.o(($event) => $options.navigateTo("/pages/dean/daily-tasks")),
    m: common_assets._imports_6$2,
    n: common_assets._imports_2$4,
    o: common_vendor.o(($event) => $options.navigateTo("/pages/dean/user-profile")),
    p: common_assets._imports_7$1,
    q: common_vendor.o(($event) => $options.redirectTo("/pages/dean/index")),
    r: common_assets._imports_8$1,
    s: common_vendor.o(($event) => $options.redirectTo("/pages/dean/dispute")),
    t: common_assets._imports_9$1,
    v: common_vendor.o(($event) => $options.redirectTo("/pages/dean/staff")),
    w: common_assets._imports_10,
    x: common_vendor.o(($event) => $options.redirectTo("/pages/dean/activity")),
    y: common_assets._imports_11,
    z: common_vendor.o(($event) => $options.redirectTo("/pages/dean/management")),
    A: common_assets._imports_12,
    B: $data.showPopup
  }, $data.showPopup ? {
    C: common_vendor.t($data.feedbackType),
    D: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    E: $data.feedbackTitle,
    F: common_vendor.o(($event) => $data.feedbackTitle = $event.detail.value),
    G: $data.feedbackContent,
    H: common_vendor.o(($event) => $data.feedbackContent = $event.detail.value),
    I: common_vendor.f($data.levelOptions, (level, index, i0) => {
      return {
        a: common_vendor.t(level.label),
        b: index,
        c: common_vendor.n($data.feedbackLevel === level.value ? "level-selected" : ""),
        d: common_vendor.o(($event) => $options.selectLevel(level.value), index)
      };
    }),
    J: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    K: common_vendor.o(() => {
    }),
    L: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args))
  } : {}, {
    M: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/profile.js.map
