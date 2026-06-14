/* =========================================================================
   MVP BULLIES — storefront logic
   Self-contained: product catalog, rendering, cart (localStorage), drawer,
   quick-view modal, toasts. No build step, no dependencies.
   ========================================================================= */

const PRODUCTS = [
  {
    id: "bully-bites",
    name: "Bully Bites",
    tagline: "Daily Vitamin Chews",
    category: "Supplements",
    price: 39.99,
    compareAt: 49.99,
    image: "assets/products/bully-bites.png",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 412,
    blurb:
      "Muscle & mass, skin & coat, joint & hip — all in one soft chew. 60 count. Built for XL & large-breed dogs.",
    points: [
      "Muscle & mass support with high-grade protein blend",
      "Glucosamine + chondroitin for joint & hip health",
      "Omega-rich for a thick, glossy coat",
      "60 soft chews · QC certified · made in the USA",
    ],
    options: { label: "Formula", values: ["Triple Action", "Muscle & Mass", "Skin & Coat", "Joint & Hip"] },
  },
  {
    id: "bde-hoodie",
    name: "Big Dog Energy Hoodie",
    tagline: "Heavyweight Streetwear",
    category: "Apparel",
    price: 64.99,
    compareAt: null,
    image: "assets/products/bde-hoodie.png",
    badge: "New",
    rating: 4.8,
    reviews: 96,
    blurb: "Oversized 400gsm fleece hoodie. Built for the bully life, on and off the yard.",
    points: [
      "Heavyweight 400gsm brushed fleece",
      "Oversized drop-shoulder fit",
      "Puff-print 'Big Dog Energy' graphic",
      "Unisex · S–3XL",
    ],
    options: { label: "Size", values: ["S", "M", "L", "XL", "2XL", "3XL"] },
  },
  {
    id: "bde-tee",
    name: "Big Dog Energy Tee",
    tagline: "Oversized Heavy Tee",
    category: "Apparel",
    price: 34.99,
    compareAt: 44.99,
    image: "assets/products/bde-tee.png",
    badge: null,
    rating: 4.7,
    reviews: 134,
    blurb: "240gsm boxy tee with the signature BDE graphic. Wear it like you mean it.",
    points: [
      "240gsm heavyweight cotton",
      "Boxy, oversized streetwear cut",
      "Soft-hand screen print",
      "Unisex · S–3XL",
    ],
    options: { label: "Size", values: ["S", "M", "L", "XL", "2XL", "3XL"] },
  },
  {
    id: "care-kit",
    name: "B.G.K. Whelping & Care Kit",
    tagline: "The Breeder's Box",
    category: "Breeder Gear",
    price: 129.99,
    compareAt: 159.99,
    image: "assets/products/care-kit.png",
    altImage: "assets/products/care-kit-2.png",
    badge: "Premium",
    rating: 5.0,
    reviews: 58,
    blurb:
      "Everything you need for whelping day, presented in a premium keepsake box. #1 XL breeder essentials.",
    points: [
      "Sterile whelping & cord-care tools",
      "Color ID bands for the whole litter",
      "Antiseptic balm + record cards",
      "Premium magnetic keepsake box",
    ],
    options: null,
  },
  {
    id: "collar-set",
    name: "Smart Litter ID Collars",
    tagline: "LED Whelping Collar Set",
    category: "Tech",
    price: 89.99,
    compareAt: null,
    image: "assets/products/collar-set.png",
    altImage: "assets/products/collar-closeup.png",
    badge: "New",
    rating: 4.8,
    reviews: 41,
    blurb:
      "Track every pup from day one. Soft LED smart collars + the full color-coded ID band set for the litter.",
    points: [
      "Glow-safe LED ID for each puppy",
      "Adjustable soft-stretch bands",
      "Wireless charging dock included",
      "Set of 8 + smart hub",
    ],
    options: { label: "Litter size", values: ["Set of 6", "Set of 8", "Set of 12"] },
  },
  {
    id: "bully-bites-bundle",
    name: "The Bully Life Bundle",
    tagline: "Chews + Tee + Save",
    category: "Bundles",
    price: 89.99,
    compareAt: 109.97,
    image: "assets/products/bully-bites.png",
    badge: "Save 18%",
    rating: 4.9,
    reviews: 77,
    blurb: "Bully Bites (Triple Action) + a Big Dog Energy tee. Fuel the dog, rep the brand.",
    points: [
      "1× Bully Bites — Triple Action (60ct)",
      "1× Big Dog Energy Tee",
      "Free shipping",
      "Best value for the crew",
    ],
    options: { label: "Tee size", values: ["S", "M", "L", "XL", "2XL", "3XL"] },
  },
];

