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
if (!Math) {
  (AddBlackListBottom + BottomLoadingPrompt)();
}
const BottomLoadingPrompt = () => "../../components/bottomLoadingPrompt/bottomLoadingPrompt.js";
const AddBlackListBottom = () => "../../components/addBlackListBottom/addBlackListBottom.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "blacklist",
  setup(__props) {
    common_vendor.onLoad(() => {
      getBlackList();
    });
    const blacklistPageNum = common_vendor.ref(1);
    const hasMoreBlacklist = common_vendor.ref(true);
    const isLoadingBlacklist = common_vendor.ref(false);
    const getBlackList = async () => {
      isLoadingBlacklist.value = true;
      api_index.api.getBlackList(blacklistPageNum.value, 5).then((res) => {
        blacklist.value = blacklist.value.concat(
          res.data.data.map((black) => {
            black.createTime = new Date(black.createTime);
            return black;
          })
        );
        if (blacklistPageNum.value * 5 >= res.data.total) {
          hasMoreBlacklist.value = false;
        } else {
          blacklistPageNum.value += 1;
        }
        common_vendor.index.hideLoading();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "获取黑名单失败",
          icon: "none"
        });
      }).finally(() => {
        isLoadingBlacklist.value = false;
      });
    };
    common_vendor.onPullDownRefresh(async () => {
      common_vendor.index.showLoading({
        title: "加载中"
      });
      blacklist.value = [];
      hasMoreBlacklist.value = true;
      blacklistPageNum.value = 1;
      await getBlackList();
      common_vendor.index.hideLoading();
    });
    const blacklist = common_vendor.ref([]);
    const showBlacklist = common_vendor.ref([]);
    common_vendor.ref(true);
    common_vendor.ref({
      code: "",
      time: ""
    });
    async function handleClick(blackListHistoryId, realName) {
      common_vendor.index.showModal({
        title: "删除黑名单",
        content: `确定要将${realName}从黑名单移除吗`,
        success: async function(res) {
          if (res.confirm) {
            await api_index.api.deleteBlackList(blackListHistoryId).then(() => {
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success",
                duration: 2e3
              });
            });
            const page = blacklistPageNum.value;
            blacklistPageNum.value = 1;
            blacklist.value = [];
            for (let index = 0; index < page; index++) {
              await getBlackList();
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    common_vendor.onReachBottom(async () => {
      if (hasMoreBlacklist.value && !isLoadingBlacklist.value) {
        await getBlackList();
      }
    });
    const selectItems = common_vendor.ref("Normal");
    const handleSelectChange = ({ detail: { value } }) => {
      selectItems.value = value;
    };
    common_vendor.watch([blacklist, selectItems], ([newBlacklist, newSelectItems]) => {
      showBlacklist.value = newBlacklist.filter((black) => newSelectItems.includes(black.status));
      if (hasMoreBlacklist.value && !isLoadingBlacklist.value && showBlacklist.value.length < 5) {
        getBlackList();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleSelectChange),
        b: common_vendor.p({
          ["scooter-code"]: true
        }),
        c: common_vendor.f(showBlacklist.value, (black, k0, i0) => {
          return {
            a: common_vendor.t(black.profile.realName),
            b: common_vendor.t(black.profile.phone),
            c: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(black.createTime)),
            d: common_vendor.t(black.reason),
            e: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(black.due)),
            f: common_vendor.o(($event) => handleClick(black.blackListHistoryId, black.profile.realName), black.blackListHistoryId),
            g: black.blackListHistoryId
          };
        }),
        d: common_vendor.p({
          ["has-more"]: hasMoreBlacklist.value,
          ["is-loading"]: isLoadingBlacklist.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-defada78"]]);
wx.createPage(MiniProgramPage);
