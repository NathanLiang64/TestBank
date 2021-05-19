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
import DepositPlus from 'pages/DepositPlus';
import NoticeSetting from 'pages/NoticeSetting';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/cardLessATM', exact: true, component: CardLessATM },
  { path: '/cardLessATM/cardLessATM1', exact: false, component: CardLessATM1 },
  { path: '/cardLessATM/cardLessATM2', exact: false, component: CardLessATM2 },
  { path: '/cardLessATM/cardLessATM3', exact: false, component: CardLessATM3 },
  { path: '/cardLessATM/cardLessWithDrawChgPwd', exact: false, component: CardLessWithDrawChgPwd },
  { path: '/lossReissue', exact: false, component: LossReissue },
  { path: '/lossReissue2', exact: false, component: LossReissue2 },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
  { path: '/billPay', exact: true, component: BillPay },
  { path: '/depositPlus', exact: true, component: DepositPlus },
  { path: '/noticeSetting', exact: true, component: NoticeSetting },

];

export default routes;
