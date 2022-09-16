/** @format */

import {lazy} from 'react';

const A00400 = lazy(() => import('pages/A00400_Provisioning'));
const A00600 = lazy(() => import('pages/A00600_RegularBasicInformation'));
const A00700 = lazy(() => import('pages/A00700_RegularPwdModify'));
const B00300 = lazy(() => import('pages/B00300_Notice'));
const B00600 = lazy(() => import('pages/B00600_More'));
const C00100 = lazy(() => import('pages/C00100_AccountOverview/C00100'));
const C00300 = lazy(() => import('pages/C00300_NtdDeposit/C00300'));
const C00400 = lazy(() => import('pages/C00400_ForeignDeposit/C00400'));
const C00500 = lazy(() => import('pages/C00500_SecsDeposit/C00500'));
const C00600 = lazy(() => import('pages/C00600_DepositPlan/C00600'));
const C00600Transaction = lazy(() => import('pages/C00600_DepositPlan/TransactionPage'));
const C00600Create = lazy(() => import('pages/C00600_DepositPlan/CreatePage'));
const C00600Edit = lazy(() => import('pages/C00600_DepositPlan/EditPage'));
const C00600EditR = lazy(() => import('pages/C00600_DepositPlan/RestrictedEditPage'));
const C00600Detail = lazy(() => import('pages/C00600_DepositPlan/DetailPage'));
const C00700 = lazy(() => import('pages/C00700_CreditCard/C00700'));
const C00700Detail = lazy(() => import('pages/C00700_CreditCard/Details'));
const C00700Reward = lazy(() => import('pages/C00700_CreditCard/Rewards'));
const C00800 = lazy(() => import('pages/C00800_ExportBankBook'));
const C008001 = lazy(() => import('pages/C00800_ExportBankBook/exportBankBook_1'));
const D00100 = lazy(() => import('pages/D00100_NtdTransfer/D00100v2'));
const D001001 = lazy(() => import('pages/D00100_NtdTransfer/D00100_1'));
const D001002 = lazy(() => import('pages/D00100_NtdTransfer/D00100_2'));
const D00300 = lazy(() => import('pages/D00300_CardLessATM'));
const D003001 = lazy(() => import('pages/D00300_CardLessATM/cardLessATM_1'));
const D003002 = lazy(() => import('pages/D00300_CardLessATM/cardLessATM_2'));
const D00400 = lazy(() => import('pages/D00400_CardLessWithDrawChgPwd'));
const D00500 = lazy(() => import('pages/D00500_FrequentContacts/D00500'));
const D00600 = lazy(() => import('pages/D00600_RegisteredContacts/D00600'));
const D00700 = lazy(() => import('pages/D00700_ForeignCurrencyTransfer'));
const D00800 = lazy(() => import('pages/D00800_ReserveTransferSearch'));
const D008001 = lazy(() => import('pages/D00800_ReserveTransferSearch/reserveTransferSearch_1'));
const D008002 = lazy(() => import('pages/D00800_ReserveTransferSearch/reserveTransferSearch_2'));
const E00100 = lazy(() => import('pages/E00100_Exchange/E00100'));
const E001001 = lazy(() => import('pages/E00100_Exchange/E00100_1'));
const E001002 = lazy(() => import('pages/E00100_Exchange/E00100_2'));
const E00200 = lazy(() => import('pages/E00200_ExchangeRate'));
const E00300 = lazy(() => import('pages/E00300_FinancialDepartments'));
const L00200 = lazy(() => import('pages/L00200_Principle'));
const L00100 = lazy(() => import('pages/L00100_Loan/L00100'));
const L00100Detail = lazy(() => import('pages/L00100_Loan/Details'));
const L00100Reward = lazy(() => import('pages/L00100_Loan/Rewards'));
const L00300 = lazy(() => import('pages/L00300_LoanInterest'));
const L003001 = lazy(() => import('pages/L00300_LoanInterest/loanInterest_1'));
const M00100 = lazy(() => import('pages/M00100_Community/M00100'));
const M00200 = lazy(() => import('pages/M00200_FriendSearch/M00200'));
const R00100 = lazy(() => import('pages/R00100_CCTransaction/R00100'));
const R00200 = lazy(() => import('pages/R00200_Instalment/R00200'));
const R00300 = lazy(() => import('pages/R00300_CCBill/R00300'));
const R00400 = lazy(() => import('pages/R00400_CCPayment/R00400'));
const R00400Result = lazy(() => import('pages/R00400_CCPayment/TransferResult'));
const R00500 = lazy(() => import('pages/R00500_AutomaticBillPayment'));
const R00600 = lazy(() => import('pages/R00600_Adjustment'));
const R006001 = lazy(() => import('pages/R00600_Adjustment/adjustment_1'));
const S00400 = lazy(() => import('pages/S00400_NoticeSetting'));
const S00600 = lazy(() => import('pages/S00600_QandA'));
const T00100 = lazy(() => import('pages/T00100_Profile/T00100'));
const T00200 = lazy(() => import('pages/T00200_QuickLoginSetting'));
const T00400 = lazy(() => import('pages/T00400_CardLessSetting'));
const T00600 = lazy(() => import('pages/T00600_MobileTransfer'));
const T006001 = lazy(() => import('pages/T00600_MobileTransfer/mobileTransfer_1'));
const T006002 = lazy(() => import('pages/T00600_MobileTransfer/mobileTransfer_2'));
const T00700 = lazy(() => import('pages/T00700_BasicInformation'));
const T00800 = lazy(() => import('pages/T00800_ChangeUserName'));
const T00900 = lazy(() => import('pages/T00900_PwdModify'));

