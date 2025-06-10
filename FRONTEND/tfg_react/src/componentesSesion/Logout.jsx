import api from "../api/axios";

export default function Logout(){
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try{
      await api.post("/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //eliminamos el token del localStorage
      localStorage.removeItem("token");
      alert("Sesion cerrada");
      //recargamos la pagina
      window.location.reload();
    } catch(error){
      alert("Error al cerrar sesion");
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesion</button>
    </div>
  );
}