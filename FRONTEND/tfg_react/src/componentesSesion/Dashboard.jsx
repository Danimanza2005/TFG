import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    //obtenemos el token del localStorage
    const token = localStorage.getItem("token");

    //obtenemos los datos del usuario autenticado
    api.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((respuesta) => setUser(respuesta.data)) //guardamos los datos del usuario
    .catch(()=> setError("No autorizado"));
  }, []);

  return(
    <div>
      <h2>Dashboard</h2>
      {/* Mostramos los datos del usuario en formato json */}
      {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : <p>{error}</p>}
    </div>
  );
}