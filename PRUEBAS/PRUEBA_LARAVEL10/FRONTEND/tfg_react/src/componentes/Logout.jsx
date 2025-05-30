import api from "../api/axios";

function Logout() {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      alert("Sesión cerrada");
      window.location.reload(); // o redirige a login
    } catch (err) {
      alert("Error al cerrar sesión");
    }
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
}

export default Logout;