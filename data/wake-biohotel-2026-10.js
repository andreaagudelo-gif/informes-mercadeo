/* Informe Wake BioHotel · Octubre 2026. Cifras del informe mensual de Mercadeo (fuentes al final). */
window.REPORTS = window.REPORTS || {};
window.REPORTS["wake-biohotel/2026-10"] = {
  photos: {
    hero: "assets/img/wb-hero-aerea.jpg",
    logo: "assets/img/wake-biohotel-logo-blanco.png",
    card: "assets/img/wb-torre-noche.jpg",
    dividers: [
      { src: "assets/img/wb-piscina.jpg", alt: "Piscina cubierta de Wake BioHotel", caption: "Bienestar y ciencia, medidos mes a mes." },
      { src: "assets/img/wb-terraza.jpg", alt: "Terraza de Wake BioHotel con vista a Medellín", caption: "" },
      { src: "assets/img/wb-cold-plunge.jpg", alt: "Área de cold plunge de Wake BioHotel", caption: "" }
    ],
    credit: "Fotos: wake.com.co/biohotel"
  },
  brand: "Wake BioHotel",
  month: "Octubre 2026",
  period: "1 al 31 de octubre de 2026 · comparado con septiembre",
  headline: [
    { label: "Inversión en pauta", value: 14.22, display: "$14,22 M", prefix: "$", suffix: " M", decimals: 2, note: "COP · Google, Meta y TikTok (TikTok con datos al 28 oct)", delta: "Comparable con septiembre (sin campañas compartidas ni TikTok): $12,92 M, +0,8% vs. $12,83 M", trend: "up" },
    { label: "ROI", value: 17.3, display: "17,3x", suffix: "x", decimals: 1, note: "Ingresos sitio web ($246,4 M COP) / inversión en pauta BioHotel ($14,22 M, con TikTok y campañas compartidas) · sin fee", delta: "Con la regla de septiembre (sin compartidas ni TikTok): 19,1x vs. 15,8x", trend: "up" },
    { label: "Participación canal web", value: 17.8, display: "17,8%", suffix: "%", decimals: 1, note: "IDeaS · 59.809 de ingresos netos del canal web en octubre", delta: "+2,0 pp vs. septiembre (15,8%, Optix)", trend: "up" },
    { label: "Ingresos sitio web", value: 77019, display: "US$77.019", prefix: "US$", decimals: 0, note: "≈ $246,4 M COP (TRM promedio $3.199)", delta: "+20,8% vs. septiembre (US$63.740)", trend: "up" },
    { label: "Reservas sitio web", value: 102, display: "102", decimals: 0, note: "Motor SynXis vía Opera (fecha de reserva)", delta: "+32,5% vs. septiembre (77)", trend: "up" },
    { label: "Sesiones totales", value: 23156, display: "23.156", decimals: 0, note: "GA4", delta: "−34,5% vs. septiembre (35.362)", trend: "down" },
  ],
  bookingsNote: "Reservas e ingresos = lo generado (reservado) en octubre en el motor web, aunque la estadía sea posterior.",
  web: [
    { label: "Reservas sitio web", display: "102", delta: "+32,5% vs. sept. (77)", trend: "up" },
    { label: "Ingresos sitio web", display: "US$77.019", delta: "+20,8% vs. sept. (US$63.740) · ≈ $246,4 M COP", trend: "up" },
    { label: "Participación canal web", display: "17,8%", delta: "+2,0 pp vs. sept. (15,8%) · IDeaS: 59.809 netos del canal web", trend: "up" },
    { label: "Sesiones totales", display: "23.156", delta: "−34,5% vs. sept. (35.362)", trend: "down" },
    { label: "Sesiones orgánicas", display: "1.638", delta: "−21,9% vs. sept. (2.097)", trend: "down" },
    { label: "Participación SEO", display: "7,1%", delta: "+1,1 pp vs. sept. (5,9%)", trend: "up" },
  ],
  ads: {
    total: { display: "$14,22 M", value: 14.22 },
    roi: { display: "17,3x", value: 17.3 },
    paidSessions: { display: "16.415", delta: "−38,9% vs. sept. (26.876) · 70,9% del sitio (sept. 76,0%)" },
    channels: [
      { name: "Google Ads", spend: 10370000, spendDisplay: "$10,37 M", sessionsOct: 6749, sessionsSep: 10950, delta: "+2,0% inversión · −38,4% sesiones vs. septiembre", note: "Búsqueda USA y Colombia, búsqueda de marca y Performance Max" },
      { name: "Meta Ads", spend: 3220000, spendDisplay: "$3,22 M", sessionsOct: 8024, sessionsSep: 14476, delta: "Sin los conjuntos de campañas compartidas ($2,55 M): −4,1% inversión · −44,6% sesiones vs. septiembre", note: "Incluye $672.652 de conjuntos BioHotel en campañas compartidas: perfil_all $389.523 y eventos_all $283.129" },
      { name: "TikTok Ads", spend: 619884, spendDisplay: "$619.884", sessionsOct: 1642, sessionsSep: 1450, delta: "+13,2% sesiones vs. septiembre (1.450)", note: "Campaña 72026-07_contravia_Alcance_Biohotel · inversión con datos al 28 de octubre" },
    ],
    roiNote: "ROI = ingresos del sitio web en COP / inversión en pauta. No incluye el fee de agencia. La comparación con septiembre usa la misma regla (sin campañas compartidas ni TikTok): 19,1x vs. 15,8x.",
    chartNote: "Valores de inversión aproximados a millones (Google $10,37 M, Meta $3,22 M) tal como aparecen en el informe.",
  },
  social: {
    instagram: {
      handle: "@wake.biohotel",
      items: [
        { label: "Seguidores", value: 17296, display: "17.296", delta: "+2,1% vs. sept. (16.944) · +596 ganados en octubre", note: "Meta Business Suite, corte 9 nov" },
        { label: "Alcance", value: 147453, display: "147.453", delta: "+6,7% vs. septiembre" },
        { label: "Impresiones", value: 260527, display: "260.527", delta: "+8,4% vs. septiembre", note: "HighLevel" },
        { label: "Interacciones", value: 1016, display: "1.016", delta: "−33,4% vs. septiembre", trend: "down" },
        { label: "Engagement rate", value: 0.69, display: "0,69%", note: "Interacciones / alcance" },
      ],
    },
    facebook: {
      handle: "Wake BioHotel (página)",
      items: [
        { label: "Seguidores", value: 378, display: "378", note: "Meta Business Suite, total al 8–9 nov" },
        { label: "Seguidores ganados en octubre", value: 61, display: "+61", note: "HighLevel Social Planner" },
        { label: "Impresiones", value: 106935, display: "106.935", delta: "−62,7% vs. septiembre", trend: "down", note: "HighLevel Social Planner" },
      ],
    },
    tiktok: {
      handle: "@wake.biohotel",
      items: [
        { label: "Seguidores", value: 878, display: "878", delta: "+15,1% vs. sept. (763)" },
        { label: "Visualizaciones", value: 1.3, display: "1,3 M", suffix: " M", decimals: 1, delta: "+8,3% vs. sept. (1,2 M)" },
        { label: "Visitas al perfil", value: 2000, display: "2.000", delta: "+11,1% vs. sept. (1.800)" },
        { label: "Me gusta del mes", value: 1800, display: "1.800", delta: "+12,5% vs. sept. (1.600) · 89 compartidos" },
        { label: "Engagement rate", value: 0.15, display: "0,15%", delta: "Sept. 0,14%" },
      ],
      note: "TikTok orgánico: planilla de RRSS “WAKE METRICAS REDES GENERAL”. TikTok Ads está en la sección de pauta.",
    },
  },
  reputation: {
    tripadvisor: { score: "4,6", scale: "/5", reviews: "34 opiniones", delta: "+0,1 vs. septiembre (4,5 · 29 opiniones)", note: "Ficha vista en Google el 9 nov" },
    others: [
      { name: "Booking", score: "8,9", scale: "/10", reviews: "49 reseñas", delta: "+0,1 vs. sept. (8,8 · 47 reseñas)" },
      { name: "Expedia", score: "9,2", scale: "/10", reviews: "55 reseñas", delta: "Igual que septiembre (54 reseñas)" },
      { name: "Google", score: "4,4", scale: "/5", reviews: "119 reseñas", delta: "+0,1 vs. sept. (4,3 · 102 reseñas)" },
    ],
    snapshot: "Calificaciones públicas · foto al 3 nov 2026 (Tripadvisor al 9 nov)",
    quotes: [
      { text: "El mejor hotel de Medellín… Excelente estadía, la atención impecable. El restaurante delicioso y los dispositivos del centro de longevidad excepcionales.", author: "Olga Lucía R. · Tripadvisor" },
      { text: "Las habitaciones están impecablemente limpias, bien planificadas, y crean una energía calmante.", author: "Reseña en Tripadvisor" },
    ],
    quotesNote: "Reseñas recientes: fragmentos de Tripadvisor vistos en Google el 9 nov (sin fecha).",
  },
  crm: {
    kpis: [
      { label: "Contactos asociados", value: 5428, display: "5.428", note: "HighLevel · Hotel Propiedad = Wake BioHotel · 2.645 huéspedes, 1.899 contactos y 242 comensales · sept.: 5 mil" },
      { label: "Envíos a la base BioHotel", value: 2, display: "2", note: "Biohacking + comercial transversal de Wake Core" },
      { label: "Mejor apertura", value: 26.8, display: "26,8%", suffix: "%", decimals: 1, note: "Biohacking · CTR 0,87%" },
    ],
    emails: [
      { image: "assets/img/email-wake-core-stay-your-way.jpg", tag: "Wake Core · comercial", subject: "Stay Your Way: Exclusive Offers at Wake", date: "6–9 oct (envío escalonado)",
        audience: "Huéspedes de las 3 marcas Wake: WL_Mkt_All_Huéspedes06Oct (9.001) · WB_Mkt_All_Huéspedes06Oct (2.172) · WM_Mkt_All_Huéspedes06Oct (645) = 11.846 en Notion",
        sent: "10.737", delivered: "10.506", open: "19,4%", opens: "2.036", ctr: "0,54%", clicks: "57", bounce: "2,2%", bounces: "231", unsubs: "87",
        note: "Resultados del envío total a las 3 bases (HighLevel no los separa por lista)." },
      { image: "assets/img/email-biohacking.jpg", tag: "Pilares de marca", subject: "Biohacking", date: "20 oct",
        audience: "WB_Mkt_All_Huéspedes20Oct · 2.312 huéspedes de BioHotel que no son comensales",
        sent: "2.092", delivered: "1.964", open: "26,8%", opens: "527", ctr: "0,87%", clicks: "17", bounce: "6,1%", bounces: "128", unsubs: "24" },
    ],
    footnote: "Apertura y CTR sobre entregados; rebotes sobre enviados. HighLevel, resultados al 9/11/2026.",
  },
  influencers: [
    { handle: "@jonzulu", name: "Jonathan Zuluaga", bio: "Fotógrafo de hotelería y marca", followers: "6.033 seguidores", format: "Carrusel en Instagram", date: "13 oct (fecha derivada del ID de la publicación)",
      caption: "“A hotel in the mountains, with a pool worth the climb. A few frames from @wake.biohotel in Medellín…”",
      likes: "107", comments: "6", url: "https://www.instagram.com/p/DecIRgJmzwE/", image: "assets/img/influencer-jonzulu.jpg",
      source: "Embed público de Instagram, lectura 9 nov · Canva de menciones, p. 30" },
  ],
  milestones: [
    "Biohacking: email a la base BioHotel (20 oct) con 26,8% de apertura y CTR 0,87%.",
    "Comercial Wake Core “Stay Your Way” (6–9 oct) a los huéspedes de las 3 marcas Wake: 19,4% de apertura.",
    "Eventos en Meta: campaña nueva de conversaciones de eventos (_eventos_all, $0,98 M, 93 conversaciones); el conjunto de BioHotel invirtió $283.129 y generó 71 conversaciones.",
    "Canal web: subió a 17,8% de participación según IDeaS (+2,0 pp).",
  ],
  /* Aprendizaje → acción: cada aprendizaje va con su próximo paso concreto */
  insights: [
    { n: "01", tag: "Oportunidad de mejora",
      learning: { title: "Recuperar el tráfico de pauta", text: "Las sesiones bajaron 34,5% (23.156) y las de pauta 38,9% (16.415). Google, con 2,0% más de inversión, trajo 38,4% menos sesiones; Meta, con 4,1% menos, trajo 44,6% menos. Aun así, las reservas web subieron 32,5% (102), el ROI es 17,3x con TikTok y las compartidas (19,1x con la regla de septiembre, que dio 15,8x) y el canal web subió a 17,8% según IDeaS." },
      action: { title: "Optimizar el tráfico de BioHotel", text: "Con Contravía, revisar término por término en Google y creatividad por creatividad en Meta cómo recuperar sesiones con la misma inversión. Meta de noviembre: más sesiones de pauta sin bajar el ROI de 17,3x." } },
    { n: "02", tag: "A potenciar",
      learning: { title: "WhatsApp como canal de eventos", text: "La campaña nueva de conversaciones de eventos en Meta generó 71 conversaciones para BioHotel con $283.129 de inversión en su conjunto." },
      action: { title: "Más WhatsApp y eventos", text: "Repetir el email de un solo botón a WhatsApp en los envíos de noviembre de BioHotel, y medir conversaciones y CTR." } },
  ],
  pending: [
    "TikTok Ads del 29 al 31 de octubre, con CPC y CTR: la inversión de TikTok va con datos al 28 oct. Al llegar se recalculan la pauta y el ROI.",
  ],
  sources: "GA4 Wake BioHotel e inversión Google Ads vía GA4 (consulta 3/11/2026; coincide con Google Ads por campaña) · Meta Ads, cuenta Wake Bio, insights por campaña y conjunto 1–31 oct (verificado en Ads Manager el 9/11) · TikTok Ads: captura de datos al 28 oct · IDeaS: participación web · Opera Cloud, reservas creadas por SynXis en octubre · Go High Level (email al 9/11/2026; Social Planner, corte 2–3/11/2026) · Meta Business Suite: seguidores (corte 9 nov) · TikTok orgánico: planilla de RRSS “WAKE METRICAS REDES GENERAL” (10/11/2026) · Booking, Expedia y Google (consulta pública 3/11/2026) · Tripadvisor: ficha vista en Google (9 nov) · Instagram: embed público de @jonzulu (9 nov) · Canva de menciones · TRM promedio octubre $3.199 COP/USD (datos.gov.co). Fotos: wake.com.co/biohotel.",
};
