/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import ReissueDebitCard from 'pages/ReissueDebitCard';
import CardlessWithdrawal from 'pages/CardlessWithdrawal';
import Step1 from 'pages/CardlessWithdrawal/step_1';
import Step2 from 'pages/CardlessWithdrawal/step_2';
import Step3 from 'pages/CardlessWithdrawal/step_3';
import ChangePassword from 'pages/CardlessWithdrawal/changePassword';
import AccountMaintenance from './pages/AccountMaintenance';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/reissueDebitCard', exact: false, component: ReissueDebitCard },
  { path: '/cardlessWithdrawal', exact: true, component: CardlessWithdrawal },
  { path: '/cardlessWithdrawal/step1', exact: false, component: Step1 },
  { path: '/cardlessWithdrawal/step2', exact: false, component: Step2 },
  { path: '/cardlessWithdrawal/step3', exact: false, component: Step3 },
  { path: '/cardlessWithdrawal/changePassword', exact: false, component: ChangePassword },
  { path: '/accountMaintenance', exact: false, component: AccountMaintenance },
];

export default routes;
