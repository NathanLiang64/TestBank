/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import CardLessATM from 'pages/CardLessATM';
import CardLessATM1 from 'pages/CardLessATM/cardLessATM_1';
import CardLessATM2 from 'pages/CardLessATM/cardLessATM_2';
import CardLessATM3 from 'pages/CardLessATM/cardLessATM_3';
import CardLessWithDrawChgPwd from 'pages/CardLessATM/cardLessWithDrawChgPwd';
import LossReissue from 'pages/LossReissue';
import LossReissue2 from 'pages/LossReissue/lossReissue_2';
import AccountMaintenance from 'pages/AccountMaintenance';
import BillPay from 'pages/BillPay';
import BillPay1 from 'pages/BillPay/billPay_1';
import DepositOverview from 'pages/DepositOverview';
import DepositInquiry from 'pages/DepositInquiry';
import DepositPlus from 'pages/DepositPlus';
import NicknameSetting from 'pages/NicknameSetting';
import NoticeSetting from 'pages/NoticeSetting';
import NoticeSetting1 from 'pages/NoticeSetting/noticeSetting_1';
import PatternLockSetting from 'pages/PatternLockSetting';
import Notice from 'pages/Notice';
import Notice1 from 'pages/Notice/notice_1';
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
import BasicInformation1 from 'pages//BasicInformation/basicInformation_1';
import QandA from 'pages/QandA';
import Open from 'pages/Open';
import Deduct from 'pages/Deduct';
import Deduct1 from 'pages/Deduct/deduct1';
import Deduct2 from 'pages/Deduct/deduct2';
import Deduct3 from 'pages/Deduct/deduct3';
import Exchange from 'pages/Exchange';
import Exchange1 from 'pages/Exchange/exchange_1';
import Exchange2 from 'pages/Exchange/exchange_2';
import Transfer from 'pages/Transfer';
import Profile from 'pages/Profile';
import More from 'pages/More';
import FinancialDepartments from 'pages/FinancialDepartments';
import Network from 'pages/Network';

/* 開發用目錄頁 */
import Nav from 'pages/Nav';

const routes = [
  { path: '/', exact: true, component: Nav },
  { path: '/login', exact: false, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/cardLessATM', exact: true, component: CardLessATM },
  { path: '/cardLessATM1', exact: false, component: CardLessATM1 },
  { path: '/cardLessATM2', exact: false, component: CardLessATM2 },
  { path: '/cardLessATM3', exact: false, component: CardLessATM3 },
  { path: '/cardLessWithDrawChgPwd', exact: false, component: CardLessWithDrawChgPwd },
  { path: '/lossReissue', exact: false, component: LossReissue },
  { path: '/lossReissue2', exact: false, component: LossReissue2 },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
  { path: '/billPay', exact: true, component: BillPay },
  { path: '/billPay1', exact: false, component: BillPay1 },
  { path: '/depositOverview', exact: false, component: DepositOverview },
  { path: '/depositInquiry', exact: false, component: DepositInquiry },
  { path: '/depositPlus', exact: false, component: DepositPlus },
  { path: '/noticeSetting', exact: true, component: NoticeSetting },
  { path: '/noticeSetting1', exact: false, component: NoticeSetting1 },
  { path: '/nicknameSetting', exact: false, component: NicknameSetting },
  { path: '/patternLockSetting', exact: false, component: PatternLockSetting },
  { path: '/notice', exact: false, component: Notice },
  { path: '/notice1', exact: false, component: Notice1 },
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
  { path: '/open', exact: false, component: Open },
  { path: '/deduct', exact: false, component: Deduct },
  { path: '/deduct1', exact: false, component: Deduct1 },
  { path: '/deduct2', exact: false, component: Deduct2 },
  { path: '/deduct3', exact: false, component: Deduct3 },
  { path: '/exchange', exact: false, component: Exchange },
  { path: '/exchange1', exact: false, component: Exchange1 },
  { path: '/exchange2', exact: false, component: Exchange2 },
  { path: '/transfer', exact: false, component: Transfer },
  { path: '/profile', exact: false, component: Profile },
  { path: '/more', exact: false, component: More },
  { path: '/financialDepartments', exact: false, component: FinancialDepartments },
  { path: '/network', exact: false, component: Network },
];

export default routes;
