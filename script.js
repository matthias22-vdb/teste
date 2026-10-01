(() => {
  const root = document.documentElement;
  const mover = document.getElementById('mover');
  const pause = document.getElementById('pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hues = [175, 265, 325, 35, 205];
  let palette = 0;
  let paused = false;
  let frame = 0;
  let targetX = 0;
  let targetY = 0;

  function resetPosition() {
    cancelAnimationFrame(frame);
    frame = 0;
    mover.style.transform = '';
  }

  document.addEventListener('pointermove', (event) => {
    if (paused || reducedMotion.matches || event.pointerType === 'touch') return;
    targetX = (event.clientX / window.innerWidth - 0.5) * 48;
    targetY = (event.clientY / window.innerHeight - 0.5) * 48;
    if (!frame) frame = requestAnimationFrame(() => {
      mover.style.transform = `translate(${targetX}px, ${targetY}px)`;
      frame = 0;
    });
  });
  document.addEventListener('pointerleave', resetPosition);
  reducedMotion.addEventListener('change', resetPosition);

  document.getElementById('color').addEventListener('click', () => {
    palette = (palette + 1) % hues.length;
    root.style.setProperty('--hue', hues[palette]);
  });

  pause.addEventListener('click', () => {
    paused = !paused;
    document.body.classList.toggle('paused', paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Reprendre' : 'Mettre en pause';
    if (paused) {
      resetPosition();
      document.querySelectorAll('.ripple').forEach((ripple) => ripple.remove());
    }
  });

  document.addEventListener('click', (event) => {
    if (paused || reducedMotion.matches || event.target.closest('button, a')) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.clientX - 12}px`;
    ripple.style.top = `${event.clientY - 12}px`;
    // Bound the number of waves even during rapid repeated clicks.
    if (document.querySelectorAll('.ripple').length >= 12) document.querySelector('.ripple').remove();
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    setTimeout(() => ripple.remove(), 1200);
  });
})();
