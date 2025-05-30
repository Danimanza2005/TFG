import { useState } from "react";
import api from "../api/axios";

function Registro() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", form);
      setMessage("Usuario registrado. Token: " + res.data.token);
    } catch (err) {
      setMessage("Error: " + err.response?.data?.message || "Algo salió mal");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="name" placeholder="Nombre" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Correo" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <input name="password_confirmation" type="password" placeholder="Confirmar Contraseña" onChange={handleChange} required />
      <button type="submit">Registrarse</button>
      <p>{message}</p>
    </form>
  );
}

export default Registro;