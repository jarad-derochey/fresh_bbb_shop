# MVP Bullies — Storefront (static)

A self-contained, zero-build storefront for **MVP Bullies** — premium supplements,
apparel and breeder gear for XL American Bullies. Built with plain HTML/CSS/JS so it
runs anywhere with **no build step and no Vercel**.

## What's here

```
site/
├─ index.html        # full single-page storefront
├─ css/styles.css    # black + gold streetwear theme, responsive
├─ js/app.js         # product catalog, cart (localStorage), quick-view, toasts
└─ assets/
   ├─ brand/         # logo, hero/lifestyle photography
   └─ products/      # product imagery (your uploads, renamed)
```

## Features

- Hero, bestseller spotlight, filterable product grid, lifestyle + breeder bands, reviews, newsletter, footer
- Working **cart**: add to cart, variants, quantity steppers, free-shipping meter, persists via `localStorage`
- **Quick-view** product modals with options
- Fully responsive (mobile nav, fluid grid) and accessible (keyboard + ARIA)
- No dependencies, no tracking, no build

## View it locally

Just open the file, or serve the folder:

```bash
# option A — open directly
open site/index.html        # macOS  (use xdg-open on Linux)

# option B — local server (recommended, so relative paths behave)
cd site && python3 -m http.server 8080
# then visit http://localhost:8080
```

## Products

Catalog lives in `js/app.js` (`PRODUCTS` array) — edit prices, copy, images,
variants there. Drop new images into `assets/products/` and reference them.

## Upgrade path

The `spojt-main.zip` at the repo root is the **Once UI / Next.js 16 starter**
(`@once-ui-system/nextjs-starter`) — the richer front end to migrate this shop
onto later if the concept works.
