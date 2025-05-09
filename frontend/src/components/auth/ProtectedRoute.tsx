import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadSite from '../loader/LoadSite';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadSite />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
