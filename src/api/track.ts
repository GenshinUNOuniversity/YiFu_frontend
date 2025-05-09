import { instance } from './instance';

interface TrackModel {
  /**
   * 手机品牌
   */
  brand: string;
  /**
   * 元素id
   */
  elementId: string;
  /**
   * 事件id
   */
  eventId: string;
  /**
   * 其它数据
   */
  ext: { [key: string]: { [key: string]: never } };
  /**
   * 手机模型
   */
  model: string;
  /**
   * 页面id
   */
  pageId: string;
  /**
   * 系统平台
   */
  platform: string;
  /**
   * 埋点日志生成时间
   */
  trackTime: number;
  /**
   * 用户id，若未登录可为空
   */
  userId?: number;
}

const doTrack = (dto: TrackModel) => {
  return instance.post('/tracking', dto);
};

export default {
  doTrack,
};
