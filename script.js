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

  const platformPicker = document.getElementById("platform-picker");
  const platformDownloads = document.querySelectorAll(
    "[data-platform-download]",
  );
  function detectDownloadPlatform() {
    const { userAgentData, userAgent, platform, maxTouchPoints } = navigator;
    const platformHint = userAgentData?.platform || platform || "";
    // Android and ChromeOS may expose Linux as their legacy platform.
    if (
      userAgentData?.mobile ||
      /Android|iPhone|iPad|iPod|CrOS|Chrome OS|Mobile/i.test(
        `${platformHint} ${userAgent}`,
      )
    )
      return;

    // iPadOS in desktop mode can identify itself as a Mac.
    if (/^Mac/i.test(platformHint) && maxTouchPoints > 1) return;

    const desktop = platformHint || userAgent;
    if (/Windows|^Win32$|^Win64$/i.test(desktop)) return "windows";
    if (/^Mac|Macintosh/i.test(desktop)) return "macos";
    if (/Linux/i.test(desktop)) return "linux";
  }

  function showSelectedDownload() {
    const selected = platformPicker.querySelector("input:checked").value;
    platformDownloads.forEach((link) => {
      link.hidden = link.dataset.platformDownload !== selected;
    });
  }
  const detectedPlatform = detectDownloadPlatform();
  if (detectedPlatform) {
    platformPicker.querySelector(`input[value="${detectedPlatform}"]`).checked =
      true;
  }
  platformPicker.addEventListener("change", showSelectedDownload);
  window.addEventListener("pageshow", showSelectedDownload);
  showSelectedDownload();
  platformPicker.hidden = false;

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
