import { lazy } from 'react';

/* Components */
// import Login from 'pages/Login';
// import Test from 'pages/Test';
// import CardLessATM from 'pages/CardLessATM';
// import CardLessATM1 from 'pages/CardLessATM/cardLessATM_1';
// import CardLessATM2 from 'pages/CardLessATM/cardLessATM_2';
// import CardLessWithDrawChgPwd from 'pages/CardLessATM/cardLessWithDrawChgPwd';
// import LossReissue from 'pages/LossReissue';
// import LossReissue2 from 'pages/LossReissue/lossReissue_2';
// import AccountMaintenance from 'pages/AccountMaintenance';
// import BillPay from 'pages/BillPay';
// import BillPay1 from 'pages/BillPay/billPay_1';
// import DepositOverview from 'pages/DepositOverview';
// import DepositInquiry from 'pages/DepositInquiry';
// import DepositPlus from 'pages/DepositPlus';
// import NicknameSetting from 'pages/NicknameSetting';
// import NoticeSetting from 'pages/NoticeSetting';
// import PatternLockSetting from 'pages/PatternLockSetting';
// import Notice from 'pages/Notice';
// import FingerPrintLockSetting from 'pages/FingerPrintLockSetting';
// import ChangeUserName from 'pages/ChangeUserName';
// import PwdModify from 'pages/PwdModify';
// import RegularPwdModify from 'pages/RegularPwdModify';
// import SMSOTPactivate from 'pages/SMSOTPactivate';
// import QRCodeTransfer from 'pages/QRCodeTransfer';
// import Adjustment from 'pages/Adjustment';
// import Adjustment1 from 'pages/Adjustment/adjustment_1';
// import ProjectJ from 'pages/ProjectJ';
// import LoanInquiry from 'pages/LoanInquiry';
// import LoanInterest from 'pages/LoanInterest';
// import BasicInformation from 'pages/BasicInformation';
// import QandA from 'pages/QandA';
// import Provisioning from 'pages/Provisioning';
// import Deduct from 'pages/Deduct';
// import Deduct1 from 'pages/Deduct/deduct1';
// import Deduct2 from 'pages/Deduct/deduct2';
// import Deduct3 from 'pages/Deduct/deduct3';
// import Exchange from 'pages/Exchange';
// import Exchange1 from 'pages/Exchange/exchange_1';
// import Exchange2 from 'pages/Exchange/exchange_2';
// import Transfer from 'pages/Transfer';
// import Transfer1 from 'pages/Transfer/transfer_1';
// import Transfer2 from 'pages/Transfer/transfer_2';
// import Profile from 'pages/Profile';
// import More from 'pages/More';
// import FinancialDepartments from 'pages/FinancialDepartments';
// import Network from 'pages/Network';
// import TradingAccount from 'pages/TradingAccount';
// import TradingAccountDetails from 'pages/TradingAccountDetails';
// import TaiwanDollarAccount from 'pages/TaiwanDollarAccount';
// import TaiwanDollarAccountDetails from 'pages/TaiwanDollarAccountDetails';
// import ForeignCurrencyAccount from 'pages/ForeignCurrencyAccount';
// import ForeignCurrencyAccountDetails from 'pages/ForeignCurrencyAccountDetails';
// import RegularBasicInformation from 'pages/RegularBasicInformation';
// import ExportBankBook from 'pages/ExportBankBook';
// import ExportBankBook1 from 'pages/ExportBankBook/exportBankBook_1';
// import ForeignCurrencyTransfer from 'pages/ForeignCurrencyTransfer';
// import ForeignCurrencyTransfer1 from 'pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_1';
// import ForeignCurrencyTransfer2 from 'pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_2';
// import ReserveTransferSearch from 'pages/ReserveTransferSearch';
// import ReserveTransferSearch1 from 'pages/ReserveTransferSearch/reserveTransferSearch_1';
// import ReserveTransferSearch2 from 'pages/ReserveTransferSearch/reserveTransferSearch_2';
// import MobileTransfer from 'pages/MobileTransfer';
// import MobileTransfer1 from 'pages/MobileTransfer/mobileTransfer_1';
// import MobileTransfer2 from 'pages/MobileTransfer/mobileTransfer_2';
// import ForeignCurrencyPriceSetting from 'pages/ForeignCurrencyPriceSetting';
// import QuickLoginSetting from 'pages/QuickLoginSetting';
// import Instalment from 'pages/Instalment';
// import AutomaticBillPayment from 'pages/AutomaticBillPayment';

