const STORAGE_KEY = "alquilo-aqui-catalogo-v1";
const DATABASE_PATH = "alquilo-aqui/catalogo";
const DEFAULT_WHATSAPP_NUMBER = "34604982625";
const MONTHLY_TERMS = {
  "1": { label: "1 mes", months: 1 },
  "6": { label: "6 meses", months: 6 },
  "12": { label: "12 meses", months: 12 }
};
const PRICE_PLAN_KEYS = ["1", "6", "12"];
const PRICE_PLAN_MULTIPLIERS = {
  "1": 1.28,
  "6": 1.08,
  "12": 1
};
const DEFAULT_MODEL_TERM_KEY = "6";
const MOBILE_VIEWPORT_QUERY = "(max-width: 760px)";
const DEFAULT_MILEAGE_PLANS = [
  { km: 800, surcharge: 0 },
  { km: 1500, surcharge: 39 },
  { km: 2000, surcharge: 59 }
];
const DEFAULT_COVERAGE_OPTIONS = [
  {
    id: "bronze",
    name: "Bronce",
    surcharge: 0,
    description: "Franquicia 1200 EUR",
    deposit: "Fianza 2 meses",
    recommended: false
  },
  {
    id: "silver",
    name: "Plata",
    surcharge: 49,
    description: "Franquicia 300 EUR",
    deposit: "Fianza 1 mes",
    recommended: true
  },
  {
    id: "gold",
    name: "Oro",
    surcharge: 219,
    description: "Sin franquicia",
    deposit: "Fianza 1 mes",
    recommended: false
  }
];
const CATALOG_VEHICLE_PRESETS = [
  {
    id: "veh-mpsuw04f-06aglhc",
    name: "Opel Adam - 2018",
    versionLabel: "Opel Adam 2018",
    type: "coche",
    brand: "Opel",
    environmentalTag: "C",
    pricePerMonth: 350,
    pricePlans: { "1": 390, "6": 360, "12": 350 },
    location: "Madrid",
    passengers: 4,
    transmission: "Manual",
    fuel: "Gasolina",
    color: "Blanco",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "Urbano compacto para ciudad y trayectos cortos con aparcamiento facil.",
    features: ["Bluetooth", "Aire", "Consumo bajo"]
  },
  {
    id: "veh-mpsukpaa-8cvy9to",
    name: "Citroen C3 - 2015",
    versionLabel: "Citroen C3 2015",
    type: "coche",
    brand: "Citroen",
    environmentalTag: "C",
    pricePerMonth: 370,
    pricePlans: { "1": 420, "6": 390, "12": 370 },
    location: "Madrid",
    passengers: 5,
    transmission: "Manual",
    fuel: "Gasolina",
    color: "Blanco",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "Utilitario practico para uso diario con mantenimiento sencillo.",
    features: ["Aire", "Radio", "Cinco plazas"]
  },
  {
    id: "veh-mpsuzumd-8m9di1p",
    name: "Peugeot 208 - 2024",
    versionLabel: "Peugeot 208 2024",
    type: "coche",
    brand: "Peugeot",
    environmentalTag: "C",
    pricePerMonth: 460,
    pricePlans: { "1": 520, "6": 480, "12": 460 },
    location: "Madrid",
    passengers: 5,
    transmission: "Manual",
    fuel: "Gasolina",
    color: "Blanco",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "Turismo moderno para ciudad y carretera con consumo contenido.",
    features: ["CarPlay", "Aire", "Pantalla tactil"]
  },
  {
    id: "veh-mo5xdy1i-b3sc0j0",
    name: "Dacia Dokker 2017",
    versionLabel: "Dacia Dokker 2017 2 plazas",
    type: "furgoneta",
    brand: "Dacia",
    environmentalTag: "C",
    pricePerMonth: 420,
    pricePlans: { "1": 480, "6": 450, "12": 420 },
    location: "Madrid",
    passengers: 2,
    transmission: "Manual",
    fuel: "Diesel",
    color: "Blanco",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "Furgoneta compacta para reparto ligero y trabajo urbano.",
    features: ["Puerta lateral", "Carga util", "Consumo bajo"]
  },
  {
    id: "veh-mnoq1y2d-b1khavq",
    name: "Citroen Berlingo 2018",
    versionLabel: "Citroen Berlingo 2018 2 plazas",
    type: "furgoneta",
    brand: "Citroen",
    environmentalTag: "C",
    pricePerMonth: 450,
    pricePlans: { "1": 500, "6": 470, "12": 450 },
    location: "Madrid",
    passengers: 2,
    transmission: "Manual",
    fuel: "Diesel",
    color: "Blanco",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "Berlingo de trabajo para reparto, herramientas y uso profesional.",
    features: ["Puerta lateral", "Carga amplia", "Anclajes"]
  },
  {
    id: "veh-mqv7nlkt-mj6sj37",
    name: "Citroen Berlingo 2021",
    versionLabel: "Citroen Berlingo 2021",
    type: "furgoneta",
    brand: "Citroen",
    environmentalTag: "C",
    pricePerMonth: 490,
    pricePlans: { "1": 560, "6": 520, "12": 490 },
    location: "Madrid",
    passengers: 3,
    transmission: "Manual",
    fuel: "Diesel",
    color: "Blanco",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "Version mas reciente para trabajo diario con buen acceso de carga.",
    features: ["Tres plazas", "Carga amplia", "Puerta lateral"]
  },
  {
    id: "veh-mo5z6cmd-ulrdx0q",
    name: "Peugeot 5008 2017",
    versionLabel: "Peugeot 5008 2017 7 plazas",
    type: "coche",
    brand: "Peugeot",
    environmentalTag: "C",
    pricePerMonth: 540,
    pricePlans: { "1": 620, "6": 580, "12": 540 },
    location: "Madrid",
    passengers: 7,
    transmission: "Manual",
    fuel: "Diesel",
    color: "Azul",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "SUV amplio de siete plazas para familia o desplazamientos largos.",
    features: ["7 plazas", "Maletero grande", "Camara"]
  },
  {
    id: "veh-mnoq1y2d-wnx5uzh",
    name: "Peugeot 3008 SUV - 2022",
    versionLabel: "Peugeot 3008 SUV 2022",
    type: "suv",
    brand: "Peugeot",
    environmentalTag: "C",
    pricePerMonth: 590,
    pricePlans: { "1": 690, "6": 640, "12": 590 },
    location: "Madrid",
    passengers: 5,
    transmission: "Automatica",
    fuel: "Diesel",
    color: "Azul",
    mileagePlans: DEFAULT_MILEAGE_PLANS,
    coverageOptions: DEFAULT_COVERAGE_OPTIONS,
    summary: "SUV moderno para uso mixto entre ciudad, trabajo y viajes.",
    features: ["Camara", "CarPlay", "SUV"]
  }
];
const CATALOG_VEHICLE_PRESETS_BY_ID = Object.fromEntries(
  CATALOG_VEHICLE_PRESETS.map((preset) => [preset.id, preset])
);
const CATALOG_VEHICLE_PRESETS_BY_SLUG = Object.fromEntries(
  CATALOG_VEHICLE_PRESETS.map((preset) => [slugify(preset.name), preset])
);
const MODEL_ROUTE_MAP = {
  "veh-mnoq1y2d-wnx5uzh": "peugeot-3008-2022",
  "veh-mnoq1y2d-b1khavq": "citroen-berlingo-van",
  "veh-mo5xdy1i-b3sc0j0": "dacia-dokker",
  "veh-mo5z6cmd-ulrdx0q": "peugeot-5008",
  "veh-mo68pyyq-rkexzg4": "fiat-punto-2018",
  "veh-mo68uzso-tzfwwg1": "citroen-jumper-l1h1",
  "veh-mo68zup0-qhoqax7": "fiat-500-2019"
};
const SLUG_TO_ID = Object.fromEntries(
  Object.entries(MODEL_ROUTE_MAP).map(([id, slug]) => [slug, id])
);

const formatters = {
  price: new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }),
  date: new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short"
  }),
  month: new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric"
  })
};

let homePageEventController = null;

document.addEventListener("DOMContentLoaded", () => {
  initViewportMode();
  initNavigation();
  void initPublicPage();
});

async function initPublicPage() {
  const state = await loadPublicState();
  syncGenericWhatsappLinks(state.settings.whatsappNumber);
  fillGlobalStats(state);
  renderPage(state);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    void refreshPageFromStorage();
  });
}

async function refreshPageFromStorage() {
  const state = await loadPublicState();
  syncGenericWhatsappLinks(state.settings.whatsappNumber);
  fillGlobalStats(state);
  renderPage(state);
}

function initNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-menu-panel]");

  if (!toggle || !panel) {
    return;
  }

  const closeMenu = () => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggle.setAttribute("aria-expanded", String(!isOpen));
    document.body.classList.toggle("menu-open", !isOpen);
  });

  panel.querySelectorAll("[data-menu-close]").forEach((element) => {
    element.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function initViewportMode() {
  const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_QUERY);
  const applyMode = (matches) => {
    const mode = matches ? "mobile" : "desktop";
    document.documentElement.dataset.device = mode;
    document.body?.setAttribute("data-device", mode);
  };
  const handleChange = (event) => {
    applyMode(event.matches);
    window.dispatchEvent(
      new CustomEvent("alquiloaqui:viewportchange", {
        detail: { isMobile: event.matches }
      })
    );
  };

  applyMode(mediaQuery.matches);

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleChange);
    return;
  }

  if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleChange);
  }
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
}

async function loadPublicState() {
  const localState = loadStateFromLocalStorage();
  const remoteState = await loadStateFromRemote();

  return mergePublicState(localState, remoteState);
}

function loadStateFromLocalStorage() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    return normalizeState(JSON.parse(rawValue));
  } catch (error) {
    return null;
  }
}

