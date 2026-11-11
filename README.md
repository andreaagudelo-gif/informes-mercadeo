# Informes de Mercadeo · Stay Group

Sitio estático (HTML, CSS y JavaScript, sin compilación) con los informes mensuales de Mercadeo por marca. Está pensado para publicarse tal cual en **GitHub Pages** desde la raíz del repositorio. Todas las rutas son relativas, así que funciona en `https://<usuario>.github.io/<repo>/`.

## Estructura

```
index.html            Portada del mes, con una tarjeta por marca
informe.html          Página de informe (?marca=wake-biohotel&mes=2026-10)
404.html              Redirige a la portada
data/index.js         Registro de marcas, meses e informes publicados
data/<marca>-<mes>.js Datos de un informe (uno por marca y mes)
assets/css/styles.css Estilos
assets/js/            common.js (nav, formato, animaciones), cover.js, report.js
assets/img/           Fotos y capturas (jpg/png optimizados, < 400 KB)
```

## Agregar un mes nuevo (por ejemplo, noviembre 2026 de Wake BioHotel)

1. Copia `data/wake-biohotel-2026-10.js` como `data/wake-biohotel-2026-11.js`.
2. Dentro del archivo cambia la clave en la línea `window.REPORTS["wake-biohotel/2026-10"]` por `"wake-biohotel/2026-11"`.
3. Reemplaza las cifras y los textos con los del nuevo informe. Usa formato colombiano en los textos (`$14,22 M`, `23.156`, `17,8%`). En `value` va el número sin formato (`14.22`, `23156`) para la animación.
4. En `data/index.js`:
   - si el mes no existe en `months`, agrégalo: `{ slug: "2026-11", label: "Noviembre 2026" }`;
   - agrega `"wake-biohotel/2026-11"` a la lista `available`;
   - si quieres que la portada abra en ese mes, cambia `defaultMonth` a `"2026-11"`.
5. Si cambias fotos o capturas, súbelas a `assets/img/` (jpg, máximo ~1600 px de ancho y < 400 KB) y actualiza las rutas en `photos`, `crm.emails[].image` e `influencers[].image`.

## Aprendizajes y próximos pasos

En cada archivo de datos, `insights` es una lista de pares **aprendizaje → próximo paso**. Cada elemento lleva `n`, `tag` (`"Oportunidad de mejora"` o `"A potenciar"`), `learning: { title, text }` y `action: { title, text }`. Usa siempre lenguaje constructivo: "oportunidad de mejora", "a optimizar", "a potenciar".

## Agregar una marca

1. La marca ya debe estar en `brands` dentro de `data/index.js` (hoy están las 6). Si es nueva, agrega `{ slug: "mi-marca", name: "Mi Marca", color: "#XXXXXX" }`.
2. Crea `data/mi-marca-2026-10.js` con la misma estructura que el archivo de BioHotel.
3. Agrega `"mi-marca/2026-10"` a `available`.

Las marcas o meses que no están en `available` se muestran como **Próximamente**.

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

Fotos: sitio oficial wake.com.co/biohotel. Capturas de emails (HighLevel) y de la publicación de Instagram de @jonzulu (embed público).
