function relocatedURL(target, current) {
  const previous = new URL(current);
  const next = new URL(target, previous);
  next.search = previous.search;
  next.hash = previous.hash;
  return next.href;
}
function legacyHomeURL(current, bookRoot) {
  return /^#vol[1-4]$/.test(new URL(current).hash) ? relocatedURL(bookRoot, current) : null;
}
function matchesBook(text, query) {
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase('ru').replaceAll('ё', 'е');
  const content = normalize(text);
  return normalize(query).trim().split(/\s+/).every(word => content.includes(word));
}
if (typeof module !== 'undefined') module.exports = { relocatedURL, legacyHomeURL, matchesBook };

if (typeof document !== 'undefined') {
  const redirect = document.querySelector('[data-redirect-target]');
  if (redirect) {
    location.replace(relocatedURL(redirect.getAttribute('href'), location.href));
  } else if (document.body.dataset.bookRoot) {
    const migrateAnchor = () => {
      const target = legacyHomeURL(location.href, document.body.dataset.bookRoot);
      if (target) location.replace(target);
    };
    migrateAnchor();
    window.addEventListener('hashchange', migrateAnchor);
  }

  const search = document.querySelector('#catalog-search');
  if (search) {
    search.closest('.search-field').hidden = false;
    const cards = Array.from(document.querySelectorAll('[data-book]'));
    const empty = document.querySelector('#catalog-empty');
    const status = document.querySelector('#catalog-status');
    const filter = () => {
      let visible = 0;
      for (const card of cards) {
        card.hidden = !matchesBook(card.dataset.search + ' ' + card.textContent, search.value);
        if (!card.hidden) visible++;
      }
      empty.hidden = visible !== 0;
      status.textContent = visible ? 'Найдено изданий: ' + visible : 'Нет совпадений';
    };
    search.addEventListener('input', filter);
    search.addEventListener('search', filter);
    document.querySelector('#clear-search').addEventListener('click', () => {
      search.value = '';
      filter();
      search.focus();
    });
    filter();
  }
}
