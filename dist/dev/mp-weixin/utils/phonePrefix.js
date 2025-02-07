"use strict";
var PhonePrefix = /* @__PURE__ */ ((PhonePrefix2) => {
  PhonePrefix2["China"] = "+86";
  PhonePrefix2["HongKong"] = "+852";
  PhonePrefix2["Macao"] = "+853";
  PhonePrefix2["Taiwan"] = "+886";
  return PhonePrefix2;
})(PhonePrefix || {});
const ChinaReg = /^1[3456789][0-9]{9}$/;
const HongKongReg = /^[569]\d{7}$/;
const MacaoReg = /^6\d{7}$/;
const TaiwanReg = /^09\d{8}$/;
const checkPhoneReg = (prefix, phoneNum) => {
  switch (prefix) {
    case "+86":
      return ChinaReg.test(phoneNum);
    case "+852":
      return HongKongReg.test(phoneNum);
    case "+853":
      return MacaoReg.test(phoneNum);
    case "+886":
      return TaiwanReg.test(phoneNum);
    default:
      return false;
  }
};
exports.PhonePrefix = PhonePrefix;
exports.checkPhoneReg = checkPhoneReg;
