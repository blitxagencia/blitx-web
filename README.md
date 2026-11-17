# BlitX · Sitio web + Agente de WhatsApp

Landing de BlitX enfocada en dos servicios: sitio web para negocios locales y agente de IA que responde en el WhatsApp del negocio.

En vivo: https://blitx.netlify.app

## Cómo se edita y se publica

Sitio estático: `index.html` + `styles.css` + `main.js` + `assets/`. Sin build, sin dependencias.

**Cada push a `main` se publica solo** (Netlify, ~1 minuto). No hay ambiente de prueba: lo que se sube, sale al aire.

- **Desde el navegador:** abrir el archivo en GitHub, lápiz, editar, *Commit changes*.
- **Desde el computador:** clonar, abrir `index.html` con doble clic para verlo, editar, `git pull --rebase` y `git push`.

Somos dos editando: **siempre `git pull --rebase` antes de empujar, y nunca `git push --force`.**

Si un deploy falla en Netlify, arreglar la causa no lo republica: hay que apretar *Retry* o empujar otro commit.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Textos, secciones, precios | `index.html` (los precios están en la sección `id="precios"`) |
| Colores, tipografías, diseño | `styles.css` (los colores son variables al inicio: `--blue`, `--green`...) |
| Demo de chat del hero | `main.js`, objeto `DEMOS` (una conversación por rubro) |
| Calculadora de pérdidas | `main.js`, función `calc()` |
| Fotos y capturas | `assets/` |

## Reglas de diseño

- Fondo oscuro siempre. Azul (`--blue`) es la marca; verde (`--green`) solo para WhatsApp y la garantía.
- Tipografías: Space Grotesk (títulos) y Manrope (texto).
- Sin guiones largos en los textos.
- Los bloques con borde punteado (`.slot`) son espacios reservados para llenar: testimonio y próximo proyecto del portafolio.
