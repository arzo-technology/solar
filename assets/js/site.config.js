/* ============================================================================
   SITE CONFIG — THIS IS THE ONLY FILE YOU NEED TO EDIT FOR A NEW CLIENT
   ----------------------------------------------------------------------------
   Brand name, logo, phone, colors, products, prices, text: all live here.
   Save the file, refresh the page. That is the whole rebrand.
   ========================================================================== */

window.SITE = {

  /* ------------------------------------------------------------------ BRAND */
  brand: {
    name: "Arzo Technology",
    shortName: "Arzo",
    tagline: "Clean power, installed right",
    // Leave as null to use the built-in sun mark, or point to your own file:
    // logo: "assets/img/client-logo.svg",
    logo: null,
    // Text shown in the browser tab and search results
    metaTitle: "Arzo Technology — Solar Panels, Inverters & Complete Systems",
    metaDescription:
      "Solar panels, hybrid inverters, lithium batteries and complete installed systems in Kabul. Free site survey, fixed quotes and same-week installation by Arzo Technology.",
  },

  /* ---------------------------------------------------------------- CONTACT */
  contact: {
    phone: "+93711620061",           // used for the call buttons (tel: link)
    phoneDisplay: "+93 71 162 0061", // what visitors see
    whatsapp: "93711620061",         // digits only, with country code, no + or 00
    email: "info@arzotechnology.com",
    address: "Kabul, Afghanistan",
    hours: "Sat – Thu, 8:00 – 18:00",
    mapUrl: "https://maps.google.com/?q=Kabul",
    socials: {
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      whatsapp: "https://wa.me/93711620061",
    },
  },

  /* ------------------------------------------------------------------ THEME */
  // Any valid CSS color. The whole site (buttons, icons, glow, charts) follows.
  theme: {
    brand: "#0E4A38",      // deep emerald — headers, primary buttons
    brandSoft: "#1C6B52",  // lighter emerald — gradients, hovers
    accent: "#C9F25E",     // lime — highlights on dark backgrounds
    accentInk: "#0A1512",  // text placed on top of the accent color
    radius: "22px",        // 0px = sharp/corporate, 28px = soft/friendly
    fontDisplay: '"Sora", "Segoe UI", system-ui, sans-serif',
    fontBody: '"Inter", "Segoe UI", system-ui, sans-serif',
  },

  /* --------------------------------------------------------------- CURRENCY */
  currency: {
    code: "USD",
    locale: "en-US",
    symbol: "$",
    decimals: 0, // prices are whole numbers → no .00
  },

  /* ------------------------------------------------------------------- HERO */
  hero: {
    eyebrow: "Homes · Shops · Farms · Offices",
    titleHtml: "Turn sunlight into a <em>lower bill</em>, every single month.",
    lead:
      "Tier-1 panels, hybrid inverters and lithium storage — surveyed, designed, installed and monitored by one accountable team. Most homes are live in under a week.",
    primaryCta: "Get a free quote",
    secondaryCta: "See systems & prices",
    stats: [
      { value: "1,240+", label: "systems installed" },
      { value: "6.2 MW", label: "clean capacity" },
      { value: "25 yr", label: "panel warranty" },
      { value: "4.9/5", label: "customer rating" },
    ],
  },

  /* ------------------------------------------------------------ TRUST STRIP */
  partners: {
    label: "Tier-1 hardware we install",
    names: ["LONGi", "Jinko Solar", "Growatt", "Deye", "Pylontech", "Victron"],
  },

  /* ------------------------------------------------------------- CATEGORIES */
  categories: [
    { key: "inverters",  name: "Inverters",        blurb: "Hybrid, on-grid & off-grid" },
    { key: "panels",     name: "Solar panels",     blurb: "N-type mono, 450–620 W" },
    { key: "batteries",  name: "Batteries",        blurb: "LiFePO₄ storage, 5–15 kWh" },
    { key: "controllers",name: "Controllers",      blurb: "MPPT charge controllers" },
    { key: "mounting",   name: "Mounting",         blurb: "Roof & ground structures" },
    { key: "systems",    name: "Complete systems", blurb: "Small to large, all-in-one" },
    { key: "accessories",name: "Accessories",      blurb: "Cable, MC4, breakers" },
  ],

  /* --------------------------------------------------------------- PRODUCTS */
  // Sizes (Small / Medium / Large) are variants — each with its own price.
  // Copy this block to add a product. `image` can be an SVG or a .jpg/.webp photo.
  products: [
    {
      id: "hybrid-inverter",
      name: "Hybrid Inverter H-Series",
      category: "inverters",
      badge: "Best seller",
      image: "assets/img/product-inverter.svg",
      blurb:
        "Runs your home, charges the battery and exports surplus — one box, with a 20 ms switchover when the grid drops.",
      features: [
        "Battery-ready: 48 V lithium or lead-acid",
        "Dual MPPT, 1.3× panel oversizing",
        "Wi-Fi app monitoring included",
        "IP65 — indoor and outdoor rated",
      ],
      specs: {
        "Rated output": "3.6 – 8 kW",
        "Max efficiency": "97.6 %",
        "MPPT trackers": "2",
        "Battery voltage": "48 V DC",
        "Protection": "IP65",
        "Warranty": "5 years",
      },
      variants: [
        { label: "Small",  detail: "3.6 kW", price: 720,  compareAt: 860 },
        { label: "Medium", detail: "5 kW",   price: 980 },
        { label: "Large",  detail: "8 kW",   price: 1450, compareAt: 1590 },
      ],
    },
    {
      id: "ongrid-inverter",
      name: "On-Grid String Inverter",
      category: "inverters",
      image: "assets/img/product-inverter-ongrid.svg",
      blurb:
        "The lowest cost per watt if you only need to kill your daytime bill and have a stable grid connection.",
      features: [
        "Up to 3 MPPT for complex roofs",
        "98.4 % peak efficiency",
        "Anti-islanding protection",
        "10-year warranty, extendable",
      ],
      specs: {
        "Rated output": "5 – 15 kW",
        "Max efficiency": "98.4 %",
        "MPPT trackers": "2 – 3",
        "Grid type": "Single / three phase",
        "Protection": "IP66",
        "Warranty": "10 years",
      },
      variants: [
        { label: "Small",  detail: "5 kW",  price: 540 },
        { label: "Medium", detail: "10 kW", price: 960 },
        { label: "Large",  detail: "15 kW", price: 1320 },
      ],
    },
    {
      id: "solar-panel",
      name: "N-Type Mono Panel",
      category: "panels",
      badge: "Tier-1",
      image: "assets/img/products/panel-array.jpg",
      blurb:
        "Half-cut N-type cells with a low temperature coefficient — the panel keeps producing when the roof gets hot.",
      features: [
        "22.8 % module efficiency",
        "Bifacial option for +8 % yield",
        "30-year linear power warranty",
        "IP68 junction box, MC4 ready",
      ],
      specs: {
        "Power": "450 – 620 W",
        "Cell type": "N-type TOPCon",
        "Efficiency": "22.8 %",
        "Degradation": "0.4 % / year",
        "Warranty": "25 years",
        "Dimensions": "2278 × 1134 mm",
      },
      variants: [
        { label: "Small",  detail: "450 W", price: 118 },
        { label: "Medium", detail: "550 W", price: 146, compareAt: 165 },
        { label: "Large",  detail: "620 W", price: 178 },
      ],
    },
    {
      id: "lithium-battery",
      name: "LiFePO₄ Wall Battery",
      category: "batteries",
      image: "assets/img/products/battery-lifepo4.jpg",
      blurb:
        "Keep the fridge, lights and internet on through the night — or through a five-hour outage.",
      features: [
        "6,000 cycles at 90 % depth of discharge",
        "Built-in BMS with app + CAN/RS485",
        "Stackable up to 4 units",
        "Floor or wall mount, 10-year warranty",
      ],
      specs: {
        "Capacity": "5.1 – 15.3 kWh",
        "Chemistry": "LiFePO₄",
        "Cycle life": "6,000 @ 90 % DoD",
        "Voltage": "48 V DC",
        "Comms": "CAN / RS485",
        "Warranty": "10 years",
      },
      variants: [
        { label: "Small",  detail: "5.1 kWh",  price: 1180 },
        { label: "Medium", detail: "10.2 kWh", price: 2240 },
        { label: "Large",  detail: "15.3 kWh", price: 3190, compareAt: 3420 },
      ],
    },
    {
      id: "mppt-controller",
      name: "MPPT Charge Controller",
      category: "controllers",
      image: "assets/img/product-controller.svg",
      blurb:
        "For off-grid cabins and farms: squeezes up to 30 % more harvest out of the same panels than a PWM unit.",
      features: [
        "60 A / 100 A models",
        "12 / 24 / 48 V auto-detect",
        "Bluetooth app + LCD display",
        "Temperature-compensated charging",
      ],
      specs: {
        "Current": "60 – 100 A",
        "System voltage": "12 / 24 / 48 V",
        "Max PV input": "150 V DC",
        "Efficiency": "98 %",
        "Protection": "IP32",
        "Warranty": "3 years",
      },
      variants: [
        { label: "Small", detail: "60 A",  price: 185 },
        { label: "Large", detail: "100 A", price: 295 },
      ],
    },
    {
      id: "mounting-kit",
      name: "Roof & Ground Mounting Kit",
      category: "mounting",
      image: "assets/img/product-mounting.svg",
      blurb:
        "Anodised aluminium rails with stainless fixings and wind-load calculations — ready for tile, metal or concrete.",
      features: [
        "Aluminium 6005-T5, stainless 304",
        "Pre-drilled, 15-minute panel install",
        "10-year structural warranty",
        "Tilt frames for flat roofs",
      ],
      specs: {
        "Material": "Aluminium + SS304",
        "Panel capacity": "4 – 20 panels",
        "Wind load": "Up to 60 m/s",
        "Snow load": "1.4 kN/m²",
        "Roof types": "Tile / metal / concrete",
        "Warranty": "10 years",
      },
      variants: [
        { label: "Small",  detail: "4 panels",  price: 140 },
        { label: "Medium", detail: "10 panels", price: 320 },
        { label: "Large",  detail: "20 panels", price: 590 },
      ],
    },
    {
      id: "complete-system",
      name: "Complete Solar System",
      category: "systems",
      badge: "Most popular",
      image: "assets/img/products/system-home.jpg",
      blurb:
        "Panels, inverter, battery, mounting and installation in one fixed price. Choose a size, we handle everything else.",
      features: [
        "Includes design, delivery and install",
        "Hybrid inverter with backup output",
        "Monitoring app set up on your phone",
        "5-year workmanship guarantee",
      ],
      specs: {
        "System size": "3 – 10 kW",
        "Panels": "6 – 20 × 550 W",
        "Battery": "5.1 – 15.3 kWh",
        "Backup": "Essential circuits",
        "Install time": "1 – 3 days",
        "Warranty": "5 – 10 years",
      },
      variants: [
        { label: "Small",  detail: "3 kW · 6 panels",   price: 2450, compareAt: 2790 },
        { label: "Medium", detail: "5 kW · 10 panels",  price: 3690 },
        { label: "Large",  detail: "10 kW · 20 panels", price: 6890, compareAt: 7450 },
      ],
    },
    {
      id: "bifacial-panel",
      name: "Bifacial N-Type Panel",
      category: "panels",
      badge: "New",
      image: "assets/img/products/panel-close.jpg",
      blurb:
        "Glass on both faces, so it also harvests light bouncing off the roof — roughly 8 % more yield from the same area.",
      features: [
        "Up to 8 % extra yield from rear-side gain",
        "Dual-glass construction, 30-year warranty",
        "Lower temperature coefficient in heat",
        "Best on white roofs and ground mounts",
      ],
      specs: {
        "Power": "550 – 620 W",
        "Cell type": "N-type TOPCon bifacial",
        "Bifaciality": "80 % ± 5 %",
        "Efficiency": "22.6 %",
        "Warranty": "30 years",
        "Dimensions": "2278 × 1134 mm",
      },
      variants: [
        { label: "Small", detail: "550 W", price: 158 },
        { label: "Large", detail: "620 W", price: 196 },
      ],
    },
    {
      id: "ground-mount",
      name: "Ground-Mounted Array",
      category: "systems",
      image: "assets/img/products/ground-mount.jpg",
      blurb:
        "When the roof is not big enough: a ballasted ground structure with panels, inverter and cabling included.",
      features: [
        "Galvanised steel or aluminium frame",
        "Ballast or pile foundations",
        "Tilt optimised for your latitude",
        "Installation and commissioning included",
      ],
      specs: {
        "System size": "5 – 20 kW",
        "Structure": "Hot-dip galvanised",
        "Tilt": "20 – 35°",
        "Wind load": "Up to 60 m/s",
        "Install time": "3 – 7 days",
        "Warranty": "10 years structure",
      },
      variants: [
        { label: "Small", detail: "5 kW", price: 3290 },
        { label: "Medium", detail: "10 kW", price: 5890 },
        { label: "Large", detail: "20 kW", price: 10900 },
      ],
    },
    {
      id: "commercial-array",
      name: "Commercial Solar Array",
      category: "systems",
      badge: "For business",
      image: "assets/img/products/system-commercial.jpg",
      blurb:
        "For warehouses, factories and shops with a daytime load. Sized on your meter data, not on roof area.",
      features: [
        "Three-phase, grid-tied design",
        "Load analysis from your bills",
        "Zero-export or net-metering options",
        "Monitoring dashboard for the manager",
      ],
      specs: {
        "System size": "20 – 100 kW",
        "Grid connection": "Three phase, 400 V",
        "Panels": "36 – 180 × 550 W",
        "Monitoring": "Web + app portal",
        "Install time": "2 – 6 weeks",
        "Warranty": "5 years workmanship",
      },
      variants: [
        { label: "Small", detail: "20 kW", price: 19500 },
        { label: "Medium", detail: "50 kW", price: 44000 },
        { label: "Large", detail: "100 kW", price: 82000 },
      ],
    },
    {
      id: "solar-carport",
      name: "Solar Carport",
      category: "systems",
      image: "assets/img/products/carport.jpg",
      blurb:
        "Shade for the cars and power for the building from the same steel frame — popular with offices and shops.",
      features: [
        "Steel frame, 10-year structural warranty",
        "Rain and hail protection",
        "Optional EV charging points",
        "Panels, inverter and wiring included",
      ],
      specs: {
        "System size": "10 – 40 kW",
        "Structure": "Galvanised steel",
        "Coverage": "4 – 16 cars",
        "Clear height": "2.4 – 3.0 m",
        "Install time": "1 – 3 weeks",
        "Warranty": "10 years structure",
      },
      variants: [
        { label: "Small", detail: "10 kW · 4 cars", price: 8900 },
        { label: "Medium", detail: "20 kW · 8 cars", price: 16400 },
        { label: "Large", detail: "40 kW · 16 cars", price: 29900 },
      ],
    },
    {
      id: "cable-kit",
      name: "Cable & Connector Kit",
      category: "accessories",
      image: "assets/img/product-accessory.svg",
      blurb:
        "UV-rated DC cable, genuine MC4 connectors, breakers and labels — the small parts that decide whether a system lasts 20 years.",
      features: [
        "1 × 6 mm² twin-core solar cable",
        "4 × MC4 connector pairs",
        "DC breaker + surge protection",
        "Cable clips and UV-rated ties",
      ],
      specs: {
        "Cable": "6 mm², 1500 V DC",
        "Rating": "UV / ozone resistant",
        "Connectors": "MC4, IP68",
        "Lengths": "10 m or 25 m",
        "Included": "Breaker + SPD + clips",
        "Warranty": "2 years",
      },
      variants: [
        { label: "Small", detail: "10 m kit", price: 39 },
        { label: "Large", detail: "25 m kit", price: 79 },
      ],
    },
  ],

  /* ---------------------------------------------------------------- WHY US */
  features: [
    {
      icon: "shield",
      title: "Only Tier-1 hardware",
      text: "Panels and inverters from the top 2 % of global manufacturers — no unbranded stock, no surprises in year three.",
    },
    {
      icon: "bolt",
      title: "Installed in days, not weeks",
      text: "One crew, one schedule. Most residential systems are surveyed, installed and switched on inside seven days.",
    },
    {
      icon: "chart",
      title: "You can see it working",
      text: "Every system ships with app monitoring. If production drops, we call you before you notice the bill.",
    },
    {
      icon: "wrench",
      title: "Local team, real people",
      text: "We answer the phone after the sale. Maintenance, cleaning and warranty claims are handled in-house.",
    },
  ],

  process: [
    { title: "Free site survey", text: "We measure the roof, check the wiring and read your last six bills." },
    { title: "Design & fixed quote", text: "A right-sized system with a clear price — no hidden extras on install day." },
    { title: "Install & commission", text: "One to three days on site, tested, labelled and handed over." },
    { title: "Monitor & maintain", text: "App monitoring, annual check-ups and a phone number that answers." },
  ],

  /* ----------------------------------------------------------- CALCULATOR */
  calculator: {
    tariff: 0.14,        // price of 1 kWh from the grid, in your currency
    peakSunHours: 4.6,   // average daily peak-sun hours for your city
    efficiency: 0.78,    // real-world system derate
    costPerKw: { onGrid: 720, hybrid: 1250 },
    maxBill: 900,
  },

  /* ----------------------------------------------------------- TESTIMONIALS */
  testimonials: [
    {
      quote:
        "Our summer bill went from 6,400 to under 700. The crew finished in two days and left the roof cleaner than they found it.",
      name: "Ahmad R.",
      role: "Homeowner · 5 kW hybrid",
      rating: 5,
    },
    {
      quote:
        "The freezer and the lights stay on through every outage now. They sized the battery around our actual usage, not a sales sheet.",
      name: "Sara N.",
      role: "Shop owner · 8 kW + 10 kWh",
      rating: 5,
    },
    {
      quote:
        "Monitoring app flagged a loose string after a storm. They came out and fixed it under warranty without me chasing anyone.",
      name: "Bilal K.",
      role: "Farm · 15 kW on-grid",
      rating: 5,
    },
  ],

  /* ------------------------------------------------------------------ FAQ */
  faqs: [
    {
      q: "How much does a home system cost?",
      a: "A 3 kW system with battery starts around $2,450 installed; 5 kW around $3,690 and 10 kW around $6,890. The price depends on roof type, cable runs and how much backup you need — the survey gives you a fixed number, not a range.",
    },
    {
      q: "How long does installation take?",
      a: "Most homes take one to two days on site. Larger or three-phase properties can take three. We book the date after the survey and keep it.",
    },
    {
      q: "Will it work during a grid outage?",
      a: "With a hybrid inverter and battery, yes — essential circuits switch over in about 20 milliseconds. An on-grid-only system shuts down during an outage for safety, as required by grid rules.",
    },
    {
      q: "What maintenance does it need?",
      a: "Very little. Rinse the panels two to three times a year in dusty months and let the app monitoring do the rest. We include an annual inspection in the first year.",
    },
    {
      q: "Do you offer a warranty?",
      a: "Panels carry a 25-year performance warranty, inverters 5–10 years and lithium batteries 10 years. Workmanship is covered for 5 years, and claims are handled by us, not by a call centre abroad.",
    },
    {
      q: "Can I pay in instalments?",
      a: "Yes. We take 50 % on order and the balance on commissioning, and can arrange three-month instalments on approved projects.",
    },
  ],

  /* ----------------------------------------------------------------- ADMIN */
  // PIN for admin.html (catalogue editor). This is a convenience lock, not real
  // security: anyone who reads the files can find it. Never store secrets here.
  admin: { pin: "1234" },

  /* ---------------------------------------------------------------- FOOTER */
  footer: {
    blurb:
      "Design, supply and installation of solar power systems for homes, shops, farms and offices.",
    credit: "",
  },
};

