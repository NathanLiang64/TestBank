/** @format */

import { Func } from 'utilities/FuncID';

const T00100settingList = [
  {
    name: '快速登入設定',
    route: '/quickLoginSetting',
    funcID: Func.T002.id,
  },
  // {
  //   name: '行動裝置綁定',
  //   route: '',
  //   funcID: 'T00300',
  // },
  // {
  //   name: '簡訊 OTP 設定',
  //   route: '/smsOTPactivate',
  //   funcID: 'T00400',
  // },
  // {
  //   name: '行動守護精靈設定',
  //   route: '',
  //   funcID: 'T00500',
  // },
  {
    name: '非約定轉帳設定',
    route: '/T00300',
    funcID: Func.T003.id,
  },
  {
    name: '無卡提款設定',
    route: '/cardLessSetting',
    funcID: Func.T004.id,
  },
  // {
  //   name: '行動金融憑證設定',
  //   route: '',
  //   funcID: '0',
  // },
  {
    name: '基本資料變更',
    route: '/basicInformation',
    funcID: Func.T007.id,
  },
  // {
  //   name: '手機號碼收款設定',
  //   route: '/mobileTransfer',
  //   funcID: 'T00600',
  // },
  {
    name: '使用者代號變更',
    route: '/changeUserName',
    funcID: Func.T008.id,
  },
  {
    name: '網銀密碼變更',
    route: '/pwdModify',
    funcID: Func.T009.id,
  },
  {
    name: '搖一搖功能設定',
    route: '',
    funcID: Func.Z99997.id,
  },
];

export default T00100settingList;
