"use strict";
const common_vendor = require("../common/vendor.js");
const api_instance = require("./instance.js");
const getAllNewsBrief = async ({ pageNum, pageSize }) => {
  return api_instance.instance.get("/news", {
    params: {
      pageNum,
      pageSize
    }
  });
};
const getNewsDetail = async ({ newsId }) => {
  return api_instance.instance.get(`/news/${newsId}`);
};
const createNews = async (title, brief) => {
  return api_instance.instance.post("/news", { title, brief });
};
const uploadNewsBriefImage = async (newsId, imageName) => {
  api_instance.instance.put(`/news/${newsId}/brief-image`, { imageName }).then((res) => {
    common_vendor.index.uploadFile({
      url: res.data.url,
      filePath: imageName,
      name: "file",
      formData: {
        OSSAccessKeyId: res.data.accessId,
        policy: res.data.policy,
        success_action_status: "200",
        signature: res.data.signature,
        key: res.data.path
      },
      success(result) {
        if (result.statusCode === 200) {
          return Promise.resolve({ result, imagePath: res.data.path });
        } else {
          return Promise.reject(result);
        }
      },
      fail(error) {
        return Promise.reject(error);
      }
    });
  });
};
const uploadNewsImage = async (newsId, imageName) => {
  api_instance.instance.put(`/news/${newsId}/image`, { imageName }).then((res) => {
    common_vendor.index.uploadFile({
      url: res.data.url,
      filePath: imageName,
      name: "file",
      formData: {
        OSSAccessKeyId: res.data.accessId,
        policy: res.data.policy,
        success_action_status: "200",
        signature: res.data.signature,
        key: res.data.path
      },
      success(result) {
        if (result.statusCode === 200) {
          return Promise.resolve({ result, imagePath: res.data.path });
        } else {
          return Promise.reject(result);
        }
      },
      fail(error) {
        return Promise.reject(error);
      }
    });
  });
};
const changeNewsBrief = async (newsId, title, brief) => {
  return api_instance.instance.put(`/news/${newsId}/brief`, { title, brief });
};
const changeNewsbody = async (newsId, content, imagePathList) => {
  return api_instance.instance.put(`/news/${newsId}/body`, { content, imagePathList });
};
const news = {
  getAllNewsBrief,
  getNewsDetail,
  createNews,
  uploadNewsBriefImage,
  uploadNewsImage,
  changeNewsBrief,
  changeNewsbody
};
exports.news = news;
