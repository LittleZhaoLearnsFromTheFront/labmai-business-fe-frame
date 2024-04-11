import ReactDOM from 'react-dom/client'
import App from "./src/index"
import { Provider } from '@labmai-model'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>
)


