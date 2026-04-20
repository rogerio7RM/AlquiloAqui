const STORAGE_KEY = "alquilo-aqui-catalogo-v1";
const FIREBASE_SDK_VERSION = "12.12.0";
const FIREBASE_DATABASE_PATH = "alquilo-aqui/catalogo";
const VEHICLE_IMAGE_MAX_SIDE = 1200;
const VEHICLE_IMAGE_JPEG_QUALITY = 0.72;
const VEHICLE_CROP_OUTPUT_WIDTH = 1200;
const VEHICLE_CROP_OUTPUT_HEIGHT = 750;
const VEHICLE_IMAGE_INLINE_REOPTIMIZE_LENGTH = 450000;
const FIREBASE_CONFIG_KEYS = [
  "apiKey",
  "authDomain",
  "databaseURL",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId"
];
const DEFAULT_ADMIN_PASSWORD = "AlquiloAqui2026!";
const MONTHLY_TERMS = {
  "1": { label: "1 mes", months: 1 },
  "3": { label: "3 meses", months: 3 },
  "12plus": { label: "12 meses o mas", months: 12 }
};

const state = {
  data: null,
  ui: {
    isAdminAuthenticated: false,
    editingVehicleId: null,
    blockVehicleId: null,
    calendarMonth: startOfMonth(new Date()),
    currentVehicleImages: [],
    croppingImageIndex: null,
    vehicleImageSelectionPromise: null,
    activeVehicleId: null,
    activeVehicleImageIndex: 0,
    catalogReturnY: 0
  },
  sync: {
    auth: null,
    databaseRef: null,
    initPromise: null,
    isConfigured: false,
    isReady: false,
    isSaving: false,
    isRemoteEmpty: false,
    hasPendingLocalSave: false,
    lastRemoteJson: "",
    pendingSave: Promise.resolve(),
    status: "local",
    errorMessage: ""
  }
};

const refs = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheDom();
  state.data = loadState();
  state.ui.blockVehicleId = state.data.vehicles[0]?.id ?? null;

  bindPublicEvents();
  bindAdminEvents();
  syncGlobalWhatsappLinks();
  renderPublic();
  renderSyncStatus();
  state.sync.initPromise = initRemoteSync();
}

function cacheDom() {
  refs.menuToggle = document.getElementById("menuToggle");
  refs.siteMenu = document.getElementById("siteMenu");
  refs.searchForm = document.getElementById("searchForm");
  refs.filterStart = document.getElementById("filterStart");
  refs.filterTerm = document.getElementById("filterTerm");
  refs.filterType = document.getElementById("filterType");
  refs.searchInput = document.getElementById("searchInput");
  refs.resetFiltersBtn = document.getElementById("resetFiltersBtn");
  refs.catalogSection = document.getElementById("catalogo");
  refs.fleetGrid = document.getElementById("fleetGrid");
  refs.vehicleDetail = document.getElementById("vehicleDetail");
  refs.emptyState = document.getElementById("emptyState");
  refs.heroWhatsappLink = document.getElementById("heroWhatsappLink");
  refs.menuWhatsappLink = document.getElementById("menuWhatsappLink");
  refs.footerWhatsappLink = document.getElementById("footerWhatsappLink");
  refs.floatingWhatsappLink = document.getElementById("floatingWhatsappLink");

  refs.adminLoginModal = document.getElementById("adminLoginModal");
  refs.adminPanelModal = document.getElementById("adminPanelModal");
  refs.adminLoginForm = document.getElementById("adminLoginForm");
  refs.adminPasswordInput = document.getElementById("adminPasswordInput");
  refs.adminLoginMessage = document.getElementById("adminLoginMessage");
  refs.adminLogoutBtn = document.getElementById("adminLogoutBtn");
  refs.loginSyncStatus = document.getElementById("loginSyncStatus");
  refs.syncStatus = document.getElementById("syncStatus");

  refs.settingsForm = document.getElementById("settingsForm");
  refs.settingsWhatsapp = document.getElementById("settingsWhatsapp");
  refs.settingsPassword = document.getElementById("settingsPassword");
  refs.settingsMessage = document.getElementById("settingsMessage");

  refs.vehicleForm = document.getElementById("vehicleForm");
  refs.vehicleId = document.getElementById("vehicleId");
  refs.vehicleName = document.getElementById("vehicleName");
  refs.vehicleType = document.getElementById("vehicleType");
  refs.vehiclePrice = document.getElementById("vehiclePrice");
  refs.vehicleLocation = document.getElementById("vehicleLocation");
  refs.vehiclePassengers = document.getElementById("vehiclePassengers");
  refs.vehicleTransmission = document.getElementById("vehicleTransmission");
  refs.vehicleFuel = document.getElementById("vehicleFuel");
  refs.vehicleImageFile = document.getElementById("vehicleImageFile");
  refs.vehicleImagesList = document.getElementById("vehicleImagesList");
  refs.clearVehicleImageBtn = document.getElementById("clearVehicleImageBtn");
  refs.vehicleImageCropper = document.getElementById("vehicleImageCropper");
  refs.vehicleImageCropStage = document.getElementById("vehicleImageCropStage");
  refs.vehicleImageCropImg = document.getElementById("vehicleImageCropImg");
  refs.vehicleImageCropZoom = document.getElementById("vehicleImageCropZoom");
  refs.vehicleImageCropX = document.getElementById("vehicleImageCropX");
  refs.vehicleImageCropY = document.getElementById("vehicleImageCropY");
  refs.applyImageCropBtn = document.getElementById("applyImageCropBtn");
  refs.cancelImageCropBtn = document.getElementById("cancelImageCropBtn");
  refs.vehicleSummary = document.getElementById("vehicleSummary");
  refs.vehicleFeatures = document.getElementById("vehicleFeatures");
  refs.vehicleFormMessage = document.getElementById("vehicleFormMessage");
  refs.cancelVehicleEditBtn = document.getElementById("cancelVehicleEditBtn");
  refs.adminVehicleList = document.getElementById("adminVehicleList");

  refs.blockVehicleSelect = document.getElementById("blockVehicleSelect");
  refs.blockForm = document.getElementById("blockForm");
  refs.blockStart = document.getElementById("blockStart");
  refs.blockEnd = document.getElementById("blockEnd");
  refs.blockNote = document.getElementById("blockNote");
  refs.blockFormMessage = document.getElementById("blockFormMessage");
  refs.blockList = document.getElementById("blockList");
  refs.calendarLabel = document.getElementById("calendarLabel");
  refs.calendarDays = document.getElementById("calendarDays");
  refs.calendarPrevBtn = document.getElementById("calendarPrevBtn");
  refs.calendarNextBtn = document.getElementById("calendarNextBtn");
}

function bindPublicEvents() {
  refs.menuToggle.addEventListener("click", () => {
    const isOpen = !refs.siteMenu.classList.contains("hidden");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  document.querySelectorAll("[data-close-menu]").forEach((button) => {
    button.addEventListener("click", closeMenu);
  });

  document.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeMenu();
    closeLoginModal();
    closeAdminPanel();
  });

  refs.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    normalizeRentalFilters();
    resetVehicleDetailView();
    renderPublic();
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  [refs.filterStart, refs.filterTerm, refs.filterType].forEach((element) => {
    element.addEventListener("change", () => {
      normalizeRentalFilters();
      resetVehicleDetailView();
      renderPublic();
    });
  });

  refs.searchInput.addEventListener("input", () => {
    resetVehicleDetailView();
    renderPublic();
  });

  refs.fleetGrid.addEventListener("click", handleVehicleGalleryControlClick);
  refs.vehicleDetail.addEventListener("click", handleVehicleDetailClick);

  refs.resetFiltersBtn.addEventListener("click", () => {
    refs.filterStart.value = "";
    refs.filterTerm.value = "1";
    refs.filterType.value = "all";
    refs.searchInput.value = "";
    resetVehicleDetailView();
    renderPublic();
  });

  document.querySelectorAll("[data-open-admin]").forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();

      if (state.ui.isAdminAuthenticated) {
        openAdminPanel();
        return;
      }

      openLoginModal();
    });
  });

  document.querySelectorAll("[data-close-login]").forEach((button) => {
    button.addEventListener("click", closeLoginModal);
  });

  document.querySelectorAll("[data-close-panel]").forEach((button) => {
    button.addEventListener("click", closeAdminPanel);
  });
}

