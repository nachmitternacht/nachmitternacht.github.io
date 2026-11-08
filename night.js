// "After midnight" mode: a small moon in the menu turns the whole site dark; a sun turns it back.
// The choice is remembered in this browser. Loaded in <head> so a dark page never flashes white first.
(() => {
  const KEY = "nm-night", root = document.documentElement;
  const saved = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } };
  if (saved()) root.classList.add("night");

  const style = document.createElement("style");
  style.textContent = `
    html.night { --bg: #121211; --fg: #e8e5de; --muted: #7f7c76; --line: #2c2b28; color-scheme: dark; }
    /* the hand-lettered logo and note are black images: shown light at night */
    html.night .logo img, html.night .hand-note { filter: invert(.91); }
    /* switching: only the colours ease over, slowly (like dusk falling), so the images themselves stay perfectly still;
       opacity is included so the evening scene of the Corner Café fades in the same rhythm */
    html.night-fade, html.night-fade *, html.night-fade *::before, html.night-fade *::after {
      transition: background-color 1.4s ease, color 1.4s ease, border-color 1.4s ease, filter 1.4s ease, opacity 1.4s ease !important; }
    .night-toggle { display: inline-flex; align-items: center; width: 14px; height: 14px; margin-left: 4px; padding: 0; border: 0; background: none;
                    color: var(--fg); align-self: center; transition: transform .4s cubic-bezier(.2, .7, .2, 1); }
    .night-toggle:hover { transform: scale(1.12); }
    .night-toggle svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.2; stroke-linecap: round; }
    .night-toggle .sun, html.night .night-toggle .moon { display: none; }
    html.night .night-toggle .sun { display: block; }
    /* phones: the menu bar is full, so the moon moves to the end of the social links in the footer */
    footer .night-toggle { display: none; margin-left: auto; }
    @media (max-width: 720px) {
      .nav .night-toggle { display: none; }
      footer .night-toggle { display: inline-flex; }
    }`;
  document.head.appendChild(style);

  addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "night-toggle";
    button.innerHTML = `
      <svg class="moon" viewBox="0 0 16 16"><path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7z"/></svg>
      <svg class="sun" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3"/></svg>`;
    const label = () => document.querySelectorAll(".night-toggle").forEach(b => b.setAttribute("aria-label", root.classList.contains("night") ? "Switch to day mode" : "Switch to night mode"));
    label();
    const flip = () => {
      const on = root.classList.toggle("night");
      try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {}
      label();
      dispatchEvent(new CustomEvent("nightchange", { detail: on }));
    };
    let fading;
    button.addEventListener("click", () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return flip();
      root.classList.add("night-fade");
      flip();
      clearTimeout(fading);
      fading = setTimeout(() => root.classList.remove("night-fade"), 1500);
    });
    nav.appendChild(button);
    // a second one in the footer, used on phones
    const social = document.querySelector("footer .social");
    if (social) {
      const copy = button.cloneNode(true);
      copy.addEventListener("click", () => button.click());
      social.appendChild(copy);
    }
    label();
  });
})();
