// Custom cursor shared by all pages: a small dark dot instead of the arrow.
// Over anything clickable (links, buttons, project images, images that open in full screen) it turns into a milky, see-through disc of the same size.
// Over text fields the normal text cursor takes over.
// The dot is a real system cursor (an image the browser hands to the operating system), not an element following the mouse:
// it never lags, and the pointer can't go missing when switching to another app or desktop.
// Only on devices with a real mouse — touch screens keep their normal behaviour.
(() => {
  if (!matchMedia("(pointer: fine)").matches) return;

  const DOT = 14, DISC = 16; // size on screen, in px

  // draws a cursor at normal and double resolution; the sharper one is used on Retina screens
  const cursor = (size, paint) => {
    const url = scale => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size * scale;
      const c = canvas.getContext("2d");
      c.scale(scale, scale);
      paint(c, size / 2);
      return `url("${canvas.toDataURL()}")`;
    };
    const one = url(1), two = url(2), spot = `${size / 2} ${size / 2}, auto`;
    return `cursor: ${one} ${spot}; cursor: -webkit-image-set(${one} 1x, ${two} 2x) ${spot}; cursor: image-set(${one} 1x, ${two} 2x) ${spot};`;
  };
  const circle = (c, mid, r) => { c.beginPath(); c.arc(mid, mid, r, 0, 2 * Math.PI); };

  const style = document.createElement("style");
  document.head.appendChild(style);

  // the dot takes the text colour of the page, so it is light in night mode
  const paint = () => {
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#151515";
    const dot = cursor(DOT, (c, mid) => { circle(c, mid, DOT / 2); c.fillStyle = fg; c.fill(); });
    // light milky glass; a faint rim keeps it visible on white
    const disc = cursor(DISC, (c, mid) => {
      circle(c, mid, DISC / 2 - .5); c.strokeStyle = "rgba(21, 21, 21, .12)"; c.stroke();
      circle(c, mid, DOT / 2 - .5); c.fillStyle = "rgba(255, 255, 255, .26)"; c.fill(); c.strokeStyle = "rgba(255, 255, 255, .6)"; c.stroke();
    });
    style.textContent = `
      html, label { ${dot} }
      a, button, select, .select, .select *, .photo { ${disc} }
      input, textarea { cursor: text; }`;
  };
  paint();
  addEventListener("nightchange", paint);
})();