function bindAdminEvents() {
  refs.adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = refs.adminPasswordInput.value;

    try {
      await authenticateAdmin(password);
    } catch (error) {
      setMessage(refs.adminLoginMessage, getAdminAuthErrorMessage(error), "error");
      return;
    }

    state.ui.isAdminAuthenticated = true;
    refs.adminPasswordInput.value = "";
    setMessage(refs.adminLoginMessage, "");
    closeLoginModal();
    openAdminPanel();
  });

  refs.adminLogoutBtn.addEventListener("click", () => {
    state.ui.isAdminAuthenticated = false;
    signOutRemoteAdmin();
    closeAdminPanel();
  });

  refs.settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const whatsappNumber = normalizeWhatsappNumber(refs.settingsWhatsapp.value);
    const newPassword = refs.settingsPassword.value.trim();

    if (!whatsappNumber) {
      setMessage(refs.settingsMessage, "Introduce un numero de WhatsApp valido.", "error");
      return;
    }

    try {
      await updateAdminPassword(newPassword);
    } catch (error) {
      setMessage(refs.settingsMessage, getAdminAuthErrorMessage(error), "error");
      return;
    }

    state.data.settings.whatsappNumber = whatsappNumber;
    saveState();
    refs.settingsPassword.value = "";
    syncGlobalWhatsappLinks();
    renderPublic();
    renderAdmin();
    setMessage(refs.settingsMessage, "Configuracion guardada.", "success");
  });

  refs.vehicleImageFile.addEventListener("change", async () => {
    try {
      await queueVehicleImageSelection();
    } catch (error) {
      setMessage(refs.vehicleFormMessage, error.message || "No se pudieron cargar las fotos.", "error");
    }
  });

  refs.clearVehicleImageBtn.addEventListener("click", () => {
    clearVehicleImage();
    setMessage(refs.vehicleFormMessage, "Fotos eliminadas de la ficha.", "success");
  });

  refs.vehicleImagesList.addEventListener("click", handleVehicleImagesListClick);

  [refs.vehicleImageCropZoom, refs.vehicleImageCropX, refs.vehicleImageCropY].forEach((control) => {
    control.addEventListener("input", updateVehicleImageCropPreview);
  });

  refs.applyImageCropBtn.addEventListener("click", applyVehicleImageCrop);
  refs.cancelImageCropBtn.addEventListener("click", closeVehicleImageCropper);

  refs.vehicleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let vehicle;
    const previousState = JSON.stringify(state.data);

    try {
      vehicle = await readVehicleForm();
    } catch (error) {
      setMessage(refs.vehicleFormMessage, error.message || "No se pudo procesar la ficha.", "error");
      return;
    }

    if (!vehicle.name || !vehicle.location || !vehicle.transmission || !vehicle.fuel || !vehicle.summary) {
      setMessage(refs.vehicleFormMessage, "Completa los campos obligatorios del vehiculo.", "error");
      return;
    }

    const existingVehicle = state.data.vehicles.find((item) => item.id === vehicle.id);

    if (existingVehicle) {
      existingVehicle.name = vehicle.name;
      existingVehicle.type = vehicle.type;
      existingVehicle.pricePerMonth = vehicle.pricePerMonth;
      existingVehicle.location = vehicle.location;
      existingVehicle.passengers = vehicle.passengers;
      existingVehicle.transmission = vehicle.transmission;
      existingVehicle.fuel = vehicle.fuel;
      existingVehicle.image = vehicle.image;
      existingVehicle.images = vehicle.images;
      existingVehicle.summary = vehicle.summary;
      existingVehicle.features = vehicle.features;
      setMessage(refs.vehicleFormMessage, "Vehiculo actualizado.", "success");
    } else {
      state.data.vehicles.push({
        ...vehicle,
        id: createId("veh"),
        blocks: []
      });
      setMessage(refs.vehicleFormMessage, "Vehiculo creado.", "success");
    }

    try {
      saveState();
    } catch (error) {
      state.data = normalizeState(JSON.parse(previousState));
      renderPublic();
      renderAdmin();
      setMessage(
        refs.vehicleFormMessage,
        "No se pudieron guardar las fotos. Prueba con JPG/PNG mas ligeros o menos fotos.",
        "error"
      );
      return;
    }

    state.ui.editingVehicleId = null;
    if (!state.ui.blockVehicleId) {
      state.ui.blockVehicleId = state.data.vehicles[0]?.id ?? null;
    }
    resetVehicleForm();
    renderPublic();
    renderAdmin();
  });

  refs.cancelVehicleEditBtn.addEventListener("click", () => {
    state.ui.editingVehicleId = null;
    resetVehicleForm();
    setMessage(refs.vehicleFormMessage, "");
  });

  refs.adminVehicleList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-vehicle]");
    const deleteButton = event.target.closest("[data-delete-vehicle]");
    const focusBlocksButton = event.target.closest("[data-focus-blocks]");

    if (editButton) {
      const vehicleId = editButton.getAttribute("data-edit-vehicle");
      state.ui.editingVehicleId = vehicleId;
      state.ui.blockVehicleId = vehicleId;
      renderAdmin();
      refs.vehicleName.focus();
      setMessage(refs.vehicleFormMessage, "Editando vehiculo.", "success");
      return;
    }

    if (focusBlocksButton) {
      state.ui.blockVehicleId = focusBlocksButton.getAttribute("data-focus-blocks");
      renderAdmin();
      refs.blockStart.focus();
      return;
    }

    if (deleteButton) {
      const vehicleId = deleteButton.getAttribute("data-delete-vehicle");
      const vehicle = findVehicleById(vehicleId);

      if (!vehicle) {
        return;
      }

      if (!window.confirm(`Eliminar "${vehicle.name}" del catalogo?`)) {
        return;
      }

      state.data.vehicles = state.data.vehicles.filter((item) => item.id !== vehicleId);
      if (state.ui.editingVehicleId === vehicleId) {
        state.ui.editingVehicleId = null;
        resetVehicleForm();
      }
      if (state.ui.blockVehicleId === vehicleId) {
        state.ui.blockVehicleId = state.data.vehicles[0]?.id ?? null;
      }
      saveState();
      renderPublic();
      renderAdmin();
    }
  });

  refs.blockVehicleSelect.addEventListener("change", () => {
    state.ui.blockVehicleId = refs.blockVehicleSelect.value || null;
    renderBlocksSection();
  });

  refs.blockForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const vehicle = findVehicleById(refs.blockVehicleSelect.value);

    if (!vehicle) {
      setMessage(refs.blockFormMessage, "Selecciona un vehiculo.", "error");
      return;
    }

    const normalizedRange = normalizeDateRange(refs.blockStart.value, refs.blockEnd.value);

    if (!normalizedRange) {
      setMessage(refs.blockFormMessage, "Selecciona al menos una fecha.", "error");
      return;
    }

    vehicle.blocks.push({
      id: createId("block"),
      start: normalizedRange.start,
      end: normalizedRange.end,
      note: refs.blockNote.value.trim()
    });

    vehicle.blocks = sortBlocks(vehicle.blocks);
    refs.blockStart.value = "";
    refs.blockEnd.value = "";
    refs.blockNote.value = "";
    saveState();
    renderPublic();
    renderAdmin();
    setMessage(refs.blockFormMessage, "Fechas bloqueadas.", "success");
  });

  refs.blockList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-block]");

    if (!deleteButton) {
      return;
    }

    const vehicleId = deleteButton.getAttribute("data-vehicle-id");
    const blockId = deleteButton.getAttribute("data-delete-block");
    const vehicle = findVehicleById(vehicleId);

    if (!vehicle) {
      return;
    }

    vehicle.blocks = vehicle.blocks.filter((block) => block.id !== blockId);
    saveState();
    renderPublic();
    renderAdmin();
  });

  refs.calendarPrevBtn.addEventListener("click", () => {
    state.ui.calendarMonth = addMonths(state.ui.calendarMonth, -1);
    renderCalendar();
  });

  refs.calendarNextBtn.addEventListener("click", () => {
    state.ui.calendarMonth = addMonths(state.ui.calendarMonth, 1);
    renderCalendar();
  });
}

function renderPublic() {
  const filters = getPublicFilters();
  const vehiclesWithState = state.data.vehicles.map((vehicle) => ({
    vehicle,
    availability: getVehicleAvailability(vehicle, filters.range)
  }));

  const visibleVehicles = vehiclesWithState.filter(({ vehicle }) => {
    const matchesType = filters.type === "all" || vehicle.type === filters.type;
    const haystack = [
      vehicle.name,
      vehicle.location,
      vehicle.summary,
      vehicle.type,
      ...vehicle.features
    ].join(" ").toLowerCase();
    const matchesSearch = !filters.search || haystack.includes(filters.search);

    return matchesType && matchesSearch;
  });

  refs.fleetGrid.innerHTML = visibleVehicles.map(({ vehicle, availability }) => renderVehicleCard(vehicle, availability, filters)).join("");
  refs.emptyState.classList.toggle("hidden", visibleVehicles.length > 0);

  const activeVehicleState = visibleVehicles.find(({ vehicle }) => vehicle.id === state.ui.activeVehicleId) || null;
  const isDetailView = Boolean(activeVehicleState);
  refs.catalogSection.classList.toggle("is-detail-view", isDetailView);
  document.body.classList.toggle("is-vehicle-detail-view", isDetailView);
  refs.vehicleDetail.classList.toggle("hidden", !activeVehicleState);
  refs.vehicleDetail.innerHTML = activeVehicleState
    ? renderVehicleDetail(activeVehicleState.vehicle, activeVehicleState.availability, filters)
    : "";

  if (state.ui.activeVehicleId && !activeVehicleState) {
    resetVehicleDetailView();
    refs.catalogSection.classList.remove("is-detail-view");
    document.body.classList.remove("is-vehicle-detail-view");
  }
}

function handleVehicleGalleryControlClick(event) {
  const openButton = event.target.closest("[data-open-vehicle-detail]");
  const button = event.target.closest("[data-gallery-direction]");

  if (openButton) {
    openVehicleDetail(openButton.getAttribute("data-open-vehicle-detail"));
    return;
  }

  if (!button) {
    return;
  }

  const gallery = button.closest(".vehicle-media")?.querySelector(".vehicle-gallery");
  const direction = Number(button.getAttribute("data-gallery-direction"));

  if (!gallery || !direction) {
    return;
  }

  rotateGallery(gallery, direction);
}