/* 轉帳靜態頁 (for prototype) */
// import TransferStatic from 'pages/TransferStatic';
// import TransferStatic1 from 'pages/TransferStatic/transfer_1';
// import TransferStatic2 from 'pages/TransferStatic/transfer_2';
const TransferStatic = lazy(() => import('pages/TransferStatic'));
const TransferStatic1 = lazy(() => import('pages/TransferStatic/transfer_1'));
const TransferStatic2 = lazy(() => import('pages/TransferStatic/transfer_2'));

/* Tutorials (for prototype) */
// import Tutorials from 'pages/Tutorials';

const CardLessATM = lazy(() => import('pages/CardLessATM'));
const CardLessATM1 = lazy(() => import('pages/CardLessATM/cardLessATM_1'));
const CardLessATM2 = lazy(() => import('pages/CardLessATM/cardLessATM_2'));
const CardLessWithDrawChgPwd = lazy(() => import('pages/CardLessATM/cardLessWithDrawChgPwd'));
const LossReissue = lazy(() => import('pages/LossReissue'));
const AccountMaintenance = lazy(() => import('pages/AccountMaintenance'));
const BillPay = lazy(() => import('pages/BillPay'));
const BillPay1 = lazy(() => import('pages/BillPay/billPay_1'));
const More = lazy(() => import('pages/More'));
const DepositPlus = lazy(() => import('pages/DepositPlus'));
const NicknameSetting = lazy(() => import('pages/NicknameSetting'));
const NoticeSetting = lazy(() => import('pages/NoticeSetting'));
const PatternLockSetting = lazy(() => import('pages/PatternLockSetting'));
const Notice = lazy(() => import('pages/Notice'));
const FingerPrintLockSetting = lazy(() => import('pages/FingerPrintLockSetting'));
const ChangeUserName = lazy(() => import('pages/ChangeUserName'));
const PwdModify = lazy(() => import('pages/PwdModify'));
const RegularPwdModify = lazy(() => import('pages/RegularPwdModify'));
const SMSOTPactivate = lazy(() => import('pages/SMSOTPactivate'));
const QRCodeTransfer = lazy(() => import('pages/QRCodeTransfer'));
const Adjustment = lazy(() => import('pages/Adjustment'));
const Adjustment1 = lazy(() => import('pages/Adjustment/adjustment_1'));
const ProjectJ = lazy(() => import('pages/ProjectJ'));
const LoanInquiry = lazy(() => import('pages/LoanInquiry'));
const LoanInterest = lazy(() => import('pages/LoanInterest'));
const BasicInformation = lazy(() => import('pages/BasicInformation'));
const QandA = lazy(() => import('pages/QandA'));
const Provisioning = lazy(() => import('pages/Provisioning'));
const Deduct = lazy(() => import('pages/Deduct'));
const Deduct1 = lazy(() => import('pages/Deduct/deduct1'));
const Deduct2 = lazy(() => import('pages/Deduct/deduct2'));
const Deduct3 = lazy(() => import('pages/Deduct/deduct3'));
const Exchange = lazy(() => import('pages/Exchange'));
const Exchange1 = lazy(() => import('pages/Exchange/exchange_1'));
const Exchange2 = lazy(() => import('pages/Exchange/exchange_2'));
const Transfer = lazy(() => import('pages/Transfer'));
const Transfer1 = lazy(() => import('pages/Transfer/transfer_1'));
const Transfer2 = lazy(() => import('pages/Transfer/transfer_2'));
const Profile = lazy(() => import('pages/Profile'));
const FinancialDepartments = lazy(() => import('pages/FinancialDepartments'));
const Network = lazy(() => import('pages/Network'));
const TradingAccount = lazy(() => import('pages/TradingAccount'));
const TradingAccountDetails = lazy(() => import('pages/TradingAccountDetails'));
const TaiwanDollarAccount = lazy(() => import('pages/TaiwanDollarAccount'));
const TaiwanDollarAccountDetails = lazy(() => import('pages/TaiwanDollarAccountDetails'));
const ForeignCurrencyAccount = lazy(() => import('pages/ForeignCurrencyAccount'));
const ForeignCurrencyAccountDetails = lazy(() => import('pages/ForeignCurrencyAccountDetails'));
const RegularBasicInformation = lazy(() => import('pages/RegularBasicInformation'));
const ExportBankBook = lazy(() => import('pages/ExportBankBook'));
const ExportBankBook1 = lazy(() => import('pages/ExportBankBook/exportBankBook_1'));
const ForeignCurrencyTransfer = lazy(() => import('pages/ForeignCurrencyTransfer'));
const ForeignCurrencyTransfer1 = lazy(() => import('pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_1'));
const ForeignCurrencyTransfer2 = lazy(() => import('pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_2'));
const ReserveTransferSearch = lazy(() => import('pages/ReserveTransferSearch'));
const ReserveTransferSearch1 = lazy(() => import('pages/ReserveTransferSearch/reserveTransferSearch_1'));
const ReserveTransferSearch2 = lazy(() => import('pages/ReserveTransferSearch/reserveTransferSearch_2'));
const MobileTransfer = lazy(() => import('pages/MobileTransfer'));
const MobileTransfer1 = lazy(() => import('pages/MobileTransfer/mobileTransfer_1'));
const MobileTransfer2 = lazy(() => import('pages/MobileTransfer/mobileTransfer_2'));
const ForeignCurrencyPriceSetting = lazy(() => import('pages/ForeignCurrencyPriceSetting'));
const QuickLoginSetting = lazy(() => import('pages/QuickLoginSetting'));
const Instalment = lazy(() => import('pages/Instalment'));
const Instalment1 = lazy(() => import('pages/Instalment/Instalment_1'));
const Instalment2 = lazy(() => import('pages/Instalment/Instalment_2'));
const Instalment3 = lazy(() => import('pages/Instalment/Instalment_3'));
const AutomaticBillPayment = lazy(() => import('pages/AutomaticBillPayment'));
const ExchangeRate = lazy(() => import('pages/ExchangeRate'));

