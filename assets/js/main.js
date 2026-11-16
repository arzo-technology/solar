/* ============================================================================
   HELIOS SOLAR — SITE LOGIC
   Vanilla JS, no dependencies. Everything it displays comes from site.config.js.
   ========================================================================== */
(function () {
  "use strict";

  const S = window.SITE;
  if (!S) return;

  /* Admin draft preview: index.html?draft=1 shows what you edited in admin.html
     in THIS browser only. Visitors never get the draft. */
  const DRAFT_KEY = "arzo-draft-v1";
  try {
    if (new URLSearchParams(location.search).get("draft") === "1") {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (draft && draft.brand && Array.isArray(draft.products)) Object.assign(S, draft);
    }
  } catch (e) { /* ignore a broken draft */ }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------- helpers */
  const esc = (str) =>
    String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const fmt = new Intl.NumberFormat(S.currency.locale, {
    style: "currency",
    currency: S.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: S.currency.decimals,
  });
  const money = (n) => fmt.format(Number(n) || 0);
  const moneyPrec = (n, d = 2) =>
    new Intl.NumberFormat(S.currency.locale, {
      style: "currency", currency: S.currency.code,
      minimumFractionDigits: d, maximumFractionDigits: d,
    }).format(Number(n) || 0);
  const num = (n, d = 0) =>
    new Intl.NumberFormat(S.currency.locale, {
      minimumFractionDigits: d, maximumFractionDigits: d,
    }).format(Number(n) || 0);

  const digits = String(S.contact.whatsapp || "").replace(/\D/g, "");

  const ICONS = {
    all: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    inverters: '<rect x="2.5" y="5" width="19" height="14" rx="3.2"/><path d="M6 12c1.1-2.8 2.2-2.8 3.3 0s2.2 2.8 3.3 0 2.2-2.8 3.3 0"/>',
    panels: '<rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 4v13M15 4v13M3 9h18M3 13.5h18"/>',
    batteries: '<rect x="2.5" y="7" width="16" height="10" rx="2.4"/><path d="M21 10.5v3"/><path d="M10 9.4 7.6 12.3h3.2L8.6 15"/>',
    controllers: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21"/>',
    mounting: '<path d="M3 8.5h18M3 15.5h18M7 4.5v16M17 4.5v16"/>',
    systems: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/><path d="M9.5 20v-5h5v5"/>',
    accessories: '<path d="M9 3.5v5M15 3.5v5"/><path d="M6.5 8.5h11v3a5.5 5.5 0 0 1-11 0v-3Z"/><path d="M12 17v3.5"/>',
    shield: '<path d="M12 3.2 4.8 5.8v6.1c0 4.2 3.1 7.3 7.2 8.9 4.1-1.6 7.2-4.7 7.2-8.9V5.8L12 3.2Z"/><path d="m9 12 2.1 2.1L15.2 10"/>',
    bolt: '<path d="M13.2 2.8 5.4 13.2h5.2l-.8 8 7.8-10.4h-5.2l.8-8Z"/>',
    chart: '<path d="M3.5 20.5h17"/><path d="M6.5 17V11M11.5 17V6.5M16.5 17v-4"/>',
    wrench: '<path d="M15.5 3.5a5 5 0 0 0-4.2 7.6L3.9 18.5l1.6 1.6 7.4-7.4a5 5 0 0 0 7.6-4.2l-3 3-2.6-.8-.8-2.6 3-3Z"/>',
    cart: '<circle cx="9" cy="19.5" r="1.4"/><circle cx="18" cy="19.5" r="1.4"/><path d="M2.5 3.5h2.2l2.5 11.2h11.2l2.1-8H6"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.all}</svg>`;

  const catName = (key) =>
    (S.categories.find((c) => c.key === key) || {}).name || key;
  const catCount = (key) =>
    S.products.filter((p) => p.category === key).length;
  const productById = (id) => S.products.find((p) => p.id === id);
  const minPrice = (p) => Math.min(...p.variants.map((v) => v.price));

  /* -------------------------------------------------------------- theme */
  function applyTheme() {
    const t = S.theme || {};
    const root = document.documentElement.style;
    if (t.brand) root.setProperty("--brand", t.brand);
    if (t.brandSoft) root.setProperty("--brand-soft", t.brandSoft);
    if (t.accent) root.setProperty("--accent", t.accent);
    if (t.accentInk) root.setProperty("--accent-ink", t.accentInk);
    if (t.radius) root.setProperty("--radius", t.radius);
    if (t.fontDisplay) root.setProperty("--font-display", t.fontDisplay);
    if (t.fontBody) root.setProperty("--font-body", t.fontBody);
  }

  /* -------------------------------------------------------------- brand */
  function applyBrand() {
    const b = S.brand, c = S.contact;
    const map = {
      name: b.name, shortName: b.shortName, tagline: b.tagline,
      phoneDisplay: c.phoneDisplay, email: c.email, address: c.address,
      hours: c.hours, currencyCode: S.currency.code,
      partnerLabel: S.partners && S.partners.label,
      footerBlurb: S.footer && S.footer.blurb,
      credit: S.footer && S.footer.credit,
      heroEyebrow: S.hero && S.hero.eyebrow,
      heroLead: S.hero && S.hero.lead,
    };
    Object.keys(map).forEach((key) => {
      if (map[key] == null) return;
      $$(`[data-brand="${key}"]`).forEach((el) => { el.textContent = map[key]; });
    });

    const titleEl = $('[data-brand="heroTitle"]');
    if (titleEl && S.hero && S.hero.titleHtml) titleEl.innerHTML = S.hero.titleHtml;

    // Optional uploaded logo — keeps the built-in sun mark when empty
    if (b.logo) {
      $$(".brand-mark").forEach((mark) => {
        mark.classList.add("has-logo");
        mark.innerHTML = `<img src="${esc(b.logo)}" alt="" />`;
      });
      const fav = document.querySelector('link[rel="icon"]');
      if (fav) fav.setAttribute("href", b.logo);
    }

    // Browser chrome / SEO
    document.title = b.metaTitle || b.name;
    const setMeta = (sel, attr, val) => { const el = $(sel); if (el && val) el.setAttribute(attr, val); };
    setMeta('meta[name="description"]', "content", b.metaDescription);
    setMeta('meta[property="og:title"]', "content", b.metaTitle || b.name);
    setMeta('meta[property="og:description"]', "content", b.metaDescription);

    const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

    // Every contact link in one place
    const waBase = `https://wa.me/${digits}?text=${encodeURIComponent(
      `Hello ${b.name}! I would like to know more about your solar systems.`
    )}`;
    const hrefs = {
      tel: `tel:${c.phone}`,
      mailto: `mailto:${c.email}`,
      map: c.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(c.address)}`,
      wa: waBase,
      instagram: c.socials && c.socials.instagram,
      facebook: c.socials && c.socials.facebook,
    };
    $$("[data-href]").forEach((el) => {
      const key = el.getAttribute("data-href");
      const href = hrefs[key];
      if (!href) { el.style.display = "none"; return; }
      el.setAttribute("href", href);
      if (key === "wa" || key === "map") { el.target = "_blank"; el.rel = "noopener"; }
    });
  }

  /* ------------------------------------------------------- hero + trust */
  function renderHero() {
    const wrap = $("#heroStats");
    if (wrap && S.hero && S.hero.stats) {
      wrap.innerHTML = S.hero.stats.map((s) => `
        <div class="hero-stat">
          <strong>${esc(s.value)}</strong>
          <span>${esc(s.label)}</span>
        </div>`).join("");
    }
    const logos = $("#trustLogos");
    if (logos && S.partners && S.partners.names) {
      logos.innerHTML = S.partners.names
        .map((n) => `<li>${esc(n)}</li>`).join("");
    }
    const cta = $(".hero-actions .btn-accent");
    if (cta && S.hero && S.hero.primaryCta) {
      // keep arrow icon, swap label text node
      const textNode = Array.from(cta.childNodes).find((n) => n.nodeType === 3);
      if (textNode) textNode.textContent = S.hero.primaryCta + " ";
    }
    const cta2 = $(".hero-actions .btn-outline-light");
    if (cta2 && S.hero && S.hero.secondaryCta) cta2.textContent = S.hero.secondaryCta;
  }

  /* ---------------------------------------------------------- categories */
  function renderCategories() {
    const grid = $("#categoryGrid");
    if (!grid) return;
    const cards = S.categories.map((c, i) => `
      <a class="category-card reveal" style="--delay:${i * 45}ms" href="#shop" data-cat-link="${esc(c.key)}">
        <span class="category-ico">${icon(c.key)}</span>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.blurb)}</p>
        <div class="category-meta">
          <span>${catCount(c.key)} product${catCount(c.key) === 1 ? "" : "s"}</span>
          <span class="category-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12.5 6l6 6-6 6"/></svg>
          </span>
        </div>
      </a>`);
    // Fills the last grid cell with a useful action instead of an empty gap
    cards.push(`
      <a class="category-card category-cta reveal" style="--delay:${cards.length * 45}ms" href="#contact">
        <span class="category-ico">${icon("bolt")}</span>
        <h3>Something custom?</h3>
        <p>Tell us your load and roof — we design the system around it.</p>
        <div class="category-meta">
          <span>Free design &amp; quote</span>
          <span class="category-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12.5 6l6 6-6 6"/></svg>
          </span>
        </div>
      </a>`);
    grid.innerHTML = cards.join("");
  }

  /* --------------------------------------------------------------- shop */
  const state = {
    category: "all",
    size: "all",
    sort: "featured",
    query: "",
    cart: [],
    variants: {},      // product id -> selected variant index
    modal: { id: null, variant: 0 },
  };

  function renderFilterTabs() {
    const wrap = $("#filterTabs");
    if (!wrap) return;
    const tabs = [{ key: "all", name: "All products" }].concat(S.categories);
    wrap.innerHTML = tabs.map((c) => `
      <button class="filter-tab${state.category === c.key ? " is-active" : ""}"
        aria-pressed="${state.category === c.key}"
        data-cat="${esc(c.key)}">${esc(c.name)}</button>`).join("");
  }

  function visibleProducts() {
    let list = S.products.slice();
    if (state.category !== "all") list = list.filter((p) => p.category === state.category);
    if (state.size !== "all") {
      list = list.filter((p) => p.variants.some((v) => v.label === state.size));
    }
    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((p) =>
        (p.name + " " + p.blurb + " " + catName(p.category)).toLowerCase().includes(q)
      );
    }
    if (state.sort === "price-asc") list.sort((a, b) => minPrice(a) - minPrice(b));
    if (state.sort === "price-desc") list.sort((a, b) => minPrice(b) - minPrice(a));
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  function productCard(p) {
    const vi = state.variants[p.id] || 0;
    const v = p.variants[vi];
    const showVariants = p.variants.length > 1;
    return `
      <article class="product-card" data-id="${esc(p.id)}">
        <div class="product-media">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="800" height="600" />
          ${p.badge ? `<span class="product-badge">${esc(p.badge)}</span>` : ""}
          <button class="quick-view" data-view="${esc(p.id)}" aria-label="View details for ${esc(p.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <div class="product-body">
          <span class="product-kicker">${esc(catName(p.category))}</span>
          <h3 class="product-name">${esc(p.name)}</h3>
          <p class="product-blurb">${esc(p.blurb)}</p>
          ${showVariants ? `
          <div class="variant-pills" role="group" aria-label="Choose a size">
            ${p.variants.map((vv, i) => `
              <button class="variant-pill${i === vi ? " is-active" : ""}" data-size="${i}"
                aria-pressed="${i === vi}">${esc(vv.label)}</button>`).join("")}
          </div>` : ""}
          <div class="product-foot">
            <div class="price-wrap">
              <span class="price">${money(v.price)}${
                v.compareAt ? `<s class="price-was">${money(v.compareAt)}</s>` : ""
              }</span>
              <span class="price-each">${esc(v.detail || v.label)}</span>
            </div>
            <button class="add-btn" data-add="${esc(p.id)}" data-variant="${vi}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    const list = visibleProducts();
    grid.innerHTML = list.map(productCard).join("");
    const empty = $("#emptyState");
    if (empty) empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    const count = $("#resultCount");
    if (count) count.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
  }

  function refreshCard(id) {
    const card = $(`.product-card[data-id="${id}"]`);
    if (!card) return;
    const p = productById(id);
    const vi = state.variants[id] || 0;
    const v = p.variants[vi];
    const price = $(".price", card);
    if (price) {
      price.innerHTML = money(v.price) +
        (v.compareAt ? `<s class="price-was">${money(v.compareAt)}</s>` : "");
    }
    const each = $(".price-each", card);
    if (each) each.textContent = v.detail || v.label;
    $$(".variant-pill", card).forEach((btn, i) => {
      btn.classList.toggle("is-active", i === vi);
      btn.setAttribute("aria-pressed", String(i === vi));
    });
    const add = $(".add-btn", card);
    if (add) add.dataset.variant = vi;
  }

  /* --------------------------------------------------------------- cart */
  const CART_KEY = "solar-quote-v1";
  const CUSTOMER_KEY = "solar-quote-customer-v1";

  const customer = { name: "", phone: "", address: "", notes: "" };

  function loadCustomer() {
    try {
      const raw = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "null");
      if (raw && typeof raw === "object") {
        ["name", "phone", "address", "notes"].forEach((k) => {
          if (typeof raw[k] === "string") customer[k] = raw[k];
        });
      }
    } catch (e) { /* ignore */ }
    const map = { name: "qName", phone: "qPhone", address: "qAddress", notes: "qNotes" };
    Object.keys(map).forEach((k) => {
      const el = document.getElementById(map[k]);
      if (el) el.value = customer[k];
    });
  }
  function saveCustomer() {
    try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer)); } catch (e) {}
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        state.cart = parsed.filter((it) => it && productById(it.id));
      }
    } catch (e) { state.cart = []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {}
  }

  function cartCount() {
    return state.cart.reduce((n, it) => n + it.q, 0);
  }
  function cartTotal() {
    return state.cart.reduce((sum, it) => {
      const p = productById(it.id);
      if (!p) return sum;
      const v = p.variants[it.v] || p.variants[0];
      return sum + v.price * it.q;
    }, 0);
  }

  function syncCartCount() {
    const n = cartCount();
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.dataset.empty = String(n === 0);
    });
  }

  function addToCart(id, variant, qty = 1) {
    const p = productById(id);
    if (!p) return;
    const v = Math.min(Math.max(0, Number(variant) || 0), p.variants.length - 1);
    const found = state.cart.find((it) => it.id === id && it.v === v);
    if (found) found.q += qty;
    else state.cart.push({ id, v, q: qty });
    saveCart(); syncCartCount(); renderCart();

    const badge = $(".cart-count");
    if (badge) {
      badge.classList.add("bump");
      setTimeout(() => badge.classList.remove("bump"), 260);
    }
    toast(`${p.name} · ${p.variants[v].label} added to your quote`);
  }

  function changeQty(index, delta) {
    const it = state.cart[index];
    if (!it) return;
    it.q += delta;
    if (it.q <= 0) state.cart.splice(index, 1);
    saveCart(); syncCartCount(); renderCart();
  }
  function removeItem(index) {
    state.cart.splice(index, 1);
    saveCart(); syncCartCount(); renderCart();
  }
  function clearCart() {
    state.cart = [];
    saveCart(); syncCartCount(); renderCart();
  }

  function quoteMessage() {
    const lines = state.cart.map((it) => {
      const p = productById(it.id);
      const v = p.variants[it.v] || p.variants[0];
      return `• ${p.name} — ${v.label}${v.detail ? " (" + v.detail + ")" : ""} × ${it.q} — ${money(v.price * it.q)}`;
    });
    const details = [
      customer.name ? `Name: ${customer.name}` : "",
      customer.phone ? `Phone: ${customer.phone}` : "",
      customer.address ? `Address: ${customer.address}` : "",
      customer.notes ? `Notes: ${customer.notes}` : "",
    ].filter(Boolean);
    return [
      `Hello ${S.brand.name}!`,
      "",
      "I would like a quote for the following:",
      "",
      ...lines,
      "",
      `Estimated total: ${money(cartTotal())}`,
      ...(details.length ? ["", ...details] : ["", "My name: ", "My address: "]),
    ].join("\n");
  }

  function updateSendLink() {
    const send = $("#waSend");
    if (!send) return;
    const text = state.cart.length
      ? quoteMessage()
      : `Hello ${S.brand.name}! I would like a quote for a solar system.`;
    send.href = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  function renderCart() {
    const body = $("#quoteItems");
    if (!body) return;

    if (!state.cart.length) {
      body.innerHTML = `
        <div class="quote-empty">
          ${icon("cart")}
          <p><strong>Your quote is empty.</strong><br />Add products and we will send a single message with the full list.</p>
          <button class="btn btn-ghost btn-sm" data-close-drawer>Browse products</button>
        </div>`;
    } else {
      body.innerHTML = `
        <div class="quote-clear-row">
          <button type="button" class="quote-clear" data-clear>Clear all</button>
        </div>` + state.cart.map((it, i) => {
        const p = productById(it.id);
        const v = p.variants[it.v] || p.variants[0];
        return `
          <div class="quote-item">
            <img src="${esc(p.image)}" alt="" width="64" height="52" loading="lazy" />
            <div>
              <p class="quote-item-name">${esc(p.name)}</p>
              <p class="quote-item-variant">${esc(v.label)}${v.detail ? " · " + esc(v.detail) : ""}</p>
              <p class="quote-item-price">${money(v.price * it.q)}</p>
            </div>
            <div class="quote-item-side">
              <button type="button" class="quote-remove" data-remove data-index="${i}" aria-label="Remove ${esc(p.name)} from quote">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
              </button>
              <div class="qty">
                <button data-qty="-1" data-index="${i}" aria-label="Decrease quantity">−</button>
                <span>${it.q}</span>
                <button data-qty="1" data-index="${i}" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>`;
      }).join("");
    }

    const total = $("#quoteTotal");
    if (total) total.textContent = money(cartTotal());
    const note = $("#quoteNote");
    if (note) {
      note.textContent = state.cart.length
        ? `${cartCount()} item${cartCount() === 1 ? "" : "s"} · estimate only, delivery confirmed after we check stock.`
        : "Add products to build your quote.";
    }
    const details = $("#quoteDetails");
    if (details) details.hidden = state.cart.length === 0;
    updateSendLink();
  }

  /* ------------------------------------------------------ drawer & modal */
  let lastFocused = null;

  function lockScroll(lock) {
    document.body.classList.toggle("is-locked", lock);
  }
  function anyOverlayOpen() {
    return !$("#quoteDrawer").hidden || !$("#productModal").hidden;
  }

  function openDrawer() {
    lastFocused = document.activeElement;
    const drawer = $("#quoteDrawer");
    drawer.hidden = false;
    $("#scrim").hidden = false;
    lockScroll(true);
    const close = $("[data-close-drawer]", drawer);
    if (close) close.focus();
  }
  function closeDrawer() {
    const drawer = $("#quoteDrawer");
    drawer.hidden = true;
    if (!anyOverlayOpen()) { $("#scrim").hidden = true; lockScroll(false); }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function openProduct(id) {
    const p = productById(id);
    if (!p) return;
    lastFocused = document.activeElement;
    state.modal = { id, variant: state.variants[id] || 0 };

    const m = $("#productModal");
    $("#modalCard").innerHTML = modalMarkup(p, state.modal.variant);
    m.hidden = false;
    $("#scrim").hidden = false;
    lockScroll(true);
    const close = $(".modal-close", m);
    if (close) close.focus();
  }
  function closeProduct() {
    $("#productModal").hidden = true;
    if (!anyOverlayOpen()) { $("#scrim").hidden = true; lockScroll(false); }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function modalMarkup(p, vi) {
    const v = p.variants[vi];
    return `
      <button class="modal-close" data-close-modal aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <div class="modal-grid">
        <div class="modal-media"><img src="${esc(p.image)}" alt="${esc(p.name)}" /></div>
        <div class="modal-body">
          <p class="modal-kicker">${esc(catName(p.category))}${p.badge ? " · " + esc(p.badge) : ""}</p>
          <h3 id="modalTitle">${esc(p.name)}</h3>
          <p class="modal-blurb">${esc(p.blurb)}</p>
          ${p.variants.length > 1 ? `
          <div class="modal-variants" role="group" aria-label="Choose a size">
            ${p.variants.map((vv, i) => `
              <button class="variant-pill${i === vi ? " is-active" : ""}" data-modal-size="${i}"
                aria-pressed="${i === vi}">${esc(vv.label)}${vv.detail ? " · " + esc(vv.detail) : ""}</button>`).join("")}
          </div>` : ""}
          <dl class="modal-specs">
            ${Object.entries(p.specs || {}).map(([k, val]) =>
              `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join("")}
          </dl>
          <ul class="modal-features">
            ${(p.features || []).map((f) => `<li>${esc(f)}</li>`).join("")}
          </ul>
          <div class="modal-buy">
            <div class="modal-price">
              <small>${esc(v.detail || v.label)} · per unit</small>
              <strong id="modalPrice">${money(v.price)}</strong>
            </div>
            <button class="btn btn-primary" data-modal-add="${esc(p.id)}">
              ${icon("cart")} Add to quote
            </button>
          </div>
        </div>
      </div>`;
  }

  function refreshModalVariant(vi) {
    const p = productById(state.modal.id);
    if (!p) return;
    state.modal.variant = vi;
    const v = p.variants[vi];
    const price = $("#modalPrice");
    if (price) price.textContent = money(v.price);
    $$("[data-modal-size]").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === vi);
      btn.setAttribute("aria-pressed", String(i === vi));
    });
  }

  /* ------------------------------------------------------------- toast */
  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.innerHTML = `${icon("shield")}<span>${esc(message)}</span>`;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------------------------------------------------------- calculator */
  function initCalculator() {
    const range = $("#billRange");
    const out = $("#billValue");
    const typeWrap = $("#systemType");
    if (!range || !out || !typeWrap) return;

    const C = S.calculator;
    const stateCalc = { bill: Number(range.value), type: "onGrid" };

    const paint = () => {
      const min = Number(range.min), max = Number(range.max);
      const pct = ((stateCalc.bill - min) / (max - min)) * 100;
      range.style.setProperty("--fill", pct + "%");
    };

    const tariffEl = $("#calcTariff");
    const sunEl = $("#calcSun");
    if (tariffEl) tariffEl.textContent = moneyPrec(C.tariff);
    if (sunEl) sunEl.textContent = String(C.peakSunHours);

    function compute() {
      const bill = stateCalc.bill;
      const units = bill / C.tariff;
      const daily = units / 30;
      let kw = daily / (C.peakSunHours * C.efficiency);
      kw = Math.max(1, Math.min(45, Math.round(kw * 2) / 2));

      const annualGen = kw * C.peakSunHours * 365 * C.efficiency;
      const annualSaving = Math.min(annualGen * C.tariff, bill * 12 * 0.95);
      const cost = kw * C.costPerKw[stateCalc.type];
      const payback = annualSaving > 0 ? cost / annualSaving : 0;
      const life = annualSaving * 25 - cost;

      out.textContent = money(bill);
      $("#calcKw").textContent = kw.toFixed(1);
      $("#calcMonth").textContent = money(Math.round(annualSaving / 12));
      $("#calcCost").textContent = money(Math.round(cost / 10) * 10);
      $("#calcPayback").textContent = payback > 0 ? payback.toFixed(1) : "—";
      $("#calcLife").textContent = money(Math.round(Math.max(0, life) / 10) * 10);
      paint();
    }

    range.addEventListener("input", () => {
      stateCalc.bill = Number(range.value);
      compute();
    });

    typeWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-value]");
      if (!btn) return;
      stateCalc.type = btn.dataset.value;
      $$("button", typeWrap).forEach((b) =>
        b.setAttribute("aria-checked", String(b === btn)));
      compute();
    });

    typeWrap.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const btns = $$("button", typeWrap);
      const i = btns.indexOf(document.activeElement);
      const next = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
      next.focus(); next.click();
    });

    compute();
  }

  /* ------------------------------------------------------------- reviews */
  function renderTestimonials() {
    const grid = $("#testimonialGrid");
    if (!grid) return;
    grid.innerHTML = (S.testimonials || []).map((t, i) => {
      const initials = t.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      return `
        <article class="testimonial-card reveal" style="--delay:${i * 70}ms">
          <div class="stars" aria-label="${t.rating} out of 5">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</div>
          <p class="testimonial-quote">${esc(t.quote)}</p>
          <div class="testimonial-person">
            <span class="avatar" aria-hidden="true">${esc(initials)}</span>
            <div><strong>${esc(t.name)}</strong><small>${esc(t.role)}</small></div>
          </div>
        </article>`;
    }).join("");
  }

  /* --------------------------------------------------------------- why */
  function renderWhy() {
    const grid = $("#featureGrid");
    if (grid) {
      grid.innerHTML = (S.features || []).map((f, i) => `
        <article class="feature-card reveal" style="--delay:${i * 60}ms">
          <span class="feature-ico">${icon(f.icon)}</span>
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.text)}</p>
        </article>`).join("");
    }
    const list = $("#processList");
    if (list) {
      list.innerHTML = (S.process || []).map((p, i) => `
        <li class="process-step reveal" style="--delay:${i * 60}ms">
          <span class="process-num">STEP ${String(i + 1).padStart(2, "0")}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.text)}</p>
        </li>`).join("");
    }
  }

  /* --------------------------------------------------------------- faq */
  function renderFaqs() {
    const list = $("#faqList");
    if (!list) return;
    list.innerHTML = (S.faqs || []).map((f, i) => `
      <details class="faq-item reveal" style="--delay:${i * 40}ms"${i === 0 ? " open" : ""}>
        <summary>
          <span>${esc(f.q)}</span>
          <span class="faq-icon" aria-hidden="true"></span>
        </summary>
        <div class="faq-answer">${esc(f.a)}</div>
      </details>`).join("");
  }

  /* ------------------------------------------------------------ footer */
  function renderFooter() {
    const ul = $("#footerCats");
    if (!ul) return;
    ul.innerHTML = S.categories.map((c) =>
      `<li><a href="#shop" data-cat-link="${esc(c.key)}">${esc(c.name)}</a></li>`).join("");
  }

  /* --------------------------------------------------------------- seo */
  function injectJsonLd() {
    const data = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: S.brand.name,
      description: S.brand.metaDescription,
      telephone: S.contact.phone,
      email: S.contact.email,
      address: { "@type": "PostalAddress", streetAddress: S.contact.address },
      priceRange: "$$",
      makesOffer: S.products.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: p.name },
        price: minPrice(p),
        priceCurrency: S.currency.code,
        availability: "https://schema.org/InStock",
      })),
    };
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(data);
    document.head.appendChild(tag);
  }

  /* ----------------------------------------------------------- reveals */
  let revealObserver = null;
  function initReveals() {
    if (!("IntersectionObserver" in window)) {
      // Fail open: never leave content invisible on older engines
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const scan = () => {
      $$("[data-reveal], .reveal").forEach((el) => {
        if (el.classList.contains("is-in") || el.dataset.observed) return;
        el.dataset.observed = "1";
        revealObserver.observe(el);
      });
    };
    scan();
    // late-rendered nodes
    setTimeout(scan, 60);
  }

  /* --------------------------------------------------------- navigation */
  function initHeader() {
    const header = $("#siteHeader");
    const onScroll = () => {
      header.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $("#navToggle");
    const nav = $("#mobileNav");
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.hidden = !open;
    };
    toggle.addEventListener("click", () => setOpen(nav.hidden));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (!nav.hidden && !e.target.closest("#mobileNav") && !e.target.closest("#navToggle")) {
        setOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------- events */
  function bindEvents() {
    // Category tabs
    $("#filterTabs").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.category = btn.dataset.cat;
      renderFilterTabs();
      renderProducts();
    });

    // Deep links from category cards / footer
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-cat-link]");
      if (!link) return;
      state.category = link.dataset.catLink;
      renderFilterTabs();
      renderProducts();
    });

    // Search / size / sort
    $("#searchInput").addEventListener("input", (e) => {
      state.query = e.target.value.trim();
      renderProducts();
    });
    $("#sizeFilter").addEventListener("change", (e) => {
      state.size = e.target.value;
      renderProducts();
    });
    $("#sortSelect").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProducts();
    });
    $("#resetFilters").addEventListener("click", () => {
      state.category = "all"; state.size = "all"; state.query = ""; state.sort = "featured";
      $("#searchInput").value = ""; $("#sizeFilter").value = "all"; $("#sortSelect").value = "featured";
      renderFilterTabs(); renderProducts();
    });

    // Product grid: variants, add, quick view
    const grid = $("#productGrid");
    grid.addEventListener("click", (e) => {
      const sizeBtn = e.target.closest("[data-size]");
      if (sizeBtn) {
        const id = sizeBtn.closest(".product-card").dataset.id;
        state.variants[id] = Number(sizeBtn.dataset.size);
        refreshCard(id);
        return;
      }
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        addToCart(addBtn.dataset.add, Number(addBtn.dataset.variant));
        return;
      }
      const viewBtn = e.target.closest("[data-view]");
      if (viewBtn) { openProduct(viewBtn.dataset.view); return; }

      const card = e.target.closest(".product-card");
      if (card && !e.target.closest("button")) openProduct(card.dataset.id);
    });

    // Quote drawer
    $$("[data-open-quote]").forEach((b) => b.addEventListener("click", openDrawer));
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-drawer]")) closeDrawer();
      if (e.target.closest("[data-close-modal]")) closeProduct();
    });
    $("#scrim").addEventListener("click", () => {
      if (!$("#productModal").hidden) closeProduct();
      if (!$("#quoteDrawer").hidden) closeDrawer();
    });

    // Qty controls
    $("#quoteItems").addEventListener("click", (e) => {
      const qtyBtn = e.target.closest("[data-qty]");
      if (qtyBtn) {
        changeQty(Number(qtyBtn.dataset.index), Number(qtyBtn.dataset.qty));
      }
      const removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) {
        removeItem(Number(removeBtn.dataset.index));
      }
      if (e.target.closest("[data-clear]")) {
        if (window.confirm("Remove all items from your quote?")) clearCart();
      }
    });

    // Modal variant + add
    $("#productModal").addEventListener("click", (e) => {
      const sizeBtn = e.target.closest("[data-modal-size]");
      if (sizeBtn) {
        refreshModalVariant(Number(sizeBtn.dataset.modalSize));
        return;
      }
      const addBtn = e.target.closest("[data-modal-add]");
      if (addBtn) {
        const id = addBtn.dataset.modalAdd;
        const vi = state.modal.variant;
        state.variants[id] = vi;
        closeProduct();
        addToCart(id, vi);
        openDrawer();
        return;
      }
      if (e.target.closest("[data-close-modal]")) closeProduct();
      if (e.target.id === "productModal") closeProduct();
    });

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!$("#productModal").hidden) closeProduct();
        else if (!$("#quoteDrawer").hidden) closeDrawer();
      }
      if (e.key === "Tab") {
        const modal = $("#productModal");
        const drawer = $("#quoteDrawer");
        if (!modal.hidden) trap(modal, e);
        else if (!drawer.hidden) trap(drawer, e);
      }
    });

    // Customer details inside the quote drawer
    const fieldMap = { qName: "name", qPhone: "phone", qAddress: "address", qNotes: "notes" };
    Object.keys(fieldMap).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        customer[fieldMap[id]] = el.value;
        saveCustomer();
        updateSendLink();
      });
    });

    // Contact form -> WhatsApp
    const form = $("#leadForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      if (!name || !phone) {
        toast("Please add your name and phone number");
        const firstEmpty = !name ? form.elements.name : form.elements.phone;
        if (firstEmpty) firstEmpty.focus();
        return;
      }
      const text = [
        `Hello ${S.brand.name}! I would like a free quote.`,
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Property: ${data.get("property")}`,
        `Monthly bill: ${data.get("bill")}`,
        data.get("message") ? `Notes: ${data.get("message")}` : "",
        "",
        state.cart.length ? `Quote list total: ${money(cartTotal())}` : "",
      ].filter(Boolean).join("\n");
      window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      toast("Opening WhatsApp with your request…");
      form.reset();
    });
  }

  function trap(container, e) {
    const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------- live monitor */
  function initLiveMonitor() {
    const el = $("#kwNow");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      const v = 5.7 + Math.random() * 1.5;
      el.textContent = v.toFixed(2);
    }, 3400);
  }

  /* --------------------------------------------------------- back to top */
  function initBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------- boot */
  function init() {
    applyTheme();
    applyBrand();
    renderHero();
    renderCategories();
    renderFilterTabs();
    renderProducts();
    renderWhy();
    renderTestimonials();
    renderFaqs();
    renderFooter();
    loadCart();
    loadCustomer();
    syncCartCount();
    renderCart();
    initCalculator();
    initHeader();
    bindEvents();
    initReveals();
    initLiveMonitor();
    initBackToTop();
    injectJsonLd();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