function rotateGallery(gallery, direction) {
  const images = Array.from(gallery.querySelectorAll("[data-gallery-image]"));

  if (!images.length) {
    return;
  }

  const currentIndex = Number(gallery.dataset.galleryIndex || "0");
  const nextIndex = (currentIndex + direction + images.length) % images.length;
  setGalleryIndex(gallery, nextIndex);
}

function setGalleryIndex(gallery, nextIndex) {
  const images = Array.from(gallery.querySelectorAll("[data-gallery-image]"));
  const dots = Array.from(gallery.closest(".vehicle-media")?.querySelectorAll("[data-gallery-dot]") || []);

  gallery.dataset.galleryIndex = String(nextIndex);
  gallery.style.setProperty("--gallery-index", String(nextIndex));
  images.forEach((image, index) => {
    image.classList.toggle("is-active", index === nextIndex);
  });
  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === nextIndex);
  });
}

function openVehicleDetail(vehicleId) {
  const vehicle = findVehicleById(vehicleId);

  if (!vehicle) {
    return;
  }

  state.ui.activeVehicleId = vehicleId;
  state.ui.activeVehicleImageIndex = 0;
  state.ui.catalogReturnY = window.scrollY || 0;
  renderPublic();
  refs.catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeVehicleDetail(options = {}) {
  const returnY = state.ui.catalogReturnY || 0;
  state.ui.activeVehicleId = null;
  state.ui.activeVehicleImageIndex = 0;
  state.ui.catalogReturnY = 0;
  renderPublic();

  if (options.restoreScroll) {
    window.setTimeout(() => {
      window.scrollTo({ top: returnY, behavior: "smooth" });
    }, 0);
  }
}

function resetVehicleDetailView() {
  state.ui.activeVehicleId = null;
  state.ui.activeVehicleImageIndex = 0;
  state.ui.catalogReturnY = 0;
  refs.catalogSection.classList.remove("is-detail-view");
  document.body.classList.remove("is-vehicle-detail-view");
  refs.vehicleDetail.classList.add("hidden");
  refs.vehicleDetail.innerHTML = "";
}

function handleVehicleDetailClick(event) {
  const closeButton = event.target.closest("[data-close-vehicle-detail]");
  const directionButton = event.target.closest("[data-detail-gallery-direction]");
  const thumbnailButton = event.target.closest("[data-detail-image-index]");

  if (closeButton) {
    closeVehicleDetail({ restoreScroll: true });
    return;
  }

  if (directionButton) {
    rotateVehicleDetailImage(Number(directionButton.getAttribute("data-detail-gallery-direction")));
    return;
  }

  if (thumbnailButton) {
    state.ui.activeVehicleImageIndex = Number(thumbnailButton.getAttribute("data-detail-image-index")) || 0;
    renderPublic();
    refs.vehicleDetail.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function rotateVehicleDetailImage(direction) {
  const vehicle = findVehicleById(state.ui.activeVehicleId);

  if (!vehicle || !direction) {
    return;
  }

  const imageCount = getVehicleGalleryImages(vehicle).length;

  if (!imageCount) {
    return;
  }

  state.ui.activeVehicleImageIndex = (state.ui.activeVehicleImageIndex + direction + imageCount) % imageCount;
  renderPublic();
  refs.vehicleDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderVehicleCard(vehicle, availability, filters) {
  const typeText = getTypeLabel(vehicle.type);
  const statusClass = availability.isAvailable ? "is-available" : "is-unavailable";
  const statusText = availability.isAvailable ? "Disponible" : "No disponible";
  const actionLabel = availability.isAvailable ? "Consultar por WhatsApp" : "Pedir alternativa";
  const whatsappUrl = buildVehicleWhatsappUrl(vehicle, availability, filters);
  const blockHint = availability.isAvailable
    ? getAvailableHint(availability, filters)
    : getUnavailableHint(availability, filters);
  const images = getVehicleImages(vehicle);
  const galleryImages = getVehicleGalleryImages(vehicle);

  return `
    <article class="vehicle-card ${availability.isAvailable ? "is-available" : "is-unavailable"}">
      <div class="vehicle-media">
        <div class="vehicle-badges">
          <span class="vehicle-badge">${escapeHtml(typeText)}</span>
          <span class="vehicle-status ${statusClass}">${escapeHtml(statusText)}</span>
        </div>
        <div class="vehicle-gallery" aria-label="Fotos de ${escapeAttribute(vehicle.name)}" tabindex="0" data-gallery-index="0" style="--gallery-index: 0">
          ${galleryImages.map((image, index) => `
            <img
              class="${index === 0 ? "is-active" : ""}"
              data-gallery-image
              src="${escapeAttribute(image)}"
              alt="${escapeAttribute(`${vehicle.name} - foto ${index + 1}`)}"
              loading="${index === 0 ? "eager" : "lazy"}"
            >
          `).join("")}
        </div>
        ${images.length > 1 ? `
          <span class="vehicle-photo-count">${escapeHtml(`${images.length} fotos`)}</span>
          <div class="vehicle-gallery-controls">
            <button type="button" data-gallery-direction="-1" aria-label="Foto anterior">&lt;</button>
            <button type="button" data-gallery-direction="1" aria-label="Foto siguiente">&gt;</button>
          </div>
          <div class="vehicle-gallery-dots" aria-hidden="true">
            ${images.map((image, index) => `<span class="${index === 0 ? "is-active" : ""}" data-gallery-dot></span>`).join("")}
          </div>
        ` : ""}
      </div>

      <div class="vehicle-content">
        <div class="vehicle-title">
          <div>
            <h3>
              <button type="button" class="vehicle-name-link" data-open-vehicle-detail="${escapeAttribute(vehicle.id)}">
                ${escapeHtml(vehicle.name)}
              </button>
            </h3>
            <p class="vehicle-hint">${escapeHtml(vehicle.location)}</p>
          </div>
          <span class="vehicle-price">${escapeHtml(formatPrice(vehicle.pricePerMonth))}</span>
        </div>

        <p class="vehicle-copy">${escapeHtml(vehicle.summary)}</p>

        <dl class="vehicle-meta">
          <div>
            <dt>Plazas</dt>
            <dd>${escapeHtml(String(vehicle.passengers))}</dd>
          </div>
          <div>
            <dt>Transmision</dt>
            <dd>${escapeHtml(vehicle.transmission)}</dd>
          </div>
          <div>
            <dt>Combustible</dt>
            <dd>${escapeHtml(vehicle.fuel)}</dd>
          </div>
          <div>
            <dt>Bloqueos</dt>
            <dd>${escapeHtml(String(vehicle.blocks.length))}</dd>
          </div>
        </dl>

        <ul class="feature-list">
          ${vehicle.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
        </ul>

        <p class="vehicle-status-copy">${escapeHtml(blockHint)}</p>

        <div class="vehicle-actions">
          <a class="vehicle-action primary" href="${escapeAttribute(whatsappUrl)}" target="_blank" rel="noreferrer">
            ${escapeHtml(actionLabel)}
          </a>
          <a class="vehicle-action secondary" href="#proceso">
            Como reservar
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderVehicleDetail(vehicle, availability, filters) {
  const images = getVehicleGalleryImages(vehicle);
  const imageIndex = Math.min(state.ui.activeVehicleImageIndex, images.length - 1);
  const activeImage = images[imageIndex] || createVehiclePlaceholder(vehicle);
  const whatsappUrl = buildVehicleWhatsappUrl(vehicle, availability, filters);
  const actionLabel = availability.isAvailable ? "Consultar por WhatsApp" : "Pedir alternativa";
  const blockHint = availability.isAvailable
    ? getAvailableHint(availability, filters)
    : getUnavailableHint(availability, filters);

  return `
    <article class="vehicle-detail-card">
      <button class="vehicle-detail-back" type="button" data-close-vehicle-detail>
        Volver al catalogo
      </button>

      <div class="vehicle-detail-layout">
        <div class="vehicle-detail-media">
          <img src="${escapeAttribute(activeImage)}" alt="${escapeAttribute(`${vehicle.name} - foto ampliada`)}">
          ${images.length > 1 ? `
            <div class="vehicle-detail-controls">
              <button type="button" data-detail-gallery-direction="-1" aria-label="Foto anterior">&lt;</button>
              <span>${escapeHtml(`${imageIndex + 1} / ${images.length}`)}</span>
              <button type="button" data-detail-gallery-direction="1" aria-label="Foto siguiente">&gt;</button>
            </div>
          ` : ""}
        </div>

        <div class="vehicle-detail-content">
          <p class="eyebrow">${escapeHtml(getTypeLabel(vehicle.type))}</p>
          <h3>${escapeHtml(vehicle.name)}</h3>
          <p class="vehicle-hint">${escapeHtml(vehicle.location)}</p>
          <p class="vehicle-detail-price">${escapeHtml(formatPrice(vehicle.pricePerMonth))}</p>
          <p>${escapeHtml(vehicle.summary)}</p>

          <dl class="vehicle-meta">
            <div>
              <dt>Plazas</dt>
              <dd>${escapeHtml(String(vehicle.passengers))}</dd>
            </div>
            <div>
              <dt>Transmision</dt>
              <dd>${escapeHtml(vehicle.transmission)}</dd>
            </div>
            <div>
              <dt>Combustible</dt>
              <dd>${escapeHtml(vehicle.fuel)}</dd>
            </div>
            <div>
              <dt>Bloqueos</dt>
              <dd>${escapeHtml(String(vehicle.blocks.length))}</dd>
            </div>
          </dl>

          <ul class="feature-list">
            ${vehicle.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
          </ul>

          <p class="vehicle-status-copy">${escapeHtml(blockHint)}</p>

          <div class="vehicle-actions">
            <a class="vehicle-action primary" href="${escapeAttribute(whatsappUrl)}" target="_blank" rel="noreferrer">
              ${escapeHtml(actionLabel)}
            </a>
            <button class="vehicle-action secondary" type="button" data-close-vehicle-detail>
              Regresar
            </button>
          </div>
        </div>
      </div>

      ${images.length > 1 ? `
        <div class="vehicle-detail-thumbs" aria-label="Fotos del vehiculo">
          ${images.map((image, index) => `
            <button
              type="button"
              class="${index === imageIndex ? "is-active" : ""}"
              data-detail-image-index="${index}"
              aria-label="${escapeAttribute(`Ver foto ${index + 1}`)}"
            >
              <img src="${escapeAttribute(image)}" alt="${escapeAttribute(`Miniatura ${index + 1} de ${vehicle.name}`)}">
            </button>
          `).join("")}
        </div>
      ` : ""}
    </article>
  `;
}

function getVehicleGalleryImages(vehicle) {
  const images = getVehicleImages(vehicle);
  return images.length ? images : [createVehiclePlaceholder(vehicle)];
}

function renderAdmin() {
  if (!state.ui.isAdminAuthenticated) {
    return;
  }

  renderSyncStatus();
  refs.settingsWhatsapp.value = state.data.settings.whatsappNumber;
  refs.settingsPassword.value = "";

  const editingVehicle = state.ui.editingVehicleId ? findVehicleById(state.ui.editingVehicleId) : null;

  if (editingVehicle) {
    refs.vehicleId.value = editingVehicle.id;
    refs.vehicleName.value = editingVehicle.name;
    refs.vehicleType.value = editingVehicle.type;
    refs.vehiclePrice.value = String(editingVehicle.pricePerMonth);
    refs.vehicleLocation.value = editingVehicle.location;
    refs.vehiclePassengers.value = String(editingVehicle.passengers);
    refs.vehicleTransmission.value = editingVehicle.transmission;
    refs.vehicleFuel.value = editingVehicle.fuel;
    refs.vehicleImageFile.value = "";
    setCurrentVehicleImages(getVehicleImages(editingVehicle));
    refs.vehicleSummary.value = editingVehicle.summary;
    refs.vehicleFeatures.value = editingVehicle.features.join(", ");
  } else {
    resetVehicleForm();
  }

  refs.adminVehicleList.innerHTML = state.data.vehicles.length
    ? state.data.vehicles.map(renderAdminVehicleItem).join("")
    : `<p class="helper-text">No hay vehiculos en el catalogo.</p>`;

  renderBlocksSection();
}

function renderSyncStatus() {
  const statusElements = [refs.loginSyncStatus, refs.syncStatus].filter(Boolean);

  if (!statusElements.length) {
    return;
  }

  if (state.sync.status === "local") {
    setSyncStatusMessage(
      statusElements,
      "Modo local: los cambios solo quedan en este dispositivo. Configura Firebase para sincronizar todos.",
      ""
    );
    return;
  }

  if (state.sync.status === "connecting") {
    setSyncStatusMessage(statusElements, "Conectando sincronizacion remota...", "");
    return;
  }

  if (state.sync.status === "pending") {
    setSyncStatusMessage(statusElements, "Cambio guardado localmente. Se enviara cuando la base remota este lista.", "");
    return;
  }

  if (state.sync.status === "empty") {
    setSyncStatusMessage(
      statusElements,
      "Base remota conectada, pero vacia. Entra como administrador y guarda un cambio para publicarla.",
      ""
    );
    return;
  }

  if (state.sync.status === "saving" || state.sync.isSaving) {
    setSyncStatusMessage(statusElements, "Guardando cambios compartidos...", "");
    return;
  }

  if (state.sync.status === "error") {
    setSyncStatusMessage(statusElements, `Sincronizacion remota con error: ${state.sync.errorMessage}`, "error");
    return;
  }

  setSyncStatusMessage(
    statusElements,
    "Sincronizacion remota activa. Los cambios se actualizan en todos los dispositivos.",
    "success"
  );
}

function setSyncStatusMessage(elements, message, type) {
  elements.forEach((element) => {
    setMessage(element, message, type);
  });
}

function renderAdminVehicleItem(vehicle) {
  const availability = getVehicleAvailability(vehicle, null);
  const currentStatus = availability.isAvailable ? "Libre hoy" : "Ocupado hoy";
  const imageCount = getVehicleImages(vehicle).length;

  return `
    <article class="admin-vehicle-item">
      <div class="admin-vehicle-top">
        <div>
          <h4>${escapeHtml(vehicle.name)}</h4>
          <div class="admin-vehicle-meta">
            <span>${escapeHtml(getTypeLabel(vehicle.type))}</span>
            <span>${escapeHtml(formatPrice(vehicle.pricePerMonth))}</span>
            <span>${escapeHtml(vehicle.location)}</span>
            <span>${escapeHtml(currentStatus)}</span>
            <span>${escapeHtml(`${imageCount} ${imageCount === 1 ? "foto" : "fotos"}`)}</span>
          </div>
        </div>

        <div class="admin-actions">
          <button class="mini-button" type="button" data-edit-vehicle="${escapeAttribute(vehicle.id)}">
            Editar
          </button>
          <button class="mini-button" type="button" data-focus-blocks="${escapeAttribute(vehicle.id)}">
            Bloqueos
          </button>
          <button class="mini-button danger" type="button" data-delete-vehicle="${escapeAttribute(vehicle.id)}">
            Eliminar
          </button>
        </div>
      </div>
      <p class="helper-text">${escapeHtml(vehicle.summary)}</p>
    </article>
  `;
}

function renderBlocksSection() {
  const selectedVehicleId = resolveSelectedBlockVehicleId();
  const vehicle = findVehicleById(selectedVehicleId);

  refs.blockVehicleSelect.innerHTML = state.data.vehicles
    .map((item) => `
      <option value="${escapeAttribute(item.id)}" ${item.id === selectedVehicleId ? "selected" : ""}>
        ${escapeHtml(item.name)}
      </option>
    `)
    .join("");

  refs.blockVehicleSelect.disabled = state.data.vehicles.length === 0;
  refs.blockStart.disabled = state.data.vehicles.length === 0;
  refs.blockEnd.disabled = state.data.vehicles.length === 0;
  refs.blockNote.disabled = state.data.vehicles.length === 0;

  if (!vehicle) {
    refs.calendarLabel.textContent = "Sin vehiculo seleccionado";
    refs.calendarDays.innerHTML = "";
    refs.blockList.innerHTML = `<p class="helper-text">Anade un vehiculo para usar el calendario.</p>`;
    return;
  }

  refs.blockList.innerHTML = vehicle.blocks.length
    ? sortBlocks(vehicle.blocks).map((block) => renderBlockItem(vehicle, block)).join("")
    : `<p class="helper-text">Este vehiculo no tiene fechas bloqueadas.</p>`;

  renderCalendar();
}

function renderBlockItem(vehicle, block) {
  return `
    <article class="block-item">
      <div class="block-top">
        <div>
          <h4>${escapeHtml(formatDateRange(block.start, block.end))}</h4>
          <p>${escapeHtml(block.note || "Bloqueo sin nota")}</p>
        </div>
        <button
          class="mini-button danger"
          type="button"
          data-delete-block="${escapeAttribute(block.id)}"
          data-vehicle-id="${escapeAttribute(vehicle.id)}"
        >
          Quitar
        </button>
      </div>
    </article>
  `;
}

function renderCalendar() {
  const selectedVehicle = findVehicleById(resolveSelectedBlockVehicleId());

  if (!selectedVehicle) {
    refs.calendarLabel.textContent = "Sin vehiculo seleccionado";
    refs.calendarDays.innerHTML = "";
    return;
  }

  const monthStart = startOfMonth(state.ui.calendarMonth);
  refs.calendarLabel.textContent = formatMonthLabel(monthStart);
  const todayIso = toIsoDate(new Date());
  const firstDayIndex = (monthStart.getDay() + 6) % 7;
  const daysInMonth = getDaysInMonth(monthStart);
  const cells = [];

  for (let index = 0; index < firstDayIndex; index += 1) {
    cells.push(`<div class="calendar-day is-offset" aria-hidden="true"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    const iso = toIsoDate(date);
    const dayBlocks = selectedVehicle.blocks.filter((block) => rangesOverlap(iso, iso, block.start, block.end));
    const classes = [
      "calendar-day",
      iso === todayIso ? "is-today" : "",
      dayBlocks.length ? "is-blocked" : ""
    ].filter(Boolean).join(" ");
    const note = dayBlocks[0]?.note || (dayBlocks.length ? "Bloqueado" : "");

    cells.push(`
      <div class="${classes}">
        <strong>${day}</strong>
        ${note ? `<small>${escapeHtml(note)}</small>` : ""}
      </div>
    `);
  }

  refs.calendarDays.innerHTML = cells.join("");
}

function loadState() {
  const savedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!savedValue) {
    const freshState = createInitialState();
    persistLocalState(freshState);
    return freshState;
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    return normalizeState(parsedValue);
  } catch (error) {
    const freshState = createInitialState();
    persistLocalState(freshState);
    return freshState;
  }
}

function saveState() {
  try {
    persistLocalState(state.data);
  } catch (error) {
    // Local cache must never block Firebase persistence or the admin workflow.
  }

  void saveRemoteState().catch(() => {});
}

function persistLocalState(data) {
  const normalizedState = normalizeState(data);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
    return;
  } catch (error) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createLocalCacheState(normalizedState)));
      return;
    } catch (cacheError) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (removeError) {
        // Ignore storage errors so Firebase sync can still continue.
      }
    }
  }
}

