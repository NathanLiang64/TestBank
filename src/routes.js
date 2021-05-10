/* Components */
import Login from 'screens/Login';
import Test from 'screens/Test';

const routes = [
  { path: '/', exact: true, component: Login },
  { path: '/test', exact: false, component: Test },
];

export default routes;
