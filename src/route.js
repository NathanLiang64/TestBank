/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import CardLessATM from 'pages/cardLessATM';
import CardLessATM1 from 'pages/cardLessATM/cardLessATM_1';
import CardLessATM2 from 'pages/cardLessATM/cardLessATM_2';
import CardLessATM3 from 'pages/cardLessATM/cardLessATM_3';
import CardLessWithDrawChgPwd from 'pages/cardLessATM/cardLessWithDrawChgPwd';
import LossReissue from 'pages/LossReissue';
import LossReissue2 from 'pages/LossReissue/lossReissue_2';
import AccountMaintenance from './pages/AccountMaintenance';

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
];

export default routes;
