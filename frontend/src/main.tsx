import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; // RecoilRoot를 import합니다.
import '../src/api/axios.ts';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    {' '}
    {/* RecoilRoot를 추가합니다. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>,
);
