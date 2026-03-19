import { HashRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import { AppLayout } from './components/layout/AppLayout';
import { TreePage } from './pages/TreePage';
import { ListPage } from './pages/ListPage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<TreePage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
