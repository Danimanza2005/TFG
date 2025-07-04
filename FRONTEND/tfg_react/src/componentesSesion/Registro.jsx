import { useState } from "react";
import api from "../api/axios";
import '../css/registro.css';

export default function Registro(){
  const [formulario, setFormulario] = useState({name: "", email: "", password: "", password_confirmation: ""});
  const [mensaje, setMensaje] = useState("");

  //funcion que actualiza el estado del formulario
  const handleChange = (e) => {
    setFormulario({...formulario, [e.target.name]: e.target.value});
  };

  //funcion que maneja el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await api.post("/register", formulario);
      setMensaje("Usuario registrado. ");
      setFormulario({name: "", email: "", password:"", password_confirmation:""});
    } catch (error) {
      setMensaje("Error: " + error.response?.data?.message || "Algo salió mal");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input type="text" name="name" placeholder="Introduce un nombre" onChange={handleChange} value={formulario.name} required />
      <input type="email" name="email" placeholder="Introduce un correo" onChange={handleChange} value={formulario.email} required />
      <input type="password" name="password" placeholder="Introduce una contraseña" onChange={handleChange} value={formulario.password} required />
      <input type="password" name="password_confirmation" placeholder="Confirma contraseña" onChange={handleChange} value={formulario.password_confirmation} required />
      <button type="submit">Registrarse</button>
      <p>{mensaje}</p>
    </form>
  );
}