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
  __name: "news",
  setup(__props) {
    const news = common_vendor.ref();
    common_vendor.onLoad((options) => {
      if (options.newsId) {
        api_index.api.getNewsDetail({ newsId: Number(options.newsId) }).then((res) => {
          news.value = { ...res.data, createTime: new Date(res.data.createTime) };
        });
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return {
        a: common_vendor.t((_a = news.value) == null ? void 0 : _a.title),
        b: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_b = news.value) == null ? void 0 : _b.createTime)),
        c: (_c = news.value) == null ? void 0 : _c.content
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1eb4639f"]]);
wx.createPage(MiniProgramPage);
