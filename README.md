# BlitX · Sitio web + Agente de WhatsApp

Landing de BlitX enfocada en dos servicios: sitio web para negocios locales y agente de IA que responde en el WhatsApp del negocio.

En vivo: https://blitxagencia.netlify.app (proyecto `blitxagencia` en el Netlify de BlitX)

## Cómo se edita y se publica

Sitio estático: `index.html` + `site.css` + `site.js` + `assets/` (más el motor de scroll). Sin build, sin dependencias.

**Cada push a `main` se publica solo** (Netlify, ~1 minuto). No hay ambiente de prueba: lo que se sube, sale al aire.

- **Desde el navegador:** abrir el archivo en GitHub, lápiz, editar, *Commit changes*.
- **Desde el computador:** clonar, abrir `index.html` con doble clic para verlo, editar, `git pull --rebase` y `git push`.

Somos dos editando: **siempre `git pull --rebase` antes de empujar, y nunca `git push --force`.**

Si un deploy falla en Netlify, arreglar la causa no lo republica: hay que apretar *Retry* o empujar otro commit.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Textos, secciones, precios | `index.html` (los precios están en la sección `id="precios"`) |
| Colores, tipografías, diseño | `site.css` (los colores son variables al inicio: `--blue`, `--green`...) |
| Demo de chat del hero | `site.js`, objeto `DEMOS` (una conversación por rubro) |
| Calculadora de pérdidas | `site.js`, función `calc()` |
| Bandeja de mensajes sin responder (sección problema) | `index.html`, lista `.inbox__list`. Cada mensaje aparece cuando el reloj marca su `data-min` |
| Notificaciones de la noche | `site.js`, arreglo `NOTIFS` (hora en minutos desde las 00:00) |
| Resumen del amanecer | `site.js`, objeto `SUMMARY` y función `renderMorning()` |
| Portafolio | `index.html`, bloque `.works` (capturas en `assets/`) |
| Fotos y capturas | `assets/` |
| Motor de scroll (no editar) | `scrollcraft.js` + `scrollcraft.css`, de [scroll-craft](https://github.com/nateherkai/scroll-craft), licencia MIT en `LICENSE-scrollcraft.txt` |

## Cómo funciona "la noche"

La página es una noche: el reloj de la barra va de **dom 23:47** a **lun 07:12** según cuánto bajas. Cada sección tiene su hora en el atributo `data-hour` (por ejemplo `data-hour="04:50"` en precios); el reloj interpola entre esas horas. Si agregas una sección, ponle un `data-hour` entre la anterior y la siguiente, y súmala a la lista del menú del reloj (`<ol class="night__list">`).

El cielo, la cordillera y los edificios se dibujan en código (`site.js`, sección 1), no son imágenes.

## Reglas de diseño

- Fondo oscuro siempre. Azul (`--blue`) es la marca; verde (`--green`) solo para WhatsApp y la garantía.
- Tipografías: Space Grotesk (títulos) y Manrope (texto).
- Sin guiones largos en los textos.
- No editar `scrollcraft.js` ni `scrollcraft.css`: todo lo propio de esta página va en `site.css` y `site.js`.
