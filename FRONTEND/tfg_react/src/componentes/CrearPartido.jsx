import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CrearPartido() {
  const { state } = useLocation();
  const ligaId = state?.ligaId;
  const navigate = useNavigate();

  // Estados principales
  const [resultado, setResultado] = useState(""); // Ej: "2-1"
  const [nombreEquipoA, setNombreEquipoA] = useState("");
  const [nombreEquipoB, setNombreEquipoB] = useState("");

  const [jugadorA, setJugadorA] = useState(""); // Input jugador equipo A
  const [jugadorB, setJugadorB] = useState(""); // Input jugador equipo B
  const [jugadoresA, setJugadoresA] = useState([]); // Lista jugadores A
  const [jugadoresB, setJugadoresB] = useState([]); // Lista jugadores B

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [accionSeleccionada, setAccionSeleccionada] = useState("gol");
  const [acciones, setAcciones] = useState([]);
  const [mvp, setMvp] = useState("");

  const accionesPosibles = ["gol", "asistencia", "amarilla", "roja"];

  // Agregar jugadores a cada equipo
  const agregarJugador = (equipo) => {
    if (equipo === "A" && jugadorA.trim()) {
      setJugadoresA((prev) => [...prev, jugadorA.trim()]);
      setJugadorA("");
    } else if (equipo === "B" && jugadorB.trim()) {
      setJugadoresB((prev) => [...prev, jugadorB.trim()]);
      setJugadorB("");
    }
  };

  // Crear una acción y añadirla a la lista
  const handleAgregarAccion = () => {
    if (!jugadorSeleccionado || !accionSeleccionada) {
      alert("Selecciona jugador y acción");
      return;
    }

    const equipo = jugadoresA.includes(jugadorSeleccionado)
      ? nombreEquipoA
      : nombreEquipoB;

    setAcciones((prev) => [
      ...prev,
      {
        jugador: jugadorSeleccionado,
        equipo,
        accion: accionSeleccionada,
      },
    ]);

    setJugadorSeleccionado("");
    setAccionSeleccionada("gol");
  };

  // Guardar el partido
  const handleGuardarPartido = async () => {
    if (
      !resultado ||
      !nombreEquipoA ||
      !nombreEquipoB ||
      jugadoresA.length === 0 ||
      jugadoresB.length === 0 ||
      !mvp
    ) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/partidos",
        {
          ligaId,
          resultado,
          nombreEquipoA,
          nombreEquipoB,
          jugadoresA,
          jugadoresB,
          acciones,
          mvp,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Partido guardado correctamente");
      navigate("/ultimos-partidos");
    } catch (error) {
      alert("Error al guardar el partido");
    }
  };

  // Jugadores combinados con equipo (para selects)
  const jugadoresConEquipo = [
    ...jugadoresA.map((j) => ({ nombre: j, equipo: nombreEquipoA })),
    ...jugadoresB.map((j) => ({ nombre: j, equipo: nombreEquipoB })),
  ];

  return (
    <div>
      <h2>Crear Partido de Liga</h2>

      {/* Resultado */}
      <div>
        <label>Resultado (ej: 2-1):</label>
        <input
          type="text"
          value={resultado}
          onChange={(e) => setResultado(e.target.value)}
        />
      </div>

      {/* Equipos */}
      <div>
        <label>Nombre Equipo A:</label>
        <input
          type="text"
          value={nombreEquipoA}
          onChange={(e) => setNombreEquipoA(e.target.value)}
        />
      </div>

      <div>
        <label>Nombre Equipo B:</label>
        <input
          type="text"
          value={nombreEquipoB}
          onChange={(e) => setNombreEquipoB(e.target.value)}
        />
      </div>

      {/* Jugadores */}
      <div>
        <h4>Jugadores Equipo A</h4>
        <input
          type="text"
          value={jugadorA}
          onChange={(e) => setJugadorA(e.target.value)}
        />
        <button onClick={() => agregarJugador("A")}>Añadir Jugador</button>
        <ul>
          {jugadoresA.map((j, i) => (
            <li key={i}>{j}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Jugadores Equipo B</h4>
        <input
          type="text"
          value={jugadorB}
          onChange={(e) => setJugadorB(e.target.value)}
        />
        <button onClick={() => agregarJugador("B")}>Añadir Jugador</button>
        <ul>
          {jugadoresB.map((j, i) => (
            <li key={i}>{j}</li>
          ))}
        </ul>
      </div>

      {/* Acciones */}
      <hr />
      <h3>Añadir acción</h3>

      <div>
        <label>Jugador:</label>
        <select
          value={jugadorSeleccionado}
          onChange={(e) => setJugadorSeleccionado(e.target.value)}
        >
          <option value="">Selecciona un jugador</option>
          {jugadoresConEquipo.map((j, i) => (
            <option key={i} value={j.nombre}>
              {j.nombre} ({j.equipo})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Acción:</label>
        <select
          value={accionSeleccionada}
          onChange={(e) => setAccionSeleccionada(e.target.value)}
        >
          {accionesPosibles.map((accion) => (
            <option key={accion} value={accion}>
              {accion}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAgregarAccion}>Guardar acción</button>

      <ul>
        {acciones.map((a, i) => (
          <li key={i}>
            {a.jugador} ({a.equipo}): {a.accion}
          </li>
        ))}
      </ul>

      {/* MVP */}
      <hr />
      <div>
        <label>MVP:</label>
        <select value={mvp} onChange={(e) => setMvp(e.target.value)}>
          <option value="">Selecciona MVP</option>
          {jugadoresConEquipo.map((j, i) => (
            <option key={i} value={j.nombre}>
              {j.nombre} ({j.equipo})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleGuardarPartido}>Guardar Partido</button>
    </div>
  );
}