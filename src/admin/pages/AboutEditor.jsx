// src/admin/pages/AboutEditor.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/* ============================
   UPLOAD IMAGEN
============================ */
async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("about")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    alert("Error subiendo imagen");
    return null;
  }

  const { data } = supabase.storage
    .from("about")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/* ============================
   EDITOR ABOUT
============================ */
export default function AboutEditor() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const rowId = import.meta.env.VITE_ABOUT_ROW_ID;

  // Cargar contenido
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("id", rowId)
        .single();

      if (error) return console.error(error);
      setContent(data);
    }
    load();
  }, [rowId]);

  const updateField = (field, value) =>
    setContent((prev) => ({ ...prev, [field]: value }));

  // Guardar
  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("about_content")
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

  if (!content) return <p>Cargando contenido…</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1>Editor — Sobre mí</h1>
      <hr />

      {/* HERO */}
      <h2>Hero</h2>

      <label>Imagen principal</label>
      <input
        type="file"
        className="form-control mb-2"
        onChange={async (e) => {
          const url = await uploadImage(e.target.files[0]);
          if (url) updateField("hero_image", url);
        }}
      />

      {content.hero_image && (
        <img
          src={content.hero_image}
          style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
        />
      )}

      <label>Título</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_title || ""}
        onChange={(e) => updateField("hero_title", e.target.value)}
      />

      <label>Subtítulo</label>
      <textarea
        className="form-control mb-4"
        value={content.hero_subtitle || ""}
        onChange={(e) => updateField("hero_subtitle", e.target.value)}
      />

      <hr />

      {/* SECCIÓN PRINCIPAL */}
      <h2>Sección principal</h2>

      <label>Título principal</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.about_main_title || ""}
        onChange={(e) => updateField("about_main_title", e.target.value)}
      />

      <label>Texto principal</label>
      <textarea
        className="form-control mb-3"
        value={content.about_main_text || ""}
        onChange={(e) => updateField("about_main_text", e.target.value)}
      />

      <label>Imagen principal</label>
      <input
        type="file"
        className="form-control mb-2"
        onChange={async (e) => {
          const url = await uploadImage(e.target.files[0]);
          if (url) updateField("about_main_image", url);
        }}
      />

      {content.about_main_image && (
        <img
          src={content.about_main_image}
          style={{
            width: "100%",
            maxHeight: "260px",
            objectFit: "cover",
            marginBottom: "20px",
          }}
        />
      )}

      <hr />

      {/* BLOQUES */}
      <h2>Bloques inferiores</h2>

      {[1, 2, 3].map((n) => (
        <div key={n} style={{ marginBottom: "40px" }}>
          <h4>Bloque {n}</h4>

          <label>Imagen</label>
          <input
            type="file"
            className="form-control mb-2"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              if (url) updateField(`block${n}_image`, url);
            }}
          />

          {content[`block${n}_image`] && (
            <img
              src={content[`block${n}_image`]}
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
          )}

          <label>Título</label>
          <input
            type="text"
            className="form-control mb-2"
            value={content[`block${n}_title`] || ""}
            onChange={(e) =>
              updateField(`block${n}_title`, e.target.value)
            }
          />

          <label>Texto</label>
          <textarea
            className="form-control"
            value={content[`block${n}_text`] || ""}
            onChange={(e) =>
              updateField(`block${n}_text`, e.target.value)
            }
          />
        </div>
      ))}

      <hr />

      {/* CTA */}
      <h2>CTA final</h2>

      <label>Título CTA</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.cta_title || ""}
        onChange={(e) => updateField("cta_title", e.target.value)}
      />

      <label>Texto CTA</label>
      <textarea
        className="form-control mb-2"
        value={content.cta_text || ""}
        onChange={(e) => updateField("cta_text", e.target.value)}
      />

      <label>Texto del botón</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.cta_button_text || ""}
        onChange={(e) => updateField("cta_button_text", e.target.value)}
      />

      <label>Link del botón</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.cta_button_link || ""}
        onChange={(e) => updateField("cta_button_link", e.target.value)}
      />

      <button onClick={handleSave} className="btn btn-primary">
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
