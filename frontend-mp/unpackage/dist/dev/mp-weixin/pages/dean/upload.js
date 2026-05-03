"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      userInfo: {
        deanId: "",
        name: "",
        avatar: "",
        phone: ""
      },
      images: []
    };
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.userInfo = userInfo;
    }
  },
  methods: new UTSJSONObject({
    chooseImage() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield common_vendor.index.chooseImage(new UTSJSONObject({
            count: 9 - this.images.length,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"]
          }));
          this.images.push(...res.tempFilePaths.map((path = null) => {
            return new UTSJSONObject({
              url: path,
              file: new File([path], "image.jpg")
            });
          }));
        } catch (error) {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    deleteImage(index) {
      this.images.splice(index, 1);
    },
    handleSubmit() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.images.length === 0) {
          common_vendor.index.showToast({
            title: "请至少上传一张照片",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          const formData = new FormData();
          this.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image.file);
          });
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const res = yield common_vendor.index.request({
            url: "http://localhost:8080/admin/dean/upload-images",
            method: "POST",
            header: new UTSJSONObject({
              "Authorization": `Bearer ${accessToken}`
            }),
            data: formData
          });
          if (res.statusCode === 200) {
            common_vendor.index.showToast({
              title: "上传成功",
              icon: "success"
            });
            common_vendor.index.navigateTo({
              url: "/pages/dean/detail"
            });
          } else {
            throw new Error("上传失败");
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: error.message || "上传失败",
            icon: "none"
          });
        }
      });
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.userInfo.name),
    b: common_vendor.t($data.userInfo.phone),
    c: common_vendor.f($data.images, (image, index, i0) => {
      return {
        a: image.url,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    d: $data.images.length < 9
  }, $data.images.length < 9 ? {
    e: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    f: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/upload.js.map