function createLocalCacheState(data) {
  const normalizedState = normalizeState(data);

  return {
    ...normalizedState,
    vehicles: normalizedState.vehicles.map((vehicle) => {
      const lightweightImages = getVehicleImages(vehicle).filter((image) => !isInlineImageData(image));

      return {
        ...vehicle,
        image: lightweightImages[0] || "",
        images: lightweightImages
      };
    })
  };
}

async function initRemoteSync() {
  const firebaseConfig = getFirebaseConfig();

  if (!firebaseConfig) {
    state.sync.status = "local";
    renderSyncStatus();
    return;
  }

  state.sync.isConfigured = true;
  state.sync.status = "connecting";
  renderSyncStatus();

  try {
    await loadFirebaseSdk();

    if (!window.firebase) {
      throw new Error("Firebase no esta disponible.");
    }

    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }

    state.sync.auth = window.firebase.auth();
    state.sync.databaseRef = window.firebase.database().ref(FIREBASE_DATABASE_PATH);
    state.sync.databaseRef.on("value", handleRemoteSnapshot, handleRemoteError);
  } catch (error) {
    state.sync.status = "error";
    state.sync.errorMessage = getErrorMessage(error);
    renderSyncStatus();
  }
}

function handleRemoteSnapshot(snapshot) {
  state.sync.isReady = true;
  state.sync.isRemoteEmpty = !snapshot.exists();

  if (state.sync.hasPendingLocalSave && state.sync.auth?.currentUser) {
    state.sync.lastRemoteJson = snapshot.exists()
      ? JSON.stringify(createRemoteState(normalizeState(snapshot.val())))
      : "";
    void saveRemoteState({ force: true }).catch(() => {});
    return;
  }

  if (!snapshot.exists()) {
    state.sync.status = "empty";
    renderSyncStatus();
    return;
  }

  const remoteState = normalizeState(snapshot.val());
  state.sync.lastRemoteJson = JSON.stringify(createRemoteState(remoteState));
  state.sync.status = "ready";
  state.sync.errorMessage = "";
  applySharedState(remoteState);
}

