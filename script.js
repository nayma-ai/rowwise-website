(() => {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: light)");
  const toggle = document.getElementById("theme-toggle");
  let saved;
  try {
    saved = localStorage.getItem("rowwise-theme");
  } catch {}
  if (!["light", "dark"].includes(saved)) saved = null;
  function applyTheme(mode) {
    root.dataset.mode = mode;
    toggle.setAttribute(
      "aria-label",
      mode === "light" ? "Switch to dark theme" : "Switch to light theme",
    );
    document.querySelector('meta[name="theme-color"]').content =
      mode === "light" ? "#F4F4F2" : "#09090A";
  }
  toggle.addEventListener("click", () => {
    saved = root.dataset.mode === "light" ? "dark" : "light";
    try {
      localStorage.setItem("rowwise-theme", saved);
    } catch {}
    applyTheme(saved);
  });
  system.addEventListener("change", (event) => {
    if (!saved) applyTheme(event.matches ? "light" : "dark");
  });
  applyTheme(root.dataset.mode);

  const menu = document.getElementById("mobile-toggle");
  const links = document.getElementById("nav-links");
  function closeMenu() {
    links.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    links.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  });
  links
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const tabs = [...document.querySelectorAll("[data-view]")];
  const names = {
    ask: "Ask",
    query: "Query",
    explore: "customers",
    mcp: "Settings / MCP",
  };
  const icons = {
    ask: "ask",
    query: "query",
    explore: "grid",
    mcp: "settings",
  };
  function selectTab(tab) {
    tabs.forEach((other) => {
      const active = tab === other;
      other.setAttribute("aria-selected", String(active));
      other.tabIndex = active ? 0 : -1;
      document.getElementById(other.getAttribute("aria-controls")).hidden =
        !active;
    });
    document
      .querySelectorAll("[data-demo-nav]")
      .forEach((item) =>
        item.classList.toggle(
          "active",
          item.dataset.demoNav === tab.dataset.view,
        ),
      );
    const title = document.getElementById("demo-tab-title");
    title
      .querySelector("use")
      .setAttribute("href", "#i-" + icons[tab.dataset.view]);
    title.lastChild.textContent = names[tab.dataset.view] + " · Sample data";
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next]);
        tabs[next].focus();
      }
    });
  });

  const filters = [...document.querySelectorAll("[data-filter]")];
  const sources = [...document.querySelectorAll("[data-source]")];
  const connectorCount = sources.filter(
    (source) => source.dataset.category !== "files",
  ).length;
  const search = document.getElementById("source-search");
  let category = "all";
  function filterSources() {
    const term = search.value.trim().toLowerCase();
    let count = 0;
    sources.forEach((source) => {
      const visible =
        (category === "all" || category === source.dataset.category) &&
        source.dataset.search.includes(term);
      source.hidden = !visible;
      if (visible) count++;
    });
    document.getElementById("source-count").textContent =
      count === sources.length
        ? `${connectorCount} connectors + local files`
        : `${count} ${count === 1 ? "match" : "matches"}`;
    document.getElementById("source-empty").hidden = count !== 0;
  }
  filters.forEach((filter) =>
    filter.addEventListener("click", () => {
      category = filter.dataset.filter;
      filters.forEach((other) =>
        other.setAttribute("aria-pressed", String(filter === other)),
      );
      filterSources();
    }),
  );
  search.addEventListener("input", filterSources);

  const copy = document.getElementById("copy-mcp");
  const command = document.getElementById("mcp-command");
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(command.textContent);
      copy.textContent = "Copied";
      document.getElementById("copy-status").textContent =
        "Command copied. Enable MCP in Rowwise before connecting.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(command);
      selection.removeAllRanges();
      selection.addRange(range);
      document.getElementById("copy-status").textContent =
        "Command selected. Press ⌘ / Ctrl+C to copy.";
    }
  });
})();