async function loadStateFromRemote() {
  const databaseUrl = String(window.ALQUILO_AQUI_FIREBASE_CONFIG?.databaseURL || "").trim();

  if (!databaseUrl) {
    return null;
  }

  try {
    const response = await fetch(
      `${databaseUrl.replace(/\/$/, "")}/${DATABASE_PATH}.json`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return normalizeState(data);
  } catch (error) {
    return null;
  }
}

function mergePublicState(localState, remoteState) {
  if (!localState && !remoteState) {
    return createFallbackState();
  }

  if (!localState) {
    return remoteState || createFallbackState();
  }

  if (!remoteState) {
    return localState;
  }

  const remoteVehicleMap = new Map(remoteState.vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const vehicles = localState.vehicles.length
    ? localState.vehicles.map((vehicle) => enrichLocalVehicle(vehicle, remoteVehicleMap.get(vehicle.id)))
    : remoteState.vehicles;

  return {
    settings: {
      whatsappNumber:
        localState.settings.whatsappNumber ||
        remoteState.settings.whatsappNumber ||
        DEFAULT_WHATSAPP_NUMBER
    },
    vehicles
  };
}

function enrichLocalVehicle(localVehicle, remoteVehicle) {
  if (!remoteVehicle) {
    return localVehicle;
  }

  const localImages = getVehicleImages(localVehicle);
  const remoteImages = getVehicleImages(remoteVehicle);
  const images = localImages.length ? localImages : remoteImages;

  return normalizeVehicle({
    ...remoteVehicle,
    ...localVehicle,
    image: images[0] || localVehicle.image || remoteVehicle.image || "",
    images
  });
}

function createFallbackState() {
  return {
    settings: {
      whatsappNumber: DEFAULT_WHATSAPP_NUMBER
    },
    vehicles: CATALOG_VEHICLE_PRESETS.map((preset) => normalizeVehicle(createCatalogVehicleFromPreset(preset)))
  };
}

function normalizeState(rawState) {
  const vehicles = Array.isArray(rawState?.vehicles)
    ? rawState.vehicles
    : rawState?.vehicles && typeof rawState.vehicles === "object"
      ? Object.values(rawState.vehicles)
      : [];

  return {
    settings: {
      whatsappNumber:
        normalizeWhatsappNumber(rawState?.settings?.whatsappNumber) || DEFAULT_WHATSAPP_NUMBER
    },
    vehicles: mergeCatalogVehicles(vehicles).map(normalizeVehicle).filter(Boolean)
  };
}

function normalizeVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object") {
    return null;
  }

  const sourceVehicle = applyCatalogVehiclePreset(vehicle);
  const images = normalizeVehicleImages(sourceVehicle.images, sourceVehicle.image);
  const legacyDailyPrice = Number(sourceVehicle.pricePerDay);
  const fallbackMonthlyPrice = Number(sourceVehicle.pricePerMonth) > 0
    ? Number(sourceVehicle.pricePerMonth)
    : legacyDailyPrice > 0
      ? legacyDailyPrice * 30
      : 1350;
  const pricePlans = normalizePricePlans(sourceVehicle.pricePlans, fallbackMonthlyPrice);
  const mileagePlans = normalizeMileagePlans(sourceVehicle.mileagePlans);
  const coverageOptions = normalizeCoverageOptions(sourceVehicle.coverageOptions);
  const normalizedMonthlyPrice = getPreferredMonthlyPrice(pricePlans, fallbackMonthlyPrice);

  return {
    id: String(sourceVehicle.id || ""),
    catalogPresetLocked: sourceVehicle.catalogPresetLocked === true,
    versionLabel: String(
      sourceVehicle.versionLabel
        || sourceVehicle.version
        || `${sourceVehicle.name || "Version"} ${Number(sourceVehicle.passengers) > 0 ? `${Number(sourceVehicle.passengers)} plazas` : ""}`
    ).trim(),
    name: String(sourceVehicle.name || "Vehiculo sin nombre"),
    type: ["coche", "suv", "furgoneta"].includes(sourceVehicle.type) ? sourceVehicle.type : "coche",
    brand: String(sourceVehicle.brand || getVehicleBrandFallback(sourceVehicle.name)).trim() || "Sin marca",
    environmentalTag: String(sourceVehicle.environmentalTag || "Sin etiqueta").trim() || "Sin etiqueta",
    pricePerMonth: normalizedMonthlyPrice,
    pricePlans,
    location: String(sourceVehicle.location || "Sin ubicacion"),
    passengers: Number(sourceVehicle.passengers) > 0 ? Number(sourceVehicle.passengers) : 5,
    transmission: String(sourceVehicle.transmission || "Manual"),
    fuel: String(sourceVehicle.fuel || "Gasolina"),
    color: String(sourceVehicle.color || "No especificado"),
    mileagePlans,
    coverageOptions,
    image: images[0] || "",
    images,
    showAsAvailable: sourceVehicle.showAsAvailable !== false,
    showDescription: sourceVehicle.showDescription !== false,
    showCoverage: false,
    summary: String(sourceVehicle.summary || ""),
    features: Array.isArray(sourceVehicle.features)
      ? sourceVehicle.features.map((feature) => String(feature).trim()).filter(Boolean)
      : [],
    blocks: Array.isArray(sourceVehicle.blocks)
      ? sourceVehicle.blocks.map(normalizeBlock).filter(Boolean).sort(sortBlocks)
      : []
  };
}

function mergeCatalogVehicles(vehicles) {
  const source = Array.isArray(vehicles) ? [...vehicles] : [];
  const matchedPresetIds = new Set();

  source.forEach((vehicle) => {
    const preset = getCatalogVehiclePreset(vehicle);

    if (preset?.id) {
      matchedPresetIds.add(preset.id);
    }
  });

  CATALOG_VEHICLE_PRESETS.forEach((preset) => {
    if (!matchedPresetIds.has(preset.id)) {
      source.push(createCatalogVehicleFromPreset(preset));
    }
  });

  return source;
}

function getCatalogVehiclePreset(vehicle) {
  if (vehicle?.id && CATALOG_VEHICLE_PRESETS_BY_ID[vehicle.id]) {
    return CATALOG_VEHICLE_PRESETS_BY_ID[vehicle.id];
  }

  const slug = slugify(vehicle?.name || "");
  return CATALOG_VEHICLE_PRESETS_BY_SLUG[slug] || null;
}

function createCatalogVehicleFromPreset(preset) {
  return {
    ...preset,
    catalogPresetLocked: true,
    pricePlans: { ...preset.pricePlans },
    mileagePlans: preset.mileagePlans.map((plan) => ({ ...plan })),
    coverageOptions: preset.coverageOptions.map((option) => ({ ...option })),
    features: [...preset.features],
    blocks: []
  };
}

function applyCatalogVehiclePreset(vehicle) {
  const preset = getCatalogVehiclePreset(vehicle);

  if (!preset || vehicle?.catalogPresetLocked === false) {
    return {
      ...vehicle,
      catalogPresetLocked: false,
      showCoverage: false
    };
  }

  return {
    ...createCatalogVehicleFromPreset(preset),
    ...vehicle,
    catalogPresetLocked: true,
    id: String(vehicle.id || preset.id),
    name: preset.name,
    versionLabel: String(vehicle.versionLabel || preset.versionLabel || ""),
    type: preset.type || vehicle.type,
    brand: preset.brand || vehicle.brand,
    environmentalTag: preset.environmentalTag || vehicle.environmentalTag,
    pricePerMonth: preset.pricePerMonth,
    pricePlans: { ...preset.pricePlans },
    location: String(vehicle.location || preset.location || ""),
    passengers: Number(vehicle.passengers) > 0 ? Number(vehicle.passengers) : preset.passengers,
    transmission: String(vehicle.transmission || preset.transmission || ""),
    fuel: String(vehicle.fuel || preset.fuel || ""),
    color: String(vehicle.color || preset.color || ""),
    mileagePlans:
      (Array.isArray(vehicle.mileagePlans) || (vehicle.mileagePlans && typeof vehicle.mileagePlans === "object"))
        ? vehicle.mileagePlans
        : preset.mileagePlans.map((plan) => ({ ...plan })),
    coverageOptions:
      (Array.isArray(vehicle.coverageOptions) || (vehicle.coverageOptions && typeof vehicle.coverageOptions === "object"))
        ? vehicle.coverageOptions
        : preset.coverageOptions.map((option) => ({ ...option })),
    summary: String(vehicle.summary || preset.summary || ""),
    features: Array.isArray(vehicle.features) && vehicle.features.length ? vehicle.features : [...preset.features],
    showCoverage: false
  };
}

function normalizeBlock(block) {
  if (!block || typeof block !== "object") {
    return null;
  }

  const start = normalizeIsoDate(block.start);
  const end = normalizeIsoDate(block.end);

  if (!start || !end) {
    return null;
  }

  return {
    id: String(block.id || `${start}-${end}`),
    start,
    end,
    note: String(block.note || "")
  };
}

function sortBlocks(left, right) {
  return left.start.localeCompare(right.start) || left.end.localeCompare(right.end);
}

function normalizeVehicleImages(images, legacyImage = "") {
  const rawImages = Array.isArray(images)
    ? images
    : images && typeof images === "object"
      ? Object.values(images)
      : [];
  const normalizedImages = rawImages.map((image) => String(image || "").trim()).filter(Boolean);
  const legacy = String(legacyImage || "").trim();

  if (legacy && !normalizedImages.includes(legacy)) {
    normalizedImages.unshift(legacy);
  }

  return normalizedImages;
}