/* ----------------------------------------------------------------------- */
/* Helpers                                                                   */
/* ----------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = (n) => "$" + n.toFixed(2);
const productById = (id) => PRODUCTS.find((p) => p.id === id);

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) s += "★";
    else if (i === full && half) s += "⯪";
    else s += "☆";
  }
  return s;
}

/* ----------------------------------------------------------------------- */
/* Cart state                                                               */
/* ----------------------------------------------------------------------- */
const CART_KEY = "mvp_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
let cart = loadCart();

function cartCount() {
  return cart.reduce((n, item) => n + item.qty, 0);
}
function cartSubtotal() {
  return cart.reduce((sum, item) => {
    const p = productById(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function addToCart(id, variant = null, qty = 1) {
  const existing = cart.find((i) => i.id === id && i.variant === variant);
  if (existing) existing.qty += qty;
  else cart.push({ id, variant, qty });
  saveCart(cart);
  renderCart();
  const p = productById(id);
  toast(`Added ${p.name}${variant ? " · " + variant : ""} to cart`);
  openCart();
}
function setQty(id, variant, qty) {
  const item = cart.find((i) => i.id === id && i.variant === variant);
  if (!item) return;
  item.qty = qty;
  if (item.qty <= 0) cart = cart.filter((i) => i !== item);
  saveCart(cart);
  renderCart();
}
function removeItem(id, variant) {
  cart = cart.filter((i) => !(i.id === id && i.variant === variant));
  saveCart(cart);
  renderCart();
}

/* ----------------------------------------------------------------------- */
/* Rendering — product grid                                                 */
/* ----------------------------------------------------------------------- */
function productCard(p) {
  const onSale = p.compareAt && p.compareAt > p.price;
  return `
  <article class="card" data-id="${p.id}">
    <div class="card__media" role="button" tabindex="0" data-action="quickview" data-id="${p.id}" aria-label="Quick view ${p.name}">
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
    </div>
    <div class="card__body">
      <span class="card__cat">${p.category}</span>
      <h3 class="card__name">${p.name}</h3>
      <p class="card__tag">${p.tagline}</p>
      <div class="card__rating" aria-label="${p.rating} out of 5">
        <span class="stars">${stars(p.rating)}</span>
        <span class="card__reviews">(${p.reviews})</span>
      </div>
      <div class="card__price">
        <span class="price">${money(p.price)}</span>
        ${onSale ? `<span class="price--was">${money(p.compareAt)}</span>` : ""}
      </div>
      <div class="card__actions">
        <button class="btn btn--gold" data-action="add" data-id="${p.id}">Add to cart</button>
        <button class="btn btn--ghost" data-action="quickview" data-id="${p.id}">Details</button>
      </div>
    </div>
  </article>`;
}

function renderGrid(filter = "All") {
  const grid = $("#product-grid");
  const list = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  grid.innerHTML = list.map(productCard).join("");
}

function renderFilters() {
  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
  const wrap = $("#filters");
  wrap.innerHTML = cats
    .map(
      (c, i) =>
        `<button class="chip ${i === 0 ? "chip--active" : ""}" data-cat="${c}">${c}</button>`
    )
    .join("");
}

/* ----------------------------------------------------------------------- */
/* Cart drawer                                                              */
/* ----------------------------------------------------------------------- */
function renderCart() {
  const count = cartCount();
  $$(".cart-count").forEach((el) => {
    el.textContent = count;
    el.classList.toggle("is-empty", count === 0);
  });

  const body = $("#cart-body");
  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty">
        <p>Your cart is empty.</p>
        <button class="btn btn--gold" data-action="close-cart">Start shopping</button>
      </div>`;
  } else {
    body.innerHTML = cart
      .map((item) => {
        const p = productById(item.id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" />
          <div class="cart-item__info">
            <h4>${p.name}</h4>
            ${item.variant ? `<span class="cart-item__variant">${item.variant}</span>` : ""}
            <div class="cart-item__price">${money(p.price)}</div>
            <div class="stepper">
              <button data-action="dec" data-id="${p.id}" data-variant="${item.variant ?? ""}" aria-label="Decrease">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-id="${p.id}" data-variant="${item.variant ?? ""}" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-action="remove" data-id="${p.id}" data-variant="${item.variant ?? ""}" aria-label="Remove">✕</button>
        </div>`;
      })
      .join("");
  }

  const sub = cartSubtotal();
  $("#cart-subtotal").textContent = money(sub);
  $("#cart-footer").style.display = cart.length ? "block" : "none";
  $("#free-ship").textContent =
    sub >= 75 ? "🎉 You've unlocked free shipping!" : `Add ${money(75 - sub)} more for free shipping`;
}

function openCart() {
  $("#cart").classList.add("open");
  $("#overlay").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cart").classList.remove("open");
  if (!$("#modal").classList.contains("open")) {
    $("#overlay").classList.remove("show");
    document.body.style.overflow = "";
  }
}

/* ----------------------------------------------------------------------- */
/* Quick-view modal                                                         */
/* ----------------------------------------------------------------------- */
function openQuickView(id) {
  const p = productById(id);
  if (!p) return;
  const onSale = p.compareAt && p.compareAt > p.price;
  const optionsHtml = p.options
    ? `<label class="qv__label">${p.options.label}</label>
       <select id="qv-variant" class="qv__select">
         ${p.options.values.map((v) => `<option value="${v}">${v}</option>`).join("")}
       </select>`
    : "";

  $("#modal-content").innerHTML = `
    <div class="qv">
      <div class="qv__media">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="qv__info">
        <span class="qv__cat">${p.category}</span>
        <h2 class="qv__name">${p.name}</h2>
        <p class="qv__tag">${p.tagline}</p>
        <div class="card__rating"><span class="stars">${stars(p.rating)}</span>
          <span class="card__reviews">${p.rating} · ${p.reviews} reviews</span></div>
        <div class="qv__price">
          <span class="price">${money(p.price)}</span>
          ${onSale ? `<span class="price--was">${money(p.compareAt)}</span>` : ""}
        </div>
        <p class="qv__blurb">${p.blurb}</p>
        <ul class="qv__points">${p.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
        ${optionsHtml}
        <button class="btn btn--gold btn--block" id="qv-add" data-id="${p.id}">Add to cart — ${money(p.price)}</button>
      </div>
    </div>`;

  $("#qv-add").addEventListener("click", () => {
    const variant = $("#qv-variant") ? $("#qv-variant").value : null;
    addToCart(p.id, variant);
    closeModal();
  });

  $("#modal").classList.add("open");
  $("#overlay").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("#modal").classList.remove("open");
  if (!$("#cart").classList.contains("open")) {
    $("#overlay").classList.remove("show");
    document.body.style.overflow = "";
  }
}

/* ----------------------------------------------------------------------- */
/* Toast                                                                    */
/* ----------------------------------------------------------------------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ----------------------------------------------------------------------- */
/* Events                                                                   */
/* ----------------------------------------------------------------------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const { action, id } = el.dataset;
  const variant = el.dataset.variant === "" ? null : el.dataset.variant;

  switch (action) {
    case "add":
      addToCart(id);
      break;
    case "quickview":
      openQuickView(id);
      break;
    case "open-cart":
      openCart();
      break;
    case "close-cart":
      closeCart();
      break;
    case "close-modal":
      closeModal();
      break;
    case "inc":
      setQty(id, variant, (cart.find((i) => i.id === id && i.variant === variant)?.qty || 0) + 1);
      break;
    case "dec":
      setQty(id, variant, (cart.find((i) => i.id === id && i.variant === variant)?.qty || 0) - 1);
      break;
    case "remove":
      removeItem(id, variant);
      break;
    case "checkout":
      toast("Checkout is a demo — payments not wired up yet 🐾");
      break;
  }
});

// keyboard quick-view on media
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart();
    closeModal();
  }
  if ((e.key === "Enter" || e.key === " ") && e.target.dataset?.action === "quickview") {
    e.preventDefault();
    openQuickView(e.target.dataset.id);
  }
});

// filter chips
$("#filters")?.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  $$(".chip").forEach((c) => c.classList.remove("chip--active"));
  chip.classList.add("chip--active");
  renderGrid(chip.dataset.cat);
});

// overlay closes everything
$("#overlay")?.addEventListener("click", () => {
  closeCart();
  closeModal();
});

// newsletter
$("#newsletter-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("You're in. Welcome to the pack 🐾");
});

// mobile nav toggle
$("#nav-toggle")?.addEventListener("click", () => {
  $("#nav-links").classList.toggle("open");
});
$$("#nav-links a").forEach((a) =>
  a.addEventListener("click", () => $("#nav-links").classList.remove("open"))
);

// year
$("#year") && ($("#year").textContent = new Date().getFullYear());

/* ----------------------------------------------------------------------- */
/* Init                                                                     */
/* ----------------------------------------------------------------------- */
renderFilters();
renderGrid();
renderCart();
