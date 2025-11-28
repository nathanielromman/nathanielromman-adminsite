// admin-site/src/admin/pages/PortfolioPhotos.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function PortfolioPhotos() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Cargar álbum + fotos
  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1) Datos del álbum
      const { data: albumData, error: albumError } = await supabase
        .from("albums")
        .select("*")
        .eq("id", albumId)
        .single();

      if (albumError) {
        console.error(albumError);
        setLoading(false);
        return;
      }

      setAlbum(albumData);

      // 2) Fotos del álbum
      const { data: photosData, error: photosError } = await supabase
        .from("album_photos")
        .select("*")
        .eq("album_id", albumId)
        .order("created_at", { ascending: true });

      if (photosError) {
        console.error(photosError);
      }

      setPhotos(photosData || []);
      setLoading(false);
    }

    load();
  }, [albumId]);

  // Subir fotos
  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    try {
      for (const file of files) {
        const fileName = `${albumId}/${Date.now()}-${file.name}`;

        // Subir a STORAGE (bucket: portfolio)
        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(fileName, file);

        if (uploadError) {
          console.error(uploadError);
          alert("Error subiendo una foto");
          continue;
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // Guardar en tabla album_photos
        const { error: insertError } = await supabase
          .from("album_photos")
          .insert({
            album_id: albumId,
            image_url: publicUrl,
          });

        if (insertError) {
          console.error(insertError);
          alert("Error guardando foto en la base de datos");
        }
      }

      // Recargar lista
      const { data: photosData } = await supabase
        .from("album_photos")
        .select("*")
        .eq("album_id", albumId)
        .order("created_at", { ascending: true });

      setPhotos(photosData || []);
    } finally {
      setUploading(false);
      e.target.value = ""; // limpiar input
    }
  }

  // Borrar foto
  async function deletePhoto(photoId) {
    if (!confirm("¿Eliminar esta foto?")) return;

    const { error } = await supabase
      .from("album_photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      console.error(error);
      alert("Error borrando foto");
      return;
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  if (loading) return <p>Cargando fotos...</p>;
  if (!album) return <p>Álbum no encontrado.</p>;

  return (
    <div>
      <h1>Fotos de: {album.title}</h1>

      {album.cover_image && (
        <img
          src={album.cover_image}
          alt={album.title}
          style={{
            width: "100%",
            maxHeight: "260px",
            objectFit: "cover",
            borderRadius: "8px",
            margin: "15px 0 25px",
          }}
        />
      )}

      <h3>Subir nuevas fotos</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="form-control mb-3"
      />

      {uploading && <p>Subiendo fotos...</p>}

      <hr />

      <h3>Fotos del álbum</h3>

      {photos.length === 0 && <p>No hay fotos aún en este álbum.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px",
          marginTop: "15px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #eee",
            }}
          >
            <img
              src={photo.image_url}
              alt=""
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <button
              onClick={() => deletePhoto(photo.id)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "11px",
                padding: "4px 6px",
                cursor: "pointer",
              }}
            >
              Borrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
