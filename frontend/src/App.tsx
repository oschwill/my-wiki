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
import MyArticles from './pages/MyArticles';
import { LanguageProvider } from './context/LanguageContext';
import { homeLoader } from './loaders/homeLoader';
import WikiBrowser from './pages/WikiBrowser';
import ShowSingleArticle from './pages/ShowSingleArticle';
import UserProfile from './pages/UserProfile';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { CookieConsentProvider } from './context/CookieConsentContext';
import CookieBanner from './components/ui/CookieBanner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} loader={homeLoader} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify-user" element={<VerifyUser />} />
      <Route path="/area/:areaSlug" element={<WikiBrowser />} />
      <Route
        path="/area/:areaSlug/category/:categorySlug/article/:articleId"
        element={<ShowSingleArticle />}
      />
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
        path="/user/:userName/:userHash"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insert-article"
        element={
          <ProtectedRoute>
            <MyArticles />
          </ProtectedRoute>
        }
      />
      {/* AGB AND CO */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
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
          <CookieConsentProvider>
            <RouterProvider router={router} fallbackElement={<LoadSite />} />
            <CookieBanner />
          </CookieConsentProvider>
        </LanguageProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
