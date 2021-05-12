/* Components */
import Login from 'pages/Login';
import Test from 'pages/Test';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
];

export default routes;
