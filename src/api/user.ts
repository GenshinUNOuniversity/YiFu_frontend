import { ApiResponse, instance } from './instance';
import Request from 'luch-request';
/**
 * 用户详情信息
 */
export interface UserProfileVO {
  /**
   * 头像地址
   */
  avatarUrl: string;
  /**
   * 学部
   */
  faculty?: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 手机号码
   */
  phone: string;
  /**
   * 用户在后台服务器的编号
   */
  userId: string;
  /**
   * 用户的电动车在后台服务器的编号
   */
  scooterId: string;
  /**
   * 用户类型，工作人员/学生
   */
  // userType: UserType;
  /**
   * 权限，是否被封禁，以及是否为管理员
   */
  // role: Role;
  /**
   * 管理的站点id
   */
  // stationId?: number;
  /**
   * 信用分
   */
  honest: number;
  /**
   * 是否永久封禁
   */
  banned: boolean;
  /**
   * 封禁的原因
   */
  blacklistReason?: UserBlackListReasonVO;
}

/**
 * 个人信息状态
 */
// export enum ProfileState {
//   Auditing = 'AUDITING',
//   Confirmed = 'CONFIRMED',
//   Draft = 'DRAFT',
//   None = 'NONE',
// }

/**
 * 用户类型
 */
// export enum UserType {
//   None = 'NONE',
//   Staff = 'STAFF',
//   Student = 'STUDENT',
// }

/**
 * 权限
 */
// export enum Role {
//   Admin = 'Admin',
//   Banned = 'Banned',
//   Manager = 'Manager',
//   None = 'None',
//   User = 'User',
// }

/**
 * 用户状态（正常/封禁）
 */
export interface UserStatusVO {
  /**
   * 用户是否正常，若为false则表示被封禁
   */
  normal: boolean;
  /**
   * 被封禁的原因
   */
  blackListReason: UserBlackListReasonVO;
}

/**
 * 封禁信息
 */
export interface UserBlackListReasonVO {
  /**
   * 预计解除时间
   */
  due: number;
  /**
   * 操作管理员
   */
  managerName: string;
  /**
   * 事发站
   */
  stationName: string;
  /**
   * 封禁原因
   */
  reason: string;
}

/**
 * FacultyItemVO，学院
 */
export interface FacultyItemVO {
  /**
   * 学院id
   */
  facultyId: number;
  /**
   * 名称
   */
  name: string;
}

export interface FacultyFatherVO {
  /**
   * 名称
   */
  name: string;
  /**
   * 子学院
   */
  facultyList: FacultyItemVO[];
}

/**
 * UpdateUserProfileDto，更新用户信息Dto
 */
export interface UpdateUserProfileDto {
  /**
   * 学院
   */
  faculty: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 学号
   */
  studentId: string;
  avatarUrl: string;
}

/**
 * 从后台服务器获取用户信息并保存到本地
 * @param userId 后台服务器上的用户ID
 * @returns 获取的用户信息
 */
const getUserInfo = async (userId: number) => {
  const result = await instance.get<UserProfileVO>(`/api/users/${userId}`);
  // 此处应有错误信息处理
  uni.setStorageSync('user-profile', result.data);
  return result;
};
// const managerGetUserInfo = async (userId: number) => {
//   return instance.get<UserProfileVO>(`/user/${userId}/profile`);
// };
// // const changeUserInfo = async (data: UpdateUserProfileDto, userType: UserType) => {
// //   return instance.put(`/api/users/profile?type=${userType === UserType.Student ? 'student' : 'stuff'}`, data);
// // };
// const getManager = () => {
//   return instance.get<UserProfileVO>('/user/manager');
// };

// const getWXPusherQrCode = async () => {
//   return instance.get<string>('/user/wx-pusher/qr-code');
// };

// const giveUserAccess = async (userId: number, type: Role = Role.None) => {
//   return instance.put(`/user/${userId}/role`, { userRole: type });
// };

// const getUserStatus = async () => {
//   return instance.get<UserStatusVO>('/user/status');
// };

// const changeUserPhone = async (code: string, type: 'code' | 'wechat', phone?: string) => {
//   return instance.put(`/user/phone?type=${type}`, { code, phone });
// };

// const getUserPhoneCode = async (phone: string) => {
//   return instance.get(`/user/phone/code?phone=${phone}`);
// };

// const getFacultyList = async () => {
//   return instance.get<FacultyFatherVO[]>('/user/faculty/list');
// };

// const deleteAccount = async () => {
//   return instance.delete('/user');
// };
export default {
  getUserInfo,
  // changeUserInfo,
  // getManager,
  // getWXPusherQrCode,
  // giveUserAccess,
  // getUserStatus,
  // changeUserPhone,
  // getUserPhoneCode,
  // managerGetUserInfo,
  // getFacultyList,
  // deleteAccount,
};