function normalizePricePlans(rawPricePlans, fallbackPrice) {
  const source = rawPricePlans && typeof rawPricePlans === "object" ? rawPricePlans : {};
  const normalizedPlans = PRICE_PLAN_KEYS.reduce((accumulator, key) => {
    const rawValue = Number(source[key]);

    if (rawValue > 0) {
      accumulator[key] = Math.round(rawValue);
    }

    return accumulator;
  }, {});
  const derivedPlans = createDerivedPricePlans(getBaseMonthlyPriceFromPlans(normalizedPlans, fallbackPrice));

  PRICE_PLAN_KEYS.forEach((key) => {
    if (!normalizedPlans[key] && derivedPlans[key]) {
      normalizedPlans[key] = derivedPlans[key];
    }
  });

  return normalizedPlans;
}

function getBaseMonthlyPriceFromPlans(pricePlans, fallbackPrice) {
  if (Number(fallbackPrice) > 0) {
    return Number(fallbackPrice);
  }

  const candidates = PRICE_PLAN_KEYS
    .filter((key) => Number(pricePlans[key]) > 0)
    .map((key) => Number(pricePlans[key]) / Number(PRICE_PLAN_MULTIPLIERS[key] || 1))
    .filter((value) => value > 0);

  return candidates.length ? Math.min(...candidates) : 1350;
}

function createDerivedPricePlans(basePrice) {
  const normalizedBase = Number(basePrice) > 0 ? Number(basePrice) : 1350;

  return PRICE_PLAN_KEYS.reduce((accumulator, key) => {
    accumulator[key] = roundVehiclePrice(normalizedBase * Number(PRICE_PLAN_MULTIPLIERS[key] || 1));
    return accumulator;
  }, {});
}

function roundVehiclePrice(value) {
  return Math.max(1, Math.round(Number(value || 0) / 5) * 5);
}

function normalizeMileagePlans(rawMileagePlans) {
  const source = Array.isArray(rawMileagePlans)
    ? rawMileagePlans
    : rawMileagePlans && typeof rawMileagePlans === "object"
      ? Object.values(rawMileagePlans)
      : [];
  const normalizedPlans = source
    .map((plan, index) => {
      const fallback = DEFAULT_MILEAGE_PLANS[index] || DEFAULT_MILEAGE_PLANS[DEFAULT_MILEAGE_PLANS.length - 1];
      const km = Number(plan?.km);
      const surcharge = Number(plan?.surcharge);

      return {
        km: km > 0 ? Math.round(km) : fallback.km,
        surcharge: surcharge >= 0 ? Math.round(surcharge) : fallback.surcharge
      };
    })
    .filter((plan) => plan.km > 0)
    .sort((left, right) => left.km - right.km);

  return normalizedPlans.length
    ? normalizedPlans
    : DEFAULT_MILEAGE_PLANS.map((plan) => ({ ...plan }));
}

function normalizeCoverageOptions(rawCoverageOptions) {
  const source = Array.isArray(rawCoverageOptions)
    ? rawCoverageOptions
    : rawCoverageOptions && typeof rawCoverageOptions === "object"
      ? Object.values(rawCoverageOptions)
      : [];
  const normalizedOptions = DEFAULT_COVERAGE_OPTIONS.map((fallback, index) => {
    const option = source[index] && typeof source[index] === "object" ? source[index] : {};

    return {
      id: String(option.id || fallback.id),
      name: String(option.name || fallback.name).trim() || fallback.name,
      surcharge: Number(option.surcharge) >= 0 ? Math.round(Number(option.surcharge)) : fallback.surcharge,
      description: String(option.description || fallback.description).trim() || fallback.description,
      deposit: String(option.deposit || fallback.deposit).trim() || fallback.deposit,
      recommended: Boolean(option.recommended)
    };
  });
  let recommendedIndex = normalizedOptions.findIndex((option) => option.recommended);

  if (recommendedIndex === -1) {
    recommendedIndex = DEFAULT_COVERAGE_OPTIONS.findIndex((option) => option.recommended);
  }

  normalizedOptions.forEach((option, index) => {
    option.recommended = index === recommendedIndex;
  });

  return normalizedOptions;
}

function getPreferredMonthlyPrice(pricePlans, fallbackPrice) {
  if (Number(pricePlans["12"]) > 0) {
    return Number(pricePlans["12"]);
  }

  const availablePrices = Object.values(pricePlans).filter((value) => Number(value) > 0);

  if (availablePrices.length) {
    return Math.min(...availablePrices);
  }

  return Number(fallbackPrice) > 0 ? Number(fallbackPrice) : 1350;
}

function getVehicleLowestQuote(vehicle) {
  const mileagePlans = Array.isArray(vehicle?.mileagePlans) && vehicle.mileagePlans.length
    ? vehicle.mileagePlans
    : DEFAULT_MILEAGE_PLANS;
  const lowestMileagePlan = mileagePlans.reduce((bestPlan, plan) => {
    if (!bestPlan) {
      return plan;
    }

    const bestSurcharge = Number(bestPlan.surcharge || 0);
    const currentSurcharge = Number(plan?.surcharge || 0);

    if (currentSurcharge !== bestSurcharge) {
      return currentSurcharge < bestSurcharge ? plan : bestPlan;
    }

    return Number(plan?.km || 0) < Number(bestPlan.km || 0) ? plan : bestPlan;
  }, null) || DEFAULT_MILEAGE_PLANS[0];
  const lowestPricePlan = PRICE_PLAN_KEYS.reduce((bestPlan, termKey) => {
    const basePrice = Number(vehicle?.pricePlans?.[termKey]);

    if (!(basePrice > 0)) {
      return bestPlan;
    }

    const candidate = {
      termKey,
      basePrice,
      price: basePrice + Number(lowestMileagePlan.surcharge || 0)
    };

    if (!bestPlan) {
      return candidate;
    }

    if (candidate.price !== bestPlan.price) {
      return candidate.price < bestPlan.price ? candidate : bestPlan;
    }

    return PRICE_PLAN_KEYS.indexOf(candidate.termKey) > PRICE_PLAN_KEYS.indexOf(bestPlan.termKey)
      ? candidate
      : bestPlan;
  }, null);

  if (lowestPricePlan) {
    return {
      price: lowestPricePlan.price,
      termKey: lowestPricePlan.termKey,
      basePrice: lowestPricePlan.basePrice,
      mileagePlan: lowestMileagePlan
    };
  }

  const fallbackPrice = Number(vehicle?.pricePerMonth) > 0 ? Number(vehicle.pricePerMonth) : 0;

  return {
    price: fallbackPrice + Number(lowestMileagePlan.surcharge || 0),
    termKey: null,
    basePrice: fallbackPrice,
    mileagePlan: lowestMileagePlan
  };
}

function getVehicleLowestQuoteMeta(quote) {
  const parts = [];

  if (Number(quote?.mileagePlan?.km) > 0) {
    parts.push(`${Math.round(Number(quote.mileagePlan.km))} km`);
  }

  if (quote?.termKey) {
    parts.push(getPricePlanLabel(quote.termKey));
  }

  return parts.join(" · ");
}

function getVehicleLowestMonthlyPrice(vehicle) {
  return getVehicleLowestQuote(vehicle).price;
}

function normalizeWhatsappNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function getVehicleBrandFallback(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

function normalizeIsoDate(value) {
  const stringValue = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(stringValue) ? stringValue : "";
}

function renderPage(state) {
  const page = document.body.dataset.page;

  if (page === "home") {
    renderHomePage(state);
    return;
  }

  if (page === "catalog") {
    renderCatalogPage(state);
    return;
  }

  if (page === "how") {
    renderHowItWorksPage(state);
    return;
  }

  if (page === "model") {
    renderModelPage(state);
  }
}

function renderHomePage(state) {
  const refs = {
    showcaseSection: document.querySelector(".home-showcase"),
    showcaseTrack: document.getElementById("homeShowcaseTrack"),
    showcaseMeta: document.getElementById("homeShowcaseMeta"),
    showcasePrev: document.getElementById("homeShowcasePrev"),
    showcaseNext: document.getElementById("homeShowcaseNext"),
    availableTrack: document.getElementById("homeAvailableTrack"),
    availablePrev: document.getElementById("homeAvailablePrev"),
    availableNext: document.getElementById("homeAvailableNext")
  };

  homePageEventController?.abort();
  homePageEventController = new AbortController();
  const { signal } = homePageEventController;

  if (!refs.showcaseTrack || !refs.availableTrack) {
    return;
  }

  const vehicles = [...state.vehicles].sort((left, right) => left.pricePerMonth - right.pricePerMonth);
  const showcaseVehicles = vehicles.slice(0, Math.min(5, vehicles.length));
  const availableVehicles = vehicles.slice(0, Math.min(12, vehicles.length));

  if (!vehicles.length) {
    refs.showcaseTrack.innerHTML = renderEmptyPanel(
      "No hay vehiculos cargados",
      "En cuanto tengas coches activos en gestion, apareceran aqui automaticamente."
    );
    refs.availableTrack.innerHTML = "";
    if (refs.showcaseMeta) {
      refs.showcaseMeta.innerHTML = "";
    }
    return;
  }

  let activeIndex = Math.min(2, showcaseVehicles.length - 1);
  let showcaseTouchStartX = 0;
  let showcaseTouchStartY = 0;
  let showcaseSwipeIntent = false;
  let showcaseSuppressClickUntil = 0;

  const selectShowcase = (nextIndex) => {
    if (
      Number.isNaN(nextIndex)
      || nextIndex < 0
      || nextIndex >= showcaseVehicles.length
      || nextIndex === activeIndex
    ) {
      return;
    }

    activeIndex = nextIndex;
    renderShowcase();
  };

  const stepShowcase = (delta) => {
    if (showcaseVehicles.length <= 1) {
      return;
    }

    activeIndex = (activeIndex + delta + showcaseVehicles.length) % showcaseVehicles.length;
    renderShowcase();
  };

  const renderShowcase = () => {
    const activeVehicle = showcaseVehicles[activeIndex];
    const mobileViewport = isMobileViewport();
    const orderedSlides = mobileViewport
      ? [{ vehicle: activeVehicle, originalIndex: activeIndex }]
      : getOrderedShowcaseVehicles(showcaseVehicles, activeIndex);

    refs.showcaseTrack.innerHTML = orderedSlides
      .map((entry, slotIndex) => renderHomeShowcaseSlide(
        entry.vehicle,
        entry.originalIndex,
        slotIndex,
        orderedSlides.length,
        { isMobile: mobileViewport }
      ))
      .join("");
    refs.showcaseTrack.dataset.layout = mobileViewport ? "mobile" : "desktop";

    if (refs.showcaseMeta) {
      refs.showcaseMeta.innerHTML = renderHomeShowcaseMeta(
        activeVehicle,
        activeIndex,
        showcaseVehicles,
        mobileViewport
      );
    }

    refs.showcasePrev?.toggleAttribute("hidden", showcaseVehicles.length <= 1);
    refs.showcaseNext?.toggleAttribute("hidden", showcaseVehicles.length <= 1);
  };

  renderShowcase();

  const handleShowcaseSelection = (event) => {
    const trigger = event.target.closest("[data-home-showcase-select]");

    if (!trigger) {
      return;
    }

    const nextIndex = Number(trigger.dataset.homeShowcaseSelect);
    selectShowcase(nextIndex);
  };

  refs.showcaseTrack.addEventListener("click", handleShowcaseSelection, { signal });
  refs.showcaseMeta?.addEventListener("click", handleShowcaseSelection, { signal });

  if (showcaseVehicles.length > 1) {
    refs.showcaseSection?.addEventListener(
      "click",
      (event) => {
        if (
          Date.now() < showcaseSuppressClickUntil
          && event.target.closest(".home-showcase-image-link")
        ) {
          event.preventDefault();
          showcaseSuppressClickUntil = 0;
        }
      },
      { capture: true, signal }
    );

    refs.showcasePrev?.addEventListener("click", () => {
      stepShowcase(-1);
    }, { signal });

    refs.showcaseNext?.addEventListener("click", () => {
      stepShowcase(1);
    }, { signal });

    refs.showcaseSection?.addEventListener(
      "wheel",
      (event) => {
        if (isMobileViewport()) {
          return;
        }

        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

        if (Math.abs(delta) < 16) {
          return;
        }

        event.preventDefault();
        stepShowcase(delta > 0 ? 1 : -1);
      },
      { passive: false, signal }
    );

    refs.showcaseSection?.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) {
          return;
        }

        showcaseTouchStartX = event.touches[0].clientX;
        showcaseTouchStartY = event.touches[0].clientY;
        showcaseSwipeIntent = false;
      },
      { passive: true, signal }
    );

    refs.showcaseSection?.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches.length !== 1 || (!showcaseTouchStartX && !showcaseTouchStartY)) {
          return;
        }

        const deltaX = event.touches[0].clientX - showcaseTouchStartX;
        const deltaY = event.touches[0].clientY - showcaseTouchStartY;

        if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {
          showcaseSwipeIntent = true;
        }
      },
      { passive: true, signal }
    );

    refs.showcaseSection?.addEventListener(
      "touchend",
      (event) => {
        if (event.changedTouches.length !== 1) {
          return;
        }

        if (!showcaseTouchStartX && !showcaseTouchStartY) {
          return;
        }

        const deltaX = event.changedTouches[0].clientX - showcaseTouchStartX;
        const deltaY = event.changedTouches[0].clientY - showcaseTouchStartY;
        showcaseTouchStartX = 0;
        showcaseTouchStartY = 0;

        if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY)) {
          showcaseSwipeIntent = false;
          return;
        }

        if (showcaseSwipeIntent) {
          showcaseSuppressClickUntil = Date.now() + 350;
        }

        stepShowcase(deltaX < 0 ? 1 : -1);
        showcaseSwipeIntent = false;
      },
      { passive: true, signal }
    );

    refs.showcaseSection?.addEventListener(
      "touchcancel",
      () => {
        showcaseTouchStartX = 0;
        showcaseTouchStartY = 0;
        showcaseSwipeIntent = false;
      },
      { passive: true, signal }
    );
  }

  window.addEventListener("alquiloaqui:viewportchange", renderShowcase, { signal });

  refs.availableTrack.innerHTML = availableVehicles
    .map((vehicle) => renderHomeAvailableCard(vehicle))
    .join("");

  const scrollAvailable = (direction) => {
    refs.availableTrack.scrollBy({
      left: direction * 280,
      behavior: "smooth"
    });
  };

  refs.availablePrev?.addEventListener("click", () => {
    scrollAvailable(-1);
  });

  refs.availableNext?.addEventListener("click", () => {
    scrollAvailable(1);
  });

  refs.availableTrack.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      refs.availableTrack.scrollBy({
        left: event.deltaY,
        behavior: "smooth"
      });
    },
    { passive: false }
  );
}

function renderCatalogPage(state) {
  const refs = {
    search: document.getElementById("catalogSearch"),
    brand: document.getElementById("catalogBrand"),
    transmission: document.getElementById("catalogTransmission"),
    fuel: document.getElementById("catalogFuel"),
    category: document.getElementById("catalogCategory"),
    passengers: document.getElementById("catalogPassengers"),
    environmentalTag: document.getElementById("catalogEnvironmentalTag"),
    reset: document.getElementById("catalogReset"),
    grid: document.getElementById("catalogGrid"),
    empty: document.getElementById("catalogEmpty"),
    count: document.getElementById("catalogCount"),
    meta: document.getElementById("catalogMeta")
  };

  if (!refs.grid) {
    return;
  }

  const initialFilters = getFiltersFromUrl();

  refs.brand.innerHTML = buildCatalogSelectOptions(
    getUniqueCatalogValues(state.vehicles, (vehicle) => vehicle.brand),
    "all",
    "Seleccionar marcas"
  );
  refs.transmission.innerHTML = buildCatalogSelectOptions(
    getUniqueCatalogValues(state.vehicles, (vehicle) => vehicle.transmission),
    "all",
    "Todas las..."
  );
  refs.fuel.innerHTML = buildCatalogSelectOptions(
    getUniqueCatalogValues(state.vehicles, (vehicle) => vehicle.fuel),
    "all",
    "Todos los..."
  );
  refs.category.innerHTML = buildCatalogSelectOptions(
    getUniqueCatalogValues(state.vehicles, (vehicle) => vehicle.type, getTypeLabel),
    "all",
    "Todas las categorias"
  );
  refs.passengers.innerHTML = buildCatalogSelectOptions(
    getUniqueCatalogValues(
      state.vehicles,
      (vehicle) => String(vehicle.passengers),
      (value) => `${value} plazas`
    ),
    "all",
    "Todas las plazas"
  );
  refs.environmentalTag.innerHTML = buildCatalogSelectOptions(
    getUniqueCatalogValues(
      state.vehicles,
      (vehicle) => vehicle.environmentalTag,
      (value) => value,
      compareEnvironmentalTags
    ),
    "all",
    "Todas las etiquetas"
  );

  refs.search.value = initialFilters.search || "";
  refs.brand.value = initialFilters.brand || "all";
  refs.transmission.value = initialFilters.transmission || "all";
  refs.fuel.value = initialFilters.fuel || "all";
  refs.category.value = initialFilters.category || "all";
  refs.passengers.value = initialFilters.passengers || "all";
  refs.environmentalTag.value = initialFilters.environmentalTag || "all";

  const updateCatalog = () => {
    const filters = {
      search: refs.search.value.trim(),
      brand: refs.brand.value,
      transmission: refs.transmission.value,
      fuel: refs.fuel.value,
      category: refs.category.value,
      passengers: refs.passengers.value,
      environmentalTag: refs.environmentalTag.value
    };
    const filteredVehicles = getFilteredVehicles(state.vehicles, filters);
    const countLabel = `${filteredVehicles.length} vehiculo${filteredVehicles.length === 1 ? "" : "s"}`;
    const activeFilterCount = [
      filters.search,
      ...["brand", "transmission", "fuel", "category", "passengers", "environmentalTag"]
        .map((key) => filters[key])
        .filter((value) => value && value !== "all")
    ].filter(Boolean).length;
    const metaLabel = activeFilterCount
      ? `${activeFilterCount} filtro${activeFilterCount === 1 ? "" : "s"} activo${activeFilterCount === 1 ? "" : "s"}.`
      : "Usa la busqueda y los filtros para afinar el listado.";

    refs.count.textContent = countLabel;
    refs.meta.textContent = metaLabel;

    refs.grid.innerHTML = filteredVehicles.map((vehicle) => renderVehicleCard(vehicle, filters)).join("");
    refs.empty.classList.toggle("is-hidden", filteredVehicles.length > 0);

    syncCatalogQuery(filters);
  };

  [refs.search, refs.brand, refs.transmission, refs.fuel, refs.category, refs.passengers, refs.environmentalTag].forEach((element) => {
    element.addEventListener("input", updateCatalog);
    element.addEventListener("change", updateCatalog);
  });

  refs.reset.addEventListener("click", () => {
    refs.search.value = "";
    refs.brand.value = "all";
    refs.transmission.value = "all";
    refs.fuel.value = "all";
    refs.category.value = "all";
    refs.passengers.value = "all";
    refs.environmentalTag.value = "all";
    updateCatalog();
  });

  updateCatalog();
}

function renderHowItWorksPage(state) {
  const summary = document.getElementById("howItWorksSummary");

  if (!summary) {
    return;
  }

  const minPrice = getMinimumPrice(state.vehicles);
  summary.textContent = state.vehicles.length
    ? `${state.vehicles.length} activos desde ${formatPrice(minPrice)}`
    : "Flujo simple";
}

