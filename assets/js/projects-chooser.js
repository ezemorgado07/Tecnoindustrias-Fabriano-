(() => {
  const trigger = document.getElementById('heroProjectsBtn');
  const modal = document.getElementById('projectChooser-modal');
  if (!trigger || !modal) return;

  const backdrop = modal.querySelector('.projectChooser-backdrop');
  const closeBtn = modal.querySelector('.projectChooser-close');
  const scrollBtn = modal.querySelector('#projectChooser-scroll');

  const open = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    // focus trap minimal: focus modal container
    modal.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    trigger.focus({ preventScroll: true });
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
  });

  scrollBtn?.addEventListener('click', () => {
    const target = document.getElementById('proyectos');
    close();
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();