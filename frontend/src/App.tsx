import {
  Navigate,
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
import { AuthProvider } from './context/AuthContext';
import MyProfile from './pages/MyProfile';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import InsertArticle from './pages/InsertArticle';
import { LanguageProvider } from './context/LanguageContext';
import { homeLoader } from './loaders/homeLoader';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} loader={homeLoader} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify-user" element={<VerifyUser />} />
      <Route path="/area" element={<Home />} />
      {/* PROTECTED ROUTES */}
      <Route
        path="/user/me"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insert-article"
        element={
          <ProtectedRoute>
            <InsertArticle />
          </ProtectedRoute>
        }
      />
      {/* CATCH ME BABY */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  ),
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LanguageProvider>
          <RouterProvider router={router} fallbackElement={<LoadSite />} />
        </LanguageProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
