import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CrearPartido() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ligaId = state?.ligaId;

  const [equipoA, setEquipoA] = useState("");
  const [equipoB, setEquipoB] = useState("");
  const [inputJugadoresA, setInputJugadoresA] = useState("");
  const [inputJugadoresB, setInputJugadoresB] = useState("");
  const [jugadoresA, setJugadoresA] = useState([]);
  const [jugadoresB, setJugadoresB] = useState([]);

  const [errorJugadoresA, setErrorJugadoresA] = useState("");
  const [errorJugadoresB, setErrorJugadoresB] = useState("");

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

  const handleAgregarJugadores = (input, setJugadores, jugadores, setError) => {
    const nombres = input
      .split(",")
      .map((j) => j.trim())
      .filter((j) => j !== "");

    const nuevos = nombres.filter(
      (j) => j.length > 0
    );

    if (nuevos.length === 0) {
      setError("Introduce un jugador.");
      return;
    }

    setJugadores([...jugadores, ...nuevos]);
    setError("");
  };

  const handleEliminarJugador = (index, jugadores, setJugadores) => {
    const copia = [...jugadores];
    copia.splice(index, 1);
    setJugadores(copia);
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

    const jugadorInfo = jugadoresTotales.find((j) => j.nombre === jugadorSeleccionado);
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

  const handleEliminarAccion = (index) => {
    const nuevasAcciones = [...acciones];
    nuevasAcciones.splice(index, 1);
    setAcciones(nuevasAcciones);
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

      const nuevosJugadores = [];

      for (const nombreJugador of jugadoresA) {
        const res = await api.post(
          "/jugadores",
          { nombre: nombreJugador, equipo_id: equipoAId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        nuevosJugadores.push({ ...res.data.data, equipo: equipoA });
      }

      for (const nombreJugador of jugadoresB) {
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
        <div>
          <input
            type="text"
            placeholder="Jugadores equipo A (separados por comas)"
            value={inputJugadoresA}
            onChange={(e) => setInputJugadoresA(e.target.value)}
          />
          <button
            onClick={() => {
              handleAgregarJugadores(inputJugadoresA, setJugadoresA, jugadoresA, setErrorJugadoresA);
              setInputJugadoresA("");
            }}
          >
            Añadir jugadores equipo A
          </button>
          {errorJugadoresA && <p style={{ color: "red" }}>{errorJugadoresA}</p>}
          <ul>
            {jugadoresA.map((j, i) => (
              <li key={`jugA-${i}`}>
                {j}
                {jugadoresA.length > 0 && (
                  <button onClick={() => handleEliminarJugador(i, jugadoresA, setJugadoresA)}>🗑️</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Nombre equipo B"
          value={equipoB}
          onChange={(e) => setEquipoB(e.target.value)}
        />
        <div>
          <input
            type="text"
            placeholder="Jugadores equipo B (separados por comas)"
            value={inputJugadoresB}
            onChange={(e) => setInputJugadoresB(e.target.value)}
          />
          <button
            onClick={() => {
              handleAgregarJugadores(inputJugadoresB, setJugadoresB, jugadoresB, setErrorJugadoresB);
              setInputJugadoresB("");
            }}
          >
            Añadir jugadores equipo B
          </button>
          {errorJugadoresB && <p style={{ color: "red" }}>{errorJugadoresB}</p>}
          <ul>
            {jugadoresB.map((j, i) => (
              <li key={`jugB-${i}`}>
                {j}
                {jugadoresB.length > 0 && (
                  <button onClick={() => handleEliminarJugador(i, jugadoresB, setJugadoresB)}>🗑️</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={handleGuardarEquipos}>Guardar Equipos y Jugadores</button>

      {equiposGuardados && (
        <>
          <h3>2. Añadir acciones</h3>
          <select
            value={jugadorSeleccionado}
            onChange={(e) => setJugadorSeleccionado(e.target.value)}
          >
            <option value="" disabled>Selecciona jugador</option>
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
            <option value="" disabled>Acción</option>
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
                <button onClick={() => handleEliminarAccion(i)}>🗑️</button>
              </li>
            ))}
          </ul>

          <h3>3. Seleccionar MVP</h3>
          <select value={mvp} onChange={(e) => setMvp(e.target.value)}>
            <option value="" disabled>Selecciona MVP</option>
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