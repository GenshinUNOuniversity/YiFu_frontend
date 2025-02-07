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
   * 学院
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
   * 个人信息状态
   */
  profileState: ProfileState;
  /**
   * 真实姓名
   */
  realName: string;
  /**
   * 编号
   */
  Id?: string;
  /**
   * 用户类型
   */
  userType: UserType;
  /**
   * 权限
   */
  role: Role;
  /**
   * 管理的站点id
   */
  stationId?: number;
  /**
   * 信用分
   */
  honest?: number;
}

/**
 * 个人信息状态
 */
export enum ProfileState {
  Auditing = 'AUDITING',
  Confirmed = 'CONFIRMED',
  Draft = 'DRAFT',
  None = 'NONE',
}

/**
 * 用户类型
 */
export enum UserType {
  None = 'NONE',
  Staff = 'STAFF',
  Student = 'STUDENT',
}

/**
 * 权限
 */
export enum Role {
  Admin = 'Admin',
  Banned = 'Banned',
  Manager = 'Manager',
  None = 'None',
  User = 'User',
}

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
  stationName: string;
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
  facultyId: number;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 真实姓名
   */
  realName: string;
  /**
   * 学号
   */
  studentId: string;
  avatarUrl: string;
}

const getUserInfo = async () => {
  const result = await instance.get<UserProfileVO>('/user/profile');
  uni.setStorageSync('status', result.data.role);
  return result;
};
const managerGetUserInfo = async (userId: number) => {
  return instance.get<UserProfileInfoVO>(`/user/${userId}/profile`);
};
const changeUserInfo = async (data: UpdateUserProfileDto, userType: UserType) => {
  return instance.put(`/user/profile?type=${userType === UserType.Student ? 'student' : 'stuff'}`, data);
};
const getManager = () => {
  return instance.get<UserProfileVO>('/user/manager');
};

const getWXPusherQrCode = async () => {
  return instance.get<string>('/user/wx-pusher/qr-code');
};

const giveUserAccess = async (userId: number, type: Role = Role.None) => {
  return instance.put(`/user/${userId}/role`, { userRole: type });
};

const getUserStatus = async () => {
  return instance.get<UserStatusVO>('/user/status');
};

const changeUserPhone = async (code: string, type: 'code' | 'wechat', phone?: string) => {
  return instance.put(`/user/phone?type=${type}`, { code, phone });
};

const getUserPhoneCode = async (phone: string) => {
  return instance.get(`/user/phone/code?phone=${phone}`);
};

const getFacultyList = async () => {
  return instance.get<FacultyFatherVO[]>('/user/faculty/list');
};

const deleteAccount = async () => {
  return instance.delete('/user');
};
export default {
  getUserInfo,
  changeUserInfo,
  getManager,
  getWXPusherQrCode,
  giveUserAccess,
  getUserStatus,
  changeUserPhone,
  getUserPhoneCode,
  managerGetUserInfo,
  getFacultyList,
  deleteAccount,
};
