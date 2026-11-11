# Informes de Mercadeo · Stay Group

Sitio estático (HTML, CSS y JavaScript, sin compilación) con los informes mensuales de Mercadeo por marca. Está pensado para publicarse tal cual en **GitHub Pages** desde la raíz del repositorio. Todas las rutas son relativas, así que funciona en `https://<usuario>.github.io/<repo>/`.

## Estructura

```
index.html            Portada del mes, con una tarjeta por marca y enlace a RRSS
informe.html          Página de informe (?marca=wake-biohotel&mes=2026-10)
rrss.html             Tablero orgánico de redes (?marca=wake-biohotel)
404.html              Redirige a la portada
data/index.js         Registro de marcas, meses e informes publicados
data/<marca>-<mes>.js Datos de un informe de mercadeo (uno por marca y mes)
data/rrss.js          Datos del tablero orgánico RRSS (se regenera; no editar a mano)
assets/css/           styles.css (sitio) y rrss.css (solo la página RRSS)
assets/js/            common.js, cover.js, report.js, rrss.js
assets/img/           Fotos y capturas (jpg/png optimizados, < 400 KB)
assets/img/rrss/      Miniaturas de las creatividades del tablero RRSS
```

## Agregar un mes nuevo (por ejemplo, noviembre 2026 de Wake BioHotel)

1. Copia `data/wake-biohotel-2026-10.js` como `data/wake-biohotel-2026-11.js`.
2. Dentro del archivo cambia la clave en la línea `window.REPORTS["wake-biohotel/2026-10"]` por `"wake-biohotel/2026-11"`.
3. Reemplaza las cifras y los textos con los del nuevo informe. Usa formato colombiano en `display` (`$14,22 M`, `23.156`, `17,8%`); la animación de conteo se arma sola a partir de ese texto.
4. En `data/index.js`:
   - si el mes no existe en `months`, agrégalo: `{ slug: "2026-11", label: "Noviembre 2026" }`;
   - agrega `"wake-biohotel/2026-11"` a la lista `available`;
   - si quieres que la portada abra en ese mes, cambia `defaultMonth` a `"2026-11"`.
5. Si cambias fotos o capturas, súbelas a `assets/img/` (jpg, máximo ~1600 px de ancho y < 400 KB) y actualiza las rutas en `photos`, `crm.emails[].image` e `influencers[].image`.

## Estructura de un archivo de datos

Cada sección aparece solo si el archivo la trae; si una marca no tiene el dato (por ejemplo, Boro no tiene TikTok), basta con no incluir esa clave.

- `theme`: `{ primary, accent, light }`, colores de la marca para botones, barras y etiquetas.
- `photos`: `hero`, `heroAlt`, `logo` (en blanco), `card` (portada), `dividers` (3 fotos) y `credit`.
- `titles` (opcional): títulos propios por sección (`kpis`, `web`, `ads`, `social`, `reputation`, `email`, `influencers`, `milestones`, `insights`). Si no van, se usan títulos genéricos.
- `headline`: 6 cifras del mes `{ label, display, delta, note, trend }`. `trend` es opcional (`up`, `down`, `flat`); si no va, se deduce del signo de `delta`.
- `web`: `{ items: [...] }`. `ads`: `top` (la primera cifra va en el recuadro de color), `charts` (barras horizontales `{ title, money, data:[{label,value,display}] }` o de octubre vs. septiembre `{ type:"vbar", data:[{label,oct,sep}] }`), `cards` y `roiNote`.
- `blocks` (opcional): secciones extra, por ejemplo reservas de restaurante o la campaña del mes: `{ after:"web"|"ads"|"social"|"email", eyebrow, title, intro, items, charts, cards, note }`.
- `social` (`instagram`, `facebook`, `tiktok`), `reputation` (`main`, `others`, `quotes`), `crm` (`kpis`, `emails`), `influencers` (`posts` con métricas y `stories` con capturas), `milestones`, `insights`, `pending`, `sources`.

Los archivos de octubre 2026 se generaron con `build/gen_data.py` (fuera de esta carpeta); también se pueden editar a mano.

## Aprendizajes y próximos pasos

En cada archivo de datos, `insights` es una lista de pares **aprendizaje → próximo paso**. Cada elemento lleva `n`, `tag` (`"Oportunidad de mejora"` o `"A potenciar"`), `learning: { title, text }` y `action: { title, text }`. Usa siempre lenguaje constructivo: "oportunidad de mejora", "a optimizar", "a potenciar".

## Agregar una marca

1. La marca ya debe estar en `brands` dentro de `data/index.js` (hoy están las 6). Si es nueva, agrega `{ slug: "mi-marca", name: "Mi Marca", color: "#XXXXXX" }`.
2. Crea `data/mi-marca-2026-10.js` con la misma estructura que los archivos existentes.
3. Agrega `"mi-marca/2026-10"` a `available`.

Las marcas o meses que no están en `available` se muestran como **Próximamente**.

## Grupos y caché

- `groups` en `data/index.js` arma la portada por propiedad (Wake BioHotel · Silo · Sastra, Wake Medellín · Boro, Wake Living). En cada informe aparece el enlace a las otras marcas de su grupo.
- Al publicar cambios, sube el número de `version` en `data/index.js` y el `?v=` de `index.html`, `informe.html` y `rrss.html`, para que los navegadores descarguen los archivos nuevos. Si cambias una foto, usa un nombre de archivo nuevo.

## Tablero orgánico RRSS

La página `rrss.html` muestra las métricas orgánicas de Facebook e Instagram y las creatividades de la parrilla, por marca. **Los datos no van en el HTML**: están en `data/rrss.js` y las miniaturas en `assets/img/rrss/`. Para actualizarlo cada lunes o en el cierre de mes, sigue `/workspace/rrss/SITIO.md` y corre `python3 /workspace/rrss/build_rrss_data.py`. No hace falta editar `rrss.html` ni `assets/js/rrss.js` si solo cambian las cifras o las piezas.


## Probar en local

```
python3 -m http.server 8000
```

Luego abre http://localhost:8000/

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a la raíz del repositorio (rama `main`).
2. En GitHub: Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Quedará en `https://<usuario>.github.io/<repo>/`.

> El repositorio es público: no subas correos de huéspedes, accesos, tokens ni datos personales. Los informes solo deben llevar cifras agregadas.

## Créditos

Fotos: sitio oficial wake.com.co (BioHotel, Living, Medellín, Boro, Silo y Sastra). Capturas de emails (HighLevel), de historias del Canva de menciones y de publicaciones públicas de Instagram (@jonzulu, @gigielenes y @manumontoyala).
