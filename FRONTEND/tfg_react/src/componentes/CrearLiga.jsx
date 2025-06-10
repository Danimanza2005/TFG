import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CrearLiga() {
  //definimos los estados
  const [nombre, setNombre] = useState("");
  const [ligas, setLigas] = useState([]);
  const [partidosPorLiga, setPartidosPorLiga] = useState({}); //almacenar los partidos de la liga por su id
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  //arrays que contienen los jugadores de cada equipo
  const [jugadoresEquipoA, setJugadoresEquipoA] = useState([]);
  const [jugadoresEquipoB, setJugadoresEquipoB] = useState([]);
  //hook para redirigir a otras rutas
  const navigate = useNavigate();

  //useEffect para cargar las ligas que estan guardadas
  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const token = localStorage.getItem('token');  //token de autenticacion
        const respuesta = await api.get('/ligas', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        //guarda las ligas obtenidas en el estado
        setLigas(respuesta.data.data || respuesta.data);
      } catch (error) {
        alert("Error al cargar las ligas");
      }
    };
    fetchLigas(); //llamamos a la funcion para que carguen las ligas
  }, []);

  //handle para crear una liga
  const handleCrearLiga = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await api.post('/ligas',
        { nombre }, //envia el nombre que inserta el usuario
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const nuevaLiga = respuesta.data.data || respuesta.data;
      //agrega la nueva liga a la lista sin tener que recargar toda la pagina
      setLigas((prev) => [...prev, nuevaLiga]);
    } catch (error) {
      alert("Error al crear liga");
    }
  };

  //handle para ver los partidos de una liga especifica
  const handleVerPartidos = async (ligaId) => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await api.get(`/partidos?liga_id=${ligaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      //guarda los partidos por liga usando el id
      setPartidosPorLiga((prev) => ({ ...prev, [ligaId]: respuesta.data.data || respuesta.data, }));
    } catch (error) {
      alert("Error al obtener partidos");
    }
  };

  //funcion para eliminar partidos
  const handleEliminarPartidos = async (ligaId, partidoId) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este partido?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/partidos/${partidoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      //eliminamos el partido de la liga sin necesidad de recargar
      setPartidosPorLiga((prev) => ({ ...prev, [ligaId]: (prev[ligaId] || []).filter((partido) => partido.id !== partidoId), }));
    } catch (error) {
      alert("Error al eliminar el partido");
    }
  };

  //funcion para ver las estadisticas de un partido especifico
  const handleVerEstadisticas = async (partido) => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await api.get(`/partidos/${partido.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const partidoCompleto = respuesta.data.data || respuesta.data;
      setPartidoSeleccionado(partidoCompleto);  //seleccionamos el partido que queremos ver
      setMostrarModal(true);  //nos muestra un modal con las acciones del partido

      const respuestaEquipoA = await api.get(`/equipos/${partidoCompleto.equipo_a.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setJugadoresEquipoA(respuestaEquipoA.data.jugadores || []);

      const respuestaEquipoB = await api.get(`/equipos/${partidoCompleto.equipo_b.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setJugadoresEquipoB(respuestaEquipoB.data.jugadores || []);
    } catch (error) {
      alert("Error al cargar las estadisticas del partido");
    }
  };

  //handle para cerrar el modal
  const handleCerrarModal = async () => {
    setMostrarModal(false);
    setPartidoSeleccionado(null);
  };

  return (
    <div>
      <h2>Crear liga</h2>
      <input type="text" placeholder="Introduce un nombre a la liga" value={nombre} onChange={(event) => setNombre(event.target.value)} />
      <button onClick={handleCrearLiga}>Crear liga</button>

      <h2>Listado de ligas</h2>
      <ul>
        {ligas.map((liga) => (
          <li key={liga.id}>
            {liga.nombre}
            <button onClick={() => navigate(`/ligas/${liga.id}/crear-partido`)}>Crear partido en esta liga</button>
            <button onClick={() => handleVerPartidos(liga.id)}>Ver partidos de esta liga</button>
            <ul>
              {(partidosPorLiga[liga.id] || []).map((partido) => (
                <li key={partido.id}>
                  <button onClick={() => handleVerEstadisticas(partido)} style={{
                    whiteSpace: "normal",
                    textAlign: "left",
                    padding: "8px",
                    marginRight: "10px",
                  }}>
                    <div><strong>Liga: </strong>{partido.liga ? partido.liga.nombre : "Amistoso"}</div>
                    <div>{partido.equipo_a?.nombre || "Equipo A"} vs {partido.equipo_b?.nombre || "Equipo B"}</div>
                    <div>Resultado: {partido.resultado || "No disponible"}</div>
                  </button>
                  <button onClick={() => handleEliminarPartidos(liga.id, partido.id)}>🗑️</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {mostrarModal && partidoSeleccionado && (
        <>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
            onClick={handleCerrarModal}></div>
          <div style={{
            position: "fixed",
            top: "10%",
            left: "25%",
            width: "50%",
            background:"white",
            padding: "20px",
            border:"2px solid black",
            borderRadius: "10px",
            zIndex: 1000,
            maxHeight:"80vh",
            overflowY: "auto"
          }}>
            <h2>ESTADISTICAS DEL PARTIDO</h2>
            <p><strong>Tipo:</strong> {partidoSeleccionado.tipo || "Amistoso"}</p>
            <p><strong>Fecha:</strong> {new Date(partidoSeleccionado.fecha).toLocaleString()}</p>
            <h3>{partidoSeleccionado.equipo_a?.nombre}{partidoSeleccionado.resultado}{partidoSeleccionado.equipo_b?.nombre}</h3>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <div style={{ width: "45%" }}>
                <h4>{partidoSeleccionado.equipo_a?.nombre}</h4>
                <ul>
                  {jugadoresEquipoA.map((jugador) => (
                    <li key={jugador.id}>{jugador.nombre}</li>
                  ))}
                </ul>
              </div>
              <div style={{ width: "45%" }}>
                <h4>{partidoSeleccionado.equipo_b?.nombre}</h4>
                <ul>
                  {jugadoresEquipoB.map((jugador) => (
                    <li key={jugador.id}>{jugador.nombre}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p><strong>🎖️ MVP:</strong> {partidoSeleccionado.mvp?.jugador?.nombre || "No disponible"}</p>
            <h4>Estadisticas destacadas</h4>
            <ul>
              {(partidoSeleccionado.acciones || []).map((accion, index) => {
                let icono = "";
                switch (accion.tipo) {
                  case "gol": icono = "⚽"; break;
                  case "asistencia": icono = "👟"; break;
                  case "amarilla": icono = "🟨"; break;
                  case "roja": icono = "🟥"; break;
                  default: icono = "ℹ️";
                }
                return (
                  <li key={index}>
                    {icono} {accion.jugador?.nombre} - {accion.tipo.charAt(0).toUpperCase() + accion.tipo.slice(1)}
                  </li>
                );
              })}
            </ul>
            <button style={{ marginTop: "20px" }} onClick={handleCerrarModal}>Cerrar</button>
          </div>
        </>
      )}
    </div>
  );
}