function handleRemoteError(error) {
  state.sync.status = "error";
  state.sync.errorMessage = getErrorMessage(error);
  renderSyncStatus();
}

async function saveRemoteState(options = {}) {
  if (!state.sync.isConfigured) {
    return;
  }

  if (!state.sync.databaseRef || !state.sync.isReady) {
    state.sync.hasPendingLocalSave = true;
    state.sync.status = "pending";
    renderSyncStatus();
    return;
  }

  const remoteState = createRemoteState(state.data);
  const remoteJson = JSON.stringify(remoteState);

  if (!options.force && remoteJson === state.sync.lastRemoteJson) {
    renderSyncStatus();
    return;
  }

  state.sync.isSaving = true;
  state.sync.status = "saving";
  state.sync.errorMessage = "";
  state.sync.hasPendingLocalSave = false;
  renderSyncStatus();

  const currentSave = state.sync.pendingSave
    .catch(() => {})
    .then(async () => {
      await state.sync.databaseRef.set(remoteState);
      state.sync.lastRemoteJson = remoteJson;
      state.sync.isRemoteEmpty = false;
      state.sync.hasPendingLocalSave = false;
      state.sync.status = "ready";
      state.sync.errorMessage = "";
    });

  state.sync.pendingSave = currentSave;

  try {
    await currentSave;
  } catch (error) {
    state.sync.status = "error";
    state.sync.errorMessage = getErrorMessage(error);
    state.sync.hasPendingLocalSave = true;
    throw error;
  } finally {
    state.sync.isSaving = false;
    renderSyncStatus();
  }
}

function applySharedState(nextState) {
  state.data = normalizeState(nextState);
  persistLocalState(state.data);
  reconcileUiWithData();
  syncGlobalWhatsappLinks();
  renderPublic();
  renderAdmin();
}

function reconcileUiWithData() {
  if (state.ui.editingVehicleId && !state.data.vehicles.some((vehicle) => vehicle.id === state.ui.editingVehicleId)) {
    state.ui.editingVehicleId = null;
  }

  if (!state.data.vehicles.some((vehicle) => vehicle.id === state.ui.blockVehicleId)) {
    state.ui.blockVehicleId = state.data.vehicles[0]?.id ?? null;
  }
}

function createRemoteState(data) {
  const normalizedState = normalizeState(data);

  return {
    settings: {
      whatsappNumber: normalizedState.settings.whatsappNumber
    },
    vehicles: normalizedState.vehicles
  };
}

function getFirebaseConfig() {
  const rawConfig = window.ALQUILO_AQUI_FIREBASE_CONFIG;

  if (!rawConfig || typeof rawConfig !== "object") {
    return null;
  }

  const config = FIREBASE_CONFIG_KEYS.reduce((accumulator, key) => {
    const value = rawConfig[key];

    if (typeof value === "string" && value.trim()) {
      accumulator[key] = value.trim();
    }

    return accumulator;
  }, {});

  const requiredKeys = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"];
  return requiredKeys.every((key) => config[key]) ? config : null;
}

function getRemoteAdminEmail() {
  return String(
    window.ALQUILO_AQUI_ADMIN_EMAIL ||
    window.ALQUILO_AQUI_FIREBASE_CONFIG?.adminEmail ||
    ""
  ).trim();
}

async function loadFirebaseSdk() {
  if (window.firebase?.database && window.firebase?.auth) {
    return;
  }

  const baseUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
  await loadScriptOnce(`${baseUrl}/firebase-app-compat.js`);
  await loadScriptOnce(`${baseUrl}/firebase-auth-compat.js`);
  await loadScriptOnce(`${baseUrl}/firebase-database-compat.js`);
}

