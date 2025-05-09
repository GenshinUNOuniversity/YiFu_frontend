import { instance } from '@/api/instance';
import { DirectUploadInfo } from './report';

/**
 * PageVOScooterVO，分页
 */
// export interface PageVOScooterVO {
//   /**
//    * 当页数据
//    */
//   data: ScooterProfileVO[];
//   /**
//    * 当前页
//    */
//   pageNum: number;
//   /**
//    * 元素总计
//    */
//   total: number;
// }

// export enum ScooterStatus {
//   None = 'None',
//   Normal = 'Normal',
//   Auditing = 'Auditing',
//   Deleted = 'Deleted',
//   Rejected = 'Rejected',
// }

/**
 * 当页数据
 */
export interface ScooterProfileVO {
  /**
   * 用户对车辆的命名
   */
  name: string;
  /**
   * 照片地址
   */
  avatarUrl: string;
  /**
   * 电动车在校内的编码
   */
  code: string;
  /**
   * 预期充满电用时
   */
  expectHour: number;
  /**
   * 电动车在后台服务器的编号
   */
  // scooterId: number;
  /**
   * 挪车备注
   */
  moveNotes: string;
}

/**
 * ScooterInfoDto，电动车信息Dto
 */
// export interface ScooterInfoDto {
//   /**
//    * 结束状态
//    */
//   completeDesc: string;
//   /**
//    * 期待的充电时间
//    */
//   expectHour: number;
// }

/**
 * 充电信息DTO
 */
export interface ChargeDetailDto {
  /**
   * 结束充电的图片地址
   */
  endPhotoPath?: string;
  /**
   * 期望充电时间
   */
  expectHour: number;
  /**
   * 移车备注
   */
  moveDesc?: string;
  /**
   * 移车图片地址
   */
  movePhotoPath?: string;
}

/**
 * AuditScooterUserInfoVO，审核状态中的用户信息
 */
// export interface AuditScooterUserInfoVO {
//   /**
//    * 学院
//    */
//   faculty?: string;
//   /**
//    * 是否为新用户
//    */
//   newUser: boolean;
//   /**
//    * 手机号
//    */
//   phone?: string;
//   /**
//    * 真实姓名
//    */
//   realName: string;
//   /**
//    * 学号
//    */
//   studentId?: string;
//   /**
//    * 用户ID
//    */
//   userId: number;
// }

/**
 * PageVOScooterBindHistoryVO，分页
 */
// export interface PageVOScooterBindHistoryVO {
//   /**
//    * 当页数据
//    */
//   data: ScooterBindHistoryVO[];
//   /**
//    * 当前页
//    */
//   pageNum: number;
//   /**
//    * 元素总计
//    */
//   total: number;
// }

/**
 * ScooterBindHistoryVO，电动车历史绑定信息
 */
// export interface ScooterBindHistoryVO {
//   /**
//    * 编号
//    */
//   code: string;
//   /**
//    * 绑定状态
//    */
//   status: Status;
// }
/**
 * PageVOScooterVO，分页
 */
// export interface PageVOAuditScooterVO {
//   /**
//    * 当页数据
//    */
//   data: ScooterProfileVO[];
//   /**
//    * 当前页
//    */
//   pageNum: number;
//   /**
//    * 元素总计
//    */
//   total: number;
// }

/**
 * 绑定状态
 */
// export enum Status {
//   Auditing = 'Auditing',
//   Deleted = 'Deleted',
//   None = 'None',
//   Normal = 'Normal',
//   Rejected = 'Rejected',
// }

const getUserScooter = () => {
  const result = instance.get<ScooterProfileVO>('/api/vihicle', {});
  uni.setStorageSync('scooter', result);
  return result;
};

// const bondScooter = async (data: ScooterInfoDto, code: string, stationId: number) => {
//   return instance.post<Record<string, never>>(`/scooter?code=${code}&stationId=${stationId}`, data);
// };

// const chargeScooter = async (
//   scooterId: number,
//   stationId: number,
//   pileId: number,
//   data: ChargeDetailDto,
//   // eslint-disable-next-line max-params
// ) => {
//   return instance.post<Record<string, never>>(`/scooter/${scooterId}/charge`, data, {
//     params: {
//       stationId,
//       pileId,
//     },
//   });
// };

// const addChargePhoto = (imageName: string) => {
//   return new Promise<DirectUploadInfo>((resolve, reject) => {
//     instance.get<DirectUploadInfo>(`/scooter/charge/upload-pic-url?fileName=${imageName}`).then((res) => {
//       uni.uploadFile({
//         url: res.data.url,
//         filePath: imageName,
//         name: 'file',
//         formData: {
//           OSSAccessKeyId: res.data.accessId,
//           policy: res.data.policy,
//           success_action_status: '200',
//           signature: res.data.signature,
//           key: res.data.path,
//         },
//         success(result) {
//           if (result.statusCode === 200) {
//             console.log(123);
//             return resolve(res.data);
//           } else {
//             return reject('err');
//           }
//         },
//         fail() {
//           return reject('err');
//         },
//       });
//     });
//   });
// };

// const takeScooter = async ({ scooterId }: { scooterId: number }) => {
//   return instance.delete<Record<string, never>>(`/scooter/${scooterId}/charge`);
// };

// const endChargeScooter = async ({ scooterId }: { scooterId: number }) => {
//   return instance.post<Record<string, never>>(`/scooter/${scooterId}/charge/end`);
// };

// const disBondScooter = async ({ scooterId }: { scooterId: number }) => {
//   return instance.delete<Record<string, never>>(`/scooter/${scooterId}`);
// };

// const getAllScooter = async (pageNum: number, pageSize: number) => {
//   return instance.get<PageVOScooterVO>('/scooter/scooter', {
//     params: {
//       pageNum,
//       pageSize,
//     },
//   });
// };

// const auditScooter = async (code: string, agree: boolean) => {
//   return instance.post<Record<string, never>>(`/scooter/audit?code=${code}`, { agree: agree });
// };

// const managerGetUserInfoByScooterCode = async (code: string) => {
//   return instance.get<AuditScooterUserInfoVO>(`/scooter/audit/user-info?code=${code}`);
// };

// const managerGetUserHistoryScooter = async ({
//   userId,
//   pageNum = 1,
//   pageSize = 1000,
// }: {
//   userId: number;
//   pageNum?: number;
//   pageSize?: number;
// }) => {
//   return instance.get<PageVOScooterBindHistoryVO>(
//     `/scooter/bind-history?userId=${userId}?pageNum=${pageNum}&pageSize=${pageSize}`,
//   );
// };

// const managerGetAuditScooterList = async ({ pageNum = 1, pageSize = 1000 }: { pageNum: number; pageSize: number }) => {
//   return instance.get<PageVOAuditScooterVO>(`/scooter/audit/scooter-page?pageNum=${pageNum}&pageSize=${pageSize}`);
// };

export default {
  getUserScooter,
  // bondScooter,
  // chargeScooter,
  // takeScooter,
  // endChargeScooter,
  // disBondScooter,
  // getAllScooter,
  // auditScooter,
  // addChargePhoto,
  // managerGetUserInfoByScooterCode,
  // managerGetUserHistoryScooter,
  // managerGetAuditScooterList,
};
