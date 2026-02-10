import { Navigate } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && user) {
    return user.role === "seller"
      ? <Navigate to="/seller/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRedirect;