function loadScriptOnce(src) {
  window.__alquiloAquiScriptPromises = window.__alquiloAquiScriptPromises || {};

  if (window.__alquiloAquiScriptPromises[src]) {
    return window.__alquiloAquiScriptPromises[src];
  }

  window.__alquiloAquiScriptPromises[src] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}.`));
    document.head.appendChild(script);
  });

  return window.__alquiloAquiScriptPromises[src];
}

async function authenticateAdmin(password) {
  if (!state.sync.isConfigured) {
    if (password !== state.data.settings.adminPassword) {
      const error = new Error("Clave incorrecta.");
      error.code = "local/wrong-password";
      throw error;
    }

    return;
  }

  await state.sync.initPromise;

  const adminEmail = getRemoteAdminEmail();

  if (!adminEmail) {
    throw new Error("Falta ALQUILO_AQUI_ADMIN_EMAIL en config.js.");
  }

  if (!state.sync.auth) {
    throw new Error("No se pudo conectar con Firebase Auth.");
  }

  await state.sync.auth.signInWithEmailAndPassword(adminEmail, password);

  if (state.sync.isRemoteEmpty || state.sync.hasPendingLocalSave) {
    await saveRemoteState({ force: true });
  }
}

function signOutRemoteAdmin() {
  if (!state.sync.auth?.currentUser) {
    return;
  }

  void state.sync.auth.signOut().catch(() => {});
}

async function updateAdminPassword(newPassword) {
  if (!newPassword) {
    return;
  }

  if (!state.sync.isConfigured) {
    state.data.settings.adminPassword = newPassword;
    return;
  }

  await state.sync.initPromise;

  if (!state.sync.auth?.currentUser) {
    throw new Error("Vuelve a entrar al panel para cambiar la clave.");
  }

  await state.sync.auth.currentUser.updatePassword(newPassword);
}

function getAdminAuthErrorMessage(error) {
  const code = error?.code || "";

  if (code === "local/wrong-password" || code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Clave incorrecta.";
  }

  if (code === "auth/user-not-found") {
    return "El usuario administrador de Firebase no existe.";
  }

  if (code === "auth/network-request-failed") {
    return "No se pudo conectar. Revisa la conexion e intentalo otra vez.";
  }

  if (code === "auth/requires-recent-login") {
    return "Vuelve a entrar al panel y cambia la clave de nuevo.";
  }

  if (code === "auth/weak-password") {
    return "La nueva clave debe tener al menos 6 caracteres.";
  }

  return getErrorMessage(error) || "No se pudo validar la clave.";
}

function getErrorMessage(error) {
  return String(error?.message || error || "Error desconocido.");
}

function createInitialState() {
  return {
    settings: {
      whatsappNumber: "34604982625",
      adminPassword: DEFAULT_ADMIN_PASSWORD
    },
    vehicles: createDemoVehicles()
  };
}

function normalizeState(rawState) {
  const fallbackState = createInitialState();
  const settings = rawState?.settings || {};
  const vehicles = Array.isArray(rawState?.vehicles)
    ? rawState.vehicles
    : rawState?.vehicles && typeof rawState.vehicles === "object"
      ? Object.values(rawState.vehicles)
      : [];
  const fallbackAdminPassword =
    state.data?.settings?.adminPassword ||
    getSavedAdminPassword() ||
    fallbackState.settings.adminPassword;

  return {
    settings: {
      whatsappNumber: normalizeWhatsappNumber(settings.whatsappNumber) || fallbackState.settings.whatsappNumber,
      adminPassword: typeof settings.adminPassword === "string" && settings.adminPassword.trim()
        ? settings.adminPassword
        : fallbackAdminPassword
    },
    vehicles: vehicles.length ? vehicles.map(normalizeVehicle).filter(Boolean) : fallbackState.vehicles
  };
}

function getSavedAdminPassword() {
  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : null;
    return typeof parsedValue?.settings?.adminPassword === "string" && parsedValue.settings.adminPassword.trim()
      ? parsedValue.settings.adminPassword
      : "";
  } catch (error) {
    return "";
  }
}

function normalizeVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object") {
    return null;
  }

  const images = normalizeVehicleImages(vehicle.images, vehicle.image);
  const legacyDailyPrice = Number(vehicle.pricePerDay);
  const normalizedMonthlyPrice = Number(vehicle.pricePerMonth) > 0
    ? Number(vehicle.pricePerMonth)
    : legacyDailyPrice > 0
      ? legacyDailyPrice * 30
      : 1350;

  return {
    id: String(vehicle.id || createId("veh")),
    name: String(vehicle.name || "Vehiculo sin nombre"),
    type: ["coche", "suv", "furgoneta"].includes(vehicle.type) ? vehicle.type : "coche",
    pricePerMonth: normalizedMonthlyPrice,
    location: String(vehicle.location || "Sin ciudad"),
    passengers: Number(vehicle.passengers) > 0 ? Number(vehicle.passengers) : 5,
    transmission: String(vehicle.transmission || "Manual"),
    fuel: String(vehicle.fuel || "Gasolina"),
    image: images[0] || "",
    images,
    summary: String(vehicle.summary || "Consulta por WhatsApp para confirmar condiciones."),
    features: Array.isArray(vehicle.features)
      ? vehicle.features.map((feature) => String(feature).trim()).filter(Boolean)
      : ["Consulta directa"],
    blocks: Array.isArray(vehicle.blocks)
      ? sortBlocks(vehicle.blocks.map((block) => normalizeBlock(block)).filter(Boolean))
      : []
  };
}

function getVehicleImages(vehicle) {
  return normalizeVehicleImages(vehicle?.images, vehicle?.image);
}

function normalizeVehicleImages(images, legacyImage = "") {
  const rawImages = Array.isArray(images)
    ? images
    : images && typeof images === "object"
      ? Object.values(images)
      : [];
  const normalizedImages = rawImages.map((image) => String(image || "").trim()).filter(Boolean);
  const normalizedLegacyImage = String(legacyImage || "").trim();

  if (normalizedLegacyImage && !normalizedImages.includes(normalizedLegacyImage)) {
    normalizedImages.unshift(normalizedLegacyImage);
  }

  return normalizedImages;
}

function normalizeBlock(block) {
  if (!block || typeof block !== "object") {
    return null;
  }

  const normalizedRange = normalizeDateRange(block.start, block.end);

  if (!normalizedRange) {
    return null;
  }

  return {
    id: String(block.id || createId("block")),
    start: normalizedRange.start,
    end: normalizedRange.end,
    note: String(block.note || "")
  };
}

function createDemoVehicles() {
  const today = new Date();

  return [
    {
      id: createId("veh"),
      name: "Seat Ibiza Urban",
      type: "coche",
      pricePerMonth: 1380,
      location: "Madrid centro",
      passengers: 5,
      transmission: "Manual",
      fuel: "Gasolina",
      image: "",
      summary: "Compacto agil para ciudad y uso mensual con consumo contenido.",
      features: ["Bluetooth", "Aire", "Consumo bajo"],
      blocks: [
        createBlockFromOffset(today, 2, 5, "Reserva confirmada"),
        createBlockFromOffset(today, 15, 17, "Mantenimiento ligero")
      ]
    },
    {
      id: createId("veh"),
      name: "Peugeot 3008 Allure",
      type: "suv",
      pricePerMonth: 2160,
      location: "Getafe",
      passengers: 5,
      transmission: "Automatica",
      fuel: "Hibrido",
      image: "",
      summary: "SUV comodo para alquiler mensual, carretera y uso familiar con buen maletero.",
      features: ["Camara", "CarPlay", "Etiqueta ECO"],
      blocks: [
        createBlockFromOffset(today, 9, 12, "Salida larga")
      ]
    },
    {
      id: createId("veh"),
      name: "Citroen Berlingo Cargo",
      type: "furgoneta",
      pricePerMonth: 2370,
      location: "Alcorcon",
      passengers: 3,
      transmission: "Manual",
      fuel: "Diesel",
      image: "",
      summary: "Ideal para reparto y trabajo por meses con acceso comodo y carga amplia.",
      features: ["Carga amplia", "Puerta lateral", "Anclajes"],
      blocks: [
        createBlockFromOffset(today, -1, 1, "Uso interno"),
        createBlockFromOffset(today, 7, 8, "Reserva empresa")
      ]
    },
    {
      id: createId("veh"),
      name: "Renault Trafic Passenger",
      type: "furgoneta",
      pricePerMonth: 2850,
      location: "Leganes",
      passengers: 9,
      transmission: "Manual",
      fuel: "Diesel",
      image: "",
      summary: "Furgoneta de pasajeros para traslados y uso continuo con mucho espacio.",
      features: ["9 plazas", "Maletero", "USB"],
      blocks: []
    }
  ];
}

function createBlockFromOffset(baseDate, startOffset, endOffset, note) {
  return {
    id: createId("block"),
    start: toIsoDate(addDays(baseDate, startOffset)),
    end: toIsoDate(addDays(baseDate, endOffset)),
    note
  };
}

function getPublicFilters() {
  return {
    range: buildRentalRange(refs.filterStart.value, refs.filterTerm.value),
    term: refs.filterTerm.value,
    type: refs.filterType.value,
    search: refs.searchInput.value.trim().toLowerCase()
  };
}

function getVehicleAvailability(vehicle, range) {
  const effectiveRange = range || {
    start: toIsoDate(new Date()),
    end: toIsoDate(new Date())
  };
  const conflicts = vehicle.blocks.filter((block) =>
    rangesOverlap(effectiveRange.start, effectiveRange.end, block.start, block.end)
  );
  const nextBlock = sortBlocks(vehicle.blocks).find((block) => block.start > effectiveRange.end);

  return {
    isAvailable: conflicts.length === 0,
    conflicts: sortBlocks(conflicts),
    nextBlock
  };
}

function getAvailableHint(availability, filters) {
  if (filters.range) {
    return `Plazo solicitado libre: ${formatRentalSelection(filters.range, filters.term)}.`;
  }

  if (availability.nextBlock) {
    return `Proximo bloqueo ${formatDateRange(availability.nextBlock.start, availability.nextBlock.end)}.`;
  }

  return "Selecciona inicio y plazo: 1 mes, 3 meses o 12 meses o mas.";
}

function getUnavailableHint(availability, filters) {
  const activeBlock = availability.conflicts[0];

  if (!activeBlock) {
    return "Consulta el inicio y el plazo en la ficha.";
  }

  if (filters.range) {
    return `Plazo solicitado ocupado. Bloqueado ${formatDateRange(activeBlock.start, activeBlock.end)}.`;
  }

  return `Bloqueado ${formatDateRange(activeBlock.start, activeBlock.end)}.`;
}

function buildVehicleWhatsappUrl(vehicle, availability, filters) {
  const phone = state.data.settings.whatsappNumber;
  const termLabel = getMonthlyTermLabel(filters.term);
  const messageParts = [
    `Hola, quiero consultar el ${vehicle.name}.`,
    filters.range
      ? `Plazo solicitado: ${formatRentalSelection(filters.range, filters.term)}.`
      : `Plazo deseado: ${termLabel}. Inicio flexible.`,
    availability.isAvailable
      ? "La ficha aparece libre para ese plazo."
      : "La ficha aparece ocupada para ese plazo y quiero una alternativa o una fecha libre.",
    `Precio publicado: ${formatPrice(vehicle.pricePerMonth)}.`
  ];

  return `https://wa.me/${phone}?text=${encodeURIComponent(messageParts.join(" "))}`;
}

function syncGlobalWhatsappLinks() {
  const phone = state.data.settings.whatsappNumber;
  const message = encodeURIComponent("Hola, quiero consultar un alquiler mensual con Alquilo Aqui.");
  const url = `https://wa.me/${phone}?text=${message}`;

  refs.heroWhatsappLink.href = url;
  refs.menuWhatsappLink.href = url;
  refs.footerWhatsappLink.href = url;
  refs.floatingWhatsappLink.href = url;
}

