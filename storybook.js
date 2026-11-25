(() => {
  const entrance = document.querySelector(".book-entrance");
  const heading = entrance?.querySelector(".story-title");
  const subtitle = entrance?.querySelector(".story-subtitle");
  const portal = entrance?.querySelector(".rabbit-portal");
  const image = portal?.querySelector("img");
  const button = entrance?.querySelector("#enter-button");

  if (!heading || !subtitle || !portal || !image || !button) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const letters = [];
  const animations = new Set();
  let skip = motion.matches;

  function showEverything() {
    for (const animation of animations) animation.cancel();
    [heading, subtitle, portal, button, ...letters].forEach((element) => {
      element.style.opacity = "1";
    });
    portal.style.maskImage = "none";
    portal.style.webkitMaskImage = "none";
    entrance.classList.add("story-written");
    button.disabled = false;
  }

  motion.addEventListener("change", (event) => {
    if (event.matches) {
      skip = true;
      showEverything();
    }
  });

  if (skip) {
    showEverything();
    return;
  }

  heading.setAttribute("aria-label", "Once upon a time…");
  const nodes = [];
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
  }

  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const character of node.textContent) {
      if (/\s/.test(character)) {
        fragment.appendChild(document.createTextNode(character));
      } else {
        const letter = document.createElement("span");
        letter.className = "story-letter";
        letter.textContent = character;
        letter.setAttribute("aria-hidden", "true");
        fragment.appendChild(letter);
        letters.push(letter);
      }
    }
    node.replaceWith(fragment);
  }

  button.disabled = true;

  async function fade(element, duration, delay = 0) {
    if (skip) return;
    const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      delay,
      easing: "ease-out",
      fill: "both",
    });
    animations.add(animation);
    try {
      await animation.finished;
      element.style.opacity = "1";
    } finally {
      animations.delete(animation);
      animation.cancel();
    }
  }

  function watercolorReveal() {
    if (skip) return Promise.resolve();
    portal.style.opacity = "1";

    return new Promise((resolve) => {
      let start;
      function paint(now) {
        if (skip) {
          resolve();
          return;
        }
        start ??= now;
        const progress = Math.min((now - start) / 1800, 1);
        const spread = 190 * (1 - Math.pow(1 - progress, 1.7));
        const bloom = (x, y, size) =>
          `radial-gradient(ellipse farthest-corner at ${x}% ${y}%, #000 0%, #000 ${
            size * 0.35
          }%, rgba(0,0,0,.75) ${size * 0.62}%, transparent ${size}%)`;
        const mask = [
          bloom(47, 52, spread),
          bloom(42, 47, spread * 0.91),
          bloom(55, 57, spread * 0.85),
        ].join(",");

        portal.style.maskImage = mask;
        portal.style.webkitMaskImage = mask;
        portal.style.opacity = String(Math.min(progress * 3, 1));

        if (progress < 1) {
          requestAnimationFrame(paint);
        } else {
          portal.style.maskImage = "none";
          portal.style.webkitMaskImage = "none";
          resolve();
        }
      }
      requestAnimationFrame(paint);
    });
  }

  async function startStory() {
    try {
      await document.fonts.ready;
      if (skip) return;
      heading.style.opacity = "1";
      await Promise.all(
        letters.map((letter, index) => fade(letter, 1000, 600 + index * 170))
      );
      entrance.classList.add("story-written");
      await fade(subtitle, 1300, 250);
      await image.decode();
      if (skip) return;
      await watercolorReveal();
      button.disabled = false;
      await fade(button, 600);
    } catch (error) {
      if (!skip) console.warn("Story introduction could not finish:", error);
    } finally {
      showEverything();
    }
  }

  startStory();
})();