function renderModelPage(state) {
  const requestedVehicle = getRequestedVehicle(state.vehicles);
  const modelView = document.getElementById("modelView");
  const relatedVehicles = document.getElementById("relatedVehicles");

  if (!modelView) {
    return;
  }

  if (!requestedVehicle) {
    document.title = "Vehiculo no encontrado | Alquilo Aqui";
    modelView.innerHTML = renderEmptyPanel(
      "Vehiculo no encontrado",
      "Puede que la ficha haya cambiado o que el enlace ya no este activo."
    );

    if (relatedVehicles) {
      relatedVehicles.innerHTML = "";
    }

    return;
  }

  const filters = getFiltersFromUrl();
  const catalogHref = buildCatalogUrl(filters);
  const images = getVehicleImages(requestedVehicle);
  const imageMarkup = images.length ? images : [createVehiclePlaceholder(requestedVehicle)];
  const initialTermKey = getInitialModelTermKey(requestedVehicle, filters);
  const initialMileageIndex = 0;
  const initialCoverageIndex = requestedVehicle.showCoverage
    ? getDefaultCoverageIndex(requestedVehicle.coverageOptions)
    : -1;
  const initialSelection = getModelSelectionSummary(
    requestedVehicle,
    initialTermKey,
    initialMileageIndex,
    initialCoverageIndex
  );
  const initialAvailability = getVehicleAvailability(
    requestedVehicle,
    getModelAvailabilityRange(filters.start, initialTermKey)
  );
  const initialWhatsappUrl = buildVehicleWhatsappUrl(
    requestedVehicle,
    initialAvailability,
    filters,
    state.settings.whatsappNumber,
    {
      termKey: initialTermKey,
      mileagePlan: initialSelection.mileagePlan,
      coverageOption: initialSelection.coverageOption,
      monthlyQuote: initialSelection.monthlyQuote
    }
  );

  document.title = `${requestedVehicle.name} | Alquilo Aqui`;

  modelView.innerHTML = `
    <div class="vehicle-detail-page">
      <section class="vehicle-detail-left">
        <div class="vehicle-detail-header">
          <h1>${escapeHtml(requestedVehicle.name)}</h1>
          <div class="vehicle-detail-badges">
            <span class="vehicle-detail-pill vehicle-detail-pill-primary">${escapeHtml(getTypeLabel(requestedVehicle.type))}</span>
            <span class="vehicle-detail-pill">1 version disponible</span>
          </div>
        </div>

        <div class="vehicle-detail-stage">
          <img
            id="modelMainImage"
            src="${escapeAttribute(imageMarkup[0])}"
            alt="${escapeAttribute(requestedVehicle.name)}"
          >
          <span class="vehicle-detail-stage-count" id="modelImageCount">1/${imageMarkup.length}</span>
        </div>

        ${imageMarkup.length > 1 ? `
          <div class="vehicle-detail-thumb-strip" id="modelThumbStrip">
            ${imageMarkup.map((image, index) => `
              <button
                class="vehicle-detail-thumb ${index === 0 ? "is-active" : ""}"
                type="button"
                data-model-thumb
                data-thumb-index="${index}"
                data-image-src="${escapeAttribute(image)}"
                aria-label="${escapeAttribute(`Ver foto ${index + 1} de ${requestedVehicle.name}`)}"
              >
                <img src="${escapeAttribute(image)}" alt="${escapeAttribute(`${requestedVehicle.name} miniatura ${index + 1}`)}">
              </button>
            `).join("")}
          </div>
        ` : ""}

        <div class="vehicle-detail-specs">
          ${renderVehicleSpecCard("Combustible", requestedVehicle.fuel)}
          ${renderVehicleSpecCard("Plazas", `${requestedVehicle.passengers}`)}
          ${renderVehicleSpecCard("Transmision", requestedVehicle.transmission)}
          ${renderVehicleSpecCard("Color", requestedVehicle.color)}
        </div>

        ${
          requestedVehicle.showDescription && requestedVehicle.features.length
            ? `
              <div class="vehicle-detail-description">
                <ul class="vehicle-detail-feature-list">${requestedVehicle.features
                  .map((feature) => `<li>${escapeHtml(feature)}</li>`)
                  .join("")}</ul>
              </div>
            `
            : ""
        }
      </section>

      <aside class="vehicle-quote-panel">
        <div class="vehicle-quote-version-card">
          <p class="vehicle-quote-kicker">Version disponible</p>
          <div class="vehicle-quote-version-top">
            <div>
              <strong>${escapeHtml(requestedVehicle.versionLabel || requestedVehicle.name)}</strong>
              <div class="vehicle-quote-version-tags">
                <span>${escapeHtml(requestedVehicle.fuel)}</span>
                <span>${escapeHtml(requestedVehicle.transmission)}</span>
              </div>
            </div>
            <span class="vehicle-quote-availability-badge ${initialAvailability.isAvailable ? "is-available" : "is-busy"}" id="modelAvailabilityBadge">
              ${initialAvailability.isAvailable ? "Disponible" : "Con bloqueo"}
            </span>
          </div>
          <div class="vehicle-quote-term-grid" id="modelTermGrid">
            ${PRICE_PLAN_KEYS.map((termKey) => renderModelTermOption(requestedVehicle, termKey, termKey === initialTermKey)).join("")}
          </div>
        </div>

        <div class="vehicle-quote-total-card">
          <div>
            <span class="vehicle-quote-total-label">Tu cuota mensual</span>
            <span class="vehicle-quote-total-subtitle">+ IVA</span>
            <small id="modelSelectedTermLabel">${escapeHtml(getPricePlanLabel(initialTermKey))}</small>
          </div>
          <div class="vehicle-quote-total-price">
            <strong id="modelTotalPrice">${escapeHtml(getPriceAmountText(initialSelection.monthlyQuote))}</strong>
            <span>/mes</span>
          </div>
        </div>

        <p class="vehicle-quote-breakdown" id="modelQuoteBreakdown">
          ${escapeHtml(getModelQuoteBreakdown(initialSelection))}
        </p>

        <div class="vehicle-quote-section">
          <h2>Kilometros/mes</h2>
          <div class="vehicle-quote-mileage-grid" id="modelMileageGrid">
            ${requestedVehicle.mileagePlans.map((plan, index) => renderModelMileageOption(plan, index, index === initialMileageIndex)).join("")}
          </div>
        </div>

        ${
          requestedVehicle.showCoverage
            ? `
              <div class="vehicle-quote-section">
                <h2>Cobertura de Riesgo</h2>
                <div class="vehicle-quote-coverage-grid" id="modelCoverageGrid">
                  ${requestedVehicle.coverageOptions.map((option, index) => renderModelCoverageOption(option, index, index === initialCoverageIndex)).join("")}
                </div>
              </div>
            `
            : ""
        }

        <p class="vehicle-quote-availability-copy" id="modelAvailabilityCopy">
          ${escapeHtml(getModelAvailabilityCopy(initialAvailability, filters.start, initialTermKey, requestedVehicle.showCoverage))}
        </p>

        <a class="button primary full" id="modelWhatsappLink" href="${escapeAttribute(initialWhatsappUrl)}" target="_blank" rel="noreferrer">
          Reservar mi coche
        </a>
        <p class="vehicle-quote-phone-note">
          O si lo prefieres escribenos por WhatsApp al <span data-whatsapp-number></span>
        </p>
        <div class="vehicle-quote-trust">
          <span>Respuesta en 24h</span>
          <span>Cancelacion flexible</span>
          <span id="modelAvailabilityFooter">${initialAvailability.isAvailable ? "Entrega inmediata" : "Consultar fecha"}</span>
        </div>
        <a class="button secondary full" href="${escapeAttribute(catalogHref)}">
          Volver al catalogo
        </a>
      </aside>
    </div>
  `;

  bindModelExperience(requestedVehicle, filters, state.settings.whatsappNumber);

  if (relatedVehicles) {
    const related = state.vehicles
      .filter((vehicle) => vehicle.id !== requestedVehicle.id)
      .sort((left, right) => left.pricePerMonth - right.pricePerMonth)
      .slice(0, 3);

    relatedVehicles.innerHTML = related.length
      ? related.map((vehicle) => renderVehicleCard(vehicle)).join("")
      : "";
  }
}

