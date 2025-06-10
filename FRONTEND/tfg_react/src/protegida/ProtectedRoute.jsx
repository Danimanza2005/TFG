import { Navigate } from "react-router-dom";

export default function ProtectedRoute ({children}) {
  const token = localStorage.getItem("token");
  //si no hay token le redirigimos al login
  if (!token) return <Navigate to="/login" />;
  //si el usuario esta autenticado se renderizaran los hijos
  return children;
}