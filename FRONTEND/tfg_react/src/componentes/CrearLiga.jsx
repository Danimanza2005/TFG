import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api/axios"; 

export default function CrearLiga() {
  const [nombre, setNombre] = useState(""); //Estado para guardar el nombre que ingresa el usuario
  const [ligaId, setLigaId] = useState(null); //Estado para guardar el ID de la liga creada
  const [ligas, setLigas] = useState([]); //Estado para guardar el listado de ligas existentes
  const navigate = useNavigate(); //Hook para navegar entre rutas

  useEffect(() => {
    //Función para obtener las ligas del backend
    const fetchLigas = async () => {
      try {
        const token = localStorage.getItem("token"); //Obtenemos el token guardado en localStorage
        //Hacemos petición GET a /ligas con el token en el header Authorization
        const respuesta = await api.get("/ligas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        //Guarda en el estado la lista de ligas que obtenemos desde el servidor
        setLigas(respuesta.data.data || respuesta.data);
      } catch (error) {
        alert("Error al cargar ligas");
      }
    };
    fetchLigas();
  }, []); //El array vacío es para que se ejecute solo una vez el componente cuando se muestre

  //Función para crear una nueva liga
  const handleCrearLiga = async () => {
    try {
      const token = localStorage.getItem("token");
      //Hacemos petición POST a /ligas enviando el nombre y con token en headers
      const respuesta = await api.post(
        "/ligas",
        { nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //Obtenemos la liga recién creada
      const nuevaLiga = respuesta.data.data || respuesta.data;
      setLigaId(nuevaLiga.id); //Guardamos el ID de la liga creada
      //Actualizamos la lista de ligas agregando la nueva sin recargar
      setLigas((prev) => [...prev, nuevaLiga]);
    } catch (error) {
      alert("Error al crear liga");
    }
  };

  return (
    <div>
      <h2>Crear Liga</h2>
        <>
          <input
            type="text"
            placeholder="Nombre de la liga"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button onClick={handleCrearLiga}>Crear Liga</button>
        </>

      <h3>Listado de ligas</h3>
      <ul>
        {/* Recorremos la lista de ligas y las mostramos */}
        {ligas.map((liga) => (
          <li key={liga.id}>
            {liga.nombre}
            {/* Botón que navega a crear partido, pasando el id de la liga */}
            <button onClick={() => navigate(`/ligas/${liga.id}/crear-partido`)}>
              Crear Partido para esta Liga
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}