function bindModelExperience(vehicle, filters, phoneNumber) {
  const mainImage = document.getElementById("modelMainImage");
  const thumbStrip = document.getElementById("modelThumbStrip");
  const imageCount = document.getElementById("modelImageCount");
  const termButtons = Array.from(document.querySelectorAll("[data-model-term]"));
  const mileageButtons = Array.from(document.querySelectorAll("[data-model-mileage]"));
  const coverageButtons = Array.from(document.querySelectorAll("[data-model-coverage]"));
  const totalPrice = document.getElementById("modelTotalPrice");
  const selectedTermLabel = document.getElementById("modelSelectedTermLabel");
  const quoteBreakdown = document.getElementById("modelQuoteBreakdown");
  const availabilityBadge = document.getElementById("modelAvailabilityBadge");
  const availabilityCopy = document.getElementById("modelAvailabilityCopy");
  const availabilityFooter = document.getElementById("modelAvailabilityFooter");
  const whatsappLink = document.getElementById("modelWhatsappLink");

  if (!mainImage || !totalPrice || !selectedTermLabel || !quoteBreakdown || !availabilityBadge || !availabilityCopy || !availabilityFooter || !whatsappLink) {
    return;
  }

  let activeTermKey = getInitialModelTermKey(vehicle, filters);
  let activeMileageIndex = 0;
  let activeCoverageIndex = vehicle.showCoverage ? getDefaultCoverageIndex(vehicle.coverageOptions) : -1;

  const updateConfigurator = () => {
    const selection = getModelSelectionSummary(vehicle, activeTermKey, activeMileageIndex, activeCoverageIndex);
    const availability = getVehicleAvailability(vehicle, getModelAvailabilityRange(filters.start, activeTermKey));

    totalPrice.textContent = getPriceAmountText(selection.monthlyQuote);
    selectedTermLabel.textContent = getPricePlanLabel(activeTermKey);
    quoteBreakdown.textContent = getModelQuoteBreakdown(selection);
    availabilityBadge.textContent = getAvailabilityBadgeText(availability);
    availabilityBadge.className = `vehicle-quote-availability-badge ${availability.isAvailable ? "is-available" : "is-busy"}`;
    availabilityCopy.textContent = getModelAvailabilityCopy(availability, filters.start, activeTermKey, vehicle.showCoverage);
    availabilityFooter.textContent = availability.isAvailable ? "Entrega inmediata" : "Consultar fecha";
    whatsappLink.href = buildVehicleWhatsappUrl(
      vehicle,
      availability,
      filters,
      phoneNumber,
      {
        termKey: activeTermKey,
        mileagePlan: selection.mileagePlan,
        coverageOption: selection.coverageOption,
        monthlyQuote: selection.monthlyQuote
      }
    );

    termButtons.forEach((button) => {
      const isActive = button.dataset.termKey === activeTermKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    mileageButtons.forEach((button) => {
      const isActive = Number(button.dataset.mileageIndex) === activeMileageIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    coverageButtons.forEach((button) => {
      const isActive = Number(button.dataset.coverageIndex) === activeCoverageIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  if (thumbStrip) {
    thumbStrip.querySelectorAll("[data-model-thumb]").forEach((button) => {
      button.addEventListener("click", () => {
        mainImage.src = button.dataset.imageSrc || "";
        thumbStrip.querySelectorAll("[data-model-thumb]").forEach((item) => {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");

        if (imageCount) {
          const currentIndex = Number(button.dataset.thumbIndex || 0) + 1;
          const totalImages = thumbStrip.querySelectorAll("[data-model-thumb]").length;
          imageCount.textContent = `${currentIndex}/${totalImages}`;
        }
      });
    });
  }

  termButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTermKey = button.dataset.termKey || activeTermKey;
      updateConfigurator();
    });
  });

  mileageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeMileageIndex = Number(button.dataset.mileageIndex || 0);
      updateConfigurator();
    });
  });

  coverageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCoverageIndex = Number(button.dataset.coverageIndex || 0);
      updateConfigurator();
    });
  });

  updateConfigurator();
}

function renderVehicleSpecCard(label, value) {
  return `
    <article class="vehicle-detail-spec-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value || "-"))}</strong>
    </article>
  `;
}

function renderModelTermOption(vehicle, termKey, isActive) {
  const price = Number(vehicle.pricePlans?.[termKey]) || getVehicleLowestMonthlyPrice(vehicle);

  return `
    <button
      class="vehicle-quote-term-option ${isActive ? "is-active" : ""}"
      type="button"
      data-model-term
      data-term-key="${escapeAttribute(termKey)}"
      aria-pressed="${isActive ? "true" : "false"}"
    >
      <span>${escapeHtml(getPricePlanLabel(termKey))}</span>
      <strong>${escapeHtml(getPriceAmountText(price))}</strong>
    </button>
  `;
}

function renderModelMileageOption(plan, index, isActive) {
  const surchargeLabel = Number(plan.surcharge) > 0
    ? `+${getPriceAmountText(plan.surcharge)}`
    : "Incluido";

  return `
    <button
      class="vehicle-quote-mileage-option ${isActive ? "is-active" : ""}"
      type="button"
      data-model-mileage
      data-mileage-index="${index}"
      aria-pressed="${isActive ? "true" : "false"}"
    >
      <strong>${escapeHtml(String(plan.km))}<small>km</small></strong>
      <span>${escapeHtml(surchargeLabel)}</span>
    </button>
  `;
}

function renderModelCoverageOption(option, index, isActive) {
  return `
    <button
      class="vehicle-quote-coverage-option ${isActive ? "is-active" : ""}"
      type="button"
      data-model-coverage
      data-coverage-index="${index}"
      aria-pressed="${isActive ? "true" : "false"}"
    >
      ${option.recommended ? `<small class="vehicle-quote-recommended">Recomendada</small>` : ""}
      <span class="vehicle-quote-coverage-name">${escapeHtml(option.name)}</span>
      <strong>${escapeHtml(`${getSignedPriceAmountText(option.surcharge)}/mes`)}</strong>
      <span>${escapeHtml(option.description)}</span>
      <span>${escapeHtml(option.deposit)}</span>
    </button>
  `;
}

function getInitialModelTermKey(vehicle, filters) {
  const termFromFilters = normalizeMonthlyTermValue(filters.term);

  if (Number(vehicle.pricePlans?.[termFromFilters]) > 0) {
    return termFromFilters;
  }

  if (Number(vehicle.pricePlans?.[DEFAULT_MODEL_TERM_KEY]) > 0) {
    return DEFAULT_MODEL_TERM_KEY;
  }

  return PRICE_PLAN_KEYS.find((key) => Number(vehicle.pricePlans?.[key]) > 0) || "12";
}

function getDefaultCoverageIndex(coverageOptions) {
  const lowestIndex = coverageOptions.reduce((bestIndex, option, index, items) => {
    if (bestIndex === -1) {
      return index;
    }

    return Number(option.surcharge) < Number(items[bestIndex].surcharge) ? index : bestIndex;
  }, -1);

  return lowestIndex === -1 ? 0 : lowestIndex;
}

function getModelSelectionSummary(vehicle, termKey, mileageIndex, coverageIndex) {
  const mileagePlan = vehicle.mileagePlans[mileageIndex] || vehicle.mileagePlans[0] || DEFAULT_MILEAGE_PLANS[0];
  const coverageOption = vehicle.showCoverage
    ? vehicle.coverageOptions[coverageIndex] || vehicle.coverageOptions[0] || DEFAULT_COVERAGE_OPTIONS[0]
    : null;
  const basePrice = Number(vehicle.pricePlans?.[termKey]) || getVehicleLowestMonthlyPrice(vehicle);
  const monthlyQuote = basePrice + Number(mileagePlan.surcharge || 0) + Number(coverageOption?.surcharge || 0);

  return {
    termKey,
    basePrice,
    mileagePlan,
    coverageOption,
    monthlyQuote
  };
}

function getModelQuoteBreakdown(selection) {
  const parts = [
    getPricePlanLabel(selection.termKey),
    `${selection.mileagePlan.km} km/mes`
  ];

  if (selection.coverageOption?.name) {
    parts.push(selection.coverageOption.name);
  }

  return parts.join(" - ");
}

function getModelAvailabilityRange(startValue, termKey) {
  if (!startValue) {
    return null;
  }

  return buildRentalRangeFromMonths(startValue, Number(termKey));
}

function buildRentalRangeFromMonths(startValue, months) {
  const normalizedStart = normalizeIsoDate(startValue);
  const duration = Number(months);

  if (!normalizedStart || duration <= 0) {
    return null;
  }

  const startDate = new Date(`${normalizedStart}T00:00:00`);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);
  endDate.setDate(endDate.getDate() - 1);

  return {
    start: toIsoDate(startDate),
    end: toIsoDate(endDate)
  };
}

function getPricePlanLabel(termKey) {
  const months = Number(termKey);
  return `${months} ${months === 1 ? "mes" : "meses"}`;
}

function getAvailabilityBadgeText(availability) {
  if (availability.isAvailable) {
    return "Disponible";
  }

  return availability.manuallyUnavailable ? "No disponible" : "Con bloqueo";
}

function getModelAvailabilityCopy(availability, startValue, termKey, hasCoverage = true) {
  if (startValue && availability.isAvailable) {
    return `Disponible para ${getPricePlanLabel(termKey)} desde ${formatDate(startValue)}.`;
  }

  if (availability.manuallyUnavailable) {
    return startValue
      ? "Este vehiculo esta marcado manualmente como no disponible para el periodo solicitado."
      : "Este vehiculo esta marcado manualmente como no disponible ahora.";
  }

  if (startValue && !availability.isAvailable) {
    const firstConflict = availability.conflicts[0];
    return `El periodo seleccionado se cruza con ${formatDateRange(firstConflict.start, firstConflict.end)}.`;
  }

  if (availability.nextBlock) {
    return `Proximo bloqueo visible: ${formatDateRange(availability.nextBlock.start, availability.nextBlock.end)}.`;
  }

  return hasCoverage
    ? "Selecciona plazo, kilometros y cobertura para calcular la cuota exacta."
    : "Selecciona plazo y kilometros para calcular la cuota exacta.";
}

