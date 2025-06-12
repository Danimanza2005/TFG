import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import '../css/amistoso.css'


export default function CrearPartidoAmistoso() {
    const navigate = useNavigate();

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
    const [guardando, setGuardando] = useState(false);

    //NUEVOS estados para mostrar partidos amistosos
    const [mostrarAmistosos, setMostrarAmistosos] = useState(false);
    const [partidosAmistosos, setPartidosAmistosos] = useState([]);

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [jugadoresEquipoA, setJugadoresEquipoA] = useState([]);
    const [jugadoresEquipoB, setJugadoresEquipoB] = useState([]);

    const iconosAcciones = {
        gol: "⚽",
        asistencia: "👟",
        amarilla: "🟨",
        roja: "🟥",
    };

    //Función para cargar partidos amistosos
    const cargarPartidosAmistosos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/partidos', {
                headers: { Authorization: `Bearer ${token}` },
            });
            //Filtrar solo amistosos en frontend
            const amistosos = res.data.filter((partido) => partido.tipo === 'amistoso');
            console.log('Partidos amistosos filtrados:', amistosos);
            setPartidosAmistosos(amistosos);
        } catch (error) {
            console.error('Error al cargar partidos amistosos:', error);
            setPartidosAmistosos([]);
        }
    };

    const handleAgregarJugadores = (input, setJugadores, jugadores, setError) => {
        const nombres = input
            .split(",")
            .map((j) => j.trim())
            .filter((j) => j !== "");

        const nuevos = nombres.filter((j) => j.length > 0);

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

    const handleEliminarPartido = async (partidoId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este partido?")) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/partidos/${partidoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Elimina el partido del estado local sin recargar
            setPartidosAmistosos(prev => prev.filter(p => p.id !== partidoId));

            // Cierra modal si se está viendo el partido eliminado
            if (partidoSeleccionado?.id === partidoId) {
                handleCerrarModal();
            }

            alert("Partido eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar partido:", error.response?.data || error.message);
            alert("Error al eliminar el partido.");
        }
    };

    const handleGuardarPartido = async () => {
        const token = localStorage.getItem("token");
        setGuardando(true);

        try {
            const resEquipoA = await api.post(
                "/equipos",
                { nombre: equipoA },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const resEquipoB = await api.post(
                "/equipos",
                { nombre: equipoB },
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
                    tipo: "amistoso",
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
            navigate("/");
        } catch (error) {
            console.error("Error al guardar partido:", error.response?.data || error.message);
            alert("Error al guardar partido");
        } finally {
            setGuardando(false);
        }
    };

    const handleVerEstadisticas = async (partido) => {
        try {
            const token = localStorage.getItem("token");

            const resPartido = await api.get(`/partidos/${partido.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const partidoCompleto = resPartido.data.data || resPartido.data;

            // Extraer acciones y filtrar jugadores que participaron
            const acciones = partidoCompleto.acciones || [];

            const jugadoresEnPartidoA = [];
            const jugadoresEnPartidoB = [];

            acciones.forEach((accion) => {
                if (
                    accion.equipo_id === partidoCompleto.equipo_a?.id &&
                    accion.jugador &&
                    !jugadoresEnPartidoA.find((j) => j.id === accion.jugador.id)
                ) {
                    jugadoresEnPartidoA.push(accion.jugador);
                }
                if (
                    accion.equipo_id === partidoCompleto.equipo_b?.id &&
                    accion.jugador &&
                    !jugadoresEnPartidoB.find((j) => j.id === accion.jugador.id)
                ) {
                    jugadoresEnPartidoB.push(accion.jugador);
                }
            });

            setPartidoSeleccionado(partidoCompleto);
            setMostrarModal(true);

            setJugadoresEquipoA(jugadoresEnPartidoA);
            setJugadoresEquipoB(jugadoresEnPartidoB);
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
            {/* Botón y lista para mostrar partidos amistosos */}
            <hr style={{ margin: "20px 0" }} />
            <button className="verAmistosos"
                onClick={() => {
                    if (!mostrarAmistosos) {
                        cargarPartidosAmistosos();
                    }
                    setMostrarAmistosos(!mostrarAmistosos);
                }}
            >
                {mostrarAmistosos ? "Ocultar partidos amistosos" : "Ver todos los partidos amistosos"}
            </button>

            {mostrarAmistosos && (
                <ul>
                    {partidosAmistosos.length === 0 ? (
                        <li>No hay partidos amistosos disponibles</li>
                    ) : (
                        partidosAmistosos.map((partido) => (
                            <li key={partido.id} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <button
                                        onClick={() => handleVerEstadisticas(partido)}
                                        style={{
                                            whiteSpace: "normal",
                                            textAlign: "left",
                                            padding: "8px",
                                            marginRight: "10px",
                                        }} className="partido-button"
                                    >
                                        <div><strong>Amistoso:</strong></div>
                                        <div>{partido.equipo_a?.nombre || 'Equipo A'} vs {partido.equipo_b?.nombre || 'Equipo B'}</div>
                                        <div>Resultado: {partido.resultado || 'No disponible'}</div>
                                    </button>
                                    <button className="btnEliminar" onClick={() => handleEliminarPartido(partido.id)}>🗑️</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
            <hr style={{ margin: "20px 0" }} />
            <h2>Crear Partido Amistoso</h2>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div className="equipo-container">
                    <h3>Equipo A</h3>
                    <input className="inputYselect"
                        type="text"
                        placeholder="Nombre equipo A"
                        value={equipoA}
                        onChange={(e) => setEquipoA(e.target.value)}
                    />
                    <input className="inputYselect"
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
                                <button className="btnEliminar" onClick={() => handleEliminarJugador(i, jugadoresA, setJugadoresA)}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="equipo-container">
                    <h3>Equipo B</h3>
                    <input className="inputYselect"
                        type="text"
                        placeholder="Nombre equipo B"
                        value={equipoB}
                        onChange={(e) => setEquipoB(e.target.value)}
                    />
                    <input className="inputYselect"
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
                                <button className="btnEliminar" onClick={() => handleEliminarJugador(i, jugadoresB, setJugadoresB)}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="btnGuardarEquipos" onClick={handleGuardarEquipos}>Guardar Equipos y Jugadores</button>

            {equiposGuardados && (
                <div className="lineaAmarilla">
                    <div className="seccion-partido">
                        <h3>Añadir acciones</h3>
                        <select className="inputYselect"
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

                        <select className="inputYselect"
                            value={accionSeleccionada}
                            onChange={(e) => setAccionSeleccionada(e.target.value)}
                        >
                            <option value="" disabled>Acción</option>
                            <option value="gol">Gol ⚽</option>
                            <option value="asistencia">Asistencia 👟</option>
                            <option value="amarilla">Amarilla 🟨</option>
                            <option value="roja">Roja 🟥</option>
                        </select>

                        <button className="btnGuardarEquiposAccion" onClick={handleAñadirAccion}>Añadir acción</button>

                        <ul>
                            {acciones.map((a, i) => (
                                <li key={`accion-${i}`} className="lista-accion">
                                    {a.jugador} ({a.equipo}) : {a.accion} {iconosAcciones[a.accion]}
                                    <button className="btnEliminarAccion" onClick={() => handleEliminarAccion(i)}>🗑️</button>
                                </li>
                            ))}
                        </ul>

                        <h3>Seleccionar MVP</h3>
                        <select className="inputYselect" value={mvp} onChange={(e) => setMvp(e.target.value)}>
                            <option value="" disabled>Selecciona MVP</option>
                            {jugadoresTotales.map((j, i) => (
                                <option key={`mvp-${i}`} value={j.nombre}>
                                    {j.nombre} ({j.equipo})
                                </option>
                            ))}
                        </select>

                        <h3>Resultado final</h3>
                        <input className="inputYselect"
                            type="text"
                            placeholder="Resultado (ej: 3-2)"
                            value={resultado}
                            onChange={(e) => setResultado(e.target.value)} />

                        <button className="btnGuardarPartidoLiga" onClick={handleGuardarPartido}>Guardar Partido</button>
                        {guardando && (
                            <div className="modal-loader">
                                <div className="spinner"></div>
                                <p>Guardando partido, por favor espera...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

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