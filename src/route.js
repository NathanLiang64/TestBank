/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import ReissueDebitCard from 'pages/ReissueDebitCard';
import CardlessWithdrawal from 'pages/CardlessWithdrawal';
import AccountMaintenance from './pages/AccountMaintenance';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/reissueDebitCard', exact: false, component: ReissueDebitCard },
  { path: '/cardlessWithdrawal', exact: false, component: CardlessWithdrawal },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
];

export default routes;
