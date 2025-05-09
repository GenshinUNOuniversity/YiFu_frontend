/*
 * @Author: Little_WeakDuck
 * @Date: 2023-10-01 22:50:37
 * @LastEditors: Little_WeakDuck
 * @LastEditTime: 2023-10-02 00:08:00
 * @FilePath: /src/utils/status.ts
 * @Description: status setting
 */

import api from '@/api';

export enum UserScooterStatus {
  Normal = 'NORMAL',
  None = 'NONE',
  Auditing = 'AUDITING',
}

export const getUserScooterStatus = () => {
  return new Promise<UserScooterStatus>(async (resolve, reject) => {
    try {
      const {
        data: { data: scooterList },
      } = await api.getUserScooterList({
        pageNum: 1,
        pageSize: 500,
      });

      const normalAndAuditingScooterList = scooterList.filter((scooter) => {
        return scooter.status === 'Normal' || scooter.status === 'Auditing';
      });
      if (normalAndAuditingScooterList.length === 0) {
        uni.setStorageSync('ScooterStatus', UserScooterStatus.None);
        resolve(UserScooterStatus.None);
      }

      const auditingScooterList = normalAndAuditingScooterList.filter((scooter) => {
        return scooter.status === 'Auditing';
      });
      if (auditingScooterList.length !== 0) {
        uni.setStorageSync('ScooterStatus', UserScooterStatus.Auditing);
        resolve(UserScooterStatus.Auditing);
      }

      uni.setStorageSync('ScooterStatus', UserScooterStatus.Normal);
      resolve(UserScooterStatus.Normal);
    } catch (error) {
      reject(error);
    }
  });
};
