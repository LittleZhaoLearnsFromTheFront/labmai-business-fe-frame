import { Spin } from 'antd';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';

function App() {
  const elements = useRoutes(routes);

  return <Suspense fallback={<Spin />}>{elements}</Suspense>;
}

export default App;
