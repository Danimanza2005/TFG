import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CrearLiga() {
  const [nombre, setNombre] = useState("");
  const [ligas, setLigas] = useState([]);
  const [partidosPorLiga, setPartidosPorLiga] = useState({});
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [jugadoresEquipoA, setJugadoresEquipoA] = useState([]);
  const [jugadoresEquipoB, setJugadoresEquipoB] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const token = localStorage.getItem("token");
        const respuesta = await api.get("/ligas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLigas(respuesta.data.data || respuesta.data);
      } catch (error) {
        alert("Error al cargar ligas");
      }
    };
    fetchLigas();
  }, []);

  const handleCrearLiga = async () => {
    try {
      const token = localStorage.getItem("token");
      const respuesta = await api.post(
        "/ligas",
        { nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const nuevaLiga = respuesta.data.data || respuesta.data;
      setLigas((prev) => [...prev, nuevaLiga]);
    } catch (error) {
      alert("Error al crear liga");
    }
  };

  const handleVerPartidos = async (ligaId) => {
    try {
      const token = localStorage.getItem("token");
      const respuesta = await api.get(`/partidos?liga_id=${ligaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartidosPorLiga((prev) => ({
        ...prev,
        [ligaId]: respuesta.data.data || respuesta.data,
      }));
    } catch (error) {
      alert("Error al obtener los partidos");
    }
  };

  const handleEliminarPartido = async (ligaId, partidoId) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este partido?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/partidos/${partidoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPartidosPorLiga((prev) => ({
        ...prev,
        [ligaId]: (prev[ligaId] || []).filter((p) => p.id !== partidoId),
      }));
    } catch (error) {
      alert("Error al eliminar el partido");
    }
  };

  const handleVerEstadisticas = async (partido) => {
    try {
      const token = localStorage.getItem("token");
      const resPartido = await api.get(`/partidos/${partido.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const partidoCompleto = resPartido.data.data || resPartido.data;
      setPartidoSeleccionado(partidoCompleto);
      setMostrarModal(true);

      const resEquipoA = await api.get(`/equipos/${partidoCompleto.equipo_a.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJugadoresEquipoA(resEquipoA.data.jugadores || []);

      const resEquipoB = await api.get(`/equipos/${partidoCompleto.equipo_b.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJugadoresEquipoB(resEquipoB.data.jugadores || []);
    } catch (error) {
      alert("Error cargando detalles del partido y jugadores");
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setPartidoSeleccionado(null);
  };

  return (
    <div>
      <h2>Crear Liga</h2>
      <input
        type="text"
        placeholder="Nombre de la liga"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={handleCrearLiga}>Crear Liga</button>

      <h3>Listado de ligas</h3>
      <ul>
        {ligas.map((liga) => (
          <li key={liga.id}>
            {liga.nombre}
            <button onClick={() => navigate(`/ligas/${liga.id}/crear-partido`)}>
              Crear Partido para esta Liga
            </button>
            <button onClick={() => handleVerPartidos(liga.id)}>
              Ver Partidos de esta Liga
            </button>

            <ul>
              {(partidosPorLiga[liga.id] || []).map((partido) => (
                <li key={partido.id}>
                  <button
                    onClick={() => handleVerEstadisticas(partido)}
                    style={{
                      whiteSpace: "normal",
                      textAlign: "left",
                      padding: "8px",
                      marginRight: "10px",
                    }}
                  >
                    <div><strong>Liga:</strong> {partido.liga ? partido.liga.nombre : "Amistoso"}</div>
                    <div>{partido.equipo_a?.nombre || "Equipo A"} vs {partido.equipo_b?.nombre || "Equipo B"}</div>
                    <div>Resultado: {partido.resultado || "No disponible"}</div>
                  </button>
                  <button onClick={() => handleEliminarPartido(liga.id, partido.id)}>🗑️</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {mostrarModal && partidoSeleccionado && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={handleCerrarModal}
          />
          <div
            style={{
              position: "fixed",
              top: "10%",
              left: "25%",
              width: "50%",
              background: "white",
              padding: "20px",
              border: "2px solid black",
              borderRadius: "10px",
              zIndex: 1000,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2>Estadísticas del Partido</h2>
            <p><strong>Tipo:</strong> {partidoSeleccionado.tipo || "Amistoso"}</p>
            <p><strong>Fecha:</strong> {new Date(partidoSeleccionado.fecha).toLocaleString()}</p>
            <h3>
              {partidoSeleccionado.equipo_a?.nombre} {partidoSeleccionado.resultado} {partidoSeleccionado.equipo_b?.nombre}
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "45%" }}>
                <h4>{partidoSeleccionado.equipo_a?.nombre}</h4>
                <ul>
                  {jugadoresEquipoA.map((j) => (
                    <li key={j.id}>{j.nombre}</li>
                  ))}
                </ul>
              </div>
              <div style={{ width: "45%" }}>
                <h4>{partidoSeleccionado.equipo_b?.nombre}</h4>
                <ul>
                  {jugadoresEquipoB.map((j) => (
                    <li key={j.id}>{j.nombre}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p><strong>MVP:</strong> {partidoSeleccionado.mvp?.jugador?.nombre || "No disponible"}</p>
            <h4>Estadísticas destacadas</h4>
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
            <button onClick={handleCerrarModal} style={{ marginTop: "20px" }}>Cerrar</button>
          </div>
        </>
      )}
    </div>
  );
}