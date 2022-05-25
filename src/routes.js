import { lazy } from 'react';

/* 轉帳靜態頁 (for prototype) */
// import TransferStatic from 'pages/TransferStatic';
// import TransferStatic1 from 'pages/TransferStatic/transfer_1';
// import TransferStatic2 from 'pages/TransferStatic/transfer_2';
const TransferStatic = lazy(() => import('pages/TransferStatic'));
const TransferStatic1 = lazy(() => import('pages/TransferStatic/transfer_1'));
const TransferStatic2 = lazy(() => import('pages/TransferStatic/transfer_2'));

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
const C006001 = lazy(() => import('pages/C00600_DepositPlan/DetailsPage'));
const C00800 = lazy(() => import('pages/C00800_ExportBankBook'));
const C008001 = lazy(() => import('pages/C00800_ExportBankBook/exportBankBook_1'));
const D00100 = lazy(() => import('pages/D00100_NtdTransfer/D00100'));
const D001001 = lazy(() => import('pages/D00100_NtdTransfer/D00100_1'));
const D001002 = lazy(() => import('pages/D00100_NtdTransfer/D00100_2'));
const D00300 = lazy(() => import('pages/D00300_CardLessATM'));
const D003001 = lazy(() => import('pages/D00300_CardLessATM/cardLessATM_1'));
const D003002 = lazy(() => import('pages/D00300_CardLessATM/cardLessATM_2'));
const D003003 = lazy(() => import('pages/D00300_CardLessATM/cardLessWithDrawChgPwd'));
const E00100 = lazy(() => import('pages/E00100_Exchange'));
const E001001 = lazy(() => import('pages/E00100_Exchange/exchange_1'));
const E001002 = lazy(() => import('pages/E00100_Exchange/exchange_2'));
const E00200 = lazy(() => import('pages/E00200_ExchangeRate'));
const E00300 = lazy(() => import('pages/E00300_FinancialDepartments'));
const M00100 = lazy(() => import('pages/M00100_Community/M00100'));
const S00300 = lazy(() => import('pages/S00300_ReserveTransferSearch'));
const S003001 = lazy(() => import('pages/S00300_ReserveTransferSearch/reserveTransferSearch_1'));
const S003002 = lazy(() => import('pages/S00300_ReserveTransferSearch/reserveTransferSearch_2'));
const S00400 = lazy(() => import('pages/S00400_NoticeSetting'));
const S00600 = lazy(() => import('pages/S00600_QandA'));
const T00100 = lazy(() => import('pages/T00100_Profile'));
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
const DepositPlus = lazy(() => import('pages/DepositPlus'));
const NicknameSetting = lazy(() => import('pages/NicknameSetting'));
const PatternLockSetting = lazy(() => import('pages/PatternLockSetting'));
const FingerPrintLockSetting = lazy(() => import('pages/FingerPrintLockSetting'));
const SMSOTPactivate = lazy(() => import('pages/SMSOTPactivate'));
const QRCodeTransfer = lazy(() => import('pages/QRCodeTransfer'));
const Adjustment = lazy(() => import('pages/Adjustment'));
const Adjustment1 = lazy(() => import('pages/Adjustment/adjustment_1'));
const ProjectJ = lazy(() => import('pages/ProjectJ'));
const LoanInquiry = lazy(() => import('pages/LoanInquiry'));
const LoanInterest = lazy(() => import('pages/LoanInterest'));
const Deduct = lazy(() => import('pages/Deduct'));
const Deduct1 = lazy(() => import('pages/Deduct/deduct1'));
const Deduct2 = lazy(() => import('pages/Deduct/deduct2'));
const Deduct3 = lazy(() => import('pages/Deduct/deduct3'));
const MoreTranscations = lazy(() => import('pages/MoreTranscations'));
const ForeignCurrencyTransfer = lazy(() => import('pages/ForeignCurrencyTransfer'));
const ForeignCurrencyTransfer1 = lazy(() => import('pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_1'));
const ForeignCurrencyTransfer2 = lazy(() => import('pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_2'));
const ForeignCurrencyPriceSetting = lazy(() => import('pages/ForeignCurrencyPriceSetting'));
const QuickLoginSetting = lazy(() => import('pages/QuickLoginSetting'));
const Instalment = lazy(() => import('pages/Instalment'));
const Instalment1 = lazy(() => import('pages/Instalment/Instalment_1'));
const Instalment2 = lazy(() => import('pages/Instalment/Instalment_2'));
const Instalment3 = lazy(() => import('pages/Instalment/Instalment_3'));
const AutomaticBillPayment = lazy(() => import('pages/AutomaticBillPayment'));

