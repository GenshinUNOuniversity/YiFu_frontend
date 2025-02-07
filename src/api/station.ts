import { instance } from './instance';

/**
 * StationListVO，站点列表
 */
export interface StationListVO {
  /**
   * 所有站点
   */
  stations: StationBriefVO[];
}

/**
 * StationBriefVO，站点简介
 */
export interface StationBriefVO {
  /**
   * 站点id
   */
  stationId: number;
  /**
   * 站点描述
   */
  desc: string;
  /**
   * 站点位置，最好四个点
   */
  location: StationLocationVO[];
  /**
   * 站点位置描述
   */
  locationDesc: string;
  /**
   * 站点名称
   */
  name: string;
  stat?: StationBriefStatVO;
}

/**
 * StationLocationVO，站点位置
 */
export interface StationLocationVO {
  /**
   * 纬度
   */
  latitude: number;
  /**
   * 经度
   */
  longitude: number;
}

/**
 * StationBriefStatVO，站点状态
 */
export interface StationBriefStatVO {
  /**
   * 空闲数量
   */
  free: number;
  /**
   * 即将空闲数量
   */
  soon: number;
  /**
   * 总计
   */
  total: number;
  /**
   * 正在使用数量
   */
  using: number;
}

const getAllStationInfo = async () => {
  return instance.get<StationListVO>('/station');
};

/**
 * StationDetailVO，站点详情
 */
export interface StationDetailVO {
  /**
   * 站点描述信息
   */
  desc: string;
  /**
   * 站点位置
   */
  location: LocationPoint[];
  /**
   * 位置描述
   */
  locationDesc: string;
  /**
   * 站点名称
   */
  name: string;
  /**
   * 充电桩群组
   */
  pileGroupList: PileGroupVO[];
  stat?: StationBriefStatVO;
  /**
   * 站点id
   */
  stationId: number;
}

/**
 * LocationPoint，位置
 */
export interface LocationPoint {
  /**
   * 纬度
   */
  latitude: number;
  /**
   * 经度
   */
  longitude: number;
}

/**
 * PileGroupVO，充电桩群组
 */
export interface PileGroupVO {
  /**
   * Id
   */
  id: string;
  /**
   * 名称
   */
  isShow?: boolean;
  name?: string;
  /**
   * 充电桩列表
   */
  pileList: PileBriefVO[];
}

/**
 * PileBriefVO，充电桩简介
 */
export interface PileBriefVO {
  /**
   * 开始使用时间
   */
  begin?: Date;
  /**
   * 结束使用时间
   */
  end?: Date;
  /**
   * 是否即将充满
   */
  isSoonFree?: boolean;
  /**
   * 名称
   */
  name: string;
  /**
   * 充电桩id
   */
  pileId: number;
  /**
   * 电动车号码
   */
  scooterCode?: string;
  /**
   * 电动车编号
   */
  scooterId?: number;
  /**
   * 使用状态
   */
  status: Status;
}

/**
 * 使用状态
 */
export enum Status {
  Ended = 'Ended',
  Free = 'Free',
  Repairing = 'Repairing',
  Using = 'Using',
}

/**
 * StationBriefStatVO，站点状态
 */
export interface StationBriefStatVO {
  /**
   * 空闲数量
   */
  free: number;
  /**
   * 即将空闲数量
   */
  soon: number;
  /**
   * 总计
   */
  total: number;
  /**
   * 正在使用数量
   */
  using: number;
}

// 获取单个充电站信息
const getStationInfo = async ({ stationId }: { stationId: number }) => {
  return instance.get<StationDetailVO>(`/station/${stationId}`);
};

/**
 * PileDetailVO，充电桩详情
 */
export interface PileDetailVO {
  /**
   * 开始使用时间
   */
  begin?: Date;
  /**
   * 充电桩备注
   */
  desc?: string;
  /**
   * 结束使用时间
   */
  end?: Date;
  /**
   * 结束描述
   */
  endDesc?: string;
  /**
   * 是否即将充满
   */
  isSoonFree?: boolean;
  /**
   * 名称
   */
  name: string;
  /**
   * 充电桩id
   */
  pileId: number;
  /**
   * 电动车号码
   */
  scooterCode?: string;
  /**
   * 电动车Id
   */
  scooterId?: number;
  /**
   * 使用状态
   */
  status: Status;
}

// 获取充电桩详情信息
const getPileInfo = async ({ stationId, pileId }: { stationId: number; pileId: number }) => {
  return instance.get<PileDetailVO>(`/station/${stationId}/pile/${pileId}`);
};

const changeStationBoard = async (stationId: number, board: string) => {
  return instance.post(`/station/${stationId}/board`, { board });
};
export default { getAllStationInfo, getStationInfo, getPileInfo, changeStationBoard };
