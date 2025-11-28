// admin-site/src/admin/pages/HomeEditor.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/* =============================
   Helper subir imágenes (bucket: home)
============================= */
async function uploadImage(file) {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("home")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    alert("Error subiendo imagen");
    return null;
  }

  const { data } = supabase.storage.from("home").getPublicUrl(fileName);
  return data.publicUrl;
}

export default function HomeEditor() {
  const rowId = import.meta.env.VITE_HOME_ROW_ID;
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar fila
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .eq("id", rowId)
        .single();

      if (error) {
        console.error(error);
        return;
      }
      setContent(data);
    }
    load();
  }, [rowId]);

  const updateField = (field, value) =>
    setContent((prev) => ({ ...prev, [field]: value }));

  async function handleSave() {
    if (!content) return;
    setSaving(true);

    const { error } = await supabase
      .from("home_content")
      .update(content)
      .eq("id", rowId);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("❌ Error al guardar");
    } else {
      alert("✅ Guardado con éxito");
    }
  }

  if (!content) return <p>Cargando editor...</p>;

  return (
    <div style={{ maxWidth: "950px", margin: "0 auto" }}>
      <h1>Editor de Home</h1>
      <p>Edita todas las secciones de la página principal.</p>

      {/* ================= HERO ================= */}
      <hr />
      <h2>Hero</h2>

      <label>Imagen de fondo</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={async (e) => {
          const url = await uploadImage(e.target.files[0]);
          if (url) updateField("hero_image", url);
        }}
      />
      {content.hero_image && (
        <img
          src={content.hero_image}
          style={{
            width: "100%",
            maxHeight: "280px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
      )}

      <label>Kicker</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_kicker || ""}
        onChange={(e) => updateField("hero_kicker", e.target.value)}
      />

      <label>Título grande</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_title || ""}
        onChange={(e) => updateField("hero_title", e.target.value)}
      />

      <label>Subtítulo</label>
      <textarea
        className="form-control mb-2"
        value={content.hero_subtitle || ""}
        onChange={(e) => updateField("hero_subtitle", e.target.value)}
      />

      <label>Botón 1 — texto</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_btn1_text || ""}
        onChange={(e) => updateField("hero_btn1_text", e.target.value)}
      />

      <label>Botón 1 — link</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_btn1_link || ""}
        onChange={(e) => updateField("hero_btn1_link", e.target.value)}
      />

      <label>Botón 2 — texto</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_btn2_text || ""}
        onChange={(e) => updateField("hero_btn2_text", e.target.value)}
      />

      <label>Botón 2 — link</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.hero_btn2_link || ""}
        onChange={(e) => updateField("hero_btn2_link", e.target.value)}
      />

      {/* ============== SECCIÓN "CRAFT YOUR LEGACY" ============== */}
      <hr />
      <h2>Sección Legacy (como la foto que mandaste)</h2>

      <h4>Columna izquierda</h4>
      <label>Título</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.legacy_left_title || ""}
        onChange={(e) => updateField("legacy_left_title", e.target.value)}
      />

      <label>Texto pequeño / firma</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.legacy_left_kicker || ""}
        onChange={(e) => updateField("legacy_left_kicker", e.target.value)}
      />

      <h4>Imagen central</h4>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={async (e) => {
          const url = await uploadImage(e.target.files[0]);
          if (url) updateField("legacy_center_image", url);
        }}
      />
      {content.legacy_center_image && (
        <img
          src={content.legacy_center_image}
          style={{
            width: "100%",
            maxHeight: "320px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
      )}

      <h4>Columna derecha</h4>
      <label>Título pequeño</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.legacy_right_title || ""}
        onChange={(e) => updateField("legacy_right_title", e.target.value)}
      />

      <label>Texto</label>
      <textarea
        className="form-control mb-2"
        value={content.legacy_right_text || ""}
        onChange={(e) => updateField("legacy_right_text", e.target.value)}
      />

      <label>Botón — texto</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.legacy_button_text || ""}
        onChange={(e) => updateField("legacy_button_text", e.target.value)}
      />

      <label>Botón — link</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.legacy_button_link || ""}
        onChange={(e) => updateField("legacy_button_link", e.target.value)}
      />

      {/* ============== CARRUSEL SIMPLE ============== */}
      <hr />
      <h2>Galería / Carrusel</h2>

      <label>Título</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.carousel_title || ""}
        onChange={(e) => updateField("carousel_title", e.target.value)}
      />

      <label>Subtítulo</label>
      <textarea
        className="form-control mb-3"
        value={content.carousel_subtitle || ""}
        onChange={(e) => updateField("carousel_subtitle", e.target.value)}
      />

      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="mb-3">
          <label>Imagen carrusel {n}</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-1"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              if (url) updateField(`carousel_image${n}`, url);
            }}
          />
          {content[`carousel_image${n}`] && (
            <img
              src={content[`carousel_image${n}`]}
              style={{
                width: "100%",
                maxHeight: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}
        </div>
      ))}

      {/* ============== PREMIOS / PUBLICACIONES ============== */}
      <hr />
      <h2>Premios / Publicaciones</h2>

      <label>Título</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.awards_title || ""}
        onChange={(e) => updateField("awards_title", e.target.value)}
      />

      <label>Subtítulo</label>
      <textarea
        className="form-control mb-3"
        value={content.awards_subtitle || ""}
        onChange={(e) => updateField("awards_subtitle", e.target.value)}
      />

      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="mb-2">
          <label>Logo {n}</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-1"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              if (url) updateField(`awards_logo${n}`, url);
            }}
          />
          {content[`awards_logo${n}`] && (
            <img
              src={content[`awards_logo${n}`]}
              style={{ height: "50px", objectFit: "contain" }}
            />
          )}
        </div>
      ))}

      {/* ============== VIDEO ============== */}
      <hr />
      <h2>Video</h2>

      <label>Título video</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.video_title || ""}
        onChange={(e) => updateField("video_title", e.target.value)}
      />

      <label>Subtítulo video</label>
      <textarea
        className="form-control mb-2"
        value={content.video_subtitle || ""}
        onChange={(e) => updateField("video_subtitle", e.target.value)}
      />

      <label>URL del video (YouTube/Vimeo o MP4)</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.video_url || ""}
        onChange={(e) => updateField("video_url", e.target.value)}
      />

      <label>Imagen de portada (opcional)</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={async (e) => {
          const url = await uploadImage(e.target.files[0]);
          if (url) updateField("video_poster", url);
        }}
      />
      {content.video_poster && (
        <img
          src={content.video_poster}
          style={{
            width: "100%",
            maxHeight: "260px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}

      {/* ============== LOGOS MARCAS ============== */}
      <hr />
      <h2>Logos de marcas</h2>

      <label>Título de la sección</label>
      <input
        type="text"
        className="form-control mb-3"
        value={content.brands_title || ""}
        onChange={(e) => updateField("brands_title", e.target.value)}
      />

      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="mb-2">
          <label>Logo marca {n}</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-1"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              if (url) updateField(`brand_logo${n}`, url);
            }}
          />
          {content[`brand_logo${n}`] && (
            <img
              src={content[`brand_logo${n}`]}
              style={{ height: "50px", objectFit: "contain" }}
            />
          )}
        </div>
      ))}

      {/* ============== SERVICIOS ============== */}
      <hr />
      <h2>Servicios (4)</h2>

      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={{ marginBottom: "30px" }}>
          <h4>Servicio {n}</h4>

          <label>Imagen</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-1"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              if (url) updateField(`service${n}_image`, url);
            }}
          />
          {content[`service${n}_image`] && (
            <img
              src={content[`service${n}_image`]}
              style={{
                width: "100%",
                maxHeight: "220px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
          )}

          <label>Título</label>
          <input
            type="text"
            className="form-control mb-2"
            value={content[`service${n}_title`] || ""}
            onChange={(e) =>
              updateField(`service${n}_title`, e.target.value)
            }
          />

          <label>Texto</label>
          <textarea
            className="form-control"
            value={content[`service${n}_text`] || ""}
            onChange={(e) =>
              updateField(`service${n}_text`, e.target.value)
            }
          />
        </div>
      ))}

      {/* ============== CTA FINAL ============== */}
      <hr />
      <h2>CTA final</h2>

      <label>Título</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.cta_title || ""}
        onChange={(e) => updateField("cta_title", e.target.value)}
      />

      <label>Texto</label>
      <textarea
        className="form-control mb-2"
        value={content.cta_text || ""}
        onChange={(e) => updateField("cta_text", e.target.value)}
      />

      <label>Texto botón</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.cta_button || ""}
        onChange={(e) => updateField("cta_button", e.target.value)}
      />

      <label>Link botón</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.cta_link || ""}
        onChange={(e) => updateField("cta_link", e.target.value)}
      />

      <button
        onClick={handleSave}
        className="btn btn-primary mb-5"
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
