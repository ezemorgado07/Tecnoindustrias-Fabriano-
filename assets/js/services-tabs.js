(() => {
  // Tabs (botones/list items) y panels
  const tabs = Array.from(document.querySelectorAll('.services-tabs__tab'));
  const panels = Array.from(document.querySelectorAll('.services-panel'));

  if (!tabs.length || !panels.length) return;

  const deactivateAll = () => {
    tabs.forEach((t) => {
      t.classList.remove('services-tabs__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach((p) => {
      p.classList.remove('services-panel--active');
      p.setAttribute('hidden', '');
    });
  };

  const activateTab = (tab) => {
    const targetId = tab.getAttribute('aria-controls');
    if (!targetId) return;

    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    deactivateAll();

    tab.classList.add('services-tabs__tab--active');
    tab.setAttribute('aria-selected', 'true');

    targetPanel.classList.add('services-panel--active');
    targetPanel.removeAttribute('hidden');
  };

  // Click
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(tab);
    });
  });

  // Estado inicial: si ya hay uno activo, respétalo; si no, activa el primero
  const alreadyActive = tabs.find((t) => t.classList.contains('services-tabs__tab--active'));
  if (alreadyActive) {
    activateTab(alreadyActive);
  } else {
    activateTab(tabs[0]);
  }
})();