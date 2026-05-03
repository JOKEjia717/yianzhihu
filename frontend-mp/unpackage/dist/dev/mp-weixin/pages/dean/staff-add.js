"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      isSubmitting: false,
      staffForm: {
        name: "",
        phone: "",
        positionIndex: 0,
        avatar: "",
        entryDate: "",
        remark: "",
        deanId: "",
        account: "",
        password: ""
      },
      positionOptions: [
        "技工",
        "管理人员",
        "教师",
        "行政人员",
        "护理人员",
        "领导",
        "其他"
      ]
    };
  },
  onLoad() {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = this.padZero(now.getMonth() + 1);
    const day = this.padZero(now.getDate());
    this.staffForm.entryDate = `${year}-${month}-${day}`;
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.deanId) {
      this.staffForm.deanId = userInfo.deanId;
    }
  },
  methods: new UTSJSONObject({
    padZero(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    onPositionChange(e = null) {
      this.staffForm.positionIndex = Number(e.detail.value);
    },
    onDateChange(e = null) {
      this.staffForm.entryDate = e.detail.value;
    },
    chooseImage() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield common_vendor.index.chooseImage(new UTSJSONObject({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"]
          }));
          if (res.tempFilePaths && res.tempFilePaths.length > 0) {
            this.staffForm.avatar = res.tempFilePaths[0];
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/dean/staff-add.uvue:216", "选择图片失败:", error);
        }
      });
    },
    submitStaff() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.staffForm.name.trim()) {
          common_vendor.index.showToast({
            title: "请输入员工姓名",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!this.staffForm.phone.trim() || !/^1\d{10}$/.test(this.staffForm.phone)) {
          common_vendor.index.showToast({
            title: "请输入正确的手机号码",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!this.staffForm.account.trim()) {
          common_vendor.index.showToast({
            title: "请输入员工账号",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (!this.staffForm.password.trim()) {
          common_vendor.index.showToast({
            title: "请输入员工密码",
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
          const uploadTask = yield common_vendor.index.uploadFile({
            url: "http://localhost:8080/caretaker/register",
            filePath: this.staffForm.avatar || "",
            name: "avatar",
            formData: new UTSJSONObject({
              account: this.staffForm.account,
              password: this.staffForm.password,
              name: this.staffForm.name,
              phone: this.staffForm.phone,
              specialty: this.positionOptions[this.staffForm.positionIndex]
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          const responseData = UTS.JSON.parse(uploadTask.data);
          common_vendor.index.__f__("log", "at pages/dean/staff-add.uvue:287", "添加员工响应:", responseData);
          if (responseData && responseData.code === 1) {
            common_vendor.index.showToast({
              title: "添加员工成功",
              icon: "success",
              duration: 2e3
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 2e3);
          } else {
            common_vendor.index.showToast({
              title: responseData.msg || "添加失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/dean/staff-add.uvue:307", "请求错误:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        } finally {
          this.isSubmitting = false;
        }
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.staffForm.name,
    c: common_vendor.o(($event) => $data.staffForm.name = $event.detail.value),
    d: $data.staffForm.phone,
    e: common_vendor.o(($event) => $data.staffForm.phone = $event.detail.value),
    f: $data.staffForm.account,
    g: common_vendor.o(($event) => $data.staffForm.account = $event.detail.value),
    h: $data.staffForm.password,
    i: common_vendor.o(($event) => $data.staffForm.password = $event.detail.value),
    j: common_vendor.t($data.positionOptions[$data.staffForm.positionIndex] || "请选择工作岗位"),
    k: $data.positionOptions,
    l: $data.staffForm.positionIndex,
    m: common_vendor.o((...args) => $options.onPositionChange && $options.onPositionChange(...args)),
    n: $data.staffForm.avatar
  }, $data.staffForm.avatar ? {
    o: $data.staffForm.avatar
  } : {}, {
    p: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    q: common_vendor.t($data.staffForm.entryDate || "请选择入职日期"),
    r: $data.staffForm.entryDate,
    s: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    t: $data.staffForm.remark,
    v: common_vendor.o(($event) => $data.staffForm.remark = $event.detail.value),
    w: common_vendor.t($data.staffForm.remark.length),
    x: common_vendor.t($data.isSubmitting ? "提交中..." : "提交"),
    y: common_vendor.o((...args) => $options.submitStaff && $options.submitStaff(...args)),
    z: $data.isSubmitting,
    A: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/staff-add.js.map
