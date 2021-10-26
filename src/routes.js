/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import CardLessATM from 'pages/CardLessATM';
import CardLessATM1 from 'pages/CardLessATM/cardLessATM_1';
import CardLessATM2 from 'pages/CardLessATM/cardLessATM_2';
import CardLessWithDrawChgPwd from 'pages/CardLessATM/cardLessWithDrawChgPwd';
import LossReissue from 'pages/LossReissue';
import LossReissue2 from 'pages/LossReissue/lossReissue_2';
import AccountMaintenance from 'pages/AccountMaintenance';
import BillPay from 'pages/BillPay';
import BillPay1 from 'pages/BillPay/billPay_1';
// import DepositOverview from 'pages/DepositOverview';
// import DepositInquiry from 'pages/DepositInquiry';
import DepositPlus from 'pages/DepositPlus';
import NicknameSetting from 'pages/NicknameSetting';
import NoticeSetting from 'pages/NoticeSetting';
import PatternLockSetting from 'pages/PatternLockSetting';
import Notice from 'pages/Notice';
import FingerPrintLockSetting from 'pages/FingerPrintLockSetting';
import ChangeUserName from 'pages/ChangeUserName';
import ChangeUserName1 from 'pages/ChangeUserName/changeUserName_1';
import PwdModify from 'pages/PwdModify';
import PwdModify1 from 'pages/PwdModify/pwdModify_1';
import RegularPwdModify from 'pages/RegularPwdModify';
import RegularPwdModify1 from 'pages/RegularPwdModify/regularPwdModify_1';
import SMSOTPactivate from 'pages/SMSOTPactivate';
import QRCodeTransfer from 'pages/QRCodeTransfer';
import Adjustment from 'pages/Adjustment';
import Adjustment1 from 'pages/Adjustment/adjustment_1';
import ProjectJ from 'pages/ProjectJ';
import LoanInquiry from 'pages/LoanInquiry';
import LoanInterest from 'pages/LoanInterest';
import BasicInformation from 'pages/BasicInformation';
import BasicInformation1 from 'pages/BasicInformation/basicInformation_1';
import QandA from 'pages/QandA';
import Provisioning from 'pages/Provisioning';
import Deduct from 'pages/Deduct';
import Deduct1 from 'pages/Deduct/deduct1';
import Deduct2 from 'pages/Deduct/deduct2';
import Deduct3 from 'pages/Deduct/deduct3';
import Exchange from 'pages/Exchange';
import Exchange1 from 'pages/Exchange/exchange_1';
import Exchange2 from 'pages/Exchange/exchange_2';
import Transfer from 'pages/Transfer';
import Transfer1 from 'pages/Transfer/transfer_1';
import Transfer2 from 'pages/Transfer/transfer_2';
import Profile from 'pages/Profile';
import More from 'pages/More';
import FinancialDepartments from 'pages/FinancialDepartments';
import Network from 'pages/Network';
import TradingAccount from 'pages/TradingAccount';
import TradingAccountDetails from 'pages/TradingAccountDetails';
import TaiwanDollarAccount from 'pages/TaiwanDollarAccount';
import TaiwanDollarAccountDetails from 'pages/TaiwanDollarAccountDetails';
import ForeignCurrencyAccount from 'pages/ForeignCurrencyAccount';
import ForeignCurrencyAccountDetails from 'pages/ForeignCurrencyAccountDetails';
import RegularBasicInformation from 'pages/RegularBasicInformation';
import RegularBasicInformation1 from 'pages/RegularBasicInformation/regularBasicInformation_1';
import RegularBasicInformation2 from 'pages/RegularBasicInformation/regularBasicInformation_2';
import ExportBankBook from 'pages/ExportBankBook';
import ExportBankBook1 from 'pages/ExportBankBook/exportBankBook_1';
import ForeignCurrencyTransfer from 'pages/ForeignCurrencyTransfer';
import ForeignCurrencyTransfer1 from 'pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_1';
import ForeignCurrencyTransfer2 from 'pages/ForeignCurrencyTransfer/foreignCurrencyTransfer_2';
import ReserveTransferSearch from 'pages/ReserveTransferSearch';
import ReserveTransferSearch1 from 'pages/ReserveTransferSearch/reserveTransferSearch_1';
import ReserveTransferSearch2 from 'pages/ReserveTransferSearch/reserveTransferSearch_2';
import MobileTransfer from 'pages/MobileTransfer';
import MobileTransfer1 from 'pages/MobileTransfer/mobileTransfer_1';
import MobileTransfer2 from 'pages/MobileTransfer/mobileTransfer_2';
import MobileTransfer3 from 'pages/MobileTransfer/mobileTransfer_3';
import ForeignCurrencyPriceSetting from 'pages/ForeignCurrencyPriceSetting';
import QuickLoginSetting from 'pages/QuickLoginSetting';

