(() => {
  const STORAGE_KEY = "hello-paper-count";
  const number = document.querySelector("[data-hello-number]");
  const note = document.querySelector("[data-hello-note]");
  const button = document.querySelector("[data-hello-count]");
  let sparkle = true;

  const read = () => {
    try {
      return Math.max(0, Number(localStorage.getItem(STORAGE_KEY)) || 0);
    } catch (error) {
      return 0;
    }
  };

  const render = (value, celebrate = false) => {
    if (number) number.textContent = String(value);
    if (note) {
      note.textContent = value === 0 ? "Click the button to add one." : "Saved on this machine.";
      note.classList.toggle("sparkle", celebrate && sparkle);
    }
  };

  button?.addEventListener("click", () => {
    const next = read() + 1;
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch (error) {}
    render(next, true);
  });

  // The host sends the current theme after the iframe loads and whenever the
  // user switches between light and dark postcards.
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "neotodo-theme") return;
    document.documentElement.dataset.dark = data.dark ? "true" : "false";
  });

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "neotodo-plugin-settings") return;
    if (typeof data.settings?.sparkle === "boolean") {
      sparkle = data.settings.sparkle;
      if (note) note.classList.remove("sparkle");
    }
  });

  render(read());
})();
