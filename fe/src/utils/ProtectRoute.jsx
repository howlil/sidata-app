import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const checkAuthToken = () => !!localStorage.getItem("token");

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    return userRole;
  }
  return null;
};

export function ProtectRoute({ children }) {
  const location = useLocation();
  if (!checkAuthToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export const withRole = (Component, allowedRoles) => {
  return (props) => {
    const userRole = getUserRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return <Component {...props} />;
    } else {
      return <Navigate to="/login" />;
    }
  };
};
