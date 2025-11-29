import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={styles.page}>
      {/* TÍTULO */}
      <h1 style={styles.title}>Panel Administrativo</h1>
      <p style={styles.subtitle}>Bienvenido, administra todo tu sitio desde aquí.</p>

      {/* GRID PRINCIPAL */}
      <div style={styles.grid}>

        {/* CARD — Home */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🏠 Home</h3>
          <p style={styles.cardText}>Edita el hero, servicios, carrusel, video y más.</p>
          <Link to="/admin/home" style={styles.cardBtn}>Ir a editar</Link>
        </div>

        {/* CARD — Sobre mí */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👤 Sobre mí</h3>
          <p style={styles.cardText}>Modifica tu historia, fotos y bloques informativos.</p>
          <Link to="/admin/about" style={styles.cardBtn}>Ir a editar</Link>
        </div>

        {/* CARD — Portafolio */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📸 Portafolio</h3>
          <p style={styles.cardText}>Crea álbumes, sube fotos, gestiona tu trabajo.</p>
          <Link to="/admin/portfolio" style={styles.cardBtn}>Administrar álbumes</Link>
        </div>

        {/* CARD — Contacto */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>✉️ Contacto</h3>
          <p style={styles.cardText}>Edita textos del formulario de contacto.</p>
          <Link to="/admin/contact" style={styles.cardBtn}>Editar contacto</Link>
        </div>

        {/* CARD — Global */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⚙️ Configuración global</h3>
          <p style={styles.cardText}>Logo, información general, footer y redes.</p>
          <Link to="/admin/global" style={styles.cardBtn}>Editar configuración</Link>
        </div>

      </div>

      {/* SECCIÓN DE ESTADÍSTICAS */}
      <h2 style={styles.sectionTitle}>📊 Estado general</h2>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <h3 style={styles.statNumber}>✓</h3>
          <p style={styles.statLabel}>Base conectada</p>
        </div>
        <div style={styles.statBox}>
          <h3 style={styles.statNumber}>✓</h3>
          <p style={styles.statLabel}>Storage funcionando</p>
        </div>
        <div style={styles.statBox}>
          <h3 style={styles.statNumber}>✓</h3>
          <p style={styles.statLabel}>Todo actualizado</p>
        </div>
      </div>
    </div>
  );
}


const styles = {
  page: {
    padding: "50px",
    maxWidth: "1200px",
    margin: "0 auto",
    color: "#222",
    fontFamily: "Inter, sans-serif",
  },

  title: {
    fontSize: "2.7rem",
    marginBottom: "8px",
    fontWeight: 700,
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
    marginBottom: "60px",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #eee",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: "1.4rem",
    marginBottom: "10px",
  },

  cardText: {
    opacity: 0.7,
    fontSize: ".95rem",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  cardBtn: {
    background: "#c5a054",
    color: "#fff",
    padding: "10px 14px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderRadius: "6px",
    fontSize: ".85rem",
    textDecoration: "none",
  },

  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "20px",
  },

  statsRow: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },

  statBox: {
    flex: "1",
    minWidth: "180px",
    background: "#fff",
    border: "1px solid #eee",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  },

  statNumber: {
    fontSize: "2rem",
    marginBottom: "6px",
  },

  statLabel: {
    opacity: 0.7,
  },
};