// TODO：支援開發及Prototype測試使用
const Login = lazy(() => import('proto/Login/login'));
const Tutorials = lazy(() => import('proto/Tutorials'));
const Nav = lazy(() => import('proto/Nav/Nav'));
// --------------------------------

const routes = [
  { path: '/A00400', exact: false, component: A00400 },
  { path: '/A00600', exact: false, component: A00600 },
  { path: '/A00700', exact: false, component: A00700 },
  { path: '/B00300', exact: false, component: B00300 },
  { path: '/B00600', exact: false, component: B00600 },
  { path: '/C00100', exact: false, component: C00100 },
  { path: '/C00300', exact: false, component: C00300 },
  { path: '/C00400', exact: false, component: C00400 },
  { path: '/C00500', exact: false, component: C00500 },
  { path: '/C00600', exact: false, component: C00600 },
  { path: '/C006001', exact: false, component: C006001 },
  { path: '/C00800', exact: false, component: C00800 },
  { path: '/C008001', exact: false, component: C008001 },
  { path: '/D00100', exact: false, component: D00100 },
  { path: '/D001001', exact: false, component: D001001 },
  { path: '/D001002', exact: false, component: D001002 },
  { path: '/D00300', exact: true, component: D00300 },
  { path: '/D003001', exact: false, component: D003001 },
  { path: '/D003002', exact: false, component: D003002 },
  { path: '/D003003', exact: false, component: D003003 },
  { path: '/E00100', exact: false, component: E00100 },
  { path: '/E001001', exact: false, component: E001001 },
  { path: '/E001002', exact: false, component: E001002 },
  { path: '/E00200', exact: false, component: E00200 },
  { path: '/E00300', exact: false, component: E00300 },
  { path: '/M00100', exact: false, component: M00100 },
  { path: '/S00300', exact: false, component: S00300 },
  { path: '/S003001', exact: false, component: S003001 },
  { path: '/S003002', exact: false, component: S003002 },
  { path: '/S00400', exact: true, component: S00400 },
  { path: '/S00600', exact: false, component: S00600 },
  { path: '/T00100', exact: false, component: T00100 },
  { path: '/T00600', exact: false, component: T00600 },
  { path: '/T006001', exact: false, component: T006001 },
  { path: '/T006002', exact: false, component: T006002 },
  { path: '/T00200', exact: false, component: QuickLoginSetting },
  { path: '/T00700', exact: false, component: T00700 },
  { path: '/T00800', exact: false, component: T00800 },
  { path: '/T00900', exact: false, component: T00900 },

  { path: '/lossReissue', exact: false, component: LossReissue },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
  { path: '/billPay', exact: true, component: BillPay },
  { path: '/billPay1', exact: false, component: BillPay1 },
  { path: '/depositPlus', exact: false, component: DepositPlus },
  { path: '/nicknameSetting', exact: false, component: NicknameSetting },
  { path: '/patternLockSetting', exact: false, component: PatternLockSetting },
  { path: '/fingerPrintLockSetting', exact: false, component: FingerPrintLockSetting },
  { path: '/smsOTPactivate', exact: false, component: SMSOTPactivate },
  { path: '/QRCodeTransfer', exact: false, component: QRCodeTransfer },
  { path: '/adjustment', exact: false, component: Adjustment },
  { path: '/adjustment1', exact: false, component: Adjustment1 },
  { path: '/projectJ', exact: false, component: ProjectJ },
  { path: '/loanInquiry', exact: false, component: LoanInquiry },
  { path: '/loanInterest', exact: false, component: LoanInterest },
  { path: '/moreTranscations', exact: false, component: MoreTranscations },
  { path: '/foreignCurrencyPriceSetting', exact: false, component: ForeignCurrencyPriceSetting },
  { path: '/quickLoginSetting', exact: false, component: QuickLoginSetting },
  { path: '/transferStatic', exact: false, component: TransferStatic },
  { path: '/transferStatic1', exact: false, component: TransferStatic1 },
  { path: '/transferStatic2', exact: false, component: TransferStatic2 },
  { path: '/staging', exact: false, component: Instalment },
  { path: '/staging1', exact: false, component: Instalment1 },
  { path: '/staging2', exact: false, component: Instalment2 },
  { path: '/staging3', exact: false, component: Instalment3 },
  { path: '/withholding', exact: false, component: AutomaticBillPayment },
  { path: '/foreignCurrencyTransfer', exact: false, component: ForeignCurrencyTransfer },
  { path: '/foreignCurrencyTransfer1', exact: false, component: ForeignCurrencyTransfer1 },
  { path: '/foreignCurrencyTransfer2', exact: false, component: ForeignCurrencyTransfer2 },
  { path: '/deduct', exact: false, component: Deduct },
  { path: '/deduct1', exact: false, component: Deduct1 },
  { path: '/deduct2', exact: false, component: Deduct2 },
  { path: '/deduct3', exact: false, component: Deduct3 },

  // 以下若程式中沒有用到，就應該刪除。
  { path: '/changeUserName', exact: false, component: T00800 },
  { path: '/cardLessATM', exact: true, component: D00300 },
  { path: '/cardLessATM1', exact: false, component: D003001 },
  { path: '/cardLessATM2', exact: false, component: D003002 },
  { path: '/cardLessWithDrawChgPwd', exact: false, component: D003003 },
  { path: '/noticeSetting', exact: true, component: S00400 },
  { path: '/notice', exact: false, component: B00300 },
  { path: '/regularPwdModify', exact: false, component: A00700 },
  { path: '/basicInformation', exact: false, component: T00700 },
  { path: '/provisioning', exact: false, component: A00400 },
  { path: '/qAndA', exact: false, component: S00600 },
  { path: '/exchange', exact: false, component: E00100 },
  { path: '/exchange1', exact: false, component: E001001 },
  { path: '/exchange2', exact: false, component: E001002 },
  { path: '/profile', exact: false, component: T00100 },
  { path: '/financialDepartments', exact: false, component: E00300 },
  { path: '/regularBasicInformation', exact: false, component: A00600 },
  { path: '/reserveTransferSearch', exact: false, component: S00300 },
  { path: '/reserveTransferSearch1', exact: false, component: S003001 },
  { path: '/reserveTransferSearch2', exact: false, component: S003002 },
  { path: '/mobileTransfer', exact: false, component: T00600 },
  { path: '/mobileTransfer1', exact: false, component: T006001 },
  { path: '/mobileTransfer2', exact: false, component: T006002 },
  { path: '/exportBankBook', exact: false, component: C00800 },
  { path: '/exportBankBook1', exact: false, component: C008001 },
  { path: '/exchangeRate', exact: false, component: E00200 },
  { path: '/pwdModify', exact: false, component: T00900 },

  // TODO：支援開發及Prototype測試使用
  { path: '/login', exact: false, component: Login },
  { path: '/tutorials', exact: false, component: Tutorials },
  { path: '/', exact: true, component: Nav },
  // --------------------------------
];

export default routes;
