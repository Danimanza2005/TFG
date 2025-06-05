import { useEffect, useState } from "react";
import api from "../api/axios";

function InfoUsuario() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError("No autorizado o token inválido");
      });
  }, []);

  return (
    <div>
      <h2>Usuario Autenticado</h2>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>{error || "Cargando..."}</p>
      )}
    </div>
  );
}

export default InfoUsuario;