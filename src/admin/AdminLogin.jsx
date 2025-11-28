// src/admin/AdminLogin.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { data: _data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas");
      return;
    }

    navigate("/admin");
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "120px auto",
        padding: "40px",
        background: "white",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", marginTop: "20px" }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginTop: "12px" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn btn-dark w-100 mt-3">Entrar</button>
      </form>
    </div>
  );
}
