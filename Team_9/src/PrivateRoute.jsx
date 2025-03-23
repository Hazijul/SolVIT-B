import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (currentUser === undefined) {
    
    return null;
  }

  return currentUser ? children : <Navigate to="/login" />;
}