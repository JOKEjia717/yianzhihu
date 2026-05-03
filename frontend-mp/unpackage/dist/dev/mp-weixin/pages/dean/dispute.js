"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      searchKey: "",
      isMoving: false,
      btnPosition: {
        left: -1,
        top: -1
      },
      disputeList: [
        {
          id: "1",
          title: "食堂餐费金额问题",
          time: "2023-06-15 09:30",
          description: "多位患者反映食堂餐费金额下降，部分饭菜不新鲜",
          status: "resolved"
        },
        {
          id: "2",
          title: "管理人员服务态度问题",
          time: "2023-06-18 14:45",
          description: "据大家反馈三号护理人员服务态度不佳",
          status: "resolving"
        },
        {
          id: "3",
          title: "公共区域噪音问题",
          time: "2023-06-20 16:20",
          description: "二楼多位患者反映一号活动室音响过大",
          status: "unresolved"
        },
        {
          id: "4",
          title: "设备维修延误",
          time: "2023-06-22 10:15",
          description: "四楼浴室热水器故障三天未维修",
          status: "unresolved"
        },
        {
          id: "5",
          title: "档案管理投诉",
          time: "2023-06-23 11:30",
          description: "病历档案错漏多，前台信息登记完全混乱",
          status: "new"
        }
      ]
    };
  },
  onLoad() {
    this.loadBtnPosition();
  },
  computed: new UTSJSONObject({
    filteredDisputeList() {
      if (!this.searchKey.trim()) {
        return this.disputeList;
      }
      return this.disputeList.filter((dispute) => {
        return dispute.title.includes(this.searchKey) || dispute.description.includes(this.searchKey);
      });
    }
  }),
  methods: new UTSJSONObject({
    loadBtnPosition() {
      try {
        const position = common_vendor.index.getStorageSync("disputeAddBtnPosition");
        if (position) {
          const pos = UTS.JSON.parse(position);
          this.btnPosition = pos;
        } else {
          const systemInfo = common_vendor.index.getSystemInfoSync();
          this.btnPosition = {
            left: systemInfo.windowWidth - 140,
            top: systemInfo.windowHeight - 240
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/dean/dispute.uvue:165", "获取按钮位置失败:", error);
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.btnPosition = {
          left: systemInfo.windowWidth - 140,
          top: systemInfo.windowHeight - 240
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
        common_vendor.index.setStorageSync("disputeAddBtnPosition", UTS.JSON.stringify(this.btnPosition));
        common_vendor.index.showToast({
          title: "位置已保存",
          icon: "success",
          duration: 1e3
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/dean/dispute.uvue:207", "保存按钮位置失败:", error);
      }
    },
    searchDispute() {
      common_vendor.index.__f__("log", "at pages/dean/dispute.uvue:212", "搜索关键词:", this.searchKey);
    },
    getStatusText(status) {
      switch (status) {
        case "resolved":
          return "已解决";
        case "resolving":
          return "处理中";
        case "unresolved":
          return "未解决";
        case "new":
          return "新增纠纷";
        default:
          return "";
      }
    },
    addDispute() {
      if (this.isMoving)
        return null;
      common_vendor.index.__f__("log", "at pages/dean/dispute.uvue:233", "添加新纠纷");
      common_vendor.index.navigateTo({
        url: "/pages/dean/add-dispute"
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
    b: common_vendor.o([($event) => $data.searchKey = $event.detail.value, (...args) => $options.searchDispute && $options.searchDispute(...args)]),
    c: $data.searchKey,
    d: common_vendor.f($options.filteredDisputeList, (dispute, index, i0) => {
      return {
        a: common_vendor.t(dispute.title),
        b: common_vendor.t(dispute.time),
        c: common_vendor.t(dispute.description),
        d: common_vendor.t($options.getStatusText(dispute.status)),
        e: common_vendor.n(dispute.status),
        f: dispute.id
      };
    }),
    e: $data.isMoving
  }, $data.isMoving ? {} : {}, {
    f: $data.btnPosition.left + "px",
    g: $data.btnPosition.top + "px",
    h: common_vendor.o((...args) => $options.addDispute && $options.addDispute(...args)),
    i: common_vendor.o((...args) => $options.startMoveBtn && $options.startMoveBtn(...args)),
    j: common_vendor.o((...args) => $options.moveBtn && $options.moveBtn(...args)),
    k: common_vendor.o((...args) => $options.endMoveBtn && $options.endMoveBtn(...args)),
    l: common_assets._imports_7$1,
    m: common_vendor.o(($event) => $options.redirectTo("/pages/dean/index")),
    n: common_assets._imports_8$1,
    o: common_assets._imports_9$1,
    p: common_vendor.o(($event) => $options.redirectTo("/pages/dean/staff")),
    q: common_assets._imports_10,
    r: common_vendor.o(($event) => $options.redirectTo("/pages/dean/activity")),
    s: common_assets._imports_11,
    t: common_vendor.o(($event) => $options.redirectTo("/pages/dean/management")),
    v: common_assets._imports_12,
    w: common_vendor.o(($event) => $options.redirectTo("/pages/dean/profile")),
    x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dean/dispute.js.map
