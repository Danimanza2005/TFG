import { useState } from "react";
import api from "../api/axios";

export default function Registro(){
  const [formulario, setFormulario] = useState({name: "", email: "", password: "", password_confirmation: ""});
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormulario({...formulario, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const respuesta = await api.post("/register", formulario);
      setMensaje("Usuario registrado");
    } catch(error){
      setMensaje("Error al registrarse");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input type="text" name="name" placeholder="Introduce un nombre" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Introduce un correo" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Introduce una contraseña" onChange={handleChange} required />
      <input type="password" name="password_confirmation" placeholder="Confirma contraseña" onChange={handleChange} required />
      <button type="submit">Registrarse</button>
      <p>{mensaje}</p>
    </form>
  );
}