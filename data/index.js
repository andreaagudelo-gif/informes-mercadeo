/* Registro de marcas y meses. Para activar una marca o mes: agrega aquí la entrada y crea data/<marca>-<mes>.js */
window.SITE = {
  title: "Stay Group · Informes de Mercadeo",
  /* Cambia este valor al publicar para que los navegadores no usen archivos viejos (también en index.html e informe.html) */
  version: "20261111-1410",
  brands: [
    { slug: "wake-biohotel", name: "Wake BioHotel", color: "#616652" },
    { slug: "silo",          name: "Silo",          color: "#A03914" },
    { slug: "sastra",        name: "Sastra",        color: "#212E41" },
    { slug: "wake-medellin", name: "Wake Medellín", color: "#723015" },
    { slug: "boro",          name: "Boro",          color: "#80431E" },
    { slug: "wake-living",   name: "Wake Living",   color: "#6B6B4F" }
  ],
  /* Grupos por propiedad (como en los PDF): el primer slug de cada grupo es la marca principal */
  groups: [
    { name: "Wake BioHotel · Silo · Sastra", brands: ["wake-biohotel", "silo", "sastra"] },
    { name: "Wake Medellín · Boro",          brands: ["wake-medellin", "boro"] },
    { name: "Wake Living",                   brands: ["wake-living"] }
  ],
  months: [
    { slug: "2026-10", label: "Octubre 2026" },
    { slug: "2026-11", label: "Noviembre 2026" }
  ],
  defaultMonth: "2026-10",
  /* Informes publicados: "marca/mes" */
  available: ["wake-biohotel/2026-10", "wake-living/2026-10", "wake-medellin/2026-10", "boro/2026-10", "silo/2026-10", "sastra/2026-10"]
};
