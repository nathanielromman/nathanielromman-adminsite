import { Outlet, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Revisar sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2. Escuchar cambios de sesión (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) navigate("/admin/login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!session) return null; // evita parpadeo

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR ADMIN */}
      <aside
        style={{
          width: "260px",
          background: "#111",
          color: "white",
          padding: "30px 20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>ADMIN</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link to="/admin" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/admin/home" style={{ color: "white" }}>Home</Link>
          <Link to="/admin/about" style={{ color: "white" }}>Sobre mí</Link>
          <Link to="/admin/portfolio" style={{ color: "white" }}>Portafolio</Link>
          <Link to="/admin/contact" style={{ color: "white" }}>Contacto</Link>
          <Link to="/admin/global" style={{ color: "white" }}>Global</Link>
        </nav>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/admin/login");
          }}
          style={{
            marginTop: "40px",
            padding: "10px",
            width: "100%",
            background: "crimson",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: "40px" }}>
        <Outlet />
      </main>
    </div>
  );
}
