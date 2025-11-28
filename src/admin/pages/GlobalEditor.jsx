import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// ===============================
// SUBIR LOGO
// ===============================
async function uploadLogo(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("global")
    .upload(fileName, file);

  if (error) {
    alert("Error subiendo logo");
    return null;
  }

  const { data } = supabase.storage.from("global").getPublicUrl(fileName);
  return data.publicUrl;
}

export default function GlobalEditor() {
  const rowId = import.meta.env.VITE_GLOBAL_ROW_ID;

  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);

  // ============================
  // CARGAR
  // ============================
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("global_content")
        .select("*")
        .eq("id", rowId)
        .single();

      if (error) console.error(error);
      setContent(data);
    }
    load();
  }, [rowId]);

  // ============================
  // GUARDAR
  // ============================
  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("global_content")
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

  if (!content) return <p>Cargando...</p>;

  const updateField = (field, value) =>
    setContent((prev) => ({ ...prev, [field]: value }));

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1>Editor Global</h1>
      <p>Configura elementos generales del sitio.</p>

      <hr />

      {/* ================= LOGO ================= */}
      <h2>Logo del sitio</h2>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={async (e) => {
          const url = await uploadLogo(e.target.files[0]);
          if (url) updateField("logo_url", url);
        }}
      />

      {content.logo_url && (
        <img
          src={content.logo_url}
          style={{
            width: "180px",
            marginBottom: "20px",
          }}
        />
      )}

      <hr />

      {/* ================= CONTACTO ================= */}
      <h2>Contacto</h2>

      <label>Email</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.email || ""}
        onChange={(e) => updateField("email", e.target.value)}
      />

      <label>Teléfono</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.phone || ""}
        onChange={(e) => updateField("phone", e.target.value)}
      />

      <label>Instagram (URL)</label>
      <input
        type="text"
        className="form-control mb-2"
        value={content.instagram || ""}
        onChange={(e) => updateField("instagram", e.target.value)}
      />

      <label>Dirección</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.address || ""}
        onChange={(e) => updateField("address", e.target.value)}
      />

      <hr />

      {/* ================= FOOTER ================= */}
      <h2>Footer</h2>

      <label>Texto del footer</label>
      <textarea
        className="form-control mb-2"
        value={content.footer_text || ""}
        onChange={(e) => updateField("footer_text", e.target.value)}
      />

      <label>Copyright</label>
      <input
        type="text"
        className="form-control mb-4"
        value={content.copyright || ""}
        onChange={(e) => updateField("copyright", e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