// TODO：支援開發及Prototype測試使用
const Login = lazy(() => import('proto/Login/login'));
const Tutorials = lazy(() => import('proto/Tutorials'));
// const Test = lazy(() => import('proto/Test'));
const Nav = lazy(() => import('proto/Nav/Nav'));
// --------------------------------

const routes = [
  { path: '/D00300', exact: true, component: CardLessATM },
  { path: '/cardLessATM', exact: true, component: CardLessATM },
  { path: '/cardLessATM1', exact: false, component: CardLessATM1 },
  { path: '/cardLessATM2', exact: false, component: CardLessATM2 },
  { path: '/cardLessWithDrawChgPwd', exact: false, component: CardLessWithDrawChgPwd },
  { path: '/lossReissue', exact: false, component: LossReissue },
  // { path: '/lossReissue2', exact: false, component: LossReissue2 },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
  { path: '/billPay', exact: true, component: BillPay },
  { path: '/billPay1', exact: false, component: BillPay1 },
  // { path: '/depositOverview', exact: false, component: DepositOverview },
  // { path: '/depositInquiry', exact: false, component: DepositInquiry },
  { path: '/depositPlus', exact: false, component: DepositPlus },
  { path: '/noticeSetting', exact: true, component: NoticeSetting },
  { path: '/nicknameSetting', exact: false, component: NicknameSetting },
  { path: '/patternLockSetting', exact: false, component: PatternLockSetting },
  { path: '/notice', exact: false, component: Notice },
  { path: '/fingerPrintLockSetting', exact: false, component: FingerPrintLockSetting },
  { path: '/changeUserName', exact: false, component: ChangeUserName },
  { path: '/pwdModify', exact: false, component: PwdModify },
  { path: '/regularPwdModify', exact: false, component: RegularPwdModify },
  { path: '/smsOTPactivate', exact: false, component: SMSOTPactivate },
  { path: '/QRCodeTransfer', exact: false, component: QRCodeTransfer },
  { path: '/adjustment', exact: false, component: Adjustment },
  { path: '/adjustment1', exact: false, component: Adjustment1 },
  { path: '/projectJ', exact: false, component: ProjectJ },
  { path: '/loanInquiry', exact: false, component: LoanInquiry },
  { path: '/loanInterest', exact: false, component: LoanInterest },
  { path: '/basicInformation', exact: false, component: BasicInformation },
  { path: '/qAndA', exact: false, component: QandA },
  { path: '/provisioning', exact: false, component: Provisioning },
  { path: '/deduct', exact: false, component: Deduct },
  { path: '/deduct1', exact: false, component: Deduct1 },
  { path: '/deduct2', exact: false, component: Deduct2 },
  { path: '/deduct3', exact: false, component: Deduct3 },
  { path: '/exchange', exact: false, component: Exchange },
  { path: '/exchange1', exact: false, component: Exchange1 },
  { path: '/exchange2', exact: false, component: Exchange2 },
  { path: '/transfer', exact: false, component: Transfer },
  { path: '/D00100', exact: false, component: Transfer },
  { path: '/transfer1', exact: false, component: Transfer1 },
  { path: '/transfer2', exact: false, component: Transfer2 },
  { path: '/profile', exact: false, component: Profile },
  { path: '/more', exact: false, component: More },
  { path: '/financialDepartments', exact: false, component: FinancialDepartments },
  { path: '/network', exact: false, component: Network },
  { path: '/C00300', exact: false, component: TaiwanDollarAccount },
  { path: '/taiwanDollarAccount', exact: false, component: TaiwanDollarAccount },
  { path: '/taiwanDollarAccountDetails', exact: false, component: TaiwanDollarAccountDetails },
  { path: '/tradingAccount', exact: false, component: TradingAccount },
  { path: '/tradingAccountDetails', exact: false, component: TradingAccountDetails },
  { path: '/foreignCurrencyAccount', exact: false, component: ForeignCurrencyAccount },
  { path: '/foreignCurrencyAccountDetails', exact: false, component: ForeignCurrencyAccountDetails },
  { path: '/regularBasicInformation', exact: false, component: RegularBasicInformation },
  { path: '/exportBankBook', exact: false, component: ExportBankBook },
  { path: '/exportBankBook1', exact: false, component: ExportBankBook1 },
  { path: '/foreignCurrencyTransfer', exact: false, component: ForeignCurrencyTransfer },
  { path: '/foreignCurrencyTransfer1', exact: false, component: ForeignCurrencyTransfer1 },
  { path: '/foreignCurrencyTransfer2', exact: false, component: ForeignCurrencyTransfer2 },
  { path: '/reserveTransferSearch', exact: false, component: ReserveTransferSearch },
  { path: '/reserveTransferSearch1', exact: false, component: ReserveTransferSearch1 },
  { path: '/reserveTransferSearch2', exact: false, component: ReserveTransferSearch2 },
  { path: '/mobileTransfer', exact: false, component: MobileTransfer },
  { path: '/mobileTransfer1', exact: false, component: MobileTransfer1 },
  { path: '/mobileTransfer2', exact: false, component: MobileTransfer2 },
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
  { path: '/E00100', exact: false, component: ExchangeRate },
  { path: '/exchangeRate', exact: false, component: ExchangeRate },

  // TODO：支援開發及Prototype測試使用
  { path: '/login', exact: false, component: Login },
  { path: '/tutorials', exact: false, component: Tutorials },
  // { path: '/home', exact: false, component: Nav },
  { path: '/', exact: true, component: Nav },
  // --------------------------------
];

export default routes;
