// admin-site/src/pages/ContactEditor.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("contact")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    alert("Error subiendo imagen");
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("contact")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export default function ContactEditor() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const rowId = import.meta.env.VITE_CONTACT_ROW_ID;

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("contact_content")
        .select("*")
        .eq("id", rowId)
        .single();

      if (error) return console.error(error);
      setContent(data);
    }
    load();
  }, [rowId]);

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("contact_content")
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

  if (!content) return <p>Cargando contenido...</p>;

  const updateField = (field, value) =>
    setContent((prev) => ({ ...prev, [field]: value }));

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1>Editor — Contacto</h1>
      <p>Edita los textos y hero del formulario de contacto.</p>

      <hr />

      {/* HERO */}
      <h2>Hero</h2>

      <label>Imagen del hero</label>
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
            maxHeight: "260px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "16px",
            marginTop: "8px",
          }}
        />
      )}

      <label>Título del hero</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.hero_title || ""}
        onChange={(e) => updateField("hero_title", e.target.value)}
      />

      <label>Subtítulo del hero</label>
      <textarea
        className="form-control mb-4"
        value={content.hero_subtitle || ""}
        onChange={(e) => updateField("hero_subtitle", e.target.value)}
      />

      <hr />

      <h2>Texto introductorio</h2>

      <label>Título</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.intro_title || ""}
        onChange={(e) => updateField("intro_title", e.target.value)}
      />

      <label>Subtítulo</label>
      <textarea
        className="form-control mb-4"
        value={content.intro_subtitle || ""}
        onChange={(e) => updateField("intro_subtitle", e.target.value)}
      />

      <button
        onClick={handleSave}
        className="btn btn-primary"
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}

