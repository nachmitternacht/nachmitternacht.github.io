// Custom cursor shared by all pages: a small dark dot that follows the mouse.
// Over anything clickable (links, buttons, project images) it turns into a milky, see-through disc of the same size.
// Only on devices with a real mouse — touch screens keep their normal behaviour.
(() => {
  if (!matchMedia("(pointer: fine)").matches) return;

  const style = document.createElement("style");
  style.textContent = `
    html, a, button, select, label { cursor: none; }
    input, textarea { cursor: text; }
    .cursor-dot {
      position: fixed; left: -7px; top: -7px; z-index: 1000; pointer-events: none; will-change: transform;
      width: 14px; height: 14px; border-radius: 50%;
      background: var(--fg, #151515);
      transition: background-color .25s ease, box-shadow .25s ease, opacity .2s ease;
    }
    /* light milky glass (no backdrop blur: it would have to be redrawn on every scroll frame); a faint rim keeps it visible */
    .cursor-dot.is-link {
      background: rgba(255, 255, 255, .26);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .6), 0 0 0 1px rgba(21, 21, 21, .12);
    }
    .cursor-dot.is-hidden { opacity: 0; }`;
  document.head.appendChild(style);

  const dot = document.createElement("div");
  dot.className = "cursor-dot is-hidden";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);

  // moved with a GPU transform once per frame, so it never triggers a page re-layout
  let x = 0, y = 0, queued = false;
  addEventListener("mousemove", e => {
    x = e.clientX; y = e.clientY;
    if (!queued) {
      queued = true;
      requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        queued = false;
      });
    }
    dot.classList.remove("is-hidden");
  }, { passive: true });

  addEventListener("mouseover", e => {
    const t = e.target;
    dot.classList.toggle("is-link", !!t.closest("a, button, select, label"));
    dot.classList.toggle("is-hidden", !!t.closest("input, textarea")); // text fields show the text cursor instead
  });

  document.addEventListener("mouseleave", () => dot.classList.add("is-hidden"));
})();
