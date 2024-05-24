const updatePosition = () => {
  const offsetX = window.screenX;
  const offsetY = window.screenY;
  document.body.setAttribute(
    "style",
    `--offsetX:${offsetX}px;--offsetY:${offsetY}px;`
  );
  window.requestAnimationFrame(updatePosition);
};

updatePosition();
