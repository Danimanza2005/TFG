import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import '../css/partidoLiga.css';

export default function CrearPartidoLiga() {
  const navigate = useNavigate();
  const { id: ligaId } = useParams(); //obtener id de la liga desde la URL

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
  const [liga, setLiga] = useState(null);

  const [equiposGuardados, setEquiposGuardados] = useState(false);
  const [guardando, setGuardando] = useState(false);

  //validacion para el boton de Guardar equipos y jugadores
  const validacionEquipos = equipoA.trim() !== "" && equipoB.trim() !== "" && jugadoresA.length > 0 && jugadoresB.length > 0;

  //useEffect para obtener datos de la liga
  useEffect(() => {
    const fetchLiga = async () => {
      try {
        const token = localStorage.getItem("token");
        const respuesta = await api.get(`/ligas/${ligaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setLiga(respuesta.data.data || respuesta.data);
      } catch (error) {
        alert("No se pudo cargar la liga");
      }
    };
    if (ligaId) {
      fetchLiga();
    }
  }, [ligaId]);

  //iconos para las acciones
  const iconosAcciones = {
    gol: "⚽",
    asistencia: "👟",
    amarilla: "🟨",
    roja: "🟥"
  };

  const handleAgregarJugadores = (input, setJugadores, jugadores, setError) => {
    //separar los jugadores por comas
    const nombres = input
      .split(",")
      .map((j) => j.trim())
      .filter((j) => j !== "");

    const nuevos = nombres.filter((j) => j.length > 0);
    if (nuevos.length === 0) {
      setError("Introduce un jugador");
      return;
    }
    setJugadores([...jugadores, ...nuevos]);
    setError("");
  };

  const handleEliminarJugador = (index, jugadores, setJugadores) => {
    //copiar la lista de jugadores
    const copia = [...jugadores];
    //eliminar el jugador que esta en esa posicion
    copia.splice(index, 1);
    //actualizar la lista
    setJugadores(copia);
  }

  const handleGuardarEquipos = () => {
    //validar para que los campos de los equipos no esten vacios
    if (!equipoA.trim() || !equipoB.trim()) {
      alert("Debes introducir un nombre para los equipos");
      return;
    }

    const jugadoresModificados = [...jugadoresA.map((j) => ({ nombre: j, equipo: equipoA })),
    ...jugadoresB.map((j) => ({ nombre: j, equipo: equipoB }))
    ];

    setJugadoresTotales(jugadoresModificados);
    setEquiposGuardados(true);
  };

  const handleAñadirAccion = () => {
    //verificar que se haya seleccionado jugador y accion
    if (!jugadorSeleccionado || !accionSeleccionada) return;
    const jugadorInfo = jugadoresTotales.find((j) => j.nombre === jugadorSeleccionado);
    if (!jugadorInfo) return;
    //agregar la accion a la lista
    setAcciones((prev) => [...prev, {
      jugador: jugadorSeleccionado,
      equipo: jugadorInfo.equipo,
      accion: accionSeleccionada
    }]);
    //limpiar los campos
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
    setGuardando(true); //empieza el cargando
    try {
      const respuestaEquipoA = await api.post("/equipos",
        { nombre: equipoA, liga_id: ligaId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const respuestaEquipoB = await api.post("/equipos",
        { nombre: equipoB, liga_id: ligaId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const equipoAId = respuestaEquipoA.data.data.id;
      const equipoBId = respuestaEquipoB.data.data.id;

      const nuevosJugadores = [];

      for (const nombreJugador of jugadoresA) {
        const respuesta = await api.post("/jugadores", {
          nombre: nombreJugador, equipo_id: equipoAId
        },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        //añadir el jugador creado a la lista
        nuevosJugadores.push({ ...respuesta.data.data, equipo: equipoA });
      }

      for (const nombreJugador of jugadoresB) {
        const respuesta = await api.post("/jugadores", {
          nombre: nombreJugador, equipo_id: equipoBId
        },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        nuevosJugadores.push({ ...respuesta.data.data, equipo: equipoB });
      }

      const jugadoresConId = nuevosJugadores.map((j) => ({
        id: j.id,
        nombre: j.nombre,
        equipo: j.equipo
      }));

      const respuestaPartido = await api.post("/partidos", {
        tipo: "liga",
        liga_id: ligaId,
        equipo_a_id: equipoAId,
        equipo_b_id: equipoBId,
        resultado,
        fecha: new Date().toISOString()
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const partidoId = respuestaPartido.data.data.id;

      if (mvp) {
        //buscar el jugador seleccionado como MVP entre los jugadores creados
        const mvpJugador = jugadoresConId.find((j) => j.nombre === mvp);
        if (mvpJugador) {
          await api.post("/mvp", {
            partido_id: partidoId,
            jugador_id: mvpJugador.id
          },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
        }
      }

      for (const accion of acciones) {
        const jugadorAccion = jugadoresConId.find((j) => j.nombre === accion.jugador);
        if (jugadorAccion) {
          const equipoId = jugadorAccion.equipo === equipoA ? equipoAId : equipoBId;
          await api.post("/acciones", {
            partido_id: partidoId,
            jugador_id: jugadorAccion.id,
            equipo_id: equipoId,
            tipo: accion.accion
          },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
        }
      }

      alert("Partido guardado correctamente");
      navigate("/ligas");

    } catch (error) {
      console.error("Error al guardar el partido", error.response?.data || error.message);
      alert("Error al guardar el partido");
    } finally {
      setGuardando(false);  //termina el cargando
    }
  };

  return (
    <div>
      <h2>Crear partido de liga</h2>
      {liga ? (
        <h3 className="nombreLiga">Liga: {liga.nombre}</h3>
      ) : (
        <p>Cargando nombre de la liga...</p>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="equipo-container">
          <h3>Equipo A</h3>
          <input type="text" placeholder="Nombre equipoA" value={equipoA} onChange={(e) => setEquipoA(e.target.value)} />
          <input type="text" placeholder="Jugadores equipoA (separados por comas)" value={inputJugadoresA} onChange={(e) => setInputJugadoresA(e.target.value)} />
          <button onClick={() => {
            handleAgregarJugadores(inputJugadoresA, setJugadoresA, jugadoresA, setErrorJugadoresA);
            setInputJugadoresA("");
          }}>Añadir jugadores al equipo A</button>
          {errorJugadoresA && <p style={{ color: "red" }}>{errorJugadoresA}</p>}
          <ul>
            {jugadoresA.map((j, i) => (
              <li key={`jugA-${i}`}>
                {j}
                {jugadoresA.length > 0 && (
                  <button className="btnEliminar" onClick={() => handleEliminarJugador(i, jugadoresA, setJugadoresA)}>🗑️</button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="equipo-container">
          <h3>Equipo B</h3>
          <input type="text" placeholder="Nombre equipoB" value={equipoB} onChange={(e) => setEquipoB(e.target.value)} />
          <input type="text" placeholder="Jugadores equipoB (separados por comas)" value={inputJugadoresB} onChange={(e) => setInputJugadoresB(e.target.value)} />
          <button onClick={() => {
            handleAgregarJugadores(inputJugadoresB, setJugadoresB, jugadoresB, setErrorJugadoresB);
            setInputJugadoresB("");
          }}>Añadir jugadores al equipo B</button>
          {errorJugadoresB && <p style={{ color: "red" }}>{errorJugadoresB}</p>}
          <ul>
            {jugadoresB.map((j, i) => (
              <li key={`jugB-${i}`}>
                {j}
                {jugadoresB.length > 0 && (
                  <button className="btnEliminar" onClick={() => handleEliminarJugador(i, jugadoresB, setJugadoresB)}>🗑️</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="btnGuardarEquipos" onClick={handleGuardarEquipos} disabled={!validacionEquipos}>Guardar equipos y jugadores</button>
      
      {equiposGuardados && (
        <div className="lineaAmarilla">
        <div className="seccion-partido">
          <h3>Añadir acciones</h3>
          <select className="inputYselect" value={jugadorSeleccionado} onChange={(e) => setJugadorSeleccionado(e.target.value)}>
            <option value="" disabled>Selecciona un jugador</option>
            {jugadoresTotales.map((j, i) => (
              <option key={`${j.nombre}-${i}`} value={j.nombre}>
                {j.nombre} ({j.equipo})
              </option>
            ))}
          </select>
          <select className="inputYselect" value={accionSeleccionada} onChange={(e) => setAccionSeleccionada(e.target.value)}>
            <option value="" disabled>Acciones</option>
            <option value="gol">Gol ⚽</option>
            <option value="asistencia">Asistencia 👟</option>
            <option value="amarilla">Amarilla 🟨</option>
            <option value="roja">Roja 🟥</option>
          </select>
          <button className="btnGuardarEquiposAccion" onClick={handleAñadirAccion}>Añadir accion</button>
          <ul>
            {acciones.map((a, i) => (
              <li key={`accion-${i}`} className="lista-accion">
                <span>{a.jugador} ({a.equipo}) : {a.accion} {iconosAcciones[a.accion]}</span>
                <button className="btnEliminarAccion" onClick={() => handleEliminarAccion(i)}>🗑️</button>
              </li>
            ))}
          </ul>
          <h3>Seleccionar MVP</h3>
          <select className="inputYselect" value={mvp} onChange={(e) => setMvp(e.target.value)}>
            <option value="" disabled>Seleccionar MVP</option>
            {jugadoresTotales.map((j, i) => (
              <option key={`mvp-${i}`} value={j.nombre}>
                {j.nombre} ({j.equipo})
              </option>
            ))}
          </select>
          <h3>Resultado</h3>
          <input className="inputYselect" type="text" placeholder="Resultado (ej: 1-2)" value={resultado} onChange={(e) => setResultado(e.target.value)} />
          <button className="btnGuardarPartidoLiga" onClick={handleGuardarPartido}>Guardar partido</button>
          {guardando && (
            <div className="modal-loader">
              <div className="spinner"></div>
              <p>Guardando partido, por favor espere...</p>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}