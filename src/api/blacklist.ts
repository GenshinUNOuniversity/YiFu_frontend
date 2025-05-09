import { instance } from './instance';
import user, { UserProfileInfoVO } from './user';

export interface PageVOBlackListHistoryItemVO {
  pageNum: number;
  total: number;
  data: BlackListHistoryItemVO[];
}

export enum BlackListStatus {
  None = 'None',
  Normal = 'Normal',
  Cancelled = 'Cancelled',
}

export interface BlackListHistoryItemVO {
  blackListHistoryId: number;
  profile: UserProfileInfoVO;
  reason: string;
  due: number;
  status: BlackListStatus;
  createTime: Date;
}

const sendToBlackList = async (
  reason: string,
  due: number,
  userId?: number,
  scooterId?: number,
  scooterCode?: string,
) => {
  if (userId === undefined && scooterId === undefined && scooterCode === undefined) {
    uni.showToast({
      title: '用户和电动车不能同时为空',
    });
  }
  return instance.post<Record<string, never>>(
    `/user/black-list?reason=${reason}&due=${due}${scooterId ? '&scooterId=' + scooterId : ''}${
      scooterCode ? '&scooterCode=' + scooterCode : ''
    }${userId ? '&userId=' + userId : ''}`,
  );
};

const getBlackList = async (pageNum: number, pageSize: number) => {
  return instance.get<PageVOBlackListHistoryItemVO>(`/user/black-list`, { params: { pageNum, pageSize } });
};

const deleteBlackList = async (blackListHistoryId: number) => {
  return instance.delete<Record<string, never>>(`/user/black-list/${blackListHistoryId}`);
};
export default { sendToBlackList, getBlackList, deleteBlackList };
