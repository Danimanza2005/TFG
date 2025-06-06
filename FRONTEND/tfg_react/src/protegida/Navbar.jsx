import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Inicio</Link>
          <Link to="/ligas">Crear Liga</Link>
          <Link to="/crear-partido">Partido Amistoso</Link>
          <Link to="/ultimos-partidos">Últimos Partidos</Link>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
