import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CrearPartido() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ligaId = state?.ligaId;

  const [equipoA, setEquipoA] = useState("");
  const [equipoB, setEquipoB] = useState("");
  const [jugadoresA, setJugadoresA] = useState(["", ""]);
  const [jugadoresB, setJugadoresB] = useState(["", ""]);

  const [jugadoresTotales, setJugadoresTotales] = useState([]);
  const [acciones, setAcciones] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [accionSeleccionada, setAccionSeleccionada] = useState("");

  const [resultado, setResultado] = useState("");
  const [mvp, setMvp] = useState("");

  const [equiposGuardados, setEquiposGuardados] = useState(false);

  const iconosAcciones = {
    gol: "⚽",
    asistencia: "👟",
    amarilla: "🟨",
    roja: "🟥",
  };

  const handleAgregarJugadorA = () => {
    setJugadoresA([...jugadoresA, ""]);
  };

  const handleAgregarJugadorB = () => {
    setJugadoresB([...jugadoresB, ""]);
  };

  const handleGuardarEquipos = () => {
    const jugadoresFormateados = [
      ...jugadoresA.map((j) => ({ nombre: j, equipo: equipoA })),
      ...jugadoresB.map((j) => ({ nombre: j, equipo: equipoB })),
    ];
    setJugadoresTotales(jugadoresFormateados);
    setEquiposGuardados(true);
  };

  const handleAñadirAccion = () => {
    if (!jugadorSeleccionado || !accionSeleccionada) return;

    const jugadorInfo = jugadoresTotales.find(j => j.nombre === jugadorSeleccionado);
    if (!jugadorInfo) return;
    setAcciones((prev) => [
      ...prev,
      {
        jugador: jugadorSeleccionado,
        equipo: jugadorInfo.equipo,
        accion: accionSeleccionada
      },
    ]);
    setJugadorSeleccionado("");
    setAccionSeleccionada("");
  };

  const handleGuardarPartido = async () => {
    const token = localStorage.getItem("token");

    try {
      const resEquipoA = await api.post(
        "/equipos",
        { nombre: equipoA, liga_id: ligaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resEquipoB = await api.post(
        "/equipos",
        { nombre: equipoB, liga_id: ligaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const equipoAId = resEquipoA.data.data.id;
      const equipoBId = resEquipoB.data.data.id;

      const jugadoresAValidos = jugadoresA.filter((j) => j.trim() !== "");
      const jugadoresBValidos = jugadoresB.filter((j) => j.trim() !== "");

      const nuevosJugadores = [];

      for (const nombreJugador of jugadoresAValidos) {
        const res = await api.post(
          "/jugadores",
          { nombre: nombreJugador, equipo_id: equipoAId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        nuevosJugadores.push({ ...res.data.data, equipo: equipoA });
      }

      for (const nombreJugador of jugadoresBValidos) {
        const res = await api.post(
          "/jugadores",
          { nombre: nombreJugador, equipo_id: equipoBId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        nuevosJugadores.push({ ...res.data.data, equipo: equipoB });
      }

      const jugadoresConIds = nuevosJugadores.map((j) => ({
        id: j.id,
        nombre: j.nombre,
        equipo: j.equipo,
      }));

      const resPartido = await api.post(
        "/partidos",
        {
          tipo: "liga",
          liga_id: ligaId,
          equipo_a_id: equipoAId,
          equipo_b_id: equipoBId,
          resultado,
          fecha: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const partidoId = resPartido.data.data.id;

      // Guardar MVP
      if (mvp) {
        const mvpJugador = jugadoresConIds.find((j) => j.nombre === mvp);
        if (mvpJugador) {
          await api.post(
            "/mvp",
            { partido_id: partidoId, jugador_id: mvpJugador.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // Guardar Acciones
      for (const accion of acciones) {
        const jugadorAccion = jugadoresConIds.find((j) => j.nombre === accion.jugador);
        if (jugadorAccion) {
          const equipoId =
            jugadorAccion.equipo === equipoA ? equipoAId : equipoBId;

          await api.post(
            "/acciones",
            {
              partido_id: partidoId,
              jugador_id: jugadorAccion.id,
              equipo_id: equipoId,
              tipo: accion.accion,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      alert("Partido guardado correctamente");
      navigate("/ligas");
    } catch (error) {
      console.error("Error al guardar partido:", error.response?.data || error.message);
      alert("Error al guardar partido");
    }
  };

  return (
    <div>
      <h2>Crear Partido de Liga</h2>

      <h3>1. Equipos y jugadores</h3>
      <div>
        <input
          type="text"
          placeholder="Nombre equipo A"
          value={equipoA}
          onChange={(e) => setEquipoA(e.target.value)}
        />
        {jugadoresA.map((j, i) => (
          <input
            key={`jugA-${i}`}
            type="text"
            placeholder={`Jugador ${i + 1} equipo A`}
            value={j}
            onChange={(e) => {
              const copia = [...jugadoresA];
              copia[i] = e.target.value;
              setJugadoresA(copia);
            }}
          />
        ))}
        <button onClick={handleAgregarJugadorA}>Añadir jugador equipo A</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Nombre equipo B"
          value={equipoB}
          onChange={(e) => setEquipoB(e.target.value)}
        />
        {jugadoresB.map((j, i) => (
          <input
            key={`jugB-${i}`}
            type="text"
            placeholder={`Jugador ${i + 1} equipo B`}
            value={j}
            onChange={(e) => {
              const copia = [...jugadoresB];
              copia[i] = e.target.value;
              setJugadoresB(copia);
            }}
          />
        ))}
        <button onClick={handleAgregarJugadorB}>Añadir jugador equipo B</button>
      </div>

      <button onClick={handleGuardarEquipos}>Guardar Equipos y Jugadores</button>

      {equiposGuardados && (
        <>
          <h3>2. Añadir acciones</h3>
          <select
            value={jugadorSeleccionado}
            onChange={(e) => setJugadorSeleccionado(e.target.value)}
          >
            <option value="" disabled selected>Selecciona jugador</option>
            {jugadoresTotales.map((j, i) => (
              <option key={`${j.nombre}-${i}`} value={j.nombre}>
                {j.nombre} ({j.equipo})
              </option>
            ))}
          </select>

          <select
            value={accionSeleccionada}
            onChange={(e) => setAccionSeleccionada(e.target.value)}
          >
            <option value="" disabled selected>Acción</option>
            <option value="gol">Gol ⚽</option>
            <option value="asistencia">Asistencia 👟</option>
            <option value="amarilla">Amarilla 🟨</option>
            <option value="roja">Roja 🟥</option>
          </select>

          <button onClick={handleAñadirAccion}>Añadir acción</button>

          <ul>
            {acciones.map((a, i) => (
              <li key={`accion-${i}`}>
                {a.jugador} ({a.equipo}) : {a.accion} {iconosAcciones[a.accion]}
              </li>
            ))}
          </ul>

          <h3>3. Seleccionar MVP</h3>
          <select value={mvp} onChange={(e) => setMvp(e.target.value)}>
            <option value="" disabled selected>Selecciona MVP</option>
            {jugadoresTotales.map((j, i) => (
              <option key={`mvp-${i}`} value={j.nombre}>
                {j.nombre} ({j.equipo})
              </option>
            ))}
          </select>

          <h3>4. Resultado final</h3>
          <input
            type="text"
            placeholder="Resultado (ej: 3-2)"
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
          />

          <button onClick={handleGuardarPartido}>Guardar Partido</button>
        </>
      )}
    </div>
  );
}