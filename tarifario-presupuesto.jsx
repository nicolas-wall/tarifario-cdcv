import { useState, useEffect, useRef } from "react";

// ── Logo mark (fallback si no carga la imagen) ────────────────────────────
const DELogo = ({ height, width, fill = "#E6E6E6" }) => {
  const aspect = 522.34 / 377.65;
  const h = height ?? (width ? width / aspect : 24);
  const w = width ?? h * aspect;
  return (
    <svg width={w} height={h} viewBox="0 0 522.34 377.65" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      <path fill={fill} d="M0,0h75.78v377.65H0V0Z"/>
      <path fill={fill} d="M152.68,0h75.78v377.65h-75.78V0Z"/>
      <path fill={fill} d="M455.82,150.93v75.78s-151.57,0-151.57,0v-75.78s151.57,0,151.57,0Z"/>
      <path fill={fill} d="M522.34,0v75.78s-218.09,0-218.09,0V0s218.09,0,218.09,0Z"/>
      <path fill={fill} d="M522.34,301.4v75.78s-218.09,0-218.09,0v-75.78s218.09,0,218.09,0Z"/>
    </svg>
  );
};

// ── Design tokens ─────────────────────────────────────────────────────────
const BG  = '#0a0a0a';
const S1  = '#111111';
const S2  = '#161616';
const BD  = 'rgba(230,230,230,0.08)';
const BDM = 'rgba(230,230,230,0.14)';
const T   = '#E6E6E6';
const TM  = 'rgba(230,230,230,0.38)';
const TVM = 'rgba(230,230,230,0.15)';
const MAG = '#d9006c';
const CYN = '#00F0FF';
const DISPLAY = "'Clash Display','Arial Black',sans-serif";
const SANS    = "'Satoshi','Inter','Helvetica Neue',sans-serif";
const MONO    = "'JetBrains Mono','Courier New',monospace";
// ─────────────────────────────────────────────────────────────────────────

const TARIFARIO_INICIAL = {
  "Identidad y Marca": [
    { id: "id_01", nombre: "Identidad visual corporativa completa (logo + manual)", precio: 1950000 },
    { id: "id_02", nombre: "Diseño de logotipo (3 propuestas)", precio: 780000 },
    { id: "id_03", nombre: "Restyling de identidad existente", precio: 520000 },
    { id: "id_04", nombre: "Naming (desarrollo de nombre de marca)", precio: 390000 },
    { id: "id_05", nombre: "Eslogan / tagline", precio: 260000 },
    { id: "id_06", nombre: "Sistema de identidad (5 aplicaciones)", precio: 975000 },
  ],
  "Editorial": [
    { id: "ed_01", nombre: "Arte de tapa (tapa, contratapa y lomo)", precio: 357700 },
    { id: "ed_02", nombre: "Armado de página simple", precio: 21500 },
    { id: "ed_03", nombre: "Armado de página compuesta", precio: 37300 },
    { id: "ed_04", nombre: "Libro de 100 páginas (cuerpo y puesta en página)", precio: 1589200 },
    { id: "ed_05", nombre: "Revista de 30 páginas sin armado de publicidades", precio: 715800 },
    { id: "ed_06", nombre: "Catálogo de productos de 20 páginas", precio: 1070500 },
    { id: "ed_07", nombre: "Menú para restaurante (hasta 6 páginas)", precio: 288300 },
    { id: "ed_08", nombre: "Manual de instrucciones (por página)", precio: 54700 },
    { id: "ed_09", nombre: "Folleto instructivo tríptico A4", precio: 307400 },
  ],
  "Piezas Gráficas": [
    { id: "pg_01", nombre: "Tarjeta personal", precio: 130000 },
    { id: "pg_02", nombre: "Flyer / pieza digital (imagen estática)", precio: 91000 },
    { id: "pg_03", nombre: "Afiche / póster A3", precio: 195000 },
    { id: "pg_04", nombre: "Carpeta institucional", precio: 390000 },
    { id: "pg_05", nombre: "Díptico A4", precio: 195000 },
    { id: "pg_06", nombre: "Tríptico A4", precio: 292500 },
    { id: "pg_07", nombre: "Papelería institucional (set completo)", precio: 585000 },
    { id: "pg_08", nombre: "Diseño de packaging (baja complejidad)", precio: 390000 },
    { id: "pg_09", nombre: "Diseño de packaging (alta complejidad)", precio: 975000 },
  ],
  "Redes Sociales": [
    { id: "rs_01", nombre: "Pack de 10 placas para RRSS", precio: 390000 },
    { id: "rs_02", nombre: "Gestión mensual RRSS (1-4 posteos/semana)", precio: 520000 },
    { id: "rs_03", nombre: "Gestión mensual RRSS (5-8 posteos/semana)", precio: 780000 },
    { id: "rs_04", nombre: "Configuración y setup de perfil", precio: 195000 },
    { id: "rs_05", nombre: "Story animada", precio: 78000 },
    { id: "rs_06", nombre: "Reel / video corto (hasta 30 seg)", precio: 390000 },
  ],
  "Diseño Web": [
    { id: "dw_01", nombre: "Landing page (1 página)", precio: 975000 },
    { id: "dw_02", nombre: "Sitio web institucional (hasta 5 secciones)", precio: 1950000 },
    { id: "dw_03", nombre: "Tienda online / e-commerce básico", precio: 3250000 },
    { id: "dw_04", nombre: "Rediseño de sitio existente", precio: 1300000 },
    { id: "dw_05", nombre: "Mantenimiento web mensual", precio: 325000 },
    { id: "dw_06", nombre: "Banner web animado", precio: 195000 },
  ],
  "Audiovisual": [
    { id: "av_01", nombre: "Motion graphic / animación logo", precio: 520000 },
    { id: "av_02", nombre: "Video institucional (producción completa, hasta 2 min)", precio: 2600000 },
    { id: "av_03", nombre: "Post-producción video (por minuto)", precio: 390000 },
    { id: "av_04", nombre: "Infografía animada", precio: 650000 },
  ],
};

const CLIENTE_TIPOS = {
  A: { label: "A — Empresa grande (+20 empleados)", factor: 1.35, color: MAG },
  B: { label: "B — Pyme / institución (<20 empleados)", factor: 1.0,  color: T   },
  C: { label: "C — Particular / sin fines de lucro",   factor: 0.65, color: CYN },
};

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const nuevoId = (prefix = "x") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

// ── Storage ───────────────────────────────────────────────────────────────
const TAR_KEY = "tarifario-cdcv-data";
const CLI_KEY = "tarifario-cdcv-clientes";

const cargarJSON = (key) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch { return null; }
};
const guardarJSON = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};
// ─────────────────────────────────────────────────────────────────────────

