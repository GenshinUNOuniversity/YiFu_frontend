import { instance } from './instance';
import { DirectUploadInfo } from './report';

/**
 * PageVONewsBriefVO，分页
 */
export interface PageVONewsBriefVO {
  /**
   * 当页数据
   */
  data: NewsBriefVO[];
  /**
   * 当前页
   */
  pageNum: number;
  /**
   * 元素总计
   */
  total: number;
}

/**
 * NewsBriefVO，新闻概要
 */
export interface NewsBriefVO {
  /**
   * 概要
   */
  brief: string;
  /**
   * 封面图片
   */
  briefPicUrl: string;
  /**
   * 创建日期
   */
  createTime: Date;
  /**
   * 新闻id
   */
  newsId: number;
  /**
   * 标题
   */
  title: string;
}

const getAllNewsBrief = async ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => {
  return instance.get<PageVONewsBriefVO>('/news', {
    params: {
      pageNum,
      pageSize,
    },
  });
};

/**
 * NewsDetailVO
 */
export interface NewsDetailVO {
  /**
   * 概要
   */
  brief: string;
  /**
   * 封面图片
   */
  briefPicUrl: string;
  /**
   * 内容
   */
  content: string;
  /**
   * 创建日期
   */
  createTime: Date;
  /**
   * 标题
   */
  title: string;
}

const getNewsDetail = async ({ newsId }: { newsId: number }) => {
  return instance.get<NewsDetailVO>(`/news/${newsId}`);
};

const createNews = async (title: string, brief: string) => {
  return instance.post<number>('/news', { title, brief });
};

const uploadNewsBriefImage = async (newsId: number, imageName: string) => {
  instance.put<DirectUploadInfo>(`/news/${newsId}/brief-image`, { imageName }).then((res) => {
    uni.uploadFile({
      url: res.data.url,
      filePath: imageName,
      name: 'file',
      formData: {
        OSSAccessKeyId: res.data.accessId,
        policy: res.data.policy,
        success_action_status: '200',
        signature: res.data.signature,
        key: res.data.path,
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
      },
    });
  });
};

const uploadNewsImage = async (newsId: number, imageName: string) => {
  instance.put<DirectUploadInfo>(`/news/${newsId}/image`, { imageName }).then((res) => {
    uni.uploadFile({
      url: res.data.url,
      filePath: imageName,
      name: 'file',
      formData: {
        OSSAccessKeyId: res.data.accessId,
        policy: res.data.policy,
        success_action_status: '200',
        signature: res.data.signature,
        key: res.data.path,
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
      },
    });
  });
};

const changeNewsBrief = async (newsId: number, title: string, brief: string) => {
  return instance.put(`/news/${newsId}/brief`, { title, brief });
};

const changeNewsbody = async (newsId: number, content: string, imagePathList: string[]) => {
  return instance.put(`/news/${newsId}/body`, { content, imagePathList });
};

export default {
  getAllNewsBrief,
  getNewsDetail,
  createNews,
  uploadNewsBriefImage,
  uploadNewsImage,
  changeNewsBrief,
  changeNewsbody,
};
