/* ============================================================================
   CATALOGUE ADMIN
   Edits a working copy of site.config.js in localStorage, then exports a new
   site.config.js you upload to the host. Static site, so nothing is shared
   between visitors until you publish the exported file.
   ========================================================================== */
(function () {
  "use strict";

  const PUBLISHED = window.SITE;
  const DRAFT_KEY = "arzo-draft-v1";
  const OK_KEY = "arzo-admin-ok";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  let site = null;
  let selectedId = null;
  let saveTimer = null;

  /* --------------------------------------------------------------- helpers */
  function money(n) {
    const c = site.currency || { code: "USD", locale: "en-US", decimals: 0 };
    try {
      return new Intl.NumberFormat(c.locale, {
        style: "currency", currency: c.code,
        minimumFractionDigits: 0, maximumFractionDigits: c.decimals || 0,
      }).format(Number(n) || 0);
    } catch (e) { return String(n); }
  }
  function priceRange(p) {
    const prices = (p.variants || []).map((v) => Number(v.price) || 0);
    if (!prices.length) return "no price";
    const min = Math.min(...prices), max = Math.max(...prices);
    return min === max ? money(min) : `${money(min)} – ${money(max)}`;
  }
  function setPath(obj, path, value) {
    const parts = path.split(".");
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]] || typeof o[parts[i]] !== "object") o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = value;
  }
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }
  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
  }

  /* ---------------------------------------------------------------- saving */
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(site));
        stampSaved();
      } catch (e) {
        toast("Could not save — the draft is too large for this browser.");
      }
    }, 250);
  }
  function stampSaved() {
    const t = new Date();
    $("#saveState").textContent = `Draft saved ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
    $("#draftTime").textContent = `last saved ${t.toLocaleString()}`;
  }

  /* ------------------------------------------------------------------ gate */
  function initGate() {
    $("#gateForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = String(site.admin && site.admin.pin || "");
      if ($("#pinInput").value === pin) {
        sessionStorage.setItem(OK_KEY, "1");
        unlock();
      } else {
        $("#gateErr").hidden = false;
        $("#pinInput").value = "";
        $("#pinInput").focus();
      }
    });
  }
  function unlock() {
    $("#gate").hidden = true;
    $("#app").hidden = false;
    selectedId = (site.products[0] || {}).id || null;
    renderAll();
  }

  /* ----------------------------------------------------------------- lists */
  function renderCounts() {
    $("#countProducts").textContent = site.products.length;
    $("#countCategories").textContent = site.categories.length;
  }

  function renderProductList() {
    const box = $("#productList");
    if (!site.products.length) {
      box.innerHTML = '<p class="list-empty">No products yet. Click “Add product”.</p>';
      return;
    }
    box.innerHTML = site.products.map((p) => `
      <button type="button" class="list-item${p.id === selectedId ? " is-active" : ""}" data-select="${esc(p.id)}">
        <img src="${esc(p.image)}" alt="" loading="lazy" />
        <span>
          <span class="li-name">${esc(p.name || "Untitled")}</span>
          <span class="li-meta">${esc(priceRange(p))}</span>
        </span>
      </button>`).join("");
  }

  function renderEditor() {
    const box = $("#productEditor");
    const p = site.products.find((x) => x.id === selectedId);
    if (!p) {
      box.innerHTML = '<div class="editor-empty">Select a product on the left, or add a new one.</div>';
      return;
    }
    const variants = p.variants || (p.variants = [{ label: "Small", detail: "", price: 0 }]);
    const specText = Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n");

    box.innerHTML = `
      <div class="ed-head">
        <div>
          <h2>${esc(p.name || "Untitled product")}</h2>
          <p>${esc((site.categories.find((c) => c.key === p.category) || {}).name || "No category")} · ${variants.length} size${variants.length === 1 ? "" : "s"}</p>
        </div>
        <button class="btn btn-ghost btn-sm" type="button" data-del-product>Delete product</button>
      </div>

      <div class="ed-card">
        <h3>Basics</h3>
        <div class="ed-grid">
          <label class="field"><span>Product name</span>
            <input data-p="name" value="${esc(p.name)}" />
          </label>
          <label class="field"><span>Category</span>
            <select data-p="category">
              ${site.categories.map((c) => `<option value="${esc(c.key)}"${c.key === p.category ? " selected" : ""}>${esc(c.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field"><span>Badge (optional)</span>
            <input data-p="badge" value="${esc(p.badge || "")}" placeholder="Best seller" />
          </label>
          <label class="field"><span>Short description</span>
            <textarea data-p="blurb" rows="2">${esc(p.blurb)}</textarea>
          </label>
        </div>
      </div>

      <div class="ed-card">
        <h3>Photo</h3>
        <div class="image-row">
          <img class="image-preview" id="imgPreview" src="${esc(p.image)}" alt="" />
          <div class="image-fields">
            <label class="field"><span>Image path or URL</span>
              <input data-p="image" id="imgPath" value="${esc(p.image)}" />
            </label>
            <button class="btn btn-ghost btn-sm" type="button" data-upload>Upload a photo…</button>
            <p class="cat-key">Best size 1000 × 750 px (4:3). Uploads are stored inside the draft and travel with the export.</p>
          </div>
        </div>
      </div>

      <div class="ed-card">
        <h3> Sizes &amp; prices </h3>
        <div class="variant-head"><span>Label</span><span>Detail (kW / W)</span><span>Price</span><span>Old price</span><span></span></div>
        ${variants.map((v, i) => `
          <div class="variant-row">
            <input data-v="${i}" data-k="label" value="${esc(v.label)}" placeholder="Small" aria-label="Size label" />
            <input data-v="${i}" data-k="detail" value="${esc(v.detail || "")}" placeholder="3.6 kW" aria-label="Size detail" />
            <input type="number" data-v="${i}" data-k="price" value="${Number(v.price) || 0}" min="0" step="1" aria-label="Price" />
            <input type="number" data-v="${i}" data-k="compareAt" value="${v.compareAt ? Number(v.compareAt) : ""}" min="0" step="1" placeholder="—" aria-label="Old price" />
            <button class="icon-x" type="button" data-rm-variant="${i}" aria-label="Remove size">✕</button>
          </div>`).join("")}
        <button class="add-link" type="button" data-add-variant>+ Add another size</button>
      </div>

      <div class="ed-card">
        <h3>Details</h3>
        <div class="ed-grid">
          <label class="field"><span>Features — one per line</span>
            <textarea data-list="features" rows="5">${esc((p.features || []).join("\n"))}</textarea>
          </label>
          <label class="field"><span>Specs — “Key: value” per line</span>
            <textarea data-specs rows="5">${esc(specText)}</textarea>
          </label>
        </div>
      </div>`;
  }

  /* --------------------------------------------------------------- render */
  function renderCategories() {
    const box = $("#categoryList");
    box.innerHTML = site.categories.map((c, i) => `
      <div class="cat-row">
        <div>
          <input data-cat-name="${i}" value="${esc(c.name)}" aria-label="Category name" />
          <div class="cat-key">key: ${esc(c.key)} · ${site.products.filter((p) => p.category === c.key).length} product(s)</div>
        </div>
        <input data-cat-blurb="${i}" value="${esc(c.blurb || "")}" placeholder="Short description" aria-label="Category description" />
        <button class="icon-x" type="button" data-del-cat="${i}" aria-label="Delete category">✕</button>
      </div>`).join("");
  }

  function renderBusiness() {
    const c = site.contact, cu = site.currency, th = site.theme, calc = site.calculator || {};
    const field = (label, path, value, type = "text", extra = "") => `
      <label class="field"><span>${esc(label)}</span>
        <input type="${type}" data-biz="${path}" value="${esc(value)}" ${extra} />
      </label>`;

    $("#businessForm").innerHTML = `
      <div class="biz-card">
        <h3>Identity</h3>
        ${field("Business name", "brand.name", site.brand.name)}
        ${field("Short name (logo area)", "brand.shortName", site.brand.shortName)}
        ${field("Tagline", "brand.tagline", site.brand.tagline)}
        ${field("PIN for this page", "admin.pin", (site.admin || {}).pin || "")}
      </div>
      <div class="biz-card">
        <h3>Contact</h3>
        ${field("Phone (as dialled, +93…)", "contact.phone", c.phone)}
        ${field("Phone (as shown)", "contact.phoneDisplay", c.phoneDisplay)}
        ${field("WhatsApp (digits only)", "contact.whatsapp", c.whatsapp)}
        ${field("Email", "contact.email", c.email, "email")}
        ${field("Address", "contact.address", c.address)}
        ${field("Opening hours", "contact.hours", c.hours)}
      </div>
      <div class="biz-card">
        <h3>Money</h3>
        ${field("Currency code", "currency.code", cu.code)}
        ${field("Currency symbol", "currency.symbol", cu.symbol)}
        ${field("Locale", "currency.locale", cu.locale)}
        ${field("Decimals (0 or 2)", "currency.decimals", cu.decimals, "number", 'min="0" max="2"')}
      </div>
      <div class="biz-card">
        <h3>Colours &amp; calculator</h3>
        ${field("Brand colour", "theme.brand", th.brand, "color")}
        ${field("Accent colour", "theme.accent", th.accent, "color")}
        ${field("Electricity tariff", "calculator.tariff", calc.tariff, "number", 'step="0.01" min="0"')}
        ${field("Peak sun hours / day", "calculator.peakSunHours", calc.peakSunHours, "number", 'step="0.1" min="1"')}
      </div>`;
  }

  function renderAll() {
    renderCounts();
    renderProductList();
    renderEditor();
    renderCategories();
    renderBusiness();
  }

  /* ---------------------------------------------------------------- events */
  function bindEvents() {
    // Tabs
    $("#tabs").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (!btn) return;
      $$("#tabs button").forEach((b) => b.classList.toggle("is-active", b === btn));
      $$(".admin-panel").forEach((p) => { p.hidden = p.id !== `tab-${btn.dataset.tab}`; });
    });

    // Product list
    $("#productList").addEventListener("click", (e) => {
      const row = e.target.closest("[data-select]");
      if (!row) return;
      selectedId = row.dataset.select;
      renderProductList();
      renderEditor();
    });

    // Add product
    $("#addProduct").addEventListener("click", () => {
      const id = "product-" + Date.now().toString(36);
      site.products.unshift({
        id,
        name: "New product",
        category: (site.categories[0] || {}).key || "systems",
        image: "assets/img/products/system-home.jpg",
        blurb: "Describe the product in one sentence.",
        features: [],
        specs: {},
        variants: [{ label: "Small", detail: "", price: 0 }],
      });
      selectedId = id;
      save(); renderAll();
      toast("Product added — fill in the name and price");
    });

    // Editor
    const ed = $("#productEditor");
    ed.addEventListener("input", (e) => {
      const p = site.products.find((x) => x.id === selectedId);
      if (!p) return;
      const t = e.target;

      if (t.dataset.p) {
        const key = t.dataset.p;
        p[key] = t.value;
        save();
        if (key === "name") {
          $(".ed-head h2", ed).textContent = t.value || "Untitled product";
          renderProductList();
        }
        if (key === "image") {
          $("#imgPreview").src = t.value;
          renderProductList();
        }
        if (key === "category") $(".ed-head p", ed).textContent =
          (site.categories.find((c) => c.key === t.value) || {}).name || "";
        return;
      }
      if (t.dataset.v != null) {
        const i = Number(t.dataset.v);
        const k = t.dataset.k;
        if (!p.variants[i]) return;
        p.variants[i][k] = (k === "price" || k === "compareAt")
          ? (t.value === "" ? (k === "compareAt" ? null : 0) : Number(t.value))
          : t.value;
        save();
        if (k === "price" || k === "compareAt") renderProductList();
        return;
      }
      if (t.dataset.list) {
        p[t.dataset.list] = t.value.split("\n").map((s) => s.trim()).filter(Boolean);
        save();
        return;
      }
      if (t.dataset.specs != null) {
        const obj = {};
        t.value.split("\n").forEach((line) => {
          const i = line.indexOf(":");
          if (i > 0) obj[line.slice(0, i).trim()] = line.slice(i + 1).trim();
        });
        p.specs = obj;
        save();
      }
    });

    ed.addEventListener("click", (e) => {
      const p = site.products.find((x) => x.id === selectedId);
      if (!p) return;

      if (e.target.closest("[data-add-variant]")) {
        p.variants.push({ label: "New size", detail: "", price: 0 });
        save(); renderEditor(); renderProductList();
        return;
      }
      const rm = e.target.closest("[data-rm-variant]");
      if (rm) {
        if (p.variants.length <= 1) { toast("A product needs at least one size"); return; }
        p.variants.splice(Number(rm.dataset.rmVariant), 1);
        save(); renderEditor(); renderProductList();
        return;
      }
      if (e.target.closest("[data-del-product]")) {
        if (!confirm(`Delete “${p.name}”? This only affects the draft until you export.`)) return;
        site.products = site.products.filter((x) => x.id !== p.id);
        selectedId = (site.products[0] || {}).id || null;
        save(); renderAll();
        toast("Product deleted");
        return;
      }
      if (e.target.closest("[data-upload]")) $("#fileInput").click();
    });

    // Upload
    $("#fileInput").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!file) return;
      const p = site.products.find((x) => x.id === selectedId);
      if (!p) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 900;
          let w = img.width, h = img.height;
          if (w > max) { h = Math.round((h * max) / w); w = max; }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          p.image = canvas.toDataURL("image/jpeg", 0.82);
          save();
          renderEditor();
          renderProductList();
          toast("Photo added to this product");
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    // Categories
    $("#categoryList").addEventListener("input", (e) => {
      const t = e.target;
      if (t.dataset.catName != null) {
        const c = site.categories[Number(t.dataset.catName)];
        c.name = t.value;
        save(); renderProductList();
      }
      if (t.dataset.catBlurb != null) {
        const c = site.categories[Number(t.dataset.catBlurb)];
        c.blurb = t.value;
        save();
      }
    });
    $("#categoryList").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-del-cat]");
      if (!btn) return;
      const i = Number(btn.dataset.delCat);
      const c = site.categories[i];
      const used = site.products.filter((p) => p.category === c.key).length;
      if (used) { toast(`${used} product(s) still use “${c.name}” — move them first.`); return; }
      if (site.categories.length <= 1) { toast("Keep at least one category"); return; }
      if (!confirm(`Delete category “${c.name}”?`)) return;
      site.categories.splice(i, 1);
      save(); renderAll();
    });
    $("#addCategory").addEventListener("click", () => {
      let key = "category";
      let n = 2;
      while (site.categories.some((c) => c.key === key)) key = "category-" + n++;
      site.categories.push({ key, name: "New category", blurb: "Short description" });
      save(); renderCategories(); renderCounts(); renderProductList();
      toast("Category added");
    });

    // Business fields
    $("#businessForm").addEventListener("input", (e) => {
      const t = e.target;
      if (!t.dataset.biz) return;
      const path = t.dataset.biz;
      let value = t.value;
      if (t.type === "number") value = t.value === "" ? 0 : Number(t.value);
      setPath(site, path, value);
      save();
      if (path === "brand.name") {
        $("#brandName").textContent = value;
        document.title = `Catalogue admin — ${value}`;
      }
    });

    // Toolbar
    $("#exportBtn").addEventListener("click", exportConfig);
    $("#resetBtn").addEventListener("click", () => {
      if (!confirm("Discard the draft and reload the published catalogue?")) return;
      localStorage.removeItem(DRAFT_KEY);
      site = clone(PUBLISHED);
      selectedId = (site.products[0] || {}).id || null;
      renderAll();
      $("#saveState").textContent = "Draft cleared";
      $("#draftTime").textContent = "no draft";
      toast("Draft cleared — showing the published catalogue");
    });
    $("#importBtn").addEventListener("click", () => $("#importInput").click());
    $("#importInput").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result));
          if (!data.brand || !Array.isArray(data.products)) throw new Error("Not a site config");
          site = data;
          selectedId = (site.products[0] || {}).id || null;
          save(); renderAll();
          toast("Imported");
        } catch (err) {
          toast("That file is not a valid config backup");
        }
      };
      reader.readAsText(file);
    });
  }

  /* ---------------------------------------------------------------- export */
  function exportConfig() {
    const stamp = new Date().toLocaleString();
    const header =
`/* ============================================================================
   SITE CONFIG — ${site.brand.name}
   Exported ${stamp} from admin.html
   ----------------------------------------------------------------------------
   Replace assets/js/site.config.js with this file, then upload it to your host.
   Uploaded photos are embedded below as base64 data URLs.
   ========================================================================== */

window.SITE = `;
    const text = header + JSON.stringify(site, null, 2) + ";\n";
    download(
      "site.config.js",
      text,
      "text/javascript",
      `Exported site.config.js (${Math.round(text.length / 1024)} KB)`
    );
  }

  function download(name, text, type, message) {
    const blob = new Blob([text], { type: type + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    if (message) toast(message);
  }

  /* ------------------------------------------------------------------ boot */
  site = clone(PUBLISHED);
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (draft && draft.brand && Array.isArray(draft.products)) site = draft;
  } catch (e) { /* ignore broken draft */ }

  $("#brandName").textContent = site.brand.name;
  document.title = `Catalogue admin — ${site.brand.name}`;
  initGate();
  bindEvents();

  if (sessionStorage.getItem(OK_KEY) === "1") unlock();
  else $("#pinInput").focus();
})();