function renderVehicleCard(vehicle, filters = getFiltersFromUrl()) {
  const availability = getVehicleAvailability(vehicle, buildRentalRange(filters.start, filters.term));
  const vehicleUrl = buildVehicleUrl(vehicle, filters);
  const whatsappUrl = buildVehicleWhatsappUrl(
    vehicle,
    availability,
    filters,
    pageWhatsappNumber()
  );
  const image = getVehicleDisplayImage(vehicle);
  const lowestQuote = getVehicleLowestQuote(vehicle);
  const lowestQuoteMeta = getVehicleLowestQuoteMeta(lowestQuote);

  return `
    <article class="vehicle-card">
      <a class="vehicle-media" href="${escapeAttribute(vehicleUrl)}" aria-label="${escapeAttribute(`Ver ${vehicle.name}`)}">
        <img src="${escapeAttribute(image)}" alt="${escapeAttribute(vehicle.name)}" loading="lazy">
        <span class="vehicle-type-badge">${escapeHtml(getTypeLabel(vehicle.type))}</span>
        <span class="vehicle-price-badge">
          <small>Desde</small>
          <strong>${escapeHtml(getPriceAmountText(lowestQuote.price))}</strong>
        </span>
      </a>

      <div class="vehicle-body">
        <div class="vehicle-top">
          <div>
            <p class="vehicle-location">${escapeHtml(vehicle.location)}</p>
            <h3><a href="${escapeAttribute(vehicleUrl)}">${escapeHtml(vehicle.name)}</a></h3>
            ${lowestQuoteMeta ? `<p class="vehicle-quote-meta">${escapeHtml(lowestQuoteMeta)}</p>` : ""}
          </div>
        </div>

        <ul class="spec-list">
          <li>${escapeHtml(String(vehicle.passengers))} plazas</li>
          <li>${escapeHtml(vehicle.transmission)}</li>
          <li>${escapeHtml(vehicle.fuel)}</li>
        </ul>

        <div class="availability-panel">
          <span class="availability-badge ${availability.isAvailable ? "available" : "busy"}">
            ${escapeHtml(getAvailabilityBadgeText(availability))}
          </span>
          <p class="availability-copy">${escapeHtml(getAvailabilityCopy(availability, filters))}</p>
        </div>

        <div class="vehicle-actions">
          <a class="button secondary" href="${escapeAttribute(vehicleUrl)}">Ver ficha</a>
          <a class="button primary" href="${escapeAttribute(whatsappUrl)}" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderHomeShowcaseMeta(vehicle, activeIndex, vehicles, isMobile) {
  const vehicleUrl = buildVehicleUrl(vehicle);
  const helperCopy = isMobile
    ? "Desliza el dedo o usa las flechas para cambiar de vehiculo."
    : "Usa la rueda del raton, los nombres o las flechas para cambiar de vehiculo.";

  return `
    <h2>${escapeHtml(vehicle.name)}</h2>
    <div class="home-showcase-price">
      <span>Desde</span>
      <strong>${escapeHtml(formatPrice(vehicle.pricePerMonth))}</strong>
      <small>/ mes</small>
    </div>
    <div class="home-showcase-dots" aria-label="Seleccionar vehiculo destacado">
      ${vehicles.map((showcaseVehicle, index) => `
        <button
          class="${index === activeIndex ? "is-active" : ""}"
          type="button"
          data-home-showcase-select="${escapeAttribute(String(index))}"
          aria-label="${escapeAttribute(`Mostrar ${showcaseVehicle.name}`)}"
          aria-pressed="${index === activeIndex ? "true" : "false"}"
        ></button>
      `).join("")}
    </div>
    <p class="home-showcase-helper">${escapeHtml(helperCopy)}</p>
    <a class="button secondary" href="${escapeAttribute(vehicleUrl)}">Ver detalles</a>
  `;
}

function renderHomeShowcaseSlide(vehicle, originalIndex, slotIndex, total, options = {}) {
  const { isMobile = false } = options;
  const image = getVehicleDisplayImage(vehicle);
  const vehicleUrl = buildVehicleUrl(vehicle);
  const centerIndex = Math.floor(total / 2);
  const distance = isMobile ? 0 : Math.abs(slotIndex - centerIndex);
  const stateClass = distance === 0 ? "is-active" : distance > 1 ? "is-dim" : "";

  return `
    <article class="home-showcase-slide ${stateClass}${isMobile ? " is-mobile" : ""}">
      <a
        class="home-showcase-image-link"
        href="${escapeAttribute(vehicleUrl)}"
        aria-label="${escapeAttribute(`Ver detalles de ${vehicle.name}`)}"
      >
        <span class="home-showcase-image">
          <img src="${escapeAttribute(image)}" alt="${escapeAttribute(vehicle.name)}" loading="lazy">
        </span>
      </a>
      ${isMobile ? "" : `
        <button
          class="home-showcase-selector"
          type="button"
          data-home-showcase-select="${escapeAttribute(String(originalIndex))}"
          aria-label="${escapeAttribute(`Destacar ${vehicle.name}`)}"
          aria-pressed="${distance === 0 ? "true" : "false"}"
        >
          <span class="home-showcase-name">${escapeHtml(vehicle.name)}</span>
        </button>
      `}
    </article>
  `;
}

function renderHomeAvailableCard(vehicle) {
  const availability = getVehicleAvailability(vehicle, null);
  const image = getVehicleDisplayImage(vehicle);
  const vehicleUrl = buildVehicleUrl(vehicle);
  const badgeClass = availability.isAvailable ? "" : " is-unavailable";

  return `
    <article class="home-available-card">
      <a class="home-available-card-media" href="${escapeAttribute(vehicleUrl)}" aria-label="${escapeAttribute(`Ver ${vehicle.name}`)}">
        <span class="home-available-card-badge${badgeClass}">${escapeHtml(getAvailabilityBadgeText(availability))}</span>
        <span class="home-available-card-price">
          <span>Desde</span>
          <strong>${escapeHtml(getPriceAmountText(vehicle.pricePerMonth))}</strong>
        </span>
        <img src="${escapeAttribute(image)}" alt="${escapeAttribute(vehicle.name)}" loading="lazy">
      </a>
      <div class="home-available-card-head">
        <span class="home-available-card-type">${escapeHtml(getTypeLabel(vehicle.type))}</span>
      </div>
      <h3><a href="${escapeAttribute(vehicleUrl)}">${escapeHtml(vehicle.name)}</a></h3>
      <a class="button secondary full" href="${escapeAttribute(vehicleUrl)}">Ver detalles</a>
    </article>
  `;
}

function getOrderedShowcaseVehicles(vehicles, activeIndex) {
  const centerIndex = Math.floor(vehicles.length / 2);

  return Array.from({ length: vehicles.length }, (_, slotIndex) => {
    const originalIndex = (activeIndex - centerIndex + slotIndex + vehicles.length) % vehicles.length;

    return {
      vehicle: vehicles[originalIndex],
      originalIndex
    };
  });
}

function getPriceAmountText(value) {
  return formatPrice(value).replace(/\s+/g, "");
}

function getSignedPriceAmountText(value) {
  const numericValue = Number(value) || 0;
  return `${numericValue > 0 ? "+" : ""}${getPriceAmountText(numericValue)}`;
}

function renderEmptyPanel(title, copy) {
  return `
    <div class="empty-panel">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(copy)}</p>
    </div>
  `;
}

function getUniqueCatalogValues(vehicles, getValue, getLabel = (value) => value, sortFn = defaultCatalogValueSort) {
  const map = new Map();

  vehicles.forEach((vehicle) => {
    const value = String(getValue(vehicle) || "").trim();

    if (!value || map.has(value)) {
      return;
    }

    map.set(value, String(getLabel(value) || value).trim());
  });

  return [...map.entries()]
    .sort((left, right) => sortFn(left[0], right[0], left[1], right[1]))
    .map(([value, label]) => ({ value, label }));
}

function buildCatalogSelectOptions(options, defaultValue, defaultLabel) {
  return [
    `<option value="${escapeAttribute(defaultValue)}">${escapeHtml(defaultLabel)}</option>`,
    ...options.map((option) => `<option value="${escapeAttribute(option.value)}">${escapeHtml(option.label)}</option>`)
  ].join("");
}

function defaultCatalogValueSort(leftValue, rightValue, leftLabel, rightLabel) {
  const leftNumber = Number(leftValue);
  const rightNumber = Number(rightValue);

  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber) && leftValue.trim() !== "" && rightValue.trim() !== "") {
    return leftNumber - rightNumber;
  }

  return String(leftLabel).localeCompare(String(rightLabel), "es", { sensitivity: "base" });
}

function compareEnvironmentalTags(leftValue, rightValue) {
  const order = ["Cero", "ECO", "C", "B", "A", "Sin etiqueta"];
  const leftIndex = order.indexOf(leftValue);
  const rightIndex = order.indexOf(rightValue);

  if (leftIndex !== -1 || rightIndex !== -1) {
    return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
  }

  return defaultCatalogValueSort(leftValue, rightValue, leftValue, rightValue);
}

function getFilteredVehicles(vehicles, filters) {
  const normalizedSearch = String(filters.search || "").trim().toLowerCase();

  return [...vehicles]
    .filter((vehicle) => filters.brand === "all" || vehicle.brand === filters.brand)
    .filter((vehicle) => filters.transmission === "all" || vehicle.transmission === filters.transmission)
    .filter((vehicle) => filters.fuel === "all" || vehicle.fuel === filters.fuel)
    .filter((vehicle) => filters.category === "all" || vehicle.type === filters.category)
    .filter((vehicle) => filters.passengers === "all" || String(vehicle.passengers) === String(filters.passengers))
    .filter((vehicle) => filters.environmentalTag === "all" || vehicle.environmentalTag === filters.environmentalTag)
    .filter((vehicle) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        vehicle.brand,
        vehicle.name,
        vehicle.location,
        vehicle.transmission,
        vehicle.fuel,
        getTypeLabel(vehicle.type),
        vehicle.environmentalTag,
        ...vehicle.features
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    })
    .sort((left, right) => getVehicleLowestMonthlyPrice(left) - getVehicleLowestMonthlyPrice(right));
}

function getRequestedVehicle(vehicles) {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");
  const slugFromBody = document.body.dataset.vehicleSlug || "";
  const requestedSlug = slugFromBody || params.get("slug") || getTrailingSlug();

  if (requestedId) {
    return vehicles.find((vehicle) => vehicle.id === requestedId) || null;
  }

  if (!requestedSlug) {
    return null;
  }

  const mappedId = SLUG_TO_ID[requestedSlug];

  if (mappedId) {
    return vehicles.find((vehicle) => vehicle.id === mappedId) || null;
  }

  return vehicles.find((vehicle) => slugify(vehicle.name) === requestedSlug) || null;
}

function getTrailingSlug() {
  const segments = window.location.pathname.split("/").filter(Boolean);
  return segments.length > 1 ? segments[segments.length - 1] : "";
}

function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return {
    search: params.get("q") || "",
    brand: params.get("brand") || "all",
    transmission: params.get("transmission") || "all",
    fuel: params.get("fuel") || "all",
    category: params.get("category") || "all",
    passengers: params.get("passengers") || "all",
    environmentalTag: params.get("environmentalTag") || "all",
    start: params.get("start") || "",
    term: normalizeMonthlyTermValue(params.get("term") || "1")
  };
}

function syncCatalogQuery(filters) {
  const params = new URLSearchParams();
  appendCatalogFilterParams(params, filters);

  const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, "", url);
}

function buildCatalogUrl(filters = {}) {
  const params = new URLSearchParams();
  appendCatalogFilterParams(params, filters);

  const query = params.toString();
  return `${getRootPrefix()}catalogo/${query ? `?${query}` : ""}`;
}

function buildVehicleUrl(vehicle, filters = {}) {
  const params = new URLSearchParams();

  appendCatalogFilterParams(params, filters);

  if (filters.start) {
    params.set("start", filters.start);
  }

  if (filters.term && filters.term !== "1") {
    params.set("term", filters.term);
  }

  const query = params.toString();
  const mappedSlug = MODEL_ROUTE_MAP[vehicle.id];

  if (mappedSlug) {
    return `${getRootPrefix()}modelo/${mappedSlug}/${query ? `?${query}` : ""}`;
  }

  return `${getRootPrefix()}modelo/?id=${encodeURIComponent(vehicle.id)}${query ? `&${query}` : ""}`;
}

function appendCatalogFilterParams(params, filters = {}) {
  if (filters.search) {
    params.set("q", String(filters.search).trim());
  }

  ["brand", "transmission", "fuel", "category", "passengers", "environmentalTag"].forEach((key) => {
    if (filters[key] && filters[key] !== "all") {
      params.set(key, String(filters[key]));
    }
  });
}

function pageWhatsappNumber() {
  const phone = document.body.dataset.currentWhatsapp || DEFAULT_WHATSAPP_NUMBER;
  return normalizeWhatsappNumber(phone) || DEFAULT_WHATSAPP_NUMBER;
}

function syncGenericWhatsappLinks(phoneNumber) {
  const normalizedPhone = normalizeWhatsappNumber(phoneNumber) || DEFAULT_WHATSAPP_NUMBER;
  document.body.dataset.currentWhatsapp = normalizedPhone;

  const url = buildGenericWhatsappUrl(normalizedPhone);
  const phoneUrl = url;

  document.querySelectorAll("[data-whatsapp-generic]").forEach((link) => {
    link.setAttribute("href", url);
  });

  document.querySelectorAll("[data-phone-generic]").forEach((link) => {
    link.setAttribute("href", phoneUrl);
  });

  document.querySelectorAll("[data-whatsapp-number]").forEach((node) => {
    node.textContent = formatPhoneDisplay(normalizedPhone);
  });
}

function fillGlobalStats(state) {
  const count = state.vehicles.length;
  const minPrice = getMinimumPrice(state.vehicles);
  const carCount = state.vehicles.filter((vehicle) => vehicle.type !== "furgoneta").length;
  const vanCount = state.vehicles.filter((vehicle) => vehicle.type === "furgoneta").length;

  document.querySelectorAll("[data-fleet-count]").forEach((node) => {
    node.textContent = String(count);
  });

  document.querySelectorAll("[data-min-price]").forEach((node) => {
    node.textContent = count ? formatPrice(minPrice) : "--";
  });

  document.querySelectorAll("[data-cars-count]").forEach((node) => {
    node.textContent = String(carCount);
  });

  document.querySelectorAll("[data-vans-count]").forEach((node) => {
    node.textContent = String(vanCount);
  });
}

function getMinimumPrice(vehicles) {
  if (!vehicles.length) {
    return 0;
  }

  return Math.min(...vehicles.map((vehicle) => getVehicleLowestMonthlyPrice(vehicle)).filter((price) => price > 0));
}

function buildGenericWhatsappUrl(phoneNumber) {
  const message = "Hola, quiero informacion sobre un alquiler mensual con Alquilo Aqui.";
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function buildVehicleWhatsappUrl(vehicle, availability, filters, phoneNumber, selection = null) {
  const selectedTermKey = selection?.termKey || normalizeMonthlyTermValue(filters.term || "1");
  const selectedTermLabel = getPricePlanLabel(selectedTermKey);
  const selectedPrice = Number(selection?.monthlyQuote) > 0
    ? Number(selection.monthlyQuote)
    : getVehicleLowestMonthlyPrice(vehicle);
  const parts = [
    `Hola, quiero consultar el ${vehicle.name}.`,
    `Cuota publicada: ${formatPrice(selectedPrice)} + IVA al mes.`
  ];

  if (filters.start) {
    parts.push(`Inicio solicitado: ${filters.start}.`);
    parts.push(`Plazo deseado: ${selectedTermLabel}.`);
  } else {
    parts.push(`Plazo deseado: ${selectedTermLabel} con inicio flexible.`);
  }

  if (selection?.mileagePlan) {
    parts.push(`Kilometros: ${selection.mileagePlan.km} km/mes.`);
  }

  if (selection?.coverageOption) {
    parts.push(`Cobertura: ${selection.coverageOption.name}.`);
  }

  parts.push(
    availability.isAvailable
      ? "La ficha aparece disponible y quiero confirmar condiciones."
      : availability.manuallyUnavailable
        ? "La ficha aparece no disponible y quiero revisar alternativas."
        : "La ficha aparece con bloqueo y quiero revisar alternativas."
  );

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(parts.join(" "))}`;
}

