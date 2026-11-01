// TEMPORARY password screen while the site is being set up — remove before launch:
// delete this file and the <script src="gate.js"> line (plus the "noindex" meta tag) in every page.
// Note: this only keeps casual visitors out. The site's code is public on GitHub, so it is not real protection.
(() => {
  // SHA-256 of the password (the password itself is not stored in the code)
  const HASH = "7de898b2d44947f6ee4fd186ef4dfa5bd2103ece9e33b9886351e134cb64fc29";
  const KEY = "nm-unlocked";

  const unlocked = () => { try { return localStorage.getItem(KEY) === HASH; } catch { return false; } };
  if (unlocked()) return;

  // hide the page straight away so nothing flashes before the screen appears
  const root = document.documentElement;
  root.classList.add("locked");
  const style = document.createElement("style");
  style.textContent = `
    html.locked body > :not(.gate):not(.cursor-dot) { visibility: hidden; }
    html.locked { overflow: hidden; }
    .gate { position: fixed; inset: 0; z-index: 900; display: grid; place-content: center; justify-items: center; gap: 28px;
            background: #fff; color: #151515; font: 500 14px/1.5 "Inter Tight", "Helvetica Neue", Arial, sans-serif; text-align: center; padding: 24px; }
    .gate img { width: 193px; height: auto; }
    .gate p { color: #9a9a9a; }
    .gate form { display: flex; gap: 14px; align-items: baseline; }
    .gate input { font: inherit; color: #151515; background: transparent; border: 0; border-bottom: 1px solid #e4e4e4;
                  padding: 6px 0; width: 180px; outline: none; border-radius: 0; transition: border-color .2s; }
    .gate input:focus { border-bottom-color: #151515; }
    .gate button { font: inherit; color: #151515; background: none; border: 0; border-bottom: 1px solid currentColor; padding: 0 0 2px; }
    .gate .wrong { min-height: 1.5em; }`;
  document.head.appendChild(style);

  const sha256 = async text => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  };

  addEventListener("DOMContentLoaded", () => {
    const gate = document.createElement("div");
    gate.className = "gate";
    gate.innerHTML = `
      <img src="images/logo-bergamot-medium.png" alt="nach.mitternacht">
      <p>This website is still being set up.</p>
      <form>
        <input type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus>
        <button type="submit">Enter →</button>
      </form>
      <p class="wrong" role="status"></p>`;
    document.body.appendChild(gate);
    gate.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault();
      const input = gate.querySelector("input");
      if (await sha256(input.value) === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch {}
        gate.remove();
        root.classList.remove("locked");
      } else {
        gate.querySelector(".wrong").textContent = "Wrong password.";
        input.select();
      }
    });
  });
})();