const LossReissue = lazy(() => import('pages/LossReissue'));
const AccountMaintenance = lazy(() => import('pages/AccountMaintenance'));
const BillPay = lazy(() => import('pages/BillPay'));
const BillPay1 = lazy(() => import('pages/BillPay/billPay_1'));
const DepositPlus = lazy(() => import('pages/C00300_NtdDeposit/DepositPlus'));
const NicknameSetting = lazy(() => import('pages/NicknameSetting'));
const PatternLockSetting = lazy(() => import('pages/PatternLockSetting'));
const FingerPrintLockSetting = lazy(() => import('pages/FingerPrintLockSetting'));
const SMSOTPactivate = lazy(() => import('pages/SMSOTPactivate'));
const ProjectJ = lazy(() => import('pages/ProjectJ'));
const LoanInquiry = lazy(() => import('pages/LoanInquiry'));
const Deduct = lazy(() => import('pages/Deduct'));
const Deduct1 = lazy(() => import('pages/Deduct/deduct1'));
const Deduct2 = lazy(() => import('pages/Deduct/deduct2'));
const Deduct3 = lazy(() => import('pages/Deduct/deduct3'));
const MoreTranscations = lazy(() => import('pages/MoreTranscations'));
// prettier-ignore
const ForeignCurrencyTransfer1 = lazy(() => import('pages/D00700_ForeignCurrencyTransfer/foreignCurrencyTransfer_1'));
// prettier-ignore
const ForeignCurrencyTransfer2 = lazy(() => import('pages/D00700_ForeignCurrencyTransfer/foreignCurrencyTransfer_2'));
const ForeignCurrencyPriceSetting = lazy(() => import('pages/ForeignCurrencyPriceSetting'));
const R002001 = lazy(() => import('pages/R00200_Instalment/R00200_1'));
const R002002 = lazy(() => import('pages/R00200_Instalment/R00200_2'));
const R002003 = lazy(() => import('pages/R00200_Instalment/R00200_3'));

// TODO：支援開發及Prototype測試使用
const Login = lazy(() => import('proto/Login/login'));
const Nav = lazy(() => import('proto/Nav/Nav'));
// --------------------------------

