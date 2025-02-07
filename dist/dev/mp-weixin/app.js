"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
require("./api/instance.js");
require("./api/index.js");
require("./api/scooter.js");
require("./api/login.js");
require("./api/user.js");
require("./api/report.js");
require("./api/chargehistory.js");
require("./api/track.js");
require("./api/news.js");
require("./api/station.js");
require("./api/banner.js");
require("./api/blacklist.js");
require("./utils/jwt.js");
require("./business/auth/useAuth.js");
if (!Math) {
  "./pages/charging/index.js";
  "./pages/my/index.js";
  "./pages/search/index.js";
  "./pages/search/searchmain/index.js";
  "./pages/search/itemcontent/index.js";
  "./pages/report/report.js";
  "./pages/charging/chargeHistory/index.js";
  "./pages/report/reportHistory/index.js";
  "./pages/report/reportTitle/reportTitle.js";
  "./pages/components/startCharging/index.js";
  "./pages/charging/prepareCharge/index.js";
  "./pages/components/userProfile/userProfile.js";
  "./pages/components/previewPhoto/previewPhoto.js";
  "./pages/report/reportSuccess/reportSuccess.js";
  "./pages/my/edit/edit.js";
  "./pages/manager/station/station.js";
  "./pages/manager/handleReport/handleReport.js";
  "./pages/manager/handleReport/reportDetail/reportDetail.js";
  "./pages/manager/handleReport/passReport/passReport.js";
  "./pages/manager/handleReport/rejectReport/rejectReport.js";
  "./pages/manager/station/pileDetail/pileDetail.js";
  "./pages/manager/index.js";
  "./pages/manager/newsManage/newsManage.js";
  "./pages/components/news/news.js";
  "./pages/manager/blacklist/blacklist.js";
  "./pages/manager/auditScooter/auditScooter.js";
  "./pages/manager/auditScooter/scooterDetail.js";
  "./pages/my/phoneManage/phoneManage.js";
  "./pages/my/deleteAccount/deleteAccount.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    const getLocationAu = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.authorize({
          scope: "scope.userLocation",
          success: (res) => {
            console.log(res);
            resolve();
          },
          fail: (err) => {
            console.log(err);
            reject(err);
          }
        });
      });
    };
    common_vendor.onLaunch(async (options) => {
      getLocationAu();
      if (options == null ? void 0 : options.query) {
        const query = options.query;
        const type = query["type"];
        switch (type) {
          case "charging": {
            const { stationId, pileId } = query;
            common_vendor.index.navigateTo({
              url: `/pages/charging/prepareCharge/index?stationId=${stationId}&pileId=${pileId}`
            });
            break;
          }
        }
      }
    });
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
