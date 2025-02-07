import { instance } from './instance';

/**
 * PageVOChargeHistoryItemVO，分页
 */
export interface PageVOChargeHistoryItemVO {
  /**
   * 当前页
   */
  pageNum: number;
  /**
   * 元素总计
   */
  total: number;
  /**
   * 当页数据
   */
  data: ChargeHistoryItemVO[];
}

/**
 * ChargeHistoryItemVO，充电历史记录单条
 */
export interface ChargeHistoryItemVO {
  /**
   * 开始充电时间
   */
  begin: Date;
  /**
   * 充电历史id
   */
  chargeHistoryId: number;
  /**
   * 准确/用户预计的结束充电，将动态调整
   */
  end?: Date;
  /**
   * 结束充电拍照图片地址
   */
  endPhotoUrl?: string;
  /**
   * 结束充电流程的用户id
   */
  endUserId?: number;
  /**
   * 期待的充电时间
   */
  expectHour: number;
  /**
   * 移车备注，比如移车位置信息
   */
  moveDesc?: string;
  /**
   * 移车图片地址
   */
  movePhotoUrl?: string;
  /**
   * 充电桩名称
   */
  pileName: string;
  /**
   * 电动车编号
   */
  scooterCode: string;
  /**
   * 充电站点id
   */
  stationId: number;
  /**
   * 充电站点名称
   */
  stationName: string;
  /**
   * 状态
   */
  status: Status;
}

/**
 * 状态
 */
export enum Status {
  EndedByOther = 'EndedByOther',
  EndedBySelf = 'EndedBySelf',
  EndedPeacefully = 'EndedPeacefully',
  ForcedEnd = 'ForcedEnd',
  None = 'None',
  Using = 'Using',
}

const getChargeHistory = async (params: { pageNum: number; pageSize: number }) => {
  return instance.get<PageVOChargeHistoryItemVO>('/charge-history', {
    params,
  });
};

const getInProgressHistory = async () => {
  return instance.get<ChargeHistoryItemVO[]>('/charge-history/in-progress');
};

export default { getInProgressHistory, getChargeHistory };
