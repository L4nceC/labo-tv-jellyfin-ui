// LaBo TV — NEW badge injector

(function () {
  function markNew() {
    const rows = document.querySelectorAll('.homePage .itemsContainer');
    if (!rows.length) return;

    // First row = Recently Added (your setup)
    const firstRow = rows[0];
    const cards = firstRow.querySelectorAll('.cardBox');

    cards.forEach((card, index) => {
      if (index < 5) {
        card.classList.add('labo-new');
      } else {
        card.classList.remove('labo-new');
      }
    });
  }

  // Run on load + after UI updates
  const observer = new MutationObserver(markNew);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', markNew);
})();
