/* ============================================================
   Individual Responsibilities — collapsible person blocks
   Every person starts collapsed and opens on click, which keeps the
   tab inside one viewport. Runs on every department page; does nothing
   if the page has only one person listed.
   ============================================================ */
(function () {
  function init() {
    var panel = document.getElementById("individual");
    if (!panel) return;

    var blocks = panel.querySelectorAll(".person-block");
    if (blocks.length < 2) return; // single person: leave it as plain content

    Array.prototype.forEach.call(blocks, function (block, i) {
      var name = block.querySelector(".person-name");
      if (!name || block.classList.contains("is-collapsible")) return;

      // move everything after the name into a wrapper we can hide
      var body = document.createElement("div");
      body.className = "person-body";
      while (name.nextSibling) body.appendChild(name.nextSibling);
      block.appendChild(body);

      // chevron
      var chev = document.createElement("span");
      chev.className = "person-chev";
      chev.setAttribute("aria-hidden", "true");
      chev.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
        'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
      name.appendChild(chev);

      block.classList.add("is-collapsible");
      name.setAttribute("role", "button");
      name.setAttribute("tabindex", "0");

      // All blocks start collapsed so the tab fits the viewport without
      // scrolling; the client asked for no scrolling on any page.
      var open = false;
      setState(block, name, body, open);

      function toggle() {
        setState(block, name, body, block.getAttribute("data-open") !== "true");
      }

      name.addEventListener("click", toggle);
      name.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function setState(block, name, body, open) {
    block.setAttribute("data-open", open ? "true" : "false");
    block.classList.toggle("open", open);
    name.setAttribute("aria-expanded", open ? "true" : "false");
    body.hidden = !open;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