function openMenu() {
  refs.siteMenu.classList.remove("hidden");
  refs.siteMenu.setAttribute("aria-hidden", "false");
  refs.menuToggle.setAttribute("aria-expanded", "true");
  updateOverlayState();
}

function closeMenu() {
  refs.siteMenu.classList.add("hidden");
  refs.siteMenu.setAttribute("aria-hidden", "true");
  refs.menuToggle.setAttribute("aria-expanded", "false");
  updateOverlayState();
}

function openLoginModal() {
  refs.adminLoginModal.classList.remove("hidden");
  refs.adminLoginModal.setAttribute("aria-hidden", "false");
  updateOverlayState();
  window.setTimeout(() => refs.adminPasswordInput.focus(), 30);
}

function closeLoginModal() {
  refs.adminLoginModal.classList.add("hidden");
  refs.adminLoginModal.setAttribute("aria-hidden", "true");
  refs.adminPasswordInput.value = "";
  setMessage(refs.adminLoginMessage, "");
  updateOverlayState();
}

function openAdminPanel() {
  renderAdmin();
  refs.adminPanelModal.classList.remove("hidden");
  refs.adminPanelModal.setAttribute("aria-hidden", "false");
  updateOverlayState();
}

function closeAdminPanel() {
  refs.adminPanelModal.classList.add("hidden");
  refs.adminPanelModal.setAttribute("aria-hidden", "true");
  updateOverlayState();
}

function updateOverlayState() {
  const hasOpenOverlay =
    !refs.siteMenu.classList.contains("hidden") ||
    !refs.adminLoginModal.classList.contains("hidden") ||
    !refs.adminPanelModal.classList.contains("hidden");
  document.body.classList.toggle("modal-open", hasOpenOverlay);
}

function resolveSelectedBlockVehicleId() {
  if (state.data.vehicles.some((vehicle) => vehicle.id === state.ui.blockVehicleId)) {
    return state.ui.blockVehicleId;
  }

  state.ui.blockVehicleId = state.data.vehicles[0]?.id ?? null;
  return state.ui.blockVehicleId;
}

async function readVehicleForm() {
  if (state.ui.vehicleImageSelectionPromise) {
    await state.ui.vehicleImageSelectionPromise;
  } else if (refs.vehicleImageFile.files?.length) {
    await queueVehicleImageSelection();
  }

  const images = await optimizeVehicleImagesForStorage(getCurrentVehicleImages());

  return {
    id: refs.vehicleId.value || "",
    name: refs.vehicleName.value.trim(),
    type: refs.vehicleType.value,
    pricePerMonth: Number(refs.vehiclePrice.value),
    location: refs.vehicleLocation.value.trim(),
    passengers: Number(refs.vehiclePassengers.value),
    transmission: refs.vehicleTransmission.value.trim(),
    fuel: refs.vehicleFuel.value.trim(),
    image: images[0] || "",
    images,
    summary: refs.vehicleSummary.value.trim(),
    features: refs.vehicleFeatures.value.split(",").map((item) => item.trim()).filter(Boolean)
  };
}

function resetVehicleForm() {
  refs.vehicleForm.reset();
  refs.vehicleId.value = "";
  refs.vehicleType.value = "coche";
  refs.vehicleImageFile.value = "";
  setCurrentVehicleImages([]);
}

function queueVehicleImageSelection() {
  const selectionPromise = handleVehicleImageSelection();
  const queuedPromise = selectionPromise.finally(() => {
    if (state.ui.vehicleImageSelectionPromise === queuedPromise) {
      state.ui.vehicleImageSelectionPromise = null;
    }
  });

  state.ui.vehicleImageSelectionPromise = queuedPromise;
  return queuedPromise;
}

async function handleVehicleImageSelection() {
  const files = Array.from(refs.vehicleImageFile.files || []);

  if (!files.length) {
    updateVehicleImagesList();
    return;
  }

  if (files.some((file) => !isSupportedVehicleImage(file))) {
    refs.vehicleImageFile.value = "";
    throw new Error("Solo se permiten archivos JPG o PNG.");
  }

  try {
    setMessage(refs.vehicleFormMessage, `Procesando ${files.length} ${files.length === 1 ? "foto" : "fotos"}...`);
    const images = [];

    for (const file of files) {
      images.push(await optimizeVehicleImageFile(file));
    }

    addCurrentVehicleImages(images);
    refs.vehicleImageFile.value = "";
    setMessage(
      refs.vehicleFormMessage,
      `${images.length} ${images.length === 1 ? "foto anadida" : "fotos anadidas"}.`,
      "success"
    );
  } catch (error) {
    refs.vehicleImageFile.value = "";
    setMessage(refs.vehicleFormMessage, "No se pudo cargar la imagen seleccionada.", "error");
    throw error;
  }
}

function clearVehicleImage() {
  refs.vehicleImageFile.value = "";
  setCurrentVehicleImages([]);
  closeVehicleImageCropper();
}

function getCurrentVehicleImages() {
  return [...state.ui.currentVehicleImages];
}

function setCurrentVehicleImages(images) {
  state.ui.currentVehicleImages = normalizeVehicleImages(images);
  updateVehicleImagesList();

  if (
    state.ui.croppingImageIndex !== null &&
    !state.ui.currentVehicleImages[state.ui.croppingImageIndex]
  ) {
    closeVehicleImageCropper();
  }
}

function addCurrentVehicleImages(images) {
  setCurrentVehicleImages([...getCurrentVehicleImages(), ...images]);
}

function updateVehicleImagesList() {
  const images = getCurrentVehicleImages();

  refs.vehicleImagesList.innerHTML = images.length
    ? images.map(renderVehicleImageItem).join("")
    : `<p class="image-upload-empty">Sin fotos subidas</p>`;
}

function renderVehicleImageItem(image, index) {
  return `
    <article class="image-upload-item ${index === 0 ? "is-primary" : ""}">
      <img src="${escapeAttribute(image)}" alt="${escapeAttribute(`Foto ${index + 1} del vehiculo`)}">
      <div class="image-upload-item-body">
        <strong>${escapeHtml(index === 0 ? `Foto ${index + 1} - principal` : `Foto ${index + 1}`)}</strong>
        <div class="image-upload-item-actions">
          ${index === 0 ? "" : `
            <button class="mini-button" type="button" data-set-primary-image="${index}">
              Principal
            </button>
          `}
          <button class="mini-button" type="button" data-crop-image="${index}">
            Ajustar recorte
          </button>
          <button class="mini-button danger" type="button" data-remove-image="${index}">
            Quitar
          </button>
        </div>
      </div>
    </article>
  `;
}

function handleVehicleImagesListClick(event) {
  const primaryButton = event.target.closest("[data-set-primary-image]");
  const cropButton = event.target.closest("[data-crop-image]");
  const removeButton = event.target.closest("[data-remove-image]");

  if (primaryButton) {
    moveVehicleImageToPrimary(Number(primaryButton.getAttribute("data-set-primary-image")));
    return;
  }

  if (cropButton) {
    openVehicleImageCropper(Number(cropButton.getAttribute("data-crop-image")));
    return;
  }

  if (removeButton) {
    removeCurrentVehicleImage(Number(removeButton.getAttribute("data-remove-image")));
  }
}

function moveVehicleImageToPrimary(index) {
  const images = getCurrentVehicleImages();

  if (!Number.isInteger(index) || index <= 0 || index >= images.length) {
    return;
  }

  const [selectedImage] = images.splice(index, 1);
  images.unshift(selectedImage);
  setCurrentVehicleImages(images);
  setMessage(refs.vehicleFormMessage, "Foto principal actualizada.", "success");
}

function removeCurrentVehicleImage(index) {
  const images = getCurrentVehicleImages();

  if (!Number.isInteger(index) || index < 0 || index >= images.length) {
    return;
  }

  images.splice(index, 1);
  setCurrentVehicleImages(images);
  setMessage(refs.vehicleFormMessage, "Foto eliminada.", "success");
}

