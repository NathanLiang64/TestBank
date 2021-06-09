/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import CardLessATM from 'pages/CardLessATM';
import CardLessATM1 from 'pages/CardLessATM/cardLessATM_1';
import CardLessATM2 from 'pages/CardLessATM/cardLessATM_2';
import CardLessATM3 from 'pages/CardLessATM/cardLessATM_3';
import CardLessWithDrawChgPwd from 'pages/CardLessATM/cardLessWithDrawChgPwd';
import LossReissue from 'pages/LossReissue';
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
import PwdModify from 'pages/PwdModify';
import RegularPwdModify from 'pages/RegularPwdModify';
import SMSOTPactivate from 'pages/SMSOTPactivate';
import QRCodeTransfer from 'pages/QRCodeTransfer';
import Adjustment from 'pages/Adjustment';
import Adjustment1 from 'pages/Adjustment/adjustment_1';
import ProjectJ from 'pages/ProjectJ';
import LoanInquiry from 'pages/LoanInquiry';
import LoanInterest from 'pages/LoanInterest';
import BasicInformation from 'pages/BasicInformation';
import QandA from 'pages/QandA';
import Open from 'pages/Open';

/* 測試用目錄頁 */
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
  { path: '/open', exact: false, component: Open },
];

export default routes;
