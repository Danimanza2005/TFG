import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
      <nav className="sidebar">
        <h2>FutbolBarro</h2>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        ) : (
          <>
            <Link to="/">Inicio</Link>
            <Link to="/ligas">Crear liga</Link>
            <Link to="/amistosos">Partido amistoso</Link>
            <Link to="/ultimos-partidos">Ultimos partidos</Link>
            <button onClick={handleLogout}>Cerrar sesion</button>
          </>
        )}
      </nav>

  );
}