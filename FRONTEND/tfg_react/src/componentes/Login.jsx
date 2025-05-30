import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Correo requerido";
    if (!form.password) newErrors.password = "Contraseña requerida";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ general: "Credenciales incorrectas" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" type="email" placeholder="Correo" onChange={handleChange} />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      <button type="submit">Entrar</button>
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
    </form>
  );
}

export default Login;