export default function Tarifario() {
  // ── State ──────────────────────────────────────────────────────────────
  const [tarifario, setTarifario]         = useState(() => cargarJSON(TAR_KEY) || TARIFARIO_INICIAL);
  const [clientes, setClientes]           = useState(() => cargarJSON(CLI_KEY) || []);

  const [clienteTipo, setClienteTipo]     = useState("B");
  const [porcEstudio, setPorcEstudio]     = useState(0);
  const [seleccionados, setSeleccionados] = useState({});
  const [categoriaAbierta, setCategoriaAbierta] = useState(() => {
    const t = cargarJSON(TAR_KEY) || TARIFARIO_INICIAL;
    return Object.keys(t)[0] || "";
  });
  const [busqueda, setBusqueda]           = useState("");
  const [clienteId, setClienteId]         = useState("");
  const [nombrePresupuesto, setNombrePresupuesto] = useState("");

  const [vista, setVista]                 = useState("builder");

  // Edit tarifario
  const [editTar, setEditTar]             = useState(null);
  const [nuevoItemForm, setNuevoItemForm] = useState({});
  const [nuevaCat, setNuevaCat]           = useState("");

  // Clientes management
  const [clienteForm, setClienteForm]     = useState(null);

  // Historial
  const [historial, setHistorial]         = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [presupuestoVista, setPresupuestoVista]   = useState(null);
  const [linkCopiado, setLinkCopiado]             = useState(false);

  const previewRef = useRef(null);
  const presupuestoIdRef = useRef(null);
  const codigoRef = useRef(null);

  const ensurePresupuestoId = () => {
    if (!presupuestoIdRef.current) {
      const now = new Date();
      const yy = String(now.getFullYear()).slice(2);
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const rnd = String(Math.floor(Math.random() * 900) + 100);
      presupuestoIdRef.current = `pres_${Date.now()}`;
      codigoRef.current = `DE-${yy}${mm}${dd}-${rnd}`;
    }
    return { id: presupuestoIdRef.current, codigo: codigoRef.current };
  };

  // ── Fonts ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const links = [
      "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap",
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
    ].map(href => {
      const el = document.createElement("link");
      el.rel = "stylesheet"; el.href = href;
      document.head.appendChild(el); return el;
    });
    return () => links.forEach(el => document.head.removeChild(el));
  }, []);

  useEffect(() => {
    if (categoriaAbierta && !tarifario[categoriaAbierta]) {
      setCategoriaAbierta(Object.keys(tarifario)[0] || "");
    }
  }, [tarifario]);

  useEffect(() => {
    if (Object.keys(seleccionados).length === 0) {
      presupuestoIdRef.current = null;
      codigoRef.current = null;
    }
  }, [seleccionados]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("p");
    if (!sharedId) return;
    fetch(`/api/presupuestos?id=${sharedId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) { setPresupuestoVista(data); setVista("preview"); } });
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────
  const clienteActual   = clientes.find(c => c.id === clienteId) || null;
  const factorCliente   = CLIENTE_TIPOS[clienteTipo].factor;
  const factorEstudio   = 1 + porcEstudio / 100;
  const precioFinal     = (item) => Math.round(item.precio * factorCliente * factorEstudio);

  // totalNeto sin descuentos → para el presupuesto imprimible
  const totalNeto = Object.values(seleccionados).reduce((acc, { item, cantidad }) => {
    const vivo = Object.values(tarifario).flat().find(i => i.id === item.id) || item;
    return acc + precioFinal(vivo) * cantidad;
  }, 0);

  // totalNetoConDesc con descuentos → para el resumen interno del builder
  const totalNetoConDesc = Object.values(seleccionados).reduce((acc, { item, cantidad, descuento = 0 }) => {
    const vivo = Object.values(tarifario).flat().find(i => i.id === item.id) || item;
    const pf = precioFinal(vivo);
    const pfDesc = descuento > 0 ? Math.round(pf * (1 - descuento / 100)) : pf;
    return acc + pfDesc * cantidad;
  }, 0);

  const itemsFiltrados = busqueda
    ? Object.entries(tarifario).flatMap(([, items]) =>
        items.filter(i => i.nombre.toLowerCase().includes(busqueda.toLowerCase())))
    : null;
  const categorias = itemsFiltrados ? { "Resultados": itemsFiltrados } : tarifario;

  // ── Builder actions ────────────────────────────────────────────────────
  const toggleItem = (item) => {
    setSeleccionados(prev => {
      if (prev[item.id]) { const n = { ...prev }; delete n[item.id]; return n; }
      return { ...prev, [item.id]: { item, cantidad: 1, descripcion: "", descuento: 0 } };
    });
  };

  const setCantidad = (id, val) => {
    setSeleccionados(prev => ({ ...prev, [id]: { ...prev[id], cantidad: Math.max(1, parseInt(val) || 1) } }));
  };

  const setDescripcion = (id, val) => {
    setSeleccionados(prev => ({ ...prev, [id]: { ...prev[id], descripcion: val } }));
  };

  const setDescuento = (id, val) => {
    setSeleccionados(prev => ({ ...prev, [id]: { ...prev[id], descuento: Math.min(100, Math.max(0, parseInt(val) || 0)) } }));
  };

  const seleccionarCliente = (id) => {
    setClienteId(id);
    const c = clientes.find(cl => cl.id === id);
    if (c?.tipo) setClienteTipo(c.tipo);
  };

  // ── Tarifario edit ─────────────────────────────────────────────────────
  const entrarEdicion = () => {
    const copia = JSON.parse(JSON.stringify(tarifario));
    setEditTar(copia);
    const forms = {};
    Object.keys(copia).forEach(cat => { forms[cat] = { nombre: "", precio: "" }; });
    setNuevoItemForm(forms);
    setNuevaCat("");
    setVista("editar");
  };

  const guardarEdicion = () => {
    const parsed = {};
    Object.entries(editTar).forEach(([cat, items]) => {
      parsed[cat] = items.map(item => ({
        ...item,
        precio: parseInt(String(item.precio).replace(/\D/g, "")) || 0,
      }));
    });
    setTarifario(parsed);
    guardarJSON(TAR_KEY, parsed);
    const ids = new Set(Object.values(parsed).flat().map(i => i.id));
    setSeleccionados(prev => {
      const n = {};
      Object.entries(prev).forEach(([id, v]) => { if (ids.has(id)) n[id] = v; });
      return n;
    });
    setVista("builder");
  };

  const resetearTarifario = () => {
    if (!window.confirm("¿Resetear el tarifario a los valores originales?")) return;
    setEditTar(JSON.parse(JSON.stringify(TARIFARIO_INICIAL)));
    const forms = {};
    Object.keys(TARIFARIO_INICIAL).forEach(cat => { forms[cat] = { nombre: "", precio: "" }; });
    setNuevoItemForm(forms);
  };

  const editarItem = (cat, idx, field, val) => {
    setEditTar(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      n[cat][idx][field] = val;
      return n;
    });
  };

  const eliminarItem = (cat, idx) => {
    if (!window.confirm(`¿Eliminar "${editTar[cat][idx].nombre}"?`)) return;
    setEditTar(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      n[cat].splice(idx, 1);
      return n;
    });
  };

  const agregarItem = (cat) => {
    const form = nuevoItemForm[cat];
    if (!form?.nombre?.trim()) return;
    const precio = parseInt(String(form.precio).replace(/\D/g, "")) || 0;
    setEditTar(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      n[cat].push({ id: nuevoId("item"), nombre: form.nombre.trim(), precio });
      return n;
    });
    setNuevoItemForm(prev => ({ ...prev, [cat]: { nombre: "", precio: "" } }));
  };

  const eliminarCategoria = (cat) => {
    const qty = editTar[cat]?.length || 0;
    const msg = qty > 0
      ? `¿Eliminar la sección "${cat}" y sus ${qty} ítems?`
      : `¿Eliminar la sección "${cat}"?`;
    if (!window.confirm(msg)) return;
    setEditTar(prev => { const n = JSON.parse(JSON.stringify(prev)); delete n[cat]; return n; });
    setNuevoItemForm(prev => { const n = { ...prev }; delete n[cat]; return n; });
  };

  const agregarCategoria = () => {
    const nombre = nuevaCat.trim();
    if (!nombre || editTar[nombre]) return;
    setEditTar(prev => ({ ...prev, [nombre]: [] }));
    setNuevoItemForm(prev => ({ ...prev, [nombre]: { nombre: "", precio: "" } }));
    setNuevaCat("");
  };

  // ── Clients CRUD ───────────────────────────────────────────────────────
  const guardarCliente = () => {
    if (!clienteForm?.nombre?.trim()) return;
    const datos = { ...clienteForm, nombre: clienteForm.nombre.trim() };
    let nuevos;
    if (datos.id) {
      nuevos = clientes.map(c => c.id === datos.id ? datos : c);
    } else {
      nuevos = [...clientes, { ...datos, id: nuevoId("c") }];
    }
    setClientes(nuevos);
    guardarJSON(CLI_KEY, nuevos);
    setClienteForm(null);
  };

  const eliminarCliente = (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    const nuevos = clientes.filter(c => c.id !== id);
    setClientes(nuevos);
    guardarJSON(CLI_KEY, nuevos);
    if (clienteId === id) setClienteId("");
  };

  // ── Historial ──────────────────────────────────────────────────────────
  const cargarHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const r = await fetch("/api/presupuestos");
      if (r.ok) setHistorial(await r.json());
    } catch { /* offline o sin token */ }
    setCargandoHistorial(false);
  };

  const abrirHistorial = () => {
    setVista("historial");
    cargarHistorial();
  };

  const guardarEnHistorial = async (status = "brief", silent = false) => {
    const { id, codigo } = ensurePresupuestoId();
    const itemsData = Object.values(seleccionados).map(({ item, cantidad, descripcion, descuento = 0 }) => {
      const vivo = Object.values(tarifario).flat().find(i => i.id === item.id) || item;
      const pf = precioFinal(vivo);
      const pfDesc = descuento > 0 ? Math.round(pf * (1 - descuento / 100)) : pf;
      return { id: vivo.id, nombre: vivo.nombre, precio: vivo.precio, precioFinal: pf, cantidad, descripcion, descuento, precioConDesc: pfDesc, subtotal: pfDesc * cantidad };
    });
    const payload = {
      id,
      codigo,
      status,
      fechaISO: new Date().toISOString(),
      fecha: new Date().toLocaleDateString("es-AR"),
      nombrePresupuesto,
      cliente: clienteActual || null,
      clienteTipo,
      porcEstudio,
      factorCliente,
      factorEstudio,
      items: itemsData,
      totalNeto,
      totalNetoConDesc,
    };
    try {
      const r = await fetch("/api/presupuestos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!silent) {
        if (r.ok) alert("Presupuesto guardado en el historial ✓");
        else alert("Error al guardar. Verificá la conexión.");
      }
    } catch { if (!silent) alert("Sin conexión con el servidor."); }
  };

  const eliminarDelHistorial = async (blobUrl) => {
    if (!window.confirm("¿Eliminar este presupuesto del historial?")) return;
    await fetch(`/api/presupuestos?url=${encodeURIComponent(blobUrl)}`, { method: "DELETE" });
    setHistorial(prev => prev.filter(p => p.blobUrl !== blobUrl));
  };

  const abrirDesdeHistorial = (pres) => {
    setPresupuestoVista(pres);
    setVista("preview");
  };

  const copiarLink = (id) => {
    const url = `${window.location.origin}${window.location.pathname}?p=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2000);
    });
  };

  const irAPreview = () => {
    setPresupuestoVista(null);
    setVista("preview");
    if (Object.keys(seleccionados).length > 0) {
      guardarEnHistorial("brief", true);
    }
  };

  // ── Exportar ───────────────────────────────────────────────────────────
  const slug = (clienteActual?.nombre || "cliente").replace(/\s+/g, "-").toLowerCase();
  const fechaArchivo = new Date().toLocaleDateString("es-AR").replace(/\//g, "-");

  const guardarMD = () => {
    const fecha = new Date().toLocaleDateString("es-AR");
    const tipoInfo = CLIENTE_TIPOS[clienteTipo];
    let md = `# Presupuesto interno — ${clienteActual?.nombre || "Sin cliente"} — ${fecha}\n\n`;

    md += `## Cliente\n`;
    md += `- **Nombre:** ${clienteActual?.nombre || "—"}\n`;
    if (clienteActual?.direccion) md += `- **Dirección:** ${clienteActual.direccion}\n`;
    if (clienteActual?.telefono)  md += `- **Teléfono:** ${clienteActual.telefono}\n`;
    md += `- **Tipo:** ${clienteTipo} — ${tipoInfo.label}\n`;
    md += `- **Factor tipo:** ×${tipoInfo.factor}\n\n`;

    md += `## Configuración de precios\n`;
    md += `- **% Estudio adicional:** ${porcEstudio}%\n`;
    md += `- **Factor combinado (tipo × estudio):** ×${(factorCliente * factorEstudio).toFixed(3)}\n\n`;

    if (nombrePresupuesto) md += `## Referencia\n${nombrePresupuesto}\n\n`;

    md += `## Ítems\n\n`;
    md += `| Servicio | Nota | Cant. | Precio unit. | Descuento | P. c/desc. | Subtotal |\n`;
    md += `|---|---|---|---|---|---|---|\n`;

    Object.values(seleccionados).forEach(({ item, cantidad, descripcion, descuento = 0 }) => {
      const vivo = Object.values(tarifario).flat().find(i => i.id === item.id) || item;
      const pf = precioFinal(vivo);
      const pfDesc = descuento > 0 ? Math.round(pf * (1 - descuento / 100)) : pf;
      md += `| ${vivo.nombre} | ${descripcion || "—"} | ${cantidad} | ${fmt(pf)} | ${descuento > 0 ? descuento + "%" : "—"} | ${descuento > 0 ? fmt(pfDesc) : "—"} | ${fmt(pfDesc * cantidad)} |\n`;
    });

    md += `\n## Totales\n`;
    md += `- **Subtotal presupuestado al cliente:** ${fmt(totalNeto)}\n`;
    if (totalNetoConDesc !== totalNeto) {
      md += `- **Subtotal con descuentos internos:** ${fmt(totalNetoConDesc)}\n`;
      md += `- **Total descuentos aplicados:** ${fmt(totalNeto - totalNetoConDesc)}\n`;
    }
    md += `- **IVA 21%:** ${fmt(totalNeto * 0.21)}\n`;
    md += `- **Total al cliente c/IVA:** ${fmt(totalNeto * 1.21)}\n`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presupuesto-interno-${slug}-${fechaArchivo}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const guardarPDF = async () => {
    if (!previewRef.current) return;
    // Update status first, before PDF generation, so it always runs
    if (presupuestoVista) {
      const updated = { ...presupuestoVista, status: "exportado" };
      fetch("/api/presupuestos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
      setPresupuestoVista(updated);
      setHistorial(prev => prev.map(p => p.id === updated.id ? { ...p, status: "exportado" } : p));
    } else {
      await guardarEnHistorial("exportado", true);
    }
    const html2pdf = (await import("html2pdf.js")).default;
    const el = previewRef.current;
    const widthMm = 210;
    const heightMm = (el.offsetHeight / el.offsetWidth) * widthMm;
    html2pdf()
      .set({
        margin: 0,
        filename: `presupuesto-${slug}-${fechaArchivo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#111111" },
        jsPDF: { unit: "mm", format: [widthMm, heightMm], orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  // datos que se usan en el preview (live o desde historial)
  const dp = presupuestoVista || null;
  // ── Styles ─────────────────────────────────────────────────────────────
  const s = {
    page:  { minHeight: "100vh", background: BG, color: T, fontFamily: SANS, display: "flex", flexDirection: "column" },
    header:{ borderBottom: `1px solid ${BDM}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG, position: "sticky", top: 0, zIndex: 10 },
    btn: (active, color = MAG) => ({
      padding: "7px 18px", fontSize: "11px", letterSpacing: "0.12em", border: "1px solid",
      borderRadius: "2px", cursor: "pointer", fontFamily: MONO, textTransform: "uppercase",
      background: active ? `${color}12` : "transparent",
      borderColor: active ? color : BD, color: active ? color : TM,
    }),
    input: { padding: "10px 14px", background: S1, border: `1px solid ${BD}`, borderRadius: "2px", color: T, fontSize: "14px", fontFamily: SANS, width: "100%", boxSizing: "border-box", outline: "none" },
    label: { fontSize: "11px", letterSpacing: "0.12em", color: TM, textTransform: "uppercase", display: "block", marginBottom: "6px", fontFamily: MONO },
    iconBtn: (color = TM) => ({ background: "none", border: "none", color, cursor: "pointer", fontSize: "14px", padding: "3px 6px", fontFamily: MONO, borderRadius: "2px" }),
  };

  // ══════════════════════════════════════════════════════════════════════
  return (
    <div style={s.page}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <DELogo height={28} fill={T} />
          <span style={{ fontSize: "11px", letterSpacing: "0.16em", color: TM, textTransform: "uppercase", fontFamily: MONO }}>Tarifario</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => { setPresupuestoVista(null); setVista("builder"); }}  style={s.btn(vista === "builder")}>Armar</button>
          <button onClick={irAPreview}  style={s.btn(vista === "preview" && !presupuestoVista, CYN)}>Presupuesto</button>
          <button onClick={entrarEdicion}               style={s.btn(vista === "editar", TM)}>✎ Tarifario</button>
          <button onClick={() => { setClienteForm(null); setVista("clientes"); }} style={s.btn(vista === "clientes", CYN)}>Clientes</button>
          <button onClick={abrirHistorial} style={s.btn(vista === "historial", TM)}>Historial</button>
        </div>
      </header>

      {/* ══════════════ EDITAR TARIFARIO ══════════════ */}
      {vista === "editar" && editTar && (
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>

            {/* Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <div>
                <div style={{ fontFamily: DISPLAY, fontSize: "22px", fontWeight: "700", color: T, letterSpacing: "-0.02em", marginBottom: "4px" }}>Editar tarifario</div>
                <div style={{ fontSize: "11px", color: TM, fontFamily: MONO }}>Precios base para cliente B — A (+35%) y C (−35%) se calculan automáticamente</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={resetearTarifario} style={s.btn(false, TM)}>↺ Resetear</button>
                <button onClick={() => setVista("builder")} style={s.btn(false, TM)}>Cancelar</button>
                <button onClick={guardarEdicion} style={{ padding: "8px 20px", background: MAG, border: "none", borderRadius: "2px", color: "#fff", fontSize: "11px", cursor: "pointer", fontFamily: MONO, fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Guardar ✓
                </button>
              </div>
            </div>

            {/* Categorías */}
            {Object.entries(editTar).map(([cat, items], catIdx) => (
              <div key={cat} style={{ marginBottom: "20px", background: S1, border: `1px solid ${BD}`, borderRadius: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontFamily: MONO, fontSize: "11px", color: MAG }}>{String(catIdx + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: DISPLAY, fontSize: "14px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: T, flex: 1 }}>{cat}</span>
                  <button onClick={() => eliminarCategoria(cat)} style={s.iconBtn("rgba(255,80,80,0.6)")} title="Eliminar sección">✕ sección</button>
                </div>

                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderBottom: `1px solid ${BD}` }}>
                    <span style={{ fontFamily: MONO, fontSize: "11px", color: TVM, minWidth: "24px" }}>{String(idx + 1).padStart(2, "0")}</span>
                    <input
                      value={item.nombre}
                      onChange={e => editarItem(cat, idx, "nombre", e.target.value)}
                      style={{ flex: 1, padding: "6px 10px", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", color: T, fontSize: "13px", fontFamily: SANS, outline: "none" }}
                    />
                    <div style={{ position: "relative", width: "150px", flexShrink: 0 }}>
                      <span style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: TM, pointerEvents: "none", fontFamily: MONO }}>$</span>
                      <input
                        value={item.precio}
                        onChange={e => editarItem(cat, idx, "precio", e.target.value)}
                        style={{ width: "100%", padding: "6px 8px 6px 22px", boxSizing: "border-box", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", color: T, fontSize: "13px", fontFamily: MONO, textAlign: "right", outline: "none" }}
                      />
                    </div>
                    <button onClick={() => eliminarItem(cat, idx)} style={s.iconBtn("rgba(255,80,80,0.5)")} title="Eliminar ítem">✕</button>
                  </div>
                ))}

                {/* Add item form */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px" }}>
                  <span style={{ fontFamily: MONO, fontSize: "11px", color: TVM, minWidth: "24px" }}>+</span>
                  <input
                    placeholder="Nombre del nuevo ítem..."
                    value={nuevoItemForm[cat]?.nombre || ""}
                    onChange={e => setNuevoItemForm(prev => ({ ...prev, [cat]: { ...prev[cat], nombre: e.target.value } }))}
                    onKeyDown={e => e.key === "Enter" && agregarItem(cat)}
                    style={{ flex: 1, padding: "6px 10px", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", color: TM, fontSize: "13px", fontFamily: SANS, outline: "none" }}
                  />
                  <div style={{ position: "relative", width: "150px", flexShrink: 0 }}>
                    <span style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: TVM, pointerEvents: "none", fontFamily: MONO }}>$</span>
                    <input
                      placeholder="0"
                      value={nuevoItemForm[cat]?.precio || ""}
                      onChange={e => setNuevoItemForm(prev => ({ ...prev, [cat]: { ...prev[cat], precio: e.target.value } }))}
                      onKeyDown={e => e.key === "Enter" && agregarItem(cat)}
                      style={{ width: "100%", padding: "6px 8px 6px 22px", boxSizing: "border-box", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", color: TM, fontSize: "13px", fontFamily: MONO, textAlign: "right", outline: "none" }}
                    />
                  </div>
                  <button
                    onClick={() => agregarItem(cat)}
                    style={{ padding: "6px 14px", background: `${MAG}18`, border: `1px solid ${MAG}40`, borderRadius: "2px", color: MAG, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            ))}

            {/* Add category */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", padding: "14px 16px", background: S1, border: `1px dashed ${BD}`, borderRadius: "2px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: TM, fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Nueva sección</span>
              <input
                placeholder="Nombre de la categoría..."
                value={nuevaCat}
                onChange={e => setNuevaCat(e.target.value)}
                onKeyDown={e => e.key === "Enter" && agregarCategoria()}
                style={{ flex: 1, padding: "8px 10px", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", color: T, fontSize: "13px", fontFamily: SANS, outline: "none" }}
              />
              <button
                onClick={agregarCategoria}
                style={{ padding: "8px 18px", background: `${MAG}18`, border: `1px solid ${MAG}40`, borderRadius: "2px", color: MAG, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}
              >
                + Sección
              </button>
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={guardarEdicion} style={{ padding: "11px 30px", background: MAG, border: "none", borderRadius: "2px", color: "#fff", fontSize: "11px", cursor: "pointer", fontFamily: MONO, fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Guardar y volver →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CLIENTES ══════════════ */}
      {vista === "clientes" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: "22px", fontWeight: "700", color: T, letterSpacing: "-0.02em" }}>Base de clientes</div>
              <button
                onClick={() => setClienteForm({ nombre: "", direccion: "", telefono: "", tipo: "B" })}
                style={{ padding: "8px 18px", background: `${MAG}18`, border: `1px solid ${MAG}40`, borderRadius: "2px", color: MAG, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                + Nuevo cliente
              </button>
            </div>

            {clienteForm && (
              <div style={{ marginBottom: "16px", padding: "18px", background: S1, border: `1px solid ${BDM}`, borderRadius: "2px" }}>
                <div style={{ fontSize: "11px", color: MAG, fontFamily: MONO, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                  {clienteForm.id ? "Editar cliente" : "Nuevo cliente"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div>
                    <label style={s.label}>Nombre / Razón social</label>
                    <input value={clienteForm.nombre} onChange={e => setClienteForm(p => ({ ...p, nombre: e.target.value }))} style={s.input} placeholder="Empresa S.A." />
                  </div>
                  <div>
                    <label style={s.label}>Teléfono</label>
                    <input value={clienteForm.telefono} onChange={e => setClienteForm(p => ({ ...p, telefono: e.target.value }))} style={s.input} placeholder="(341) 555-0000" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={s.label}>Dirección</label>
                    <input value={clienteForm.direccion} onChange={e => setClienteForm(p => ({ ...p, direccion: e.target.value }))} style={s.input} placeholder="Av. Rivadavia 1234, Rafaela" />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label style={{ ...s.label, display: "inline", marginBottom: 0, marginRight: "10px" }}>Tipo</label>
                    <div style={{ display: "inline-flex", gap: "4px" }}>
                      {Object.entries(CLIENTE_TIPOS).map(([k, v]) => (
                        <button key={k} onClick={() => setClienteForm(p => ({ ...p, tipo: k }))}
                          style={{ padding: "5px 14px", borderRadius: "2px", border: "1px solid", cursor: "pointer", fontFamily: MONO, fontSize: "11px", fontWeight: "700", background: clienteForm.tipo === k ? `${v.color}15` : "transparent", borderColor: clienteForm.tipo === k ? v.color : BD, color: clienteForm.tipo === k ? v.color : TM }}>
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setClienteForm(null)} style={s.btn(false, TM)}>Cancelar</button>
                    <button onClick={guardarCliente} style={{ padding: "7px 18px", background: MAG, border: "none", borderRadius: "2px", color: "#fff", fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Guardar ✓
                    </button>
                  </div>
                </div>
              </div>
            )}

            {clientes.length === 0 && !clienteForm && (
              <div style={{ padding: "48px 16px", textAlign: "center", color: TVM, fontSize: "13px", border: `1px dashed ${BD}`, borderRadius: "2px", fontFamily: MONO }}>
                No hay clientes guardados. Agregá el primero con el botón de arriba.
              </div>
            )}
            {clientes.map((c, idx) => (
              <div key={c.id} style={{ padding: "14px 16px", background: S1, border: `1px solid ${BD}`, borderRadius: "2px", marginBottom: "4px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontFamily: MONO, fontSize: "11px", color: TVM, minWidth: "24px", paddingTop: "2px" }}>{String(idx + 1).padStart(2, "0")}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", color: T, fontFamily: DISPLAY, fontWeight: "700", letterSpacing: "-0.01em" }}>{c.nombre}</div>
                  {(c.direccion || c.telefono) && (
                    <div style={{ fontSize: "12px", color: TM, fontFamily: MONO, marginTop: "3px" }}>
                      {[c.direccion, c.telefono].filter(Boolean).join("  ·  ")}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "2px", background: `${CLIENTE_TIPOS[c.tipo || "B"].color}12`, border: `1px solid ${CLIENTE_TIPOS[c.tipo || "B"].color}35`, color: CLIENTE_TIPOS[c.tipo || "B"].color, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {c.tipo || "B"}
                </span>
                <button onClick={() => setClienteForm({ ...c })} style={s.iconBtn(TM)}>✎</button>
                <button onClick={() => eliminarCliente(c.id)} style={s.iconBtn("rgba(255,80,80,0.5)")}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ BUILDER ══════════════ */}
      {vista === "builder" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 57px)" }}>

          {/* Panel izquierdo */}
          <div style={{ width: "57%", overflowY: "auto", borderRight: `1px solid ${BD}`, padding: "24px 24px 60px" }}>

            {/* Nuevo presupuesto */}
            <button
              onClick={() => { setSeleccionados({}); setNombrePresupuesto(""); setClienteId(""); presupuestoIdRef.current = null; codigoRef.current = null; }}
              style={{ display: "block", width: "100%", padding: "11px", marginBottom: "12px", background: "transparent", border: `1px dashed ${BDM}`, borderRadius: "2px", color: TM, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              + Nuevo presupuesto
            </button>

            {/* Config */}
            <div style={{ background: S1, border: `1px solid ${BD}`, borderRadius: "2px", padding: "16px", marginBottom: "20px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {/* Columna izquierda: tipo */}
              <div style={{ flex: "1", minWidth: "190px" }}>
                <label style={s.label}>Tipo de cliente</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {Object.entries(CLIENTE_TIPOS).map(([k, v]) => (
                    <button key={k} onClick={() => setClienteTipo(k)} style={{
                      padding: "9px 12px", borderRadius: "2px", border: "1px solid", cursor: "pointer",
                      textAlign: "left", fontSize: "13px", fontFamily: MONO, letterSpacing: "0.04em",
                      background: clienteTipo === k ? `${v.color}10` : "transparent",
                      borderColor: clienteTipo === k ? v.color : BD,
                      color: clienteTipo === k ? v.color : TM,
                    }}>
                      <strong>{k}</strong>
                      <span style={{ marginLeft: "6px" }}>— {v.label.split("—")[1].trim()}</span>
                      <span style={{ float: "right", opacity: 0.6, fontSize: "11px" }}>{k === "A" ? "+35%" : k === "C" ? "−35%" : "base"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Columna derecha */}
              <div style={{ flex: "1", minWidth: "165px" }}>
                <label style={s.label}>Cliente</label>
                <select
                  value={clienteId}
                  onChange={e => seleccionarCliente(e.target.value)}
                  style={{ ...s.input, cursor: "pointer", marginBottom: "8px", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(230,230,230,0.3)'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "30px" }}
                >
                  <option value="">— Sin cliente —</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                {clienteActual && (
                  <div style={{ fontSize: "11px", color: TM, fontFamily: MONO, marginBottom: "10px" }}>
                    {[clienteActual.direccion, clienteActual.telefono].filter(Boolean).join("  ·  ") || "—"}
                  </div>
                )}

                <label style={s.label}>% Estudio adicional</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="number" min="0" max="300" value={porcEstudio} onChange={e => setPorcEstudio(Number(e.target.value))}
                    style={{ width: "68px", padding: "7px", background: BG, border: `1px solid ${BDM}`, borderRadius: "2px", color: T, fontSize: "16px", fontFamily: MONO, outline: "none" }} />
                  <span style={{ color: TM, fontSize: "14px", fontFamily: MONO }}>%</span>
                  <span style={{ fontSize: "12px", color: TM, fontFamily: MONO }}>→ ×{(factorCliente * factorEstudio).toFixed(2)}</span>
                </div>
                <input type="range" min="0" max="100" value={Math.min(porcEstudio, 100)} onChange={e => setPorcEstudio(Number(e.target.value))} style={{ width: "100%", accentColor: MAG, marginBottom: "10px" }} />

                <input placeholder="N° o descripción del presupuesto" value={nombrePresupuesto} onChange={e => setNombrePresupuesto(e.target.value)} style={s.input} />
              </div>
            </div>

            {/* Búsqueda */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input placeholder="Buscar servicio..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
                style={{ ...s.input, padding: "12px 36px 12px 14px" }} />
              {busqueda && (
                <button onClick={() => setBusqueda("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: TM, cursor: "pointer", fontSize: "14px" }}>✕</button>
              )}
            </div>

            {/* Categorías */}
            {Object.entries(categorias).map(([cat, items], catIdx) => (
              <div key={cat} style={{ marginBottom: "4px" }}>
                <button
                  onClick={() => setCategoriaAbierta(p => p === cat ? null : cat)}
                  style={{ width: "100%", padding: "13px 16px", background: categoriaAbierta === cat ? S2 : S1, border: `1px solid ${categoriaAbierta === cat ? BDM : BD}`, borderRadius: "2px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {!busqueda && <span style={{ fontFamily: MONO, fontSize: "11px", color: categoriaAbierta === cat ? MAG : TVM }}>{String(catIdx + 1).padStart(2, "0")}</span>}
                    <span style={{ fontFamily: DISPLAY, fontSize: "14px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: categoriaAbierta === cat ? T : TM }}>{cat}</span>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: "11px", color: TVM, display: "flex", alignItems: "center", gap: "10px" }}>
                    {items.filter(i => seleccionados[i.id]).length > 0 && (
                      <span style={{ color: MAG, fontSize: "11px" }}>{items.filter(i => seleccionados[i.id]).length} sel.</span>
                    )}
                    {categoriaAbierta === cat ? "▲" : "▼"}
                  </span>
                </button>

                {(categoriaAbierta === cat || busqueda) && (
                  <div style={{ paddingTop: "2px", display: "flex", flexDirection: "column", gap: "2px" }}>
                    {items.map((item, itemIdx) => {
                      const sel = !!seleccionados[item.id];
                      const cant = seleccionados[item.id]?.cantidad ?? 1;
                      const nota = seleccionados[item.id]?.descripcion ?? "";
                      const dscnt = seleccionados[item.id]?.descuento ?? 0;
                      const pf = precioFinal(item);
                      const pfDesc = dscnt > 0 ? Math.round(pf * (1 - dscnt / 100)) : pf;
                      return (
                        <div key={item.id}>
                          <div style={{ background: sel ? `${MAG}08` : S1, border: `1px solid ${sel ? MAG + "30" : BD}`, borderRadius: sel ? "2px 2px 0 0" : "2px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontFamily: MONO, fontSize: "11px", color: sel ? MAG : TVM, minWidth: "24px", flexShrink: 0 }}>{String(itemIdx + 1).padStart(2, "0")}</span>
                            <button onClick={() => toggleItem(item)} style={{ width: "17px", height: "17px", flexShrink: 0, border: `1.5px solid ${sel ? MAG : BDM}`, borderRadius: "2px", background: sel ? MAG : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                              {sel && <span style={{ color: "#fff", fontSize: "9px", fontWeight: "700", lineHeight: 1 }}>✓</span>}
                            </button>
                            <span style={{ flex: 1, fontSize: "13px", color: sel ? T : "rgba(230,230,230,0.45)", fontFamily: SANS, lineHeight: "1.4" }}>{item.nombre}</span>
                            {sel && (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "12px", color: TM, fontFamily: MONO }}>×</span>
                                <input type="number" min="1" value={cant} onChange={e => setCantidad(item.id, e.target.value)} onClick={e => e.stopPropagation()}
                                  style={{ width: "44px", padding: "4px 6px", textAlign: "center", background: BG, border: `1px solid ${BDM}`, borderRadius: "2px", color: T, fontSize: "13px", fontFamily: MONO, outline: "none" }} />
                                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                  <input type="number" min="0" max="100" value={dscnt} onChange={e => setDescuento(item.id, e.target.value)} onClick={e => e.stopPropagation()}
                                    style={{ width: "44px", padding: "4px 6px", textAlign: "center", background: BG, border: `1px solid ${dscnt > 0 ? CYN + "50" : BDM}`, borderRadius: "2px", color: dscnt > 0 ? CYN : TM, fontSize: "13px", fontFamily: MONO, outline: "none" }} />
                                  <span style={{ fontSize: "12px", color: dscnt > 0 ? CYN : TVM, fontFamily: MONO }}>%</span>
                                </div>
                              </div>
                            )}
                            <div style={{ textAlign: "right", minWidth: "120px" }}>
                              <div style={{ fontSize: "13px", color: sel ? (dscnt > 0 ? CYN : MAG) : TVM, fontWeight: "600", fontFamily: MONO }}>{fmt(sel ? pfDesc : pf)}</div>
                              {sel && dscnt > 0 && <div style={{ fontSize: "11px", color: TVM, fontFamily: MONO, textDecoration: "line-through" }}>{fmt(pf)}</div>}
                              {sel && porcEstudio > 0 && dscnt === 0 && <div style={{ fontSize: "11px", color: TVM, fontFamily: MONO }}>base {fmt(Math.round(item.precio * factorCliente))}</div>}
                            </div>
                          </div>
                          {/* Nota inline */}
                          {sel && (
                            <div style={{ background: `${MAG}05`, border: `1px solid ${MAG}20`, borderTop: "none", borderRadius: "0 0 2px 2px", padding: "7px 16px 9px 54px" }}>
                              <input
                                placeholder="Descripción o nota para el presupuesto..."
                                value={nota}
                                onChange={e => setDescripcion(item.id, e.target.value)}
                                style={{ width: "100%", padding: "5px 10px", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", color: TM, fontSize: "12px", fontFamily: MONO, outline: "none", boxSizing: "border-box" }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Panel derecho: resumen */}
          <div style={{ width: "43%", overflowY: "auto", padding: "24px", background: "#0d0d0d" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.16em", color: TM, textTransform: "uppercase", marginBottom: "18px", fontFamily: MONO }}>Resumen</div>

            {clienteActual && (
              <div style={{ marginBottom: "4px", fontSize: "18px", color: T, fontFamily: DISPLAY, fontWeight: "700", letterSpacing: "-0.01em" }}>{clienteActual.nombre}</div>
            )}
            {clienteActual && (clienteActual.direccion || clienteActual.telefono) && (
              <div style={{ marginBottom: "12px", fontSize: "12px", color: TM, fontFamily: MONO }}>
                {[clienteActual.direccion, clienteActual.telefono].filter(Boolean).join("  ·  ")}
              </div>
            )}
            {nombrePresupuesto && <div style={{ marginBottom: "16px", fontSize: "12px", color: TM, fontFamily: MONO }}>{nombrePresupuesto}</div>}

            <div style={{ marginBottom: "18px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 12px", borderRadius: "2px", fontSize: "11px", background: `${CLIENTE_TIPOS[clienteTipo].color}10`, border: `1px solid ${CLIENTE_TIPOS[clienteTipo].color}35`, color: CLIENTE_TIPOS[clienteTipo].color, fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Cliente {clienteTipo}
              </span>
              {porcEstudio > 0 && (
                <span style={{ padding: "4px 12px", borderRadius: "2px", fontSize: "11px", background: `${CYN}10`, border: `1px solid ${CYN}30`, color: CYN, fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase" }}>+{porcEstudio}% estudio</span>
              )}
            </div>

            {Object.keys(seleccionados).length === 0 ? (
              <div style={{ padding: "48px 16px", textAlign: "center", color: TVM, fontSize: "13px", border: `1px dashed ${BD}`, borderRadius: "2px", fontFamily: MONO, letterSpacing: "0.06em" }}>
                Seleccioná servicios del panel izquierdo
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "18px" }}>
                  {Object.values(seleccionados).map(({ item, cantidad, descripcion, descuento = 0 }) => {
                    const vivo = Object.values(tarifario).flat().find(i => i.id === item.id) || item;
                    const pf = precioFinal(vivo);
                    const pfDesc = descuento > 0 ? Math.round(pf * (1 - descuento / 100)) : pf;
                    return (
                      <div key={item.id} style={{ padding: "10px 14px", background: S1, border: `1px solid ${BD}`, borderRadius: "2px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", color: "rgba(230,230,230,0.7)", lineHeight: "1.4", fontFamily: SANS }}>{vivo.nombre}</div>
                            {descripcion && <div style={{ fontSize: "11px", color: TM, fontFamily: MONO, marginTop: "2px" }}>{descripcion}</div>}
                            {cantidad > 1 && <div style={{ fontSize: "11px", color: TM, fontFamily: MONO }}>× {cantidad} · {fmt(pfDesc)}</div>}
                            {descuento > 0 && <div style={{ fontSize: "11px", color: CYN, fontFamily: MONO, marginTop: "2px" }}>−{descuento}% dto. interno</div>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "13px", color: descuento > 0 ? CYN : MAG, fontWeight: "600", whiteSpace: "nowrap", fontFamily: MONO }}>{fmt(pfDesc * cantidad)}</div>
                            {descuento > 0 && <div style={{ fontSize: "11px", color: TVM, fontFamily: MONO, textDecoration: "line-through" }}>{fmt(pf * cantidad)}</div>}
                          </div>
                          <button onClick={() => toggleItem(item)} style={{ background: "none", border: "none", color: TVM, cursor: "pointer", fontSize: "14px", padding: "0 2px" }}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: "16px 18px", background: S1, border: `1px solid ${BDM}`, borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", color: TM, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: MONO }}>Total neto</span>
                    <span style={{ fontSize: "20px", color: T, fontWeight: "700", fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>{fmt(totalNetoConDesc)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: TM, fontFamily: MONO }}>IVA 21%</span>
                    <span style={{ fontSize: "13px", color: TM, fontFamily: MONO }}>{fmt(totalNetoConDesc * 0.21)}</span>
                  </div>
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "11px", color: TM, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: MONO }}>Total c/ IVA</span>
                    <span style={{ fontSize: "26px", color: MAG, fontWeight: "700", fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>{fmt(totalNetoConDesc * 1.21)}</span>
                  </div>
                </div>

                <button onClick={irAPreview} style={{ marginTop: "12px", width: "100%", padding: "14px", background: MAG, border: "none", borderRadius: "2px", color: "#fff", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", fontFamily: MONO, fontWeight: "600" }}>
                  Ver presupuesto →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ PREVIEW ══════════════ */}
      {vista === "preview" && (() => {
        // Datos del preview: historial (dp) o builder live
        const pvCliente        = dp?.cliente    || clienteActual;
        const pvNombre         = dp?.nombrePresupuesto ?? nombrePresupuesto;
        const pvFecha          = dp?.fecha      || new Date().toLocaleDateString("es-AR");
        const pvTotalNeto      = dp?.totalNeto  ?? totalNeto;
        const pvCodigo         = dp?.codigo     || codigoRef.current;
        const pvItems          = dp
          ? dp.items.map(i => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, descripcion: i.descripcion, precioFinal: i.precioFinal }))
          : Object.values(seleccionados).map(({ item, cantidad, descripcion }) => {
              const vivo = Object.values(tarifario).flat().find(i => i.id === item.id) || item;
              return { id: vivo.id, nombre: vivo.nombre, cantidad, descripcion, precioFinal: precioFinal(vivo) };
            });
        return (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
          <div ref={previewRef} style={{ background: S1, border: `1px solid ${BDM}`, borderRadius: "2px", overflow: "hidden" }}>

            {/* Banner superior */}
            <div style={{ position: "relative", height: "110px", background: "#0d0d0d", overflow: "hidden" }}>
              <img src="/images/presupuesto-header.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }} onError={e => { e.target.style.display = "none"; }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/images/logo.png" alt="Dos Elementos" style={{ height: "44px", objectFit: "contain" }}
                  onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
                <div style={{ display: "none" }}><DELogo width={120} fill="#ffffff" /></div>
              </div>
            </div>

            {/* Cabecera: nombre izq, dirección der */}
            <div style={{ padding: "28px 36px", borderBottom: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "9px", color: MAG, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px", fontFamily: MONO }}>[ Presupuesto ]</div>
                <div style={{ fontSize: "24px", color: T, fontWeight: "700", fontFamily: DISPLAY, letterSpacing: "-0.02em", marginBottom: "6px" }}>
                  {pvCliente?.nombre || "Cliente"}
                </div>
                {pvNombre && <div style={{ fontSize: "12px", color: TM, fontFamily: MONO }}>{pvNombre}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: TM, fontFamily: MONO, marginBottom: "4px" }}>{pvFecha}</div>
                {pvCodigo && <div style={{ fontSize: "11px", color: MAG, fontFamily: MONO, letterSpacing: "0.1em", marginBottom: "12px" }}>{pvCodigo}</div>}
                {pvCliente?.direccion && <div style={{ fontSize: "13px", color: T, fontFamily: MONO }}>{pvCliente.direccion}</div>}
                {pvCliente?.telefono  && <div style={{ fontSize: "13px", color: T, fontFamily: MONO, marginTop: "4px" }}>{pvCliente.telefono}</div>}
              </div>
            </div>

            {/* Tabla */}
            <div style={{ padding: "24px 36px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BD}` }}>
                    {["Servicio", "Cant.", "Precio unit.", "Subtotal"].map((h, i) => (
                      <th key={h} style={{ textAlign: i === 0 ? "left" : i === 1 ? "center" : "right", fontSize: "9px", color: TM, letterSpacing: "0.14em", textTransform: "uppercase", paddingBottom: "12px", fontFamily: MONO, fontWeight: "400", width: i === 1 ? "54px" : i > 1 ? "140px" : "auto" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pvItems.map((row) => (
                    <tr key={row.id} style={{ borderBottom: `1px solid ${BD}` }}>
                      <td style={{ padding: "12px 0" }}>
                        <div style={{ fontSize: "13px", color: "rgba(230,230,230,0.75)", fontFamily: SANS }}>{row.nombre}</div>
                        {row.descripcion && <div style={{ fontSize: "11px", color: TM, fontFamily: MONO, marginTop: "3px" }}>{row.descripcion}</div>}
                      </td>
                      <td style={{ padding: "12px 0", textAlign: "center", fontSize: "13px", color: TM, fontFamily: MONO }}>{row.cantidad}</td>
                      <td style={{ padding: "12px 0", textAlign: "right", fontSize: "13px", color: TM, fontFamily: MONO }}>{fmt(row.precioFinal)}</td>
                      <td style={{ padding: "12px 0", textAlign: "right", fontSize: "13px", color: T, fontWeight: "600", fontFamily: MONO }}>{fmt(row.precioFinal * row.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div style={{ padding: "0 36px 28px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "280px" }}>
                {[["Subtotal", fmt(pvTotalNeto), T], ["IVA (21%)", fmt(pvTotalNeto * 0.21), TM]].map(([label, val, color]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${BD}` }}>
                    <span style={{ fontSize: "12px", color: TM, fontFamily: MONO }}>{label}</span>
                    <span style={{ fontSize: "13px", color, fontFamily: MONO }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderTop: `1px solid ${BDM}` }}>
                  <span style={{ fontSize: "9px", color: TM, fontFamily: MONO, letterSpacing: "0.14em", textTransform: "uppercase" }}>Total</span>
                  <span style={{ fontSize: "26px", color: MAG, fontWeight: "700", fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>{fmt(pvTotalNeto * 1.21)}</span>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div style={{ margin: "0 36px 28px", padding: "14px 18px", background: BG, border: `1px solid ${BD}`, borderRadius: "2px", fontSize: "11px", color: TM, lineHeight: "1.7", fontFamily: MONO }}>
              <div style={{ marginBottom: "4px", color: TVM, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "9px" }}>— Notas</div>
              Los valores son orientativos y pueden variar según la complejidad del proyecto, plazos de entrega y otros factores específicos. No incluye gastos de materialización salvo indicación expresa. Validez del presupuesto: 15 días.
            </div>

            {/* Banner inferior */}
            <div style={{ position: "relative", height: "72px", background: "#0d0d0d", overflow: "hidden" }}>
              <img src="/images/presupuesto-footer.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} onError={e => { e.target.style.display = "none"; }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)" }}>info@doselementos.com</span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>·</span>
                <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)" }}>www.doselementos.com</span>
              </div>
            </div>

          </div>

          {dp && dp.items.some(i => i.descuento > 0) && (
            <div style={{ marginTop: "12px", padding: "14px 18px", background: S2, border: `1px solid ${BD}`, borderRadius: "2px" }}>
              <div style={{ fontSize: "9px", color: CYN, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: MONO, marginBottom: "10px" }}>[ Descuentos internos ]</div>
              {dp.items.filter(i => i.descuento > 0).map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderTop: `1px solid ${BD}` }}>
                  <span style={{ fontSize: "12px", color: TM, fontFamily: SANS }}>{i.nombre}</span>
                  <div style={{ display: "flex", gap: "16px", fontFamily: MONO }}>
                    <span style={{ fontSize: "12px", color: CYN }}>−{i.descuento}%</span>
                    <span style={{ fontSize: "12px", color: TVM }}>{fmt(i.precioConDesc)} u.</span>
                  </div>
                </div>
              ))}
              {dp.totalNetoConDesc !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${BDM}`, marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", color: TM, fontFamily: MONO }}>Neto con descuentos</span>
                  <span style={{ fontSize: "13px", color: CYN, fontFamily: MONO, fontWeight: "600" }}>{fmt(dp.totalNetoConDesc)} + IVA</span>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button
              onClick={() => { presupuestoVista ? setVista("historial") : setVista("builder"); setPresupuestoVista(null); }}
              style={{ padding: "9px 20px", background: "transparent", border: `1px solid ${BD}`, borderRadius: "2px", color: TM, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              ← {presupuestoVista ? "Historial" : "Volver"}
            </button>
            {(presupuestoVista?.id || presupuestoIdRef.current) && (
              <button
                onClick={() => copiarLink(presupuestoVista?.id || presupuestoIdRef.current)}
                style={{ padding: "9px 20px", background: linkCopiado ? `${CYN}20` : "transparent", border: `1px solid ${linkCopiado ? CYN + "60" : BD}`, borderRadius: "2px", color: linkCopiado ? CYN : TM, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}
              >
                {linkCopiado ? "✓ Copiado" : "⎘ Link"}
              </button>
            )}
            <button onClick={guardarPDF} style={{ padding: "9px 24px", background: MAG, border: "none", borderRadius: "2px", color: "#fff", fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "600" }}>
              ↓ Generar PDF
            </button>
          </div>
        </div>
        );
      })()}

      {/* ══════════════ HISTORIAL ══════════════ */}
      {vista === "historial" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: "22px", fontWeight: "700", color: T, letterSpacing: "-0.02em" }}>Historial</div>
              <button onClick={cargarHistorial} style={s.btn(false, TM)}>↺ Actualizar</button>
            </div>

            {cargandoHistorial && (
              <div style={{ padding: "48px", textAlign: "center", color: TVM, fontFamily: MONO, fontSize: "13px" }}>Cargando...</div>
            )}

            {!cargandoHistorial && historial.length === 0 && (
              <div style={{ padding: "48px 16px", textAlign: "center", color: TVM, fontSize: "13px", border: `1px dashed ${BD}`, borderRadius: "2px", fontFamily: MONO }}>
                No hay presupuestos guardados todavía.
              </div>
            )}

            {historial.map((pres) => (
              <div key={pres.id} style={{ padding: "16px 20px", background: S1, border: `1px solid ${BD}`, borderRadius: "2px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", color: T, fontFamily: DISPLAY, fontWeight: "700", letterSpacing: "-0.01em" }}>
                    {pres.cliente?.nombre || "Sin cliente"}
                    {pres.nombrePresupuesto && <span style={{ fontSize: "13px", color: TM, fontFamily: MONO, fontWeight: "400", marginLeft: "10px" }}>{pres.nombrePresupuesto}</span>}
                  </div>
                  <div style={{ marginTop: "4px", fontSize: "12px", color: TM, fontFamily: MONO, display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <span>{pres.fecha}</span>
                    {pres.codigo && <span style={{ color: MAG, letterSpacing: "0.08em" }}>{pres.codigo}</span>}
                    <span style={{ color: CLIENTE_TIPOS[pres.clienteTipo]?.color }}>{pres.clienteTipo} · {pres.porcEstudio > 0 ? `+${pres.porcEstudio}% estudio` : "sin recargo"}</span>
                    <span style={{ color: MAG }}>{fmt(pres.totalNeto * 1.21)} c/IVA</span>
                    <span style={{ padding: "2px 8px", borderRadius: "2px", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", background: pres.status === "exportado" ? `${CYN}20` : `${TVM}`, color: pres.status === "exportado" ? CYN : TM, border: `1px solid ${pres.status === "exportado" ? CYN + "40" : BD}` }}>
                      {pres.status === "exportado" ? "Exportado" : "Brief"}
                    </span>
                  </div>
                </div>
                <button onClick={() => copiarLink(pres.id)} style={{ padding: "7px 12px", background: "transparent", border: `1px solid ${BD}`, borderRadius: "2px", color: TM, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>⎘</button>
                <button
                  onClick={() => abrirDesdeHistorial(pres)}
                  style={{ padding: "7px 16px", background: `${CYN}12`, border: `1px solid ${CYN}30`, borderRadius: "2px", color: CYN, fontSize: "11px", cursor: "pointer", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  Ver / PDF
                </button>
                <button onClick={() => eliminarDelHistorial(pres.blobUrl)} style={s.iconBtn("rgba(255,80,80,0.5)")}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
