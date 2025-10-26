// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";

export default function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    // não logado -> manda pro login
    return <Navigate to="/login" replace />;
  }

  // logado -> libera dashboard
  return children;
}
