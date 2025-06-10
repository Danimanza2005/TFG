import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [formulario, setFormulario] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" })
  };

  const validate = () => {
    const nuevoError = {};
    if (!formulario.email) nuevoError.email = "Inserte un correo";
    if (!formulario.password) nuevoError.password = "Inserte una contraseña";
    return nuevoError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoError = validate();
    if(Object.keys(nuevoError).length > 0) return setError(nuevoError);
    try{
      const respuesta = await api.post("/login", formulario);
      localStorage.setItem("token", respuesta.data.token);
      //una vez que el usuario este logeado lo enviamos a la pantalla de inicio
      navigate("/");
    } catch (error){
      setError({general: "Credenciales incorrectas"});
    }
  };

  return(
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Introduce un correo" onChange={handleChange} />
      {error.email && <p style={{color: "red"}}>{error.email}</p>}
      <input type="password" name="password" placeholder="Introduce la contraseña" onChange={handleChange} />
      {error.password && <p style={{color: "red"}}>{error.password}</p>}
      <button type="submit">Entrar</button>
      {error.general && <p style={{color: "red"}}>{error.general}</p>}
    </form>
  );
}