"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      isSubmitting: false,
      disputeForm: {
        title: "",
        description: "",
        date: "",
        time: "",
        typeIndex: 0,
        urgencyLevel: 1,
        deanId: ""
      },
      disputeTypes: [
        "设施问题",
        "服务质量",
        "人员投诉",
        "安全隐患",
        "饮食问题",
        "其他"
      ],
      urgencyLevels: [
        new UTSJSONObject({ text: "低", color: "#26c48b" }),
        new UTSJSONObject({ text: "中", color: "#ffaa00" }),
        new UTSJSONObject({ text: "高", color: "#ff6b6b" })
      ]
    };
  },
  onLoad() {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = this.padZero(now.getMonth() + 1);
    const day = this.padZero(now.getDate());
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    this.disputeForm.date = `${year}-${month}-${day}`;
    this.disputeForm.time = `${hours}:${minutes}`;
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.deanId) {
      this.disputeForm.deanId = userInfo.deanId;
    }
  },
  methods: {
    padZero(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    onDateChange(e = null) {
      this.disputeForm.date = e.detail.value;
    },
    onTimeChange(e = null) {
      this.disputeForm.time = e.detail.value;
    },
    onTypeChange(e = null) {
      this.disputeForm.typeIndex = Number(e.detail.value);
    },
    selectUrgency(level) {
      this.disputeForm.urgencyLevel = level;
    },
    submitDispute() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.disputeForm.title.trim()) {
          common_vendor.index.showToast({
            title: "请输入纠纷标题",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!this.disputeForm.description.trim()) {
          common_vendor.index.showToast({
            title: "请输入纠纷详情",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!this.disputeForm.date || !this.disputeForm.time) {
          common_vendor.index.showToast({
            title: "请选择发生时间",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        this.isSubmitting = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (!accessToken || !refreshToken) {
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          const disputeData = new UTSJSONObject({
            title: this.disputeForm.title,
            description: this.disputeForm.description,
            occurTime: `${this.disputeForm.date} ${this.disputeForm.time}`,
            type: this.disputeTypes[this.disputeForm.typeIndex],
            urgencyLevel: this.disputeForm.urgencyLevel,
            deanId: this.disputeForm.deanId,
            status: "new"
            // 新增纠纷默认状态为"新增"
          });
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/dispute/add",
            method: "POST",
            data: disputeData,
            header: new UTSJSONObject({
              "Content-Type": "application/json",
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          const response = result.data;
          common_vendor.index.__f__("log", "at pages/dean/add-dispute.uvue:243", "添加纠纷响应:", response);
          if (response && response.code === 1) {
            common_vendor.index.showToast({
              title: "添加纠纷成功",
              icon: "success",
              duration: 2e3
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 2e3);
          } else {
            common_vendor.index.showToast({
              title: response.msg || "添加失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/dean/add-dispute.uvue:263", "请求错误:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        } finally {
          this.isSubmitting = false;
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.disputeForm.title,
    c: common_vendor.o(($event) => $data.disputeForm.title = $event.detail.value),
    d: $data.disputeForm.description,
    e: common_vendor.o(($event) => $data.disputeForm.description = $event.detail.value),
    f: common_vendor.t($data.disputeForm.description.length),
    g: common_vendor.t($data.disputeForm.date || "请选择日期"),
    h: $data.disputeForm.date,
    i: common_vendor.o((e) => {
      $data.disputeForm.date = e.detail.value;
      $options.onDateChange(e);
    }),
    j: common_vendor.t($data.disputeForm.time || "请选择时间"),
    k: $data.disputeForm.time,
    l: common_vendor.o((e) => {
      $data.disputeForm.time = e.detail.value;
      $options.onTimeChange(e);
    }),
    m: common_vendor.t($data.disputeTypes[$data.disputeForm.typeIndex] || "请选择纠纷类型"),
    n: $data.disputeTypes,
    o: $data.disputeForm.typeIndex,
    p: common_vendor.o((e) => {
      $data.disputeForm.typeIndex = Number(e.detail.value);
      $options.onTypeChange(e);
    }),
    q: common_vendor.f($data.urgencyLevels, (level, index, i0) => {
      return {
        a: common_vendor.t(level.text),
        b: index,
        c: common_vendor.n({
          "selected": $data.disputeForm.urgencyLevel === index
        }),
        d: common_vendor.o(($event) => $options.selectUrgency(index), index)
      };
    }),
    r: common_vendor.t($data.isSubmitting ? "提交中..." : "提交纠纷"),
    s: common_vendor.o((...args) => $options.submitDispute && $options.submitDispute(...args)),
    t: $data.isSubmitting,
    v: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/add-dispute.js.map
