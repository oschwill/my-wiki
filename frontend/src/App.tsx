import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import './App.css';
import RootLayout from './layout/RootLayout';
import Home from './pages/Home';
import LoadSite from './components/loader/LoadSite';

/* CSS */
import 'bootstrap/dist/css/bootstrap.min.css';
/* JS */
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Auth from './pages/Auth';
import VerifyUser from './pages/VerifyUser';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify-user" element={<VerifyUser />} />
      <Route path="/area" element={<Home />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} fallbackElement={<LoadSite />} />;
}

export default App;
