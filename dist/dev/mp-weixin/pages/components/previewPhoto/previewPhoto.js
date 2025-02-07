"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "previewPhoto",
  setup(__props) {
    const photoUrl = common_vendor.ref("");
    common_vendor.onLoad(() => {
      var _a;
      const instance = (_a = common_vendor.getCurrentInstance()) == null ? void 0 : _a.proxy;
      const eventChannel = instance.getOpenerEventChannel();
      eventChannel.once("previewPhotoUrl", (data) => {
        photoUrl.value = data.photoUrl;
      });
    });
    const isShowDelete = common_vendor.ref(true);
    const deletePic = () => {
      common_vendor.index.showActionSheet({
        title: "要删除这张照片吗？",
        itemList: ["删除"],
        itemColor: "red",
        success: () => {
          common_vendor.index.$emit("deleteUrl", { deleteUrl: photoUrl.value });
          common_vendor.index.navigateBack({});
        }
      });
    };
    const changeTitle = () => {
      isShowDelete.value = !isShowDelete.value;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isShowDelete.value
      }, isShowDelete.value ? {
        b: common_vendor.o(deletePic)
      } : {}, {
        c: photoUrl.value,
        d: common_vendor.o(changeTitle)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0ccb4d90"]]);
wx.createPage(MiniProgramPage);