function getVehicleAvailability(vehicle, range) {
  const manuallyUnavailable = vehicle.showAsAvailable === false;

  if (!range) {
    const nextBlock = [...vehicle.blocks].sort(sortBlocks)[0] || null;

    return {
      isAvailable: !manuallyUnavailable,
      manuallyUnavailable,
      conflicts: [],
      nextBlock
    };
  }

  const conflicts = vehicle.blocks.filter((block) =>
    rangesOverlap(range.start, range.end, block.start, block.end)
  );
  const nextBlock = vehicle.blocks.find((block) => block.start > range.end) || null;

  return {
    isAvailable: !manuallyUnavailable && conflicts.length === 0,
    manuallyUnavailable,
    conflicts: conflicts.sort(sortBlocks),
    nextBlock
  };
}

function buildRentalRange(startValue, termValue) {
  const normalizedStart = normalizeIsoDate(startValue);
  const term = MONTHLY_TERMS[normalizeMonthlyTermValue(termValue)];

  if (!normalizedStart || !term) {
    return null;
  }

  const startDate = new Date(`${normalizedStart}T00:00:00`);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + term.months);
  endDate.setDate(endDate.getDate() - 1);

  return {
    start: toIsoDate(startDate),
    end: toIsoDate(endDate)
  };
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA;
}

function getAvailabilityCopy(availability, filters) {
  if (filters.start && availability.isAvailable) {
    return `Disponible para ${getMonthlyTermLabel(filters.term)} desde ${formatDate(filters.start)}.`;
  }

  if (availability.manuallyUnavailable) {
    return filters.start
      ? "Este vehiculo esta marcado manualmente como no disponible para el periodo solicitado."
      : "Este vehiculo esta marcado manualmente como no disponible ahora.";
  }

  if (filters.start && !availability.isAvailable) {
    const firstConflict = availability.conflicts[0];
    return `El periodo solicitado se cruza con ${formatDateRange(firstConflict.start, firstConflict.end)}.`;
  }

  if (availability.nextBlock) {
    return `Proximo bloqueo visible: ${formatDateRange(availability.nextBlock.start, availability.nextBlock.end)}.`;
  }

  return "Consulta la fecha exacta de inicio y te confirmamos la disponibilidad por WhatsApp.";
}

function getVehicleDisplayImage(vehicle) {
  const images = getVehicleImages(vehicle);
  return images[0] || createVehiclePlaceholder(vehicle);
}

function getVehicleImages(vehicle) {
  return normalizeVehicleImages(vehicle?.images, vehicle?.image);
}

function createVehiclePlaceholder(vehicle) {
  const title = escapeSvg(vehicle?.name || "Alquilo Aqui");
  const subtitle = escapeSvg(getTypeLabel(vehicle?.type || "coche"));

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#081f31"/>
          <stop offset="55%" stop-color="#123b55"/>
          <stop offset="100%" stop-color="#17b4b2"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="750" fill="url(#bg)"/>
      <circle cx="980" cy="140" r="130" fill="rgba(240,204,143,0.16)"/>
      <circle cx="180" cy="640" r="180" fill="rgba(255,255,255,0.06)"/>
      <text x="80" y="540" fill="#ffffff" font-family="Montserrat, Arial, sans-serif" font-size="70" font-weight="700">${title}</text>
      <text x="80" y="602" fill="rgba(255,255,255,0.72)" font-family="Montserrat, Arial, sans-serif" font-size="34" font-weight="600">${subtitle}</text>
    </svg>
  `)}`;
}

function getMonthlyTermLabel(value) {
  return MONTHLY_TERMS[normalizeMonthlyTermValue(value)]?.label || MONTHLY_TERMS["1"].label;
}

function normalizeMonthlyTermValue(termValue) {
  if (termValue === "12plus") {
    return "12";
  }

  if (termValue === "3") {
    return "6";
  }

  if (termValue === "9" || termValue === "18") {
    return "12";
  }

  return MONTHLY_TERMS[termValue] ? termValue : "1";
}

function getTypeLabel(value) {
  return {
    coche: "Coche",
    suv: "SUV",
    furgoneta: "Furgoneta"
  }[value] || "Vehiculo";
}

function getRootPrefix() {
  return document.body.dataset.rootPrefix || "./";
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value) {
  return formatters.price.format(Number(value) || 0);
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : formatters.date.format(date);
}

function formatDateRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function formatPhoneDisplay(phone) {
  if (phone.length === 11 && phone.startsWith("34")) {
    return `+34 ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
  }

  return `+${phone}`;
}

function toIsoDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function escapeSvg(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
