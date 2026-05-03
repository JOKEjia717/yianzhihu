"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      nursingDetail: {},
      isApplying: false,
      showApplyModal: false,
      elderForm: new UTSJSONObject({
        name: "",
        gender: 0,
        age: "",
        photos: []
      }),
      genderOptions: ["男", "女"],
      childrenInfo: new UTSJSONObject({
        childrenId: "",
        name: "",
        phone: ""
      }),
      formError: ""
    };
  },
  onLoad(options) {
    const nursingHomeId = options.nursingHomeId;
    if (nursingHomeId) {
      this.loadNursingDetail(nursingHomeId);
    }
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.childrenInfo = {
        childrenId: userInfo.childrenId,
        name: userInfo.name,
        phone: userInfo.phone
      };
    }
  },
  methods: new UTSJSONObject({
    handleBack() {
      common_vendor.index.navigateBack();
    },
    loadNursingDetail(nursingHomeId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/children/nursing-detail.uvue:158", "开始加载养老院详情，ID:", nursingHomeId);
        try {
          const res = yield utils_request.request.get(`/home/selectById?nursingHomeId=${nursingHomeId}`);
          common_vendor.index.__f__("log", "at pages/children/nursing-detail.uvue:161", "请求响应:", res);
          if (res.statusCode === 200 && res.data.code === 1) {
            this.nursingDetail = res.data.data;
            common_vendor.index.__f__("log", "at pages/children/nursing-detail.uvue:165", "数据加载成功:", this.nursingDetail);
            this.checkIsApplication();
          } else {
            common_vendor.index.__f__("error", "at pages/children/nursing-detail.uvue:168", "请求失败:", res.data.msg);
            common_vendor.index.showToast({
              title: res.data.msg || "加载失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/children/nursing-detail.uvue:175", "请求异常:", error);
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },
    openApplyModal() {
      this.showApplyModal = true;
    },
    closeApplyModal() {
      this.showApplyModal = false;
    },
    choosePhoto() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield common_vendor.index.chooseImage(new UTSJSONObject({ count: 1 }));
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          this.elderForm.photos.push(res.tempFilePaths[0]);
        }
      });
    },
    deletePhoto(index) {
      this.elderForm.photos.splice(index, 1);
    },
    submitApply() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.elderForm.name || !this.elderForm.age || this.elderForm.photos.length === 0) {
          this.formError = "请填写完整信息";
          setTimeout(() => {
            this.formError = "";
          }, 2e3);
          return Promise.resolve(null);
        }
        this.formError = "";
        this.isApplying = true;
        try {
          const formData = new FormData();
          formData.append("caretakerId", this.nursingDetail.deanId || "");
          formData.append("name", this.elderForm.name);
          formData.append("gender", Number(this.elderForm.gender));
          formData.append("age", Number(this.elderForm.age));
          formData.append("childrenName", this.childrenInfo.name);
          formData.append("childrenPhone", this.childrenInfo.phone);
          formData.append("childrenId", this.childrenInfo.childrenId);
          const filePath = this.elderForm.photos[0];
          formData.append("photo", new UTSJSONObject({
            uri: filePath,
            type: "image/jpeg",
            name: "photo.jpg"
          }));
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const res = yield common_vendor.index.uploadFile({
            url: `http://localhost:8080/elder/create?deanId=${this.nursingDetail.deanId}`,
            filePath,
            name: "photo",
            formData: new UTSJSONObject({
              caretakerId: this.nursingDetail.deanId || "",
              name: this.elderForm.name,
              gender: Number(this.elderForm.gender),
              age: Number(this.elderForm.age),
              childrenName: this.childrenInfo.name,
              childrenPhone: this.childrenInfo.phone,
              childrenId: this.childrenInfo.childrenId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          const data = UTS.JSON.parse(res.data);
          if (res.statusCode === 200 && data.code === 1) {
            common_vendor.index.showToast({ title: "申请成功", icon: "success" });
            this.showApplyModal = false;
            this.isApplying = true;
          } else {
            throw new Error(data.msg || "申请失败");
          }
        } catch (e) {
          common_vendor.index.showToast({ title: e.message || "申请失败", icon: "none" });
          this.isApplying = false;
        }
      });
    },
    checkIsApplication() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const accessToken = common_vendor.index.getStorageSync("accessToken");
        const refreshToken = common_vendor.index.getStorageSync("refreshToken");
        try {
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/elder/isApplication",
            method: "GET",
            data: new UTSJSONObject({
              childrenId: this.childrenInfo.childrenId,
              deanId: this.nursingDetail.deanId
            }),
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (res.statusCode === 200 && res.data.code === 1) {
            this.isApplying = res.data.data === 1;
          }
        } catch (e) {
          this.isApplying = false;
        }
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleBack && $options.handleBack(...args)),
    b: $data.nursingDetail.photo,
    c: common_vendor.t($data.nursingDetail.name),
    d: common_vendor.t($data.nursingDetail.address),
    e: common_vendor.t($data.nursingDetail.director),
    f: common_vendor.t($options.formatDate($data.nursingDetail.createdTime)),
    g: common_vendor.t($data.nursingDetail.honors),
    h: common_vendor.t($data.isApplying ? "申请中" : "申请入院"),
    i: $data.isApplying,
    j: common_vendor.o((...args) => $options.openApplyModal && $options.openApplyModal(...args)),
    k: $data.showApplyModal
  }, $data.showApplyModal ? common_vendor.e({
    l: $data.formError
  }, $data.formError ? {
    m: common_vendor.t($data.formError)
  } : {}, {
    n: $data.elderForm.name,
    o: common_vendor.o(($event) => $data.elderForm.name = $event.detail.value),
    p: $data.elderForm.gender === 1 ? 1 : "",
    q: common_vendor.o(($event) => $data.elderForm.gender = 1),
    r: $data.elderForm.gender === 0 ? 1 : "",
    s: common_vendor.o(($event) => $data.elderForm.gender = 0),
    t: $data.elderForm.age,
    v: common_vendor.o(($event) => $data.elderForm.age = $event.detail.value),
    w: common_vendor.f($data.elderForm.photos, (img, idx, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.deletePhoto(idx), idx),
        c: idx
      };
    }),
    x: $data.elderForm.photos.length < 1
  }, $data.elderForm.photos.length < 1 ? {
    y: common_vendor.o((...args) => $options.choosePhoto && $options.choosePhoto(...args))
  } : {}, {
    z: common_vendor.o((...args) => $options.submitApply && $options.submitApply(...args)),
    A: common_vendor.o((...args) => $options.closeApplyModal && $options.closeApplyModal(...args))
  }) : {}, {
    B: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/nursing-detail.js.map