const routes = [
  {path: '/A00400', exact: false, component: A00400},
  {path: '/A00600', exact: false, component: A00600},
  {path: '/A00700', exact: false, component: A00700},
  {path: '/B00300', exact: false, component: B00300},
  {path: '/B00600', exact: false, component: B00600},
  {path: '/C00100', exact: false, component: C00100},
  {path: '/C00300', exact: false, component: C00300},
  {path: '/C00400', exact: false, component: C00400},
  {path: '/C00500', exact: false, component: C00500},
  {path: '/C00600', exact: false, component: C00600},
  {path: '/C006001', exact: false, component: C00600Transaction},
  {path: '/C006002', exact: false, component: C00600Create},
  {path: '/C006003', exact: false, component: C00600Edit},
  {path: '/C006004', exact: false, component: C00600Detail},
  {path: '/C006005', exact: false, component: C00600EditR},
  {path: '/C00700', exact: false, component: C00700},
  {path: '/C007001', exact: false, component: C00700Detail},
  {path: '/C007002', exact: false, component: C00700Reward},
  {path: '/C00800', exact: false, component: C00800},
  {path: '/C008001', exact: false, component: C008001},
  {path: '/D00100', exact: false, component: D00100},
  {path: '/D001001', exact: false, component: D001001},
  {path: '/D001002', exact: false, component: D001002},
  {path: '/D00300', exact: true, component: D00300},
  {path: '/D003001', exact: false, component: D003001},
  {path: '/D003002', exact: false, component: D003002},
  {path: '/D00400', exact: false, component: D00400},
  {path: '/D00500', exact: false, component: D00500},
  {path: '/D00600', exact: false, component: D00600},
  {path: '/D00700', exact: false, component: D00700},
  {path: '/D00800', exact: false, component: D00800},
  {path: '/D008001', exact: false, component: D008001},
  {path: '/D008002', exact: false, component: D008002},
  {path: '/E00100', exact: false, component: E00100},
  {path: '/E001001', exact: false, component: E001001},
  {path: '/E001002', exact: false, component: E001002},
  {path: '/E00200', exact: false, component: E00200},
  {path: '/E00300', exact: false, component: E00300},
  {path: '/L00200', exact: false, component: L00200},
  {path: '/L00100', exact: false, component: L00100},
  {path: '/L001001', exact: false, component: L00100Reward},
  {path: '/L001002', exact: false, component: L00100Detail},
  {path: '/L00300', exact: false, component: L00300},
  {path: '/L003001', exact: false, component: L003001},
  {path: '/M00100', exact: false, component: M00100},
  {path: '/M00200', exact: false, component: M00200},
  {path: '/R00100', exact: false, component: R00100},
  {path: '/R00200', exact: false, component: R00200},
  {path: '/R002001', exact: false, component: R002001},
  {path: '/R002002', exact: false, component: R002002},
  {path: '/R002003', exact: false, component: R002003},
  {path: '/R00300', exact: false, component: R00300},
  {path: '/R00400', exact: false, component: R00400},
  {path: '/R004001', exact: false, component: R00400Result},
  {path: '/R00500', exact: false, component: R00500},
  {path: '/R00600', exact: false, component: R00600},
  {path: '/R006001', exact: false, component: R006001},
  {path: '/S00400', exact: true, component: S00400},
  {path: '/S00600', exact: false, component: S00600},
  {path: '/T00100', exact: false, component: T00100},
  {path: '/T00600', exact: false, component: T00600},
  {path: '/T006001', exact: false, component: T006001},
  {path: '/T006002', exact: false, component: T006002},
  {path: '/T00200', exact: false, component: T00200},
  {path: '/T00400', exact: false, component: T00400},
  {path: '/T00700', exact: false, component: T00700},
  {path: '/T00800', exact: false, component: T00800},
  {path: '/T00900', exact: false, component: T00900},

  // 缺 function id
  {path: '/lossReissue', exact: false, component: LossReissue},
  {path: '/accountMaintenance', exact: false, component: AccountMaintenance},
  {path: '/billPay', exact: true, component: BillPay},
  {path: '/billPay1', exact: false, component: BillPay1},
  {path: '/depositPlus', exact: false, component: DepositPlus},
  {path: '/nicknameSetting', exact: false, component: NicknameSetting},
  {path: '/patternLockSetting', exact: false, component: PatternLockSetting},
  {
    path: '/fingerPrintLockSetting',
    exact: false,
    component: FingerPrintLockSetting,
  },
  {path: '/smsOTPactivate', exact: false, component: SMSOTPactivate},
  {path: '/projectJ', exact: false, component: ProjectJ},
  {path: '/loanInquiry', exact: false, component: LoanInquiry},
  {path: '/moreTranscations', exact: false, component: MoreTranscations},
  {
    path: '/foreignCurrencyPriceSetting',
    exact: false,
    component: ForeignCurrencyPriceSetting,
  },
  {
    path: '/foreignCurrencyTransfer1',
    exact: false,
    component: ForeignCurrencyTransfer1,
  },
  {
    path: '/foreignCurrencyTransfer2',
    exact: false,
    component: ForeignCurrencyTransfer2,
  },
  {path: '/deduct', exact: false, component: Deduct},
  {path: '/deduct1', exact: false, component: Deduct1},
  {path: '/deduct2', exact: false, component: Deduct2},
  {path: '/deduct3', exact: false, component: Deduct3},

  // TODO：支援開發及Prototype測試使用
  {path: '/login', exact: false, component: Login},
  {path: '/', exact: true, component: Nav},
  // --------------------------------
];

export default routes;