/* 開發用目錄頁 */
import Nav from 'pages/Nav';

/* 轉帳靜態頁 (for prototype) */
import TransferStatic from 'pages/TransferStatic';
import TransferStatic1 from 'pages/TransferStatic/transfer_1';
import TransferStatic2 from 'pages/TransferStatic/transfer_2';

/* Tutorials (for prototype) */
import Tutorials from 'pages/Tutorials';

const routes = [
  { path: '/', exact: true, component: Nav },
  { path: '/login', exact: false, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/cardLessATM', exact: true, component: CardLessATM },
  { path: '/cardLessATM1', exact: false, component: CardLessATM1 },
  { path: '/cardLessATM2', exact: false, component: CardLessATM2 },
  { path: '/cardLessWithDrawChgPwd', exact: false, component: CardLessWithDrawChgPwd },
  { path: '/lossReissue', exact: false, component: LossReissue },
  { path: '/lossReissue2', exact: false, component: LossReissue2 },
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
  { path: '/changeUserName1', exact: false, component: ChangeUserName1 },
  { path: '/pwdModify', exact: false, component: PwdModify },
  { path: '/pwdModify1', exact: false, component: PwdModify1 },
  { path: '/regularPwdModify', exact: false, component: RegularPwdModify },
  { path: '/regularPwdModify1', exact: false, component: RegularPwdModify1 },
  { path: '/smsOTPactivate', exact: false, component: SMSOTPactivate },
  { path: '/QRCodeTransfer', exact: false, component: QRCodeTransfer },
  { path: '/adjustment', exact: false, component: Adjustment },
  { path: '/adjustment1', exact: false, component: Adjustment1 },
  { path: '/projectJ', exact: false, component: ProjectJ },
  { path: '/loanInquiry', exact: false, component: LoanInquiry },
  { path: '/loanInterest', exact: false, component: LoanInterest },
  { path: '/basicInformation', exact: false, component: BasicInformation },
  { path: '/basicInformation1', exact: false, component: BasicInformation1 },
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
  { path: '/transfer1', exact: false, component: Transfer1 },
  { path: '/transfer2', exact: false, component: Transfer2 },
  { path: '/profile', exact: false, component: Profile },
  { path: '/more', exact: false, component: More },
  { path: '/financialDepartments', exact: false, component: FinancialDepartments },
  { path: '/network', exact: false, component: Network },
  { path: '/taiwanDollarAccount', exact: false, component: TaiwanDollarAccount },
  { path: '/taiwanDollarAccountDetails', exact: false, component: TaiwanDollarAccountDetails },
  { path: '/tradingAccount', exact: false, component: TradingAccount },
  { path: '/tradingAccountDetails', exact: false, component: TradingAccountDetails },
  { path: '/foreignCurrencyAccount', exact: false, component: ForeignCurrencyAccount },
  { path: '/foreignCurrencyAccountDetails', exact: false, component: ForeignCurrencyAccountDetails },
  { path: '/regularBasicInformation', exact: false, component: RegularBasicInformation },
  { path: '/regularBasicInformation1', exact: false, component: RegularBasicInformation1 },
  { path: '/regularBasicInformation2', exact: false, component: RegularBasicInformation2 },
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
  { path: '/mobileTransfer3', exact: false, component: MobileTransfer3 },
  { path: '/foreignCurrencyPriceSetting', exact: false, component: ForeignCurrencyPriceSetting },
  { path: '/quickLoginSetting', exact: false, component: QuickLoginSetting },
  { path: '/transferStatic', exact: false, component: TransferStatic },
  { path: '/transferStatic1', exact: false, component: TransferStatic1 },
  { path: '/transferStatic2', exact: false, component: TransferStatic2 },
  { path: '/tutorials', exact: false, component: Tutorials },
];

export default routes;
