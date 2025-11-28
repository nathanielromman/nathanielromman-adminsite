// src/admin/pages/PortfolioEditor.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function PortfolioEditor() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    slug: "",
    category: "",
    cover_image: ""
  });

  // Cargar álbumes
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("albums")
        .select("*")
        .order("created_at", { ascending: false });

      setAlbums(data || []);
      setLoading(false);
    }
    load();
  }, []);

  // Crear álbum
  async function createAlbum() {
    if (!newAlbum.title || !newAlbum.slug) {
      alert("Falta título o slug");
      return;
    }

    const { error } = await supabase.from("albums").insert(newAlbum);

    if (error) {
      console.error(error);
      alert("Error creando álbum");
      return;
    }

    window.location.reload();
  }

  // Subir cover
  async function uploadCover(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      alert("Error subiendo imagen");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    setNewAlbum({ ...newAlbum, cover_image: urlData.publicUrl });
  }

  // 🔥 BORRAR ÁLBUM COMPLETO — con fotos
  async function deleteAlbum(album) {
    const ok = confirm(
      `¿Seguro que quieres borrar el álbum "${album.title}"?\n\nEsto borrará TODAS sus fotos.`
    );
    if (!ok) return;

    // 1) Borrar las fotos del bucket /portfolio/{album.id}/
    const { data: photos } = await supabase.storage
      .from("portfolio")
      .list(`${album.id}/`);

    if (photos && photos.length > 0) {
      const paths = photos.map((p) => `${album.id}/${p.name}`);
      await supabase.storage.from("portfolio").remove(paths);
    }

    // 2) Borrar el álbum de la tabla
    const { error } = await supabase
      .from("albums")
      .delete()
      .eq("id", album.id);

    if (error) {
      console.error(error);
      alert("Error al borrar álbum");
      return;
    }

    alert("Álbum eliminado");
    window.location.reload();
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Álbumes del portafolio</h1>

      {/* CREAR NUEVO ÁLBUM */}
      <h3 className="mt-4">Crear nuevo álbum</h3>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Título"
        onChange={(e) =>
          setNewAlbum({ ...newAlbum, title: e.target.value })
        }
      />

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Slug (ej: boda-ana-luis)"
        onChange={(e) =>
          setNewAlbum({ ...newAlbum, slug: e.target.value })
        }
      />

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Categoría (opcional)"
        onChange={(e) =>
          setNewAlbum({ ...newAlbum, category: e.target.value })
        }
      />

      <label>Imagen de portada</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={uploadCover}
      />

      {newAlbum.cover_image && (
        <img
          src={newAlbum.cover_image}
          style={{
            width: "100%",
            maxHeight: "250px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
      )}

      <button className="btn btn-primary" onClick={createAlbum}>
        Crear álbum
      </button>

      <hr />

      {/* LISTA DE ÁLBUMES */}
      <h3>Álbumes existentes</h3>

      {albums.length === 0 && <p>No hay álbumes aún.</p>}

      {albums.map((a) => (
        <div
          key={a.id}
          style={{
            padding: "15px 0",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={a.cover_image}
            alt={a.title}
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />

          <div style={{ flex: 1 }}>
            <strong>{a.title}</strong>
            <br />
            <small>{a.slug}</small>
          </div>

          <Link
            to={`/admin/portfolio/${a.id}/photos`}
            className="btn btn-sm btn-dark"
          >
            Fotos
          </Link>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteAlbum(a)}
          >
            Borrar
          </button>
        </div>
      ))}
    </div>
  );
}
