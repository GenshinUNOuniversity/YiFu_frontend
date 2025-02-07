"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
require("../../../api/scooter.js");
require("../../../api/instance.js");
require("../../../utils/jwt.js");
require("../../../business/auth/useAuth.js");
require("../../../api/login.js");
require("../../../api/user.js");
require("../../../api/report.js");
require("../../../api/chargehistory.js");
require("../../../api/track.js");
require("../../../api/news.js");
require("../../../api/station.js");
require("../../../api/banner.js");
require("../../../api/blacklist.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addBlackListBottom",
  props: {
    scooterId: null,
    userId: null,
    scooterCode: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const due = common_vendor.ref((/* @__PURE__ */ new Date()).getTime());
    const reason = common_vendor.ref("");
    const codeRegular = /^[A-Z]\d{1,4}$/;
    const enterScooterCode = common_vendor.ref("");
    const userType = () => {
      common_vendor.index.showModal({
        title: "请输入加入黑名单原因",
        editable: true,
        placeholderText: "请输入原因",
        success: (res) => {
          if (res.confirm) {
            if (res.content === "" || !res.content) {
              common_vendor.index.showToast({ title: "请输入原因", icon: "error" });
              return;
            } else {
              reason.value = res.content;
              common_vendor.index.showModal({
                title: "请输入黑名单天数",
                editable: true,
                placeholderText: "请输入天数",
                success: (res2) => {
                  if (res2.confirm) {
                    if (res2.content === "" || !res2.content) {
                      common_vendor.index.showToast({ title: "请输入天数", icon: "error" });
                      return;
                    } else if (!/^[0-9]+$/.test(res2.content)) {
                      common_vendor.index.showToast({ title: "请输入正确的天数", icon: "error" });
                      return;
                    } else {
                      due.value = (/* @__PURE__ */ new Date()).getTime() + 864e4 * Number(res2.content);
                      api_index.api.sendToBlackList(
                        reason.value,
                        due.value,
                        props.userId,
                        props.scooterId,
                        props.scooterCode ? enterScooterCode.value : void 0
                      ).then(() => {
                        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
                      }).catch((err) => {
                        common_vendor.index.showToast({
                          title: err.message,
                          icon: "none"
                        });
                      });
                    }
                  } else {
                    return;
                  }
                }
              });
            }
          } else {
            return;
          }
        }
      });
    };
    const sendToBlackList = () => {
      if (props.scooterCode) {
        common_vendor.index.showModal({
          title: "请输入加入黑名单的车辆",
          editable: true,
          placeholderText: "请输入电动车编号",
          success: ({ confirm, content }) => {
            if (confirm) {
              if (codeRegular.test(content)) {
                enterScooterCode.value = content;
                userType();
              } else {
                common_vendor.index.showToast({ title: "电动车编号错误", icon: "error" });
                return Promise.reject();
              }
            }
          }
        });
      } else {
        userType();
      }
    };
    return (_ctx, _cache) => {
      return {
        a: !(__props.scooterId || __props.userId || __props.scooterCode),
        b: common_vendor.o(sendToBlackList)
      };
    };
  }
});
wx.createComponent(_sfc_main);
