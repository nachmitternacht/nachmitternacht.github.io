// Custom cursor shared by all pages: a small dark dot that follows the mouse.
// Over anything clickable (links, buttons, project images, images that open in full screen) it turns into a milky, see-through disc of the same size.
// Over text fields it disappears and the normal text cursor takes over.
// When the mouse leaves the page (browser bar, other windows, switching desktops) the dot fades out instead of waiting at the edge.
// Only on devices with a real mouse — touch screens keep their normal behaviour.
(() => {
  if (!matchMedia("(pointer: fine)").matches) return;

  const style = document.createElement("style");
  style.textContent = `
    html, a, button, select, label, .select, .select * { cursor: none; }
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

  const CLICKABLE = "a, button, select, .select, .photo", TEXT = "input, textarea";
  let x = 0, y = 0, dx = 0, dy = 0, last = 0, running = false, inside = false, overText = false;

  // the dot is only visible while the mouse is on the page and not over a text field
  const update = () => dot.classList.toggle("is-hidden", !inside || overText);

  // the dot glides after the mouse instead of jumping to it: each frame it covers part of the remaining way,
  // timed by the clock so it feels the same on 60 Hz and 120 Hz screens; moved with a GPU transform, so the page never re-lays out
  const place = () => { dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`; };
  const step = now => {
    const t = 1 - Math.exp(-(now - last) / 16); // about 16 ms to close most of the gap
    last = now;
    dx += (x - dx) * t; dy += (y - dy) * t;
    if (Math.abs(x - dx) < .1 && Math.abs(y - dy) < .1) { dx = x; dy = y; running = false; }
    place();
    if (running) requestAnimationFrame(step);
  };

  addEventListener("mousemove", e => {
    x = e.clientX; y = e.clientY;
    if (!inside) {
      // coming back onto the page: appear right at the mouse, never sliding in from where it left
      dx = x; dy = y; place();
      inside = true; update();
    }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); }
  }, { passive: true });

  addEventListener("mouseover", e => {
    const t = e.target;
    dot.classList.toggle("is-link", !!t.closest(CLICKABLE));
    overText = !!t.closest(TEXT);
    update();
  });

  // leaving the page: out of the window, into the browser bar, or the window losing focus / being hidden
  const leave = () => { inside = false; update(); };
  addEventListener("mouseout", e => { if (!e.relatedTarget) leave(); });
  document.addEventListener("mouseleave", leave);
  addEventListener("blur", leave);
  document.addEventListener("visibilitychange", () => { if (document.hidden) leave(); });
})();
