import type { RouteObject } from 'react-router-dom';
import Active from '../pages/active';
import Error from "../pages/404"
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Active />,
  },
  {
    path: '*',
    element: <Error />
  }
];
