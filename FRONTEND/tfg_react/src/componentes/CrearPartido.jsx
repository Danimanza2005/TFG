
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function CrearPartido() {

    const [equipos, setEquipos] = useState([]);
    const [equipoLocal, setEquipoLocal] = useState("");
    const [equipoVisitante, setEquipoVisitante] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        api.get("/equipos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

            .then((res)) => setEquipos(res.data);
        .catch () => setMensaje("Error al cargar los equipos");

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!equipoLocal || !equipoVisitante) {
            setMensaje("Debes seleccionar ambos equipos");
        }

        if (equipoLocal === equipoVisitante) {
            setMensaje("Un equipo no puede jugar contra si mismo");
        }

        const token = localStorage.getItem(token);

        try {
            const res = await api.post("/partidos",
                {
                    equipo_local_id: equipoLocal,
                    equipo_visitante_if: equipoVisitante
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMensaje("Partido creado correctamente");
        }catch(err){
            setMensaje("Error al crear el partido");
        }
    };

    return(
        <div>
            <h2>Crear Partido</h2>
            <form action="">
                <div>
                    <label></label>
                    <select name="" id=""></select>
                </div>
            </form>
        </div>
    );

}