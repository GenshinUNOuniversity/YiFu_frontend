"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_timeformatter = require("../../../utils/timeformatter.js");
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
  __name: "index",
  setup(__props) {
    const station = common_vendor.ref();
    const pileDetail = common_vendor.ref();
    const scooterList = common_vendor.ref([]);
    const endPhotoDirectUploadInfo = common_vendor.ref();
    const movePhotoDirectUploadInfo = common_vendor.ref();
    const subscribeMessageTemplateIdList = [
      "vkZDzsDbC9dtWpX7xOe6-cvzdRLTvbghiyvUNeAdDgw",
      "GdVxZLWuH2Wi0QP1RApkYcAEocmen9553zmuIBEcN7M"
    ];
    const getStationInfo = async ({ stationId: stationId2 }) => {
      try {
        const res = await api_index.api.getStationInfo({ stationId: stationId2 });
        station.value = res.data;
      } catch (e) {
        console.log(e);
      }
    };
    const getPileDetail = async ({ stationId: stationId2, pileId: pileId2 }) => {
      api_index.api.getPileInfo({ stationId: stationId2, pileId: pileId2 }).then((res) => {
        if (res.data.status === "Repairing") {
          common_vendor.index.showModal({
            title: "警告",
            content: "本充电桩已坏，若以修复请联系管理员",
            showCancel: false,
            success: function(res2) {
              common_vendor.index.navigateBack();
            }
          });
        } else {
          pileDetail.value = { ...res.data, end: res.data.end ? new Date(res.data.end) : void 0 };
        }
      });
    };
    const getScooterList = async () => {
      api_index.api.getUserScooterList({ pageNum: 1, pageSize: 100 }).then((res) => {
        scooterList.value = res.data.data.filter((scooter2) => {
          return scooter2.status === "Normal";
        });
      });
    };
    const moveCardInput = common_vendor.ref("");
    const finishScooterPositionPic = common_vendor.ref("");
    const moveScooterPositionPic = common_vendor.ref("");
    const chooseImages = (which) => {
      common_vendor.index.chooseImage({
        sizeType: ["compressed"],
        sourceType: ["camera"],
        count: 1,
        success: function(res) {
          switch (which) {
            case "finish":
              finishScooterPositionPic.value = res.tempFilePaths.toString();
              break;
            case "move":
              moveScooterPositionPic.value = res.tempFilePaths.toString();
              break;
          }
        }
      });
    };
    const previewImage = (url) => {
      common_vendor.index.navigateTo({
        url: "/pages/components/previewPhoto/previewPhoto",
        success: (res) => {
          res.eventChannel.emit("previewPhotoUrl", { photoUrl: url });
        }
      });
      common_vendor.index.$once("deleteUrl", (data) => {
        if (data.deleteUrl === finishScooterPositionPic.value) {
          finishScooterPositionPic.value = "";
        } else if (data.deleteUrl === moveScooterPositionPic.value) {
          moveScooterPositionPic.value = "";
        }
      });
    };
    const whichScooter = common_vendor.ref(0);
    const changeScooter = (e) => {
      whichScooter.value = e.detail.value;
    };
    const changeExpectHour = (e) => {
      scooterList.value[whichScooter.value].expectHour = Number(e.detail.value) + 1;
    };
    const changeDesc = () => {
      common_vendor.index.showModal({
        title: "充电结束时的描述",
        content: scooterList.value[whichScooter.value].completeDesc,
        showCancel: true,
        editable: true,
        success: ({ confirm, content }) => {
          if (confirm) {
            scooterList.value[whichScooter.value].completeDesc = content;
          }
        }
      });
    };
    const stationId = common_vendor.ref(1);
    const pileId = common_vendor.ref(2);
    common_vendor.onLoad(async (data) => {
      try {
        common_vendor.index.showLoading({ title: "加载中", mask: true });
        console.log(pileDetail.value);
        stationId.value = Number(data.stationId);
        pileId.value = Number(data.pileId);
        getStationInfo({ stationId: stationId.value });
        getPileDetail({ stationId: Number(data.stationId), pileId: Number(data.pileId) });
        getScooterList();
        common_vendor.index.hideLoading();
        console.log(data);
      } catch (error) {
      }
    });
    const startReport = () => {
      common_vendor.index.navigateTo({
        url: `/pages/report/report?stationId=${stationId.value}&pileId=${pileId.value}&whichKind=pile`
      });
    };
    const startCharge = async () => {
      var _a, _b, _c;
      if (((_a = pileDetail.value) == null ? void 0 : _a.status) === "Using" && !(finishScooterPositionPic.value && moveScooterPositionPic.value)) {
        common_vendor.index.showToast({ title: "请上传照片", icon: "error" });
        return;
      }
      if (finishScooterPositionPic.value) {
        await api_index.api.addChargePhoto(finishScooterPositionPic.value).then((res) => {
          endPhotoDirectUploadInfo.value = res;
        });
      }
      if (moveScooterPositionPic.value) {
        await api_index.api.addChargePhoto(moveScooterPositionPic.value).then((res) => {
          movePhotoDirectUploadInfo.value = res;
        });
      }
      await api_index.api.chargeScooter(scooterList.value[whichScooter.value].scooterId, stationId.value, pileId.value, {
        endPhotoPath: (_b = endPhotoDirectUploadInfo.value) == null ? void 0 : _b.path,
        expectHour: scooterList.value[whichScooter.value].expectHour,
        moveDesc: scooterList.value[whichScooter.value].completeDesc,
        movePhotoPath: (_c = movePhotoDirectUploadInfo.value) == null ? void 0 : _c.path
      }).then(() => {
        common_vendor.index.showToast({
          title: "充电成功",
          icon: "success",
          duration: 2e3
        });
        common_vendor.index.requestSubscribeMessage({
          tmplIds: subscribeMessageTemplateIdList,
          success: (res) => {
            if (res["errMsg"] === "requestSubscribeMessage:ok" || res[subscribeMessageTemplateIdList[0]] === "accept" || res[subscribeMessageTemplateIdList[1]] === "accept") {
              common_vendor.index.showToast({
                title: "订阅成功",
                icon: "success",
                duration: 2e3
              });
            }
            common_vendor.index.showToast({
              title: "不进行消息订阅无法收到通知",
              icon: "none",
              duration: 4e3
            });
            common_vendor.index.navigateBack();
          },
          fail: () => {
            common_vendor.index.showToast({
              title: "不进行消息订阅无法收到通知",
              icon: "none",
              duration: 4e3
            });
            common_vendor.index.navigateBack();
          },
          complete: () => {
            console.log("请求发送通知");
          }
        });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err.message,
          duration: 4e3
        });
      });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      return common_vendor.e({
        a: common_vendor.o(startReport),
        b: ((_a = pileDetail.value) == null ? void 0 : _a.status) === "Free" || ((_b = pileDetail.value) == null ? void 0 : _b.status) === "Ended"
      }, ((_c = pileDetail.value) == null ? void 0 : _c.status) === "Free" || ((_d = pileDetail.value) == null ? void 0 : _d.status) === "Ended" ? common_vendor.e({
        c: common_vendor.t((_e = station.value) == null ? void 0 : _e.name),
        d: common_vendor.t((_f = pileDetail.value) == null ? void 0 : _f.name),
        e: ((_g = pileDetail.value) == null ? void 0 : _g.status) === "Ended"
      }, ((_h = pileDetail.value) == null ? void 0 : _h.status) === "Ended" ? {
        f: common_vendor.t((_i = pileDetail.value) == null ? void 0 : _i.scooterCode)
      } : {}) : {}, {
        g: ((_j = pileDetail.value) == null ? void 0 : _j.status) === "Using"
      }, ((_k = pileDetail.value) == null ? void 0 : _k.status) === "Using" ? common_vendor.e({
        h: common_vendor.t((_l = pileDetail.value) == null ? void 0 : _l.name),
        i: common_vendor.t((_m = pileDetail.value) == null ? void 0 : _m.scooterCode),
        j: common_vendor.t(common_vendor.unref(utils_timeformatter.timeFormatter)((_n = pileDetail.value) == null ? void 0 : _n.end)),
        k: finishScooterPositionPic.value
      }, finishScooterPositionPic.value ? {
        l: finishScooterPositionPic.value,
        m: common_vendor.o(($event) => previewImage(finishScooterPositionPic.value))
      } : {
        n: common_vendor.o(($event) => chooseImages("finish"))
      }, {
        o: moveScooterPositionPic.value
      }, moveScooterPositionPic.value ? {
        p: moveScooterPositionPic.value,
        q: common_vendor.o(($event) => previewImage(moveScooterPositionPic.value))
      } : {
        r: common_vendor.o(($event) => chooseImages("move"))
      }, {
        s: moveCardInput.value,
        t: common_vendor.o(($event) => moveCardInput.value = $event.detail.value)
      }) : {}, {
        v: scooterList.value.length > 0
      }, scooterList.value.length > 0 ? {
        w: common_vendor.t(scooterList.value[whichScooter.value].code),
        x: whichScooter.value,
        y: scooterList.value,
        z: common_vendor.o(changeScooter),
        A: common_vendor.t(scooterList.value[whichScooter.value].expectHour),
        B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        C: scooterList.value[whichScooter.value].expectHour - 1,
        D: common_vendor.o(changeExpectHour),
        E: common_vendor.t(scooterList.value[whichScooter.value].completeDesc),
        F: common_vendor.o(changeDesc)
      } : {}, {
        G: common_vendor.o(startCharge)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3f77f74d"]]);
wx.createPage(MiniProgramPage);
