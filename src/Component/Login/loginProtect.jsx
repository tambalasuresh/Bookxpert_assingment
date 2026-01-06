import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuth");

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