function openVehicleImageCropper(index) {
  const images = getCurrentVehicleImages();

  if (!Number.isInteger(index) || index < 0 || index >= images.length) {
    return;
  }

  state.ui.croppingImageIndex = index;
  refs.vehicleImageCropZoom.value = "1";
  refs.vehicleImageCropX.value = "0";
  refs.vehicleImageCropY.value = "0";
  refs.vehicleImageCropper.classList.remove("hidden");
  refs.vehicleImageCropper.setAttribute("aria-hidden", "false");
  refs.vehicleImageCropImg.onload = updateVehicleImageCropPreview;
  refs.vehicleImageCropImg.src = images[index];

  if (refs.vehicleImageCropImg.complete) {
    updateVehicleImageCropPreview();
  }

  refs.vehicleImageCropper.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeVehicleImageCropper() {
  state.ui.croppingImageIndex = null;
  refs.vehicleImageCropper.classList.add("hidden");
  refs.vehicleImageCropper.setAttribute("aria-hidden", "true");
  refs.vehicleImageCropImg.onload = null;
  refs.vehicleImageCropImg.removeAttribute("src");
  refs.vehicleImageCropImg.removeAttribute("style");
}

function updateVehicleImageCropPreview() {
  const cropMetrics = getVehicleCropMetrics();

  if (!cropMetrics) {
    return;
  }

  refs.vehicleImageCropImg.style.width = `${cropMetrics.drawWidth}px`;
  refs.vehicleImageCropImg.style.height = `${cropMetrics.drawHeight}px`;
  refs.vehicleImageCropImg.style.transform = `translate(${cropMetrics.drawX}px, ${cropMetrics.drawY}px)`;
}

function applyVehicleImageCrop() {
  const index = state.ui.croppingImageIndex;
  const images = getCurrentVehicleImages();

  if (!Number.isInteger(index) || index < 0 || index >= images.length) {
    return;
  }

  const cropMetrics = getVehicleCropMetrics();
  const contextImage = refs.vehicleImageCropImg;

  if (!cropMetrics || !contextImage.naturalWidth || !contextImage.naturalHeight) {
    setMessage(refs.vehicleFormMessage, "No se pudo preparar el recorte.", "error");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = cropMetrics.outputWidth;
  canvas.height = cropMetrics.outputHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    setMessage(refs.vehicleFormMessage, "Tu navegador no pudo aplicar el recorte.", "error");
    return;
  }

  const scaleX = canvas.width / cropMetrics.stageWidth;
  const scaleY = canvas.height / cropMetrics.stageHeight;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    contextImage,
    cropMetrics.drawX * scaleX,
    cropMetrics.drawY * scaleY,
    cropMetrics.drawWidth * scaleX,
    cropMetrics.drawHeight * scaleY
  );

  images[index] = canvas.toDataURL("image/jpeg", VEHICLE_IMAGE_JPEG_QUALITY);
  setCurrentVehicleImages(images);
  closeVehicleImageCropper();
  setMessage(refs.vehicleFormMessage, "Recorte aplicado. Guarda el vehiculo para publicarlo.", "success");
}

function getVehicleCropMetrics() {
  if (state.ui.croppingImageIndex === null || !refs.vehicleImageCropImg.naturalWidth) {
    return null;
  }

  const stageRect = refs.vehicleImageCropStage.getBoundingClientRect();
  const stageWidth = stageRect.width || refs.vehicleImageCropStage.clientWidth;
  const stageHeight = stageRect.height || refs.vehicleImageCropStage.clientHeight;

  if (!stageWidth || !stageHeight) {
    return null;
  }

  const imageRatio = refs.vehicleImageCropImg.naturalWidth / refs.vehicleImageCropImg.naturalHeight;
  const stageRatio = stageWidth / stageHeight;
  const baseDimensions = imageRatio > stageRatio
    ? {
        width: stageHeight * imageRatio,
        height: stageHeight
      }
    : {
        width: stageWidth,
        height: stageWidth / imageRatio
      };
  const zoom = clamp(Number(refs.vehicleImageCropZoom.value) || 1, 1, 3);
  const offsetPercentX = clamp(Number(refs.vehicleImageCropX.value) || 0, -100, 100);
  const offsetPercentY = clamp(Number(refs.vehicleImageCropY.value) || 0, -100, 100);
  const drawWidth = baseDimensions.width * zoom;
  const drawHeight = baseDimensions.height * zoom;
  const maxOffsetX = Math.max(0, (drawWidth - stageWidth) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - stageHeight) / 2);
  const offsetX = (offsetPercentX / 100) * maxOffsetX;
  const offsetY = (offsetPercentY / 100) * maxOffsetY;

  return {
    stageWidth,
    stageHeight,
    drawWidth,
    drawHeight,
    drawX: (stageWidth - drawWidth) / 2 + offsetX,
    drawY: (stageHeight - drawHeight) / 2 + offsetY,
    outputWidth: VEHICLE_CROP_OUTPUT_WIDTH,
    outputHeight: VEHICLE_CROP_OUTPUT_HEIGHT
  };
}

function isSupportedVehicleImage(file) {
  return ["image/jpeg", "image/png"].includes(file.type);
}

async function optimizeVehicleImageFile(file) {
  if (!isSupportedVehicleImage(file)) {
    throw new Error("Solo se permiten archivos JPG o PNG.");
  }

  const imageDataUrl = await readFileAsDataUrl(file);
  return optimizeVehicleImageSource(imageDataUrl);
}

async function optimizeVehicleImagesForStorage(images) {
  const optimizedImages = [];

  for (const image of normalizeVehicleImages(images)) {
    if (!isInlineImageData(image) || image.length <= VEHICLE_IMAGE_INLINE_REOPTIMIZE_LENGTH) {
      optimizedImages.push(image);
      continue;
    }

    optimizedImages.push(await optimizeVehicleImageSource(image));
  }

  return optimizedImages;
}

async function optimizeVehicleImageSource(source) {
  const image = await loadImage(source);
  const dimensions = getScaledDimensions(image.width, image.height, VEHICLE_IMAGE_MAX_SIDE);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tu navegador no pudo preparar la imagen.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", VEHICLE_IMAGE_JPEG_QUALITY);
}

function isInlineImageData(image) {
  return String(image || "").startsWith("data:image/");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo abrir la imagen."));
    image.src = source;
  });
}

function getScaledDimensions(width, height, maxSide) {
  const largestSide = Math.max(width, height);

  if (largestSide <= maxSide) {
    return { width, height };
  }

  const scale = maxSide / largestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

function findVehicleById(vehicleId) {
  return state.data.vehicles.find((vehicle) => vehicle.id === vehicleId) || null;
}

function normalizeRentalFilters() {
  if (!MONTHLY_TERMS[refs.filterTerm.value]) {
    refs.filterTerm.value = "1";
  }
}

function buildRentalRange(start, termValue) {
  if (!start) {
    return null;
  }

  const startDate = new Date(`${start}T00:00:00`);
  const endDate = addMonthsKeepingDay(startDate, getMonthlyTermMonths(termValue));
  endDate.setDate(endDate.getDate() - 1);

  return {
    start: toIsoDate(startDate),
    end: toIsoDate(endDate)
  };
}

function getMonthlyTermLabel(termValue) {
  return MONTHLY_TERMS[termValue]?.label || MONTHLY_TERMS["1"].label;
}

function getMonthlyTermMonths(termValue) {
  return MONTHLY_TERMS[termValue]?.months || MONTHLY_TERMS["1"].months;
}

function formatRentalSelection(range, termValue) {
  return `${getMonthlyTermLabel(termValue)} desde ${formatDate(range.start)} hasta ${formatDate(range.end)}`;
}

function normalizeDateRange(start, end) {
  const startValue = start || end;
  const endValue = end || start;

  if (!startValue || !endValue) {
    return null;
  }

  if (startValue <= endValue) {
    return { start: startValue, end: endValue };
  }

  return { start: endValue, end: startValue };
}

function normalizeWhatsappNumber(value) {
  return String(value || "").replace(/\D/g, "");
}

function sortBlocks(blocks) {
  return [...blocks].sort((left, right) => left.start.localeCompare(right.start));
}

function formatPrice(value) {
  return `${Number(value)} EUR/mes`;
}

function formatDateRange(start, end) {
  const startText = formatDate(start);
  const endText = formatDate(end);
  return start === end ? startText : `${startText} - ${endText}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short"
  }).format(new Date(`${value}T00:00:00`));
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function getTypeLabel(type) {
  const labels = {
    coche: "Coche",
    suv: "SUV",
    furgoneta: "Furgoneta"
  };

  return labels[type] || "Vehiculo";
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addMonthsKeepingDay(date, amount) {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth() + amount;
  const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const targetDay = Math.min(date.getDate(), lastDayOfTargetMonth);
  return new Date(targetYear, targetMonth, targetDay);
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function createVehiclePlaceholder(vehicle) {
  const title = escapeSvg(vehicle.name);
  const type = escapeSvg(getTypeLabel(vehicle.type));
  const price = escapeSvg(formatPrice(vehicle.pricePerMonth));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#20b0c0" />
          <stop offset="100%" stop-color="#004080" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#bg)" rx="42" />
      <circle cx="686" cy="96" r="84" fill="rgba(255,255,255,0.14)" />
      <circle cx="96" cy="432" r="116" fill="rgba(255,255,255,0.08)" />
      <path d="M200 320c0-22 16-40 38-44l44-8 52-62c12-14 30-22 48-22h106c22 0 42 10 56 28l38 48 58 14c18 4 30 20 30 38v24c0 14-12 26-26 26h-20c-6-32-34-56-68-56-34 0-62 24-68 56H344c-6-32-34-56-68-56-34 0-62 24-68 56h-10c-18 0-32-14-32-32v-10z" fill="rgba(255,255,255,0.2)" />
      <circle cx="276" cy="370" r="46" fill="#0d2a43" />
      <circle cx="560" cy="370" r="46" fill="#0d2a43" />
      <circle cx="276" cy="370" r="20" fill="#edf7fb" />
      <circle cx="560" cy="370" r="20" fill="#edf7fb" />
      <text x="64" y="92" fill="#f7fdff" font-family="Space Grotesk, sans-serif" font-size="26" letter-spacing="4">ALQUILO AQUI</text>
      <text x="64" y="410" fill="#f7fdff" font-family="Cormorant Garamond, serif" font-size="56">${title}</text>
      <text x="64" y="454" fill="#d8f3f8" font-family="Space Grotesk, sans-serif" font-size="22">${type} - ${price}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setMessage(element, message, type = "") {
  element.textContent = message;
  element.classList.remove("is-error", "is-success");

  if (type) {
    element.classList.add(`is-${type}`);
  }
}

function escapeHtml(value) {
  return String(value)
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
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
