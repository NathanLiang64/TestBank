/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';
import ReissueDebitCard from 'pages/ReissueDebitCard';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
  { path: '/reissueDebitCard', exact: false, component: ReissueDebitCard },
];

export default routes;
