(function () {
  const FRAME_COUNT = 26;
  const frames = Array.from({ length: FRAME_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(3, "0");
    return `./ezgif-frame-${n}.png`;
  });

  const canvas = document.getElementById("frame-canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const progressBar = document.querySelector(".progress-bar");
  const progressEl = document.querySelector(".progress");

  const images = frames.map((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    return img;
  });

  function drawCover(image, w, h) {
    if (!image.complete || image.naturalWidth === 0) return;
    const iw = image.naturalWidth;
    const ih = image.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(image, dx, dy, dw, dh);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  }

  function scrollProgress() {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    if (maxScroll <= 0) return 0;
    const y = window.scrollY || window.pageYOffset;
    return Math.min(1, Math.max(0, y / maxScroll));
  }

  function paint() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const p = scrollProgress();
    const t = p * (FRAME_COUNT - 1);
    const i0 = Math.floor(t);
    const frac = t - i0;
    const i1 = Math.min(i0 + 1, FRAME_COUNT - 1);

    ctx.fillStyle = "#07070c";
    ctx.fillRect(0, 0, w, h);

    const ready0 = images[i0].complete && images[i0].naturalWidth > 0;
    const ready1 = images[i1].complete && images[i1].naturalWidth > 0;

    if (ready0) drawCover(images[i0], w, h);
    if (ready1 && i1 !== i0) {
      ctx.globalAlpha = frac;
      drawCover(images[i1], w, h);
      ctx.globalAlpha = 1;
    } else if (ready1 && i1 === i0) {
      drawCover(images[i1], w, h);
    }

    const pct = Math.round(p * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressEl) {
      progressEl.setAttribute("aria-valuenow", String(pct));
      progressEl.setAttribute("aria-valuetext", `${pct}%`);
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      paint();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resize, { passive: true });

  Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    )
  ).then(() => {
    resize();
  });

  images.forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", () => paint(), { once: true });
    }
  });
})();
