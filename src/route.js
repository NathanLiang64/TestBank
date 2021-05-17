/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import LossReissue from 'pages/LossReissue';
import CardlessWithdrawal from 'pages/CardlessWithdrawal';
import AccountMaintenance from './pages/AccountMaintenance';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/lossReissue', exact: false, component: LossReissue },
  { path: '/cardlessWithdrawal', exact: false, component: CardlessWithdrawal },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
];

export default routes;
