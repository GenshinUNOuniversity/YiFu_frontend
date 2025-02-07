/*
 * @Author: Little_WeakDuck
 * @Date: 2023-10-17 16:02:00
 * @LastEditors: Little_WeakDuck
 * @LastEditTime: 2023-10-17 16:36:41
 * @FilePath: /src/utils/phonePrefix.ts
 * @Description: phone Prefix
 */

export enum PhonePrefix {
  'China' = '+86',
  'HongKong' = '+852',
  'Macao' = '+853',
  'Taiwan' = '+886',
}

const ChinaReg = /^1[3456789][0-9]{9}$/;
const HongKongReg = /^[569]\d{7}$/;
const MacaoReg = /^6\d{7}$/;
const TaiwanReg = /^09\d{8}$/;

export const checkPhoneReg = (prefix: PhonePrefix, phoneNum: string) => {
  switch (prefix) {
    case PhonePrefix.China:
      return ChinaReg.test(phoneNum);

    case PhonePrefix.HongKong:
      return HongKongReg.test(phoneNum);
    case PhonePrefix.Macao:
      return MacaoReg.test(phoneNum);
    case PhonePrefix.Taiwan:
      return TaiwanReg.test(phoneNum);
    default:
      return false;
  }
};
