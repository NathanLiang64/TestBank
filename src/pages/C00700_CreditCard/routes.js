import { lazy } from 'react';

const C00700 = lazy(() => import('./C00700'));

const routes = () => [
  { path: '/C007000', exact: false, component: C00700 },
];
export default routes;
