const STORAGE_KEY = "alquilo-aqui-catalogo-v1";
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
    calendarMonth: startOfMonth(new Date())
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
  refs.fleetGrid = document.getElementById("fleetGrid");
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
  refs.vehicleImagePreview = document.getElementById("vehicleImagePreview");
  refs.vehicleImagePreviewImg = document.getElementById("vehicleImagePreviewImg");
  refs.vehicleImagePreviewEmpty = document.getElementById("vehicleImagePreviewEmpty");
  refs.clearVehicleImageBtn = document.getElementById("clearVehicleImageBtn");
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
    renderPublic();
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  [refs.filterStart, refs.filterTerm, refs.filterType].forEach((element) => {
    element.addEventListener("change", () => {
      normalizeRentalFilters();
      renderPublic();
    });
  });

  refs.searchInput.addEventListener("input", renderPublic);

  refs.resetFiltersBtn.addEventListener("click", () => {
    refs.filterStart.value = "";
    refs.filterTerm.value = "1";
    refs.filterType.value = "all";
    refs.searchInput.value = "";
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
  refs.adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = refs.adminPasswordInput.value;

    if (password !== state.data.settings.adminPassword) {
      setMessage(refs.adminLoginMessage, "Clave incorrecta.", "error");
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
    closeAdminPanel();
  });

  refs.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const whatsappNumber = normalizeWhatsappNumber(refs.settingsWhatsapp.value);
    const newPassword = refs.settingsPassword.value.trim();

    if (!whatsappNumber) {
      setMessage(refs.settingsMessage, "Introduce un numero de WhatsApp valido.", "error");
      return;
    }

    state.data.settings.whatsappNumber = whatsappNumber;

    if (newPassword) {
      state.data.settings.adminPassword = newPassword;
    }

    saveState();
    refs.settingsPassword.value = "";
    syncGlobalWhatsappLinks();
    renderPublic();
    renderAdmin();
    setMessage(refs.settingsMessage, "Configuracion guardada.", "success");
  });

  refs.vehicleImageFile.addEventListener("change", async () => {
    try {
      await handleVehicleImageSelection();
    } catch (error) {
      setMessage(refs.vehicleFormMessage, error.message || "No se pudo cargar la imagen.", "error");
    }
  });

  refs.clearVehicleImageBtn.addEventListener("click", () => {
    clearVehicleImage();
    setMessage(refs.vehicleFormMessage, "Imagen eliminada de la ficha.", "success");
  });

  refs.vehicleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let vehicle;
    const previousState = JSON.stringify(state.data);

    try {
      vehicle = await readVehicleForm();
    } catch (error) {
      setMessage(refs.vehicleFormMessage, error.message || "No se pudo procesar la imagen.", "error");
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
        "No se pudo guardar la imagen. Prueba con un JPG/PNG mas ligero.",
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
  const imageUrl = vehicle.image || createVehiclePlaceholder(vehicle);

  return `
    <article class="vehicle-card ${availability.isAvailable ? "is-available" : "is-unavailable"}">
      <div class="vehicle-media">
        <div class="vehicle-badges">
          <span class="vehicle-badge">${escapeHtml(typeText)}</span>
          <span class="vehicle-status ${statusClass}">${escapeHtml(statusText)}</span>
        </div>
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(vehicle.name)}">
      </div>

      <div class="vehicle-content">
        <div class="vehicle-title">
          <div>
            <h3>${escapeHtml(vehicle.name)}</h3>
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

function renderAdmin() {
  if (!state.ui.isAdminAuthenticated) {
    return;
  }

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
    setCurrentVehicleImage(editingVehicle.image);
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

function renderAdminVehicleItem(vehicle) {
  const availability = getVehicleAvailability(vehicle, null);
  const currentStatus = availability.isAvailable ? "Libre hoy" : "Ocupado hoy";

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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    return freshState;
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    return normalizeState(parsedValue);
  } catch (error) {
    const freshState = createInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    return freshState;
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
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
  const vehicles = Array.isArray(rawState?.vehicles) ? rawState.vehicles : [];

  return {
    settings: {
      whatsappNumber: normalizeWhatsappNumber(settings.whatsappNumber) || fallbackState.settings.whatsappNumber,
      adminPassword: typeof settings.adminPassword === "string" && settings.adminPassword.trim()
        ? settings.adminPassword
        : fallbackState.settings.adminPassword
    },
    vehicles: vehicles.length ? vehicles.map(normalizeVehicle).filter(Boolean) : fallbackState.vehicles
  };
}

function normalizeVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object") {
    return null;
  }

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
    image: String(vehicle.image || ""),
    summary: String(vehicle.summary || "Consulta por WhatsApp para confirmar condiciones."),
    features: Array.isArray(vehicle.features)
      ? vehicle.features.map((feature) => String(feature).trim()).filter(Boolean)
      : ["Consulta directa"],
    blocks: Array.isArray(vehicle.blocks)
      ? sortBlocks(vehicle.blocks.map((block) => normalizeBlock(block)).filter(Boolean))
      : []
  };
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
  const uploadedImage = refs.vehicleImageFile.files?.[0]
    ? await optimizeVehicleImageFile(refs.vehicleImageFile.files[0])
    : null;

  return {
    id: refs.vehicleId.value || "",
    name: refs.vehicleName.value.trim(),
    type: refs.vehicleType.value,
    pricePerMonth: Number(refs.vehiclePrice.value),
    location: refs.vehicleLocation.value.trim(),
    passengers: Number(refs.vehiclePassengers.value),
    transmission: refs.vehicleTransmission.value.trim(),
    fuel: refs.vehicleFuel.value.trim(),
    image: uploadedImage ?? getCurrentVehicleImage(),
    summary: refs.vehicleSummary.value.trim(),
    features: refs.vehicleFeatures.value.split(",").map((item) => item.trim()).filter(Boolean)
  };
}

function resetVehicleForm() {
  refs.vehicleForm.reset();
  refs.vehicleId.value = "";
  refs.vehicleType.value = "coche";
  refs.vehicleImageFile.value = "";
  setCurrentVehicleImage("");
}

async function handleVehicleImageSelection() {
  const file = refs.vehicleImageFile.files?.[0];

  if (!file) {
    updateVehicleImagePreview(getCurrentVehicleImage());
    return;
  }

  if (!isSupportedVehicleImage(file)) {
    refs.vehicleImageFile.value = "";
    throw new Error("Solo se permiten archivos JPG o PNG.");
  }

  try {
    const previewImage = await readFileAsDataUrl(file);
    updateVehicleImagePreview(previewImage);
    setMessage(refs.vehicleFormMessage, "Imagen lista para guardar.", "success");
  } catch (error) {
    refs.vehicleImageFile.value = "";
    updateVehicleImagePreview(getCurrentVehicleImage());
    setMessage(refs.vehicleFormMessage, "No se pudo cargar la imagen seleccionada.", "error");
  }
}

function clearVehicleImage() {
  refs.vehicleImageFile.value = "";
  setCurrentVehicleImage("");
}

function getCurrentVehicleImage() {
  return refs.vehicleForm.dataset.currentImage || "";
}

function setCurrentVehicleImage(image) {
  refs.vehicleForm.dataset.currentImage = image || "";
  updateVehicleImagePreview(image || "");
}

function updateVehicleImagePreview(image) {
  const hasImage = Boolean(image);
  refs.vehicleImagePreviewImg.classList.toggle("hidden", !hasImage);
  refs.vehicleImagePreviewEmpty.classList.toggle("hidden", hasImage);

  if (hasImage) {
    refs.vehicleImagePreviewImg.src = image;
    return;
  }

  refs.vehicleImagePreviewImg.removeAttribute("src");
}

function isSupportedVehicleImage(file) {
  return ["image/jpeg", "image/png"].includes(file.type);
}

async function optimizeVehicleImageFile(file) {
  if (!isSupportedVehicleImage(file)) {
    throw new Error("Solo se permiten archivos JPG o PNG.");
  }

  const imageDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(imageDataUrl);
  const dimensions = getScaledDimensions(image.width, image.height, 1600);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tu navegador no pudo preparar la imagen.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const keepPng = file.type === "image/png" && imageHasTransparency(context, canvas.width, canvas.height);
  return keepPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.82);
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

function imageHasTransparency(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height).data;

  for (let index = 3; index < imageData.length; index += 4) {
    if (imageData[index] < 250) {
      return true;
    }
  }

  return false;
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
