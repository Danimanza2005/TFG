import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/ultimosPartidos.css';

export default function UltimosPartidos() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [jugadoresEquipoA, setJugadoresEquipoA] = useState([]);
  const [jugadoresEquipoB, setJugadoresEquipoB] = useState([]);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.get('/api/partidos/ultimos-partidos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartidos(respuesta.data);
      } catch (error) {
        setMensajeError("Error al cargar los partidos");
      } finally {
        setLoading(false);
      }
    };
    fetchPartidos();
  }, []);

  const handleVerEstadisticas = async (partido) => {
    try {
      const token = localStorage.getItem('token');
      const respuestaPartido = await axios.get(`/api/partidos/${partido.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const partidoCompleto = respuestaPartido.data.data || respuestaPartido.data;
      setPartidoSeleccionado(partidoCompleto);

      const acciones = partidoCompleto.acciones || [];
      const jugadoresAPartido = [];
      const jugadoresBPartido = [];

      //recorre las acciones del partido para identificar los jugadores por equipo
      acciones.forEach((accion) => {
        if (accion.equipo_id === partidoCompleto.equipo_a?.id && accion.jugador && !jugadoresAPartido.find((j) => j.id === accion.jugador.id)) {
          jugadoresAPartido.push(accion.jugador);
        }
        if (accion.equipo_id === partidoCompleto.equipo_b?.id && accion.jugador && !jugadoresBPartido.find((j) => j.id === accion.jugador.id)) {
          jugadoresBPartido.push(accion.jugador);
        }
      })
      setJugadoresEquipoA(jugadoresAPartido);
      setJugadoresEquipoB(jugadoresBPartido);
      setMostrarModal(true);  //muestra el modal con los datos
    } catch (error) {
      setMensajeError("Error al cargar las estadisticas del partido");
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setPartidoSeleccionado(null);
  };

  if (loading) return <p>Cargando últimos partidos...</p>;
  if (mensajeError) return <p style={{ color: "red" }}>Error: {mensajeError}</p>;
  if (partidos.length === 0) return <p>No hay partidos disponibles.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Últimos 5 partidos</h2>
      <ul>
        {partidos.map((partido) => (
          <li key={partido.id} style={{ marginBottom: "1rem" }} className='listaUltimos'>
            <button className="partido-button" onClick={() => handleVerEstadisticas(partido)} style={{ cursor: "pointer", padding: "10px", width: "100%", textAlign: "left" }}>
              <strong>{new Date(partido.fecha).toLocaleString()}</strong><br />
              {partido.equipo_a?.nombre || "Equipo A"} vs {partido.equipo_b?.nombre || "Equipo B"}<br />
              Resultado: {partido.resultado || "No disponible"}<br />
              Tipo: {partido.tipo} {partido.liga && `(${partido.liga.nombre})`}
            </button>
          </li>
        ))}
      </ul>
      {mostrarModal && partidoSeleccionado && (
        <>
          <div className="modal-overlay" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
            onClick={handleCerrarModal}></div>

          <div className="modal-estadisticas" style={{
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
            overflowY: "auto"
          }}>
            <h2>Estadísticas del Partido</h2>

            <p><strong>Tipo:</strong> {partidoSeleccionado.tipo || "Amistoso"}</p>
            <p><strong>Fecha:</strong> {new Date(partidoSeleccionado.fecha).toLocaleString()}</p>

            <div className="neon">
              {partidoSeleccionado.equipo_a?.nombre} {partidoSeleccionado.resultado} {partidoSeleccionado.equipo_b?.nombre}
            </div>

            <div className="equipos-container">
              <div className="equipo">
                <h4>{partidoSeleccionado.equipo_a?.nombre}</h4>
                <ul className="lista-jugadores">
                  {jugadoresEquipoA.length ? (
                    jugadoresEquipoA.map(j => <li key={j.id}>{j.nombre}</li>)
                  ) : (
                    <li>Sin jugadores</li>
                  )}
                </ul>
              </div>

              <div className="equipo">
                <h4>{partidoSeleccionado.equipo_b?.nombre}</h4>
                <ul className="lista-jugadores">
                  {jugadoresEquipoB.length ? (
                    jugadoresEquipoB.map(j => <li key={j.id}>{j.nombre}</li>)
                  ) : (
                    <li>Sin jugadores</li>
                  )}
                </ul>
              </div>
            </div>
            <h5 className="mvp">🎖️ MVP: {partidoSeleccionado.mvp?.jugador?.nombre || "No especificado"}</h5>
            <div className="estadisticas-destacadas">
              <strong>Estadísticas destacadas:</strong>
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
                  <div key={index}>
                    {icono} {accion.jugador?.nombre} - {accion.tipo.charAt(0).toUpperCase() + accion.tipo.slice(1)}
                  </div>
                );
              })}
            </div>

            <button className="boton-cerrar" onClick={handleCerrarModal}>Cerrar</button>
          </div>
        </>
      )}
    </div>
  );
}