import { instance } from './instance';

/**
 * 充电历史记录单条
 */
export interface ChargeHistoryVO {
  /**
   * 开始充电时间
   */
  start_time: string;
  /**
   * 充电历史id
   */
  record_id: string;
  /**
   * 结束充电时间
   */
  end_time: string;
  /**
   * 移车备注，比如移车位置信息
   */
  start_note: string;
  /**
   * 挪车图片
   */
  start_image: string;
  /**
   * 充电桩名称
   */
  pile_name: string;
  /**
   * 充电站点名称
   */
  station_name: string;
  /**
   * 挪车车辆编号
   */
  start_vehicle_code: string;
  /**
   * 被挪车车辆编号
   */
  end_vehicle_code: string;
  /**
   * 被挪车备注
   */
  end_note: string;
  /**
   * 充电图片
   */
  charging_image: string;
  /**
   * 被挪车图片
   */
  end_image: string;
  /**
   * 信用分是否发生变化
   */
  credit_status: boolean;
  /**
   * 信用分变化情况
   */
  credit_score: number;
}

const getChargeHistory = (userid: number) => {
  const result = instance.get<ChargeHistoryVO[]>('/api/move/' + userid, {});
  // uni.setStorageSync('chargehistory',  result.data);
  return result;
};

export default { getChargeHistory };
