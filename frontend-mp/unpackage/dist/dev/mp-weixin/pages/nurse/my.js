"use strict";
const common_vendor = require("../../common/vendor.js");
const NurseTabbar = () => "../../components/nurse-tabbar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    NurseTabbar
  },
  data() {
    return {
      userInfo: {},
      orderStats: {},
      showEdit: false,
      editForm: {
        avatar: null,
        phone: "",
        specialty: ""
      },
      isSubmitting: false
    };
  },
  onLoad() {
    const storedInfo = common_vendor.index.getStorageSync("userInfo");
    if (storedInfo) {
      this.userInfo = {
        name: storedInfo.name || "",
        avatar: storedInfo.avatar,
        phone: storedInfo.phone || "",
        specialty: storedInfo.specialty || ""
      };
      this.editForm = {
        avatar: storedInfo.avatar,
        phone: storedInfo.phone || "",
        specialty: storedInfo.specialty || ""
      };
    }
    this.fetchOrderStats();
  },
  methods: {
    fetchOrderStats() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          const result = yield common_vendor.index.request({
            url: "http://localhost:8080/order/stats",
            method: "GET",
            header: new UTSJSONObject({
              "accessToken": accessToken,
              "refreshToken": refreshToken
            })
          });
          if (result.data.code === 1 && result.data.data) {
            this.orderStats = result.data.data;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/my.uvue:167", "获取订单统计失败:", error);
        }
      });
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    handleMenuClick(type) {
    },
    handleLogout() {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.clearStorageSync();
            common_vendor.index.redirectTo({
              url: "/pages/nurse/login"
            });
          }
        }
      }));
    },
    showEditModal() {
      this.showEdit = true;
    },
    closeEditModal() {
      this.showEdit = false;
      this.editForm = {
        avatar: this.userInfo.avatar,
        phone: this.userInfo.phone,
        specialty: this.userInfo.specialty
      };
    },
    chooseAvatar() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.editForm.avatar = res.tempFilePaths[0];
        }
      }));
    },
    submitEdit() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.editForm.phone || !this.editForm.specialty) {
          common_vendor.index.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        this.isSubmitting = true;
        try {
          const accessToken = common_vendor.index.getStorageSync("accessToken");
          const refreshToken = common_vendor.index.getStorageSync("refreshToken");
          if (this.editForm.avatar && this.editForm.avatar !== this.userInfo.avatar && this.editForm.avatar.startsWith("http") === false) {
            const uploadResult = yield common_vendor.index.uploadFile({
              url: "http://localhost:8080/caretaker/update",
              filePath: this.editForm.avatar,
              name: "avatar",
              formData: new UTSJSONObject({
                "phone": this.editForm.phone,
                "specialty": this.editForm.specialty
              }),
              header: new UTSJSONObject({
                "accessToken": accessToken,
                "refreshToken": refreshToken
              })
            });
            const response = UTS.JSON.parse(uploadResult.data);
            if (response.code === 1) {
              this.updateUserInfo(response.data);
            } else {
              throw new Error(response.msg || "更新失败");
            }
          } else {
            const result = yield common_vendor.index.request({
              url: "http://localhost:8080/caretaker/update",
              method: "POST",
              data: new UTSJSONObject({
                "phone": this.editForm.phone,
                "specialty": this.editForm.specialty
              }),
              header: new UTSJSONObject({
                "accessToken": accessToken,
                "refreshToken": refreshToken,
                "Content-Type": "application/x-www-form-urlencoded"
              })
            });
            if (result.data.code === 1) {
              this.updateUserInfo(result.data.data);
            } else {
              throw new Error(result.data.msg || "更新失败");
            }
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/nurse/my.uvue:286", "更新失败:", error);
          common_vendor.index.showToast({
            title: error.message || "更新失败",
            icon: "none"
          });
        } finally {
          this.isSubmitting = false;
        }
      });
    },
    updateUserInfo(newData = null) {
      const updatedInfo = new UTSJSONObject(Object.assign(Object.assign({}, this.userInfo), { avatar: newData.avatar || this.userInfo.avatar, phone: newData.phone || this.userInfo.phone, specialty: newData.specialty || this.userInfo.specialty }));
      common_vendor.index.setStorageSync("userInfo", updatedInfo);
      this.userInfo = updatedInfo;
      this.editForm = {
        avatar: updatedInfo.avatar,
        phone: updatedInfo.phone,
        specialty: updatedInfo.specialty
      };
      this.showEdit = false;
      common_vendor.index.showToast({
        title: "更新成功",
        icon: "success"
      });
    }
  }
});
if (!Array) {
  const _component_nurse_tabbar = common_vendor.resolveComponent("nurse-tabbar");
  _component_nurse_tabbar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar || "/static/images/default-avatar.png",
    b: common_vendor.o((...args) => $options.showEditModal && $options.showEditModal(...args)),
    c: common_vendor.t($data.userInfo.name || "未设置姓名"),
    d: common_vendor.t($data.userInfo.phone || "未设置"),
    e: common_vendor.t($data.userInfo.specialty || "未设置"),
    f: common_vendor.o((...args) => $options.showEditModal && $options.showEditModal(...args)),
    g: $data.showEdit
  }, $data.showEdit ? common_vendor.e({
    h: common_vendor.o((...args) => $options.closeEditModal && $options.closeEditModal(...args)),
    i: $data.editForm.avatar
  }, $data.editForm.avatar ? {
    j: $data.editForm.avatar
  } : {}, {
    k: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    l: $data.editForm.phone,
    m: common_vendor.o(($event) => $data.editForm.phone = $event.detail.value),
    n: $data.editForm.specialty,
    o: common_vendor.o(($event) => $data.editForm.specialty = $event.detail.value),
    p: common_vendor.o((...args) => $options.closeEditModal && $options.closeEditModal(...args)),
    q: common_vendor.t($data.isSubmitting ? "提交中..." : "确认"),
    r: common_vendor.o((...args) => $options.submitEdit && $options.submitEdit(...args)),
    s: $data.isSubmitting
  }) : {}, {
    t: common_vendor.p({
      ["current-path"]: "/pages/nurse/my"
    }),
    v: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/nurse/my.js.map
