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
  __name: "newsManage",
  setup(__props) {
    const stationId = common_vendor.ref();
    const stationBoard = common_vendor.ref("");
    const editBoard = common_vendor.ref("");
    const isEditBoard = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      stationId.value = common_vendor.index.getStorageSync("stationId");
      getStationInfo();
    });
    const getStationInfo = () => {
      api_index.api.getStationInfo({ stationId: stationId.value ? stationId.value : 0 }).then((res) => {
        stationBoard.value = res.data.desc;
      });
    };
    const startEditBoard = () => {
      editBoard.value = stationBoard.value;
      isEditBoard.value = true;
    };
    const changeBoard = () => {
      api_index.api.changeStationBoard(stationId.value ? stationId.value : 0, editBoard.value).then(() => {
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
        getStationInfo();
        isEditBoard.value = false;
      });
    };
    const cancel = () => {
      isEditBoard.value = false;
    };
    const showNote = () => {
      common_vendor.index.showModal({ title: "阿姨的温馨提示", showCancel: false, content: stationBoard.value });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(stationBoard.value),
        b: common_vendor.o(showNote)
      }, {}, {
        c: isEditBoard.value
      }, isEditBoard.value ? {
        d: -1,
        e: editBoard.value,
        f: common_vendor.o(($event) => editBoard.value = $event.detail.value),
        g: common_vendor.o(cancel),
        h: common_vendor.o(changeBoard)
      } : {
        i: common_vendor.o(startEditBoard)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6e5ac313"]]);
wx.createPage(MiniProgramPage);
