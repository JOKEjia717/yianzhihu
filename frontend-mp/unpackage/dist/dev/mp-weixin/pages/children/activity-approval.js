"use strict";
const common_vendor = require("../../common/vendor.js");
const mockActivities = [
  {
    requestId: "req001",
    elderId: "elder1",
    activityId: "act001",
    activityName: "老年太极班",
    activityTime: "2023-06-15 09:00:00",
    location: "养老院中心广场",
    description: "适合各年龄段老人的太极班，活动轻松，强身健体",
    applyTime: "2023-06-10 14:30:00",
    status: 0
  },
  {
    requestId: "req002",
    elderId: "elder1",
    activityId: "act002",
    activityName: "棋牌竞赛",
    activityTime: "2023-06-20 14:00:00",
    location: "养老院活动室",
    description: "各种棋牌游戏，包括象棋、围棋、斗地主等",
    applyTime: "2023-06-12 10:15:00",
    status: 1
  },
  {
    requestId: "req003",
    elderId: "elder1",
    activityId: "act003",
    activityName: "健康讲座",
    activityTime: "2023-06-25 15:30:00",
    location: "养老院多功能厅",
    description: "关于老年人健康饮食和疾病预防的专业讲座",
    applyTime: "2023-06-14 09:45:00",
    status: 2
  },
  {
    requestId: "req004",
    elderId: "elder2",
    activityId: "act004",
    activityName: "户外郊游",
    activityTime: "2023-07-05 08:30:00",
    location: "城市公园",
    description: "轻松愉快的户外活动，呼吸新鲜空气",
    applyTime: "2023-06-28 11:20:00",
    status: 0
  },
  {
    requestId: "req005",
    elderId: "elder2",
    activityId: "act005",
    activityName: "手工制作班",
    activityTime: "2023-07-10 14:00:00",
    location: "养老院工艺室",
    description: "学习制作简单的手工艺品，锻炼动手能力",
    applyTime: "2023-07-01 16:40:00",
    status: 0
  },
  {
    requestId: "req006",
    elderId: "elder3",
    activityId: "act006",
    activityName: "电影欣赏会",
    activityTime: "2023-07-15 19:00:00",
    location: "养老院影音室",
    description: "观看经典老电影，重温美好回忆",
    applyTime: "2023-07-05 13:30:00",
    status: 1
  },
  {
    requestId: "req007",
    elderId: "elder3",
    activityId: "act007",
    activityName: "歌唱比赛",
    activityTime: "2023-07-20 15:00:00",
    location: "养老院礼堂",
    description: "老年人歌唱比赛，展示风采",
    applyTime: "2023-07-10 10:00:00",
    status: 0
  },
  {
    requestId: "req008",
    elderId: "elder4",
    activityId: "act008",
    activityName: "书法练习",
    activityTime: "2023-07-25 10:00:00",
    location: "养老院书画室",
    description: "学习和练习书法，陶冶情操",
    applyTime: "2023-07-15 15:10:00",
    status: 0
  },
  {
    requestId: "req009",
    elderId: "elder5",
    activityId: "act009",
    activityName: "瑜伽班",
    activityTime: "2023-08-01 08:00:00",
    location: "养老院健身房",
    description: "适合老年人的轻柔瑜伽课程",
    applyTime: "2023-07-20 14:25:00",
    status: 0
  },
  {
    requestId: "req010",
    elderId: "elder5",
    activityId: "act010",
    activityName: "绘画课程",
    activityTime: "2023-08-05 14:30:00",
    location: "养老院书画室",
    description: "简单的绘画技巧教学，放松心情",
    applyTime: "2023-07-25 11:55:00",
    status: 2
  }
];
const commonActivities = [
  {
    requestId: "reqc001",
    elderId: "common",
    activityId: "actc001",
    activityName: "春节联欢会",
    activityTime: "2024-02-10 18:00:00",
    location: "养老院大礼堂",
    description: "欢庆春节的联欢活动，有歌舞表演和抽奖",
    applyTime: "2024-01-25 09:30:00",
    status: 0
  },
  {
    requestId: "reqc002",
    elderId: "common",
    activityId: "actc002",
    activityName: "端午节包粽子",
    activityTime: "2024-06-10 10:00:00",
    location: "养老院食堂",
    description: "端午节活动，学习包粽子，品尝美食",
    applyTime: "2024-05-25 14:20:00",
    status: 0
  },
  {
    requestId: "reqc003",
    elderId: "common",
    activityId: "actc003",
    activityName: "中秋赏月会",
    activityTime: "2024-09-17 19:00:00",
    location: "养老院花园",
    description: "中秋节赏月活动，有茶点和文艺表演",
    applyTime: "2024-09-01 16:45:00",
    status: 0
  }
];
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      elderId: "",
      elderName: "",
      activityRequests: []
    };
  },
  onLoad(options) {
    if (options.elderId) {
      this.elderId = options.elderId;
    }
    if (options.elderName) {
      this.elderName = options.elderName;
    }
    this.generateMockData();
  },
  methods: {
    generateMockData() {
      const getRandomSeed = (id) => {
        let total = 0;
        for (let i = 0; i < id.length; i++) {
          total += id.charCodeAt(i);
        }
        return total;
      };
      const seed = getRandomSeed(this.elderId);
      const rnd = (max) => {
        return Math.floor((seed * 9301 + 49297) % 233280) / 233280 * max;
      };
      this.activityRequests = [];
      const elderSpecificActivities = mockActivities.filter((act) => {
        return act.elderId === this.elderId || // 如果没有完全匹配，使用部分匹配
        this.elderId.length > 5 && act.elderId === this.elderId.substring(0, 5);
      });
      if (elderSpecificActivities.length > 0) {
        this.activityRequests.push(...elderSpecificActivities);
      }
      const numCommonToAdd = Math.min(2, commonActivities.length);
      for (let i = 0; i < numCommonToAdd; i++) {
        const activity = new UTSJSONObject(Object.assign({}, commonActivities[i]));
        activity.elderId = this.elderId;
        activity.requestId = "req" + this.elderId + i;
        this.activityRequests.push(activity);
      }
      if (this.activityRequests.length < 3) {
        const numToGenerate = 3 - this.activityRequests.length;
        const activityNames = ["趣味运动会", "健康检查活动", "音乐鉴赏会", "传统戏曲欣赏", "园艺活动"];
        const locations = ["养老院操场", "养老院医务室", "养老院音乐厅", "养老院文化室", "养老院花园"];
        const descriptions = [
          "轻松愉快的运动会，有多种趣味项目",
          "全面的健康检查，关注老年人身体健康",
          "古典音乐欣赏，提高艺术修养",
          "传统戏曲表演和讲解，传承文化",
          "园艺种植活动，亲近自然"
        ];
        for (let i = 0; i < numToGenerate; i++) {
          const nameIndex = Math.floor(rnd(activityNames.length));
          const locationIndex = Math.floor(rnd(locations.length));
          const descIndex = Math.floor(rnd(descriptions.length));
          const now = /* @__PURE__ */ new Date();
          now.setDate(now.getDate() + 15 + Math.floor(rnd(30)));
          const activityTime = now.toISOString();
          const applyDate = /* @__PURE__ */ new Date();
          applyDate.setDate(applyDate.getDate() - Math.floor(rnd(5)));
          const applyTime = applyDate.toISOString();
          this.activityRequests.push({
            requestId: "reqgen" + this.elderId + i,
            elderId: this.elderId,
            activityId: "actgen" + this.elderId + i,
            activityName: activityNames[nameIndex],
            activityTime,
            location: locations[locationIndex],
            description: descriptions[descIndex],
            applyTime,
            status: Math.floor(rnd(3))
          });
        }
      }
      if (this.activityRequests.length > 5) {
        this.activityRequests = this.activityRequests.sort(() => {
          return 0.5 - Math.random();
        }).slice(0, 5);
      }
      let hasPending = this.activityRequests.some((req) => {
        return req.status === 0;
      });
      if (!hasPending && this.activityRequests.length > 0) {
        this.activityRequests[0].status = 0;
      }
    },
    handleApprove(requestId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield this.updateRequestStatus(requestId, 1);
      });
    },
    handleReject(requestId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield this.updateRequestStatus(requestId, 2);
      });
    },
    updateRequestStatus(requestId, status) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.activityRequests = this.activityRequests.map((req) => {
          if (req.requestId === requestId) {
            return Object.assign(Object.assign({}, req), { status });
          }
          return req;
        });
        common_vendor.index.showToast({
          title: status === 1 ? "通过成功" : "拒绝成功",
          icon: "success"
        });
      });
    },
    handleBack() {
      common_vendor.index.navigateBack();
    },
    formatDate(dateString) {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return "待审批";
        case 1:
          return "已通过";
        case 2:
          return "已拒绝";
        default:
          return "未知状态";
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 0:
          return "status-pending";
        case 1:
          return "status-approved";
        case 2:
          return "status-rejected";
        default:
          return "";
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleBack && $options.handleBack(...args)),
    b: common_vendor.t($data.elderName),
    c: $data.activityRequests.length === 0
  }, $data.activityRequests.length === 0 ? {} : {
    d: common_vendor.f($data.activityRequests, (request, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(request.activityName),
        b: common_vendor.t($options.getStatusText(request.status)),
        c: common_vendor.n($options.getStatusClass(request.status)),
        d: common_vendor.t($options.formatDate(request.applyTime)),
        e: common_vendor.t($options.formatDate(request.activityTime)),
        f: common_vendor.t(request.location),
        g: common_vendor.t(request.description),
        h: request.status === 0
      }, request.status === 0 ? {
        i: common_vendor.o(($event) => $options.handleReject(request.requestId), request.requestId),
        j: common_vendor.o(($event) => $options.handleApprove(request.requestId), request.requestId)
      } : {}, {
        k: request.requestId
      });
    })
  }, {
    e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/children/activity-approval.js.map
