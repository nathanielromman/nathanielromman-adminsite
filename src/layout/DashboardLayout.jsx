import { Outlet, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  // -------------------------
  //   VERIFICAR USUARIO
  // -------------------------
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        navigate("/login", { replace: true });
        return;
      }

      setUser(data.user);
    }

    checkUser();
  }, [navigate]);

  // -------------------------
  //   LOGOUT
  // -------------------------
  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <aside
        className="bg-dark text-white p-3 d-none d-md-flex flex-column"
        style={{
          width: "240px",
          minHeight: "100vh",
          flexShrink: 0,
          overflowY: "auto"
        }}
      >
        <h4 className="mb-4">Admin</h4>

        <ul className="nav flex-column gap-2">
          <li><Link className="text-white nav-link" to="/">Dashboard</Link></li>
          <li><Link className="text-white nav-link" to="/cms/home">CMS Home</Link></li>
          <li><Link className="text-white nav-link" to="/cms/about">CMS Sobre</Link></li>
          <li><Link className="text-white nav-link" to="/cms/portfolio">Portafolio</Link></li>
          <li><Link className="text-white nav-link" to="/clients">Clientes</Link></li>
          <li><Link className="text-white nav-link" to="/sessions">Sesiones</Link></li>
        </ul>
      </aside>

      {/* CONTENT AREA */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* MOBILE MENU */}
        <div className="d-md-none bg-dark p-2">
          <button
            className="btn btn-light"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰ Menú
          </button>
        </div>

        {/* SIDEBAR MÓVIL */}
        {showSidebar && (
          <div
            className="bg-dark text-white p-3 d-md-none position-absolute"
            style={{ width: "70%", height: "100%", zIndex: 999 }}
          >
            <ul className="nav flex-column gap-2">
              <li><Link className="text-white nav-link" to="/" onClick={() => setShowSidebar(false)}>Dashboard</Link></li>
              <li><Link className="text-white nav-link" to="/cms/home" onClick={() => setShowSidebar(false)}>CMS Home</Link></li>
              <li><Link className="text-white nav-link" to="/cms/about" onClick={() => setShowSidebar(false)}>CMS Sobre</Link></li>
              <li><Link className="text-white nav-link" to="/cms/portfolio" onClick={() => setShowSidebar(false)}>Portafolio</Link></li>
              <li><Link className="text-white nav-link" to="/clients" onClick={() => setShowSidebar(false)}>Clientes</Link></li>
              <li><Link className="text-white nav-link" to="/sessions" onClick={() => setShowSidebar(false)}>Sesiones</Link></li>
            </ul>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main
          className="p-4"
          style={{
            flexGrow: 1,
            width: "100%",
            overflowY: "auto",
            backgroundColor: "#f7f7f7"
          }}
        >
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-danger" onClick={logout}>
              Cerrar sesión
            </button>
          </div>

          <Outlet />
        </main>

      </div>
    </div>
  );
}
