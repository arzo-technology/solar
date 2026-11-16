# Arzo Technology — solar website

A complete one-page website for a solar business, plus a catalogue admin page so the
owner can change products, sizes, prices and categories without touching code.

No build step. No frameworks. No server. Upload the files and it works.

---

## 1. What is in this folder

```
index.html                    the website
admin.html                    catalogue editor (PIN protected)
assets/
  css/styles.css              design
  css/admin.css               admin page design
  js/site.config.js           ← all text, prices, contact details
  js/main.js                  cart, calculator, filters
  js/admin.js                 admin logic
  img/products/*.jpg          product photos
  img/product-*.svg           product renders (inverters, controller, cable, rails)
  img/favicon.svg             site icon
README.md                     this file
```

`index.html` needs the `assets` folder next to it. Upload them together, keeping
the folder structure exactly as it is.

---

## 2. Open it

Double-click `index.html`.

For a proper test (so the quote basket behaves exactly like production), serve the folder:

```powershell
python -m http.server 8137
```

Then open `http://127.0.0.1:8137`.

---

## 3. Editing products, sizes, prices and categories — no code

Open **`admin.html`** (there is also a small *Admin* link in the footer).

1. Enter the PIN — default **1234**. Change it in `site.config.js` → `admin.pin`.
2. **Products** tab — pick a product on the left, edit on the right:
   - name, category, badge, short description
   - photo (paste a path, or click **Upload a photo…**)
   - sizes and prices — add or remove as many as you like
   - features (“one per line”) and specs (“Key: value” per line)
   - **+ Add product** creates a new one; **Delete product** removes it
3. **Categories** tab — add, rename or delete categories. A category that still has
   products cannot be deleted (move those products first).
4. **Business info** tab — name, phone, WhatsApp, email, address, currency, colours,
   calculator numbers and the PIN.
5. **Export site.config.js** → put that file in `assets/js/site.config.js`, replacing the
   old one, and upload it.

### The important part: draft vs published

This is a static site, so the admin cannot change the live site for everybody by itself.

- While you edit, everything is saved as a **draft in your own browser only**.
- **Preview draft** opens the site with your unsaved-to-the-world changes.
- **Export site.config.js** produces the file that makes the changes real for all visitors.
- **Reset** throws the draft away and goes back to the published catalogue.

So the loop is: *edit → preview → export → replace the file on the host*.

> If two people edit on different computers, their drafts do not sync — only the
> exported file is shared. For one owner, that is exactly what you want.

---

## 4. Changing the brand and phone number

Everything is in `assets/js/site.config.js`. The admin page covers most of it, but the
file is the source of truth:

| What | Where |
| --- | --- |
| Name, tagline, browser title | `brand.name`, `brand.tagline`, `brand.metaTitle` |
| Logo | save the file in `assets/img/` and set `brand.logo: "assets/img/logo.svg"` (leave `null` for the built-in sun) |
| Phone (call buttons) | `contact.phone` — international format, `+93711620061` |
| WhatsApp | `contact.whatsapp` — digits only, `93711620061` |
| Email, address, hours, map | `contact.email`, `contact.address`, `contact.hours`, `contact.mapUrl` |
| Colours | `theme.brand`, `theme.accent` |
| Currency | `currency.code`, `currency.locale`, `currency.decimals` |
| Calculator | `calculator.tariff`, `calculator.peakSunHours` |

### Currency

The site shows **one** currency. It is currently USD. To switch to afghani:

```js
currency: { code: "AFN", locale: "fa-AF", symbol: "؋", decimals: 0 },
```

…then change the product prices to whole afghani numbers. Nothing else needs editing.

---

## 5. About the photos

The photos in `assets/img/products/` are **free stock placeholders** from Pexels
(their licence allows commercial use without attribution). They are not Arzo
Technology's own work and should be replaced before the site is presented as real
completed projects.

To replace one:

1. Take or receive a photo, crop it to **4:3** (e.g. 1000 × 750 px).
2. Admin → Products → the product → **Upload a photo…**, or drop the file in
   `assets/img/products/` and type its path.
3. Export and upload.

The inverter, controller, cable and mounting images are drawn renders rather than
photos, because there is no good free photography of those products. Replace them with
the client's own product shots when available.

---

## 6. Putting it online (GitHub Pages)

1. Create a GitHub account, then **New repository** → name it `arzo-technology` → **Public**.
2. **Add file → Upload files** → drag `index.html`, `admin.html`, `assets` and `README.md`
   → **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)`
   → **Save**.
4. After a minute the site is live at `https://USERNAME.github.io/arzo-technology/`.

A real domain (like `arzotechnology.com`) is not bought on GitHub. Buy it separately
(Namecheap, Cloudflare, GoDaddy, ~$10–15/year), then in **Settings → Pages → Custom
domain** enter it and point the domain's DNS at GitHub:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `USERNAME.github.io` |

Then enable **Enforce HTTPS**. Buy the domain in the **client's** name, not yours.

---

## 7. Before you hand it over

- [ ] Real phone and WhatsApp tested from a phone (tap Call, tap WhatsApp)
- [ ] Email and street address are the client's, not placeholders
- [ ] Prices checked against the client's real price list
- [ ] Photos replaced with the client's own, or labelled as examples
- [ ] PIN changed from `1234`
- [ ] Reviews and FAQs are true for this business
- [ ] Calculator tariff and sun hours match the local market
- [ ] Tested on a phone at 390 px and on desktop
- [ ] Uploaded to the host, and the live URL opened on a phone

---

## 8. Notes and limits

- **No payment and no backend.** Orders go to WhatsApp with the full item list, sizes,
  quantities, total and the customer's name, address and notes. That is deliberate —
  it needs no server, no database and no card fees.
- **The quote basket** is stored in the visitor's browser (`localStorage`), so it survives
  a refresh. Nothing is sent anywhere until they press the WhatsApp button.
- **The admin PIN is not real security.** It lives in a public file; it prevents
  accidents, not attackers. Never put private data in this site.
- **Uploaded photos** are embedded in the exported config as base64. Keep uploads under
  ~900 px wide, or the config file becomes heavy.
- **Accessibility:** keyboard-navigable, focus states, `Esc` closes overlays, honours
  `prefers-reduced-motion`.
- **Printing:** the site has a print stylesheet, so it can be printed as a price sheet.
