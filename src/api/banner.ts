import { instance } from './instance';

/**
 * BannerItemVO，banner单条
 */
export interface BannerItemVO {
  /**
   * banner id
   */
  bannerId: number;
  /**
   * 图片地址
   */
  imagePath: string;
  /**
   * 关联的新闻id
   */
  newsId?: number;
  /**
   * order
   */
  order: number;
}

const getBanner = async () => {
  return instance.get<BannerItemVO[]>('/banner');
};

export default { getBanner };
