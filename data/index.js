/* Registro de marcas y meses. Para activar una marca o mes: agrega aquí la entrada y crea data/<marca>-<mes>.js */
window.SITE = {
  title: "Stay Group · Informes de Mercadeo",
  brands: [
    { slug: "wake-biohotel", name: "Wake BioHotel", color: "#616652" },
    { slug: "wake-living",   name: "Wake Living",   color: "#8A8578" },
    { slug: "wake-medellin", name: "Wake Medellín", color: "#B2B6B0" },
    { slug: "boro",          name: "Boro",          color: "#7A4B3A" },
    { slug: "silo",          name: "Silo",          color: "#548055" },
    { slug: "sastra",        name: "Sastra",        color: "#3A577F" }
  ],
  months: [
    { slug: "2026-10", label: "Octubre 2026" },
    { slug: "2026-11", label: "Noviembre 2026" }
  ],
  defaultMonth: "2026-10",
  /* Informes publicados: "marca/mes" */
  available: ["wake-biohotel/2026-10"]
};
