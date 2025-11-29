import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// LOGIN ADMIN
import AdminLogin from "./admin/AdminLogin";

// LAYOUT
import AdminLayout from "./admin/AdminLayout";

// PÁGINAS
import AdminDashboard from "./admin/pages/AdminDashboard";
import HomeEditor from "./admin/pages/HomeEditor";
import AboutEditor from "./admin/pages/AboutEditor";
import PortfolioEditor from "./admin/pages/PortfolioEditor";
import PortfolioPhotos from "./admin/pages/PortfolioPhotos";
import ContactEditor from "./admin/pages/ContactEditor";
import GlobalEditor from "./admin/pages/GlobalEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route index element={<AdminDashboard />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="portfolio" element={<PortfolioEditor />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="global" element={<GlobalEditor />} />

          {/* RUTAS ANIDADAS CORRECTAS */}
          <Route path="portfolio/:albumId/photos" element={<PortfolioPhotos />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
