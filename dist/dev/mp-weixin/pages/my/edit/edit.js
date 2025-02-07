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
const _sfc_main = {
  name: "Edit",
  setup() {
    common_vendor.onLoad((options) => {
      if (options.haveScooter === "true") {
        flag.value = true;
        scooterId.value = Number(options.scooterId);
        code.value = options.code;
        checked.value = Boolean(options.checked);
        console.log(checked.value);
        reject.value = options.reject;
      } else {
        common_vendor.index.showLoading({ title: "加载中" });
        flag.value = false;
        api_index.api.getAllStationInfo().then((res) => {
          common_vendor.index.hideLoading();
          stationList.value = res.data.stations.map((station) => {
            return { name: station.name, stationId: station.stationId };
          });
        });
      }
    });
    const codeRegular = /^[A-Z]?\d{1,4}$/;
    const stationList = common_vendor.ref([]);
    const stationSelected = common_vendor.ref();
    const selectStation = (e) => {
      stationSelected.value = e.target.value;
    };
    const flag = common_vendor.ref();
    const firstEnter = common_vendor.ref(true);
    const focus = common_vendor.ref(false);
    const code = common_vendor.ref("");
    const chargingTime = common_vendor.ref();
    const checked = common_vendor.ref(false);
    const reject = common_vendor.ref(false);
    const completeDesc = common_vendor.ref("");
    const scooterId = common_vendor.ref();
    const selectChargingTime = (e) => {
      chargingTime.value = Number(e.target.value) + 1;
    };
    const handleFocus = () => {
      focus.value = true;
      firstEnter.value = false;
    };
    const handleBlur = () => {
      if (code.value === "") {
        focus.value = false;
      }
    };
    const submitbond = () => {
      if (!code.value) {
        common_vendor.index.showToast({ title: "请输入编号", icon: "error" });
        return;
      } else if (!stationSelected.value) {
        common_vendor.index.showToast({ title: "请选择充电站", icon: "error" });
        return;
      } else if (!chargingTime.value) {
        common_vendor.index.showToast({ title: "请选择充电时间", icon: "error" });
        return;
      } else if (!completeDesc.value) {
        common_vendor.index.showToast({ title: "请填写充满描述", icon: "error" });
        return;
      } else if (!codeRegular.test(code.value)) {
        common_vendor.index.showToast({ title: "请输入正确编号", icon: "error" });
        return;
      } else {
        common_vendor.index.showModal({
          title: "绑定电动车",
          content: `编号：${code.value}\r
所属充电站：${stationList.value[stationSelected.value].name}\r
预计充电时间${chargingTime.value}小时\r
充电结束描述：${completeDesc.value}`,
          confirmText: "绑定",
          success: (res) => {
            if (res.confirm) {
              api_index.api.bondScooter(
                { completeDesc: completeDesc.value, expectHour: chargingTime.value },
                code.value,
                stationList.value[stationSelected.value].stationId
              ).then(() => {
                common_vendor.index.showToast({ title: "绑定成功", icon: "success" });
                common_vendor.index.navigateBack();
              }).catch((err) => {
                common_vendor.index.showToast({ title: err.message, icon: "none" });
              });
            }
          }
        });
      }
    };
    const disbondScooter = () => {
      common_vendor.index.showModal({
        title: "解绑电动车",
        content: `解绑电动车${code.value}后无法恢复`,
        confirmText: "解绑",
        success: (res) => {
          if (res.confirm) {
            api_index.api.disBondScooter({ scooterId: scooterId.value }).then(() => {
              common_vendor.index.showToast({ title: "解绑成功", icon: "success" });
              common_vendor.index.navigateBack();
            }).catch((err) => {
              common_vendor.index.showToast({ title: err.message, icon: "none" });
            });
          }
        }
      });
    };
    return {
      code,
      flag,
      reject,
      handleFocus,
      handleBlur,
      focus,
      firstEnter,
      chargingTime,
      selectChargingTime,
      checked,
      completeDesc,
      submitbond,
      stationList,
      selectStation,
      stationSelected,
      disbondScooter
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $setup.flag === false
  }, $setup.flag === false ? {
    b: $setup.focus ? 1 : "",
    c: !$setup.focus & !$setup.firstEnter ? 1 : "",
    d: $setup.focus ? 1 : "",
    e: common_vendor.o((...args) => $setup.handleFocus && $setup.handleFocus(...args)),
    f: common_vendor.o((...args) => $setup.handleBlur && $setup.handleBlur(...args)),
    g: $setup.code,
    h: common_vendor.o(($event) => $setup.code = $event.detail.value),
    i: $setup.focus === true,
    j: !$setup.focus ? 1 : "",
    k: $setup.focus ? 1 : "",
    l: !$setup.firstEnter ? 1 : "",
    m: common_vendor.o((...args) => $setup.submitbond && $setup.submitbond(...args)),
    n: common_vendor.t($setup.stationSelected ? $setup.stationList[$setup.stationSelected].name : "请选择充电站"),
    o: $setup.stationList,
    p: common_vendor.o((...args) => $setup.selectStation && $setup.selectStation(...args)),
    q: common_vendor.t($setup.chargingTime ? $setup.chargingTime + "小时" : "请选择预期充电时间"),
    r: [1, 2, 3, 4, 5, 6, 7, 8],
    s: common_vendor.o((...args) => $setup.selectChargingTime && $setup.selectChargingTime(...args)),
    t: $setup.completeDesc,
    v: common_vendor.o(($event) => $setup.completeDesc = $event.detail.value)
  } : {}, {
    w: $setup.flag === true
  }, $setup.flag === true ? common_vendor.e({
    x: common_vendor.t($setup.code),
    y: $setup.checked
  }, $setup.checked ? {
    z: $setup.checked ? 1 : "",
    A: !$setup.checked ? 1 : ""
  } : {
    B: !$setup.checked ? 1 : "",
    C: $setup.checked ? 1 : ""
  }, {
    D: $setup.checked
  }, $setup.checked ? {} : {}, {
    E: $setup.checked
  }, $setup.checked ? {
    F: $setup.checked ? 1 : "",
    G: !$setup.checked ? 1 : ""
  } : {
    H: common_vendor.t($setup.reject ? "被拒绝" : "待审核"),
    I: !$setup.checked ? 1 : "",
    J: $setup.checked ? 1 : ""
  }, {
    K: common_vendor.o((...args) => $setup.disbondScooter && $setup.disbondScooter(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0280ee48"]]);
wx.createPage(MiniProgramPage);
