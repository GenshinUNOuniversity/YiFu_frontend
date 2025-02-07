"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const api_user = require("../../../api/user.js");
require("../../../api/scooter.js");
require("../../../api/instance.js");
require("../../../utils/jwt.js");
require("../../../business/auth/useAuth.js");
require("../../../api/login.js");
require("../../../api/report.js");
require("../../../api/chargehistory.js");
require("../../../api/track.js");
require("../../../api/news.js");
require("../../../api/station.js");
require("../../../api/banner.js");
require("../../../api/blacklist.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "scooterDetail",
  setup(__props) {
    const historyScooterList = common_vendor.ref([]);
    const scooterCode = common_vendor.ref("");
    common_vendor.ref();
    const userInfo = common_vendor.ref();
    common_vendor.onLoad(async (option) => {
      if (option && option.scooterCode) {
        scooterCode.value = option.scooterCode;
      } else {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先输入电动车编号",
          showCancel: false,
          success: () => {
            common_vendor.index.navigateBack();
          }
        });
      }
      try {
        common_vendor.index.showLoading({
          title: "加载中"
        });
        const userInfoRes = await api_index.api.managerGetUserInfoByScooterCode(scooterCode.value);
        userInfo.value = userInfoRes.data;
        if (!userInfo.value.newUser) {
          const userHistoryRes = await api_index.api.managerGetUserHistoryScooter({ userId: userInfo.value.userId });
          historyScooterList.value = userHistoryRes.data.data;
        }
        common_vendor.index.hideLoading();
      } catch (error) {
        console.error("🚀 ~ file: scooterDetail.vue:100 ~ onLoad ~ error:", error);
        common_vendor.index.showModal({
          title: "提示",
          content: "获取用户信息失败",
          showCancel: false,
          success: () => {
            common_vendor.index.navigateBack();
          }
        });
      }
    });
    const passNewUser = async () => {
      if (!userInfo.value) {
        return;
      }
      try {
        await api_index.api.giveUserAccess(userInfo.value.userId, api_user.Role.User);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.data.message,
          icon: "error",
          duration: 2e3
        });
        throw new Error(error);
      }
    };
    function auditScooter(code, agree) {
      common_vendor.index.showModal({
        title: agree ? "通过" : "拒绝",
        content: `确定要${agree ? "通过" : "拒绝" + code}吗`,
        success: async function(res) {
          var _a;
          if (res.confirm) {
            if ((_a = userInfo.value) == null ? void 0 : _a.newUser) {
              await passNewUser();
            }
            api_index.api.auditScooter(code, agree).then((res2) => {
              common_vendor.index.showToast({
                title: agree ? "通过成功" : "拒绝成功",
                icon: agree ? "success" : "error",
                duration: 2e3
              });
              scooterCode.value = "";
              userInfo.value = void 0;
            }).catch((err) => {
              common_vendor.index.showToast({
                title: agree ? "通过失败" : "拒绝失败",
                icon: "none",
                duration: 2e3
              });
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    const scooterStatusFormatter = (status) => {
      switch (status) {
        case "Normal":
          return "正常";
        case "Auditing":
          return "审核中";
        case "Rejected":
          return "已拒绝";
        case "Deleted":
          return "已删除";
        default:
          return "状态未知";
      }
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.t(scooterCode.value),
        b: userInfo.value
      }, userInfo.value ? {
        c: common_vendor.t((_a = userInfo.value) == null ? void 0 : _a.realName),
        d: common_vendor.t(userInfo.value.faculty),
        e: common_vendor.t((_b = userInfo.value) == null ? void 0 : _b.studentId),
        f: common_vendor.t((_c = userInfo.value) == null ? void 0 : _c.phone)
      } : {}, {
        g: common_vendor.f(historyScooterList.value, (scooter, index, i0) => {
          return {
            a: common_vendor.t(scooter.code),
            b: common_vendor.t(scooterStatusFormatter(scooter.status)),
            c: index
          };
        }),
        h: userInfo.value
      }, userInfo.value ? {
        i: common_vendor.o(($event) => auditScooter(scooterCode.value, false)),
        j: common_vendor.o(($event) => auditScooter(scooterCode.value, true))
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-25f642e6"]]);
wx.createPage(MiniProgramPage);
