const test = require('node:test');
const assert = require('node:assert/strict');
const { relocatedURL, legacyHomeURL, matchesBook } = require('../assets/library.js');

test('old chapter URL keeps query and encoded anchor under GitHub Pages prefix', () => {
  assert.equal(relocatedURL('../../../ml-systems/vol1/01_introduction/01_introduction.html',
    'https://hunterhcl.github.io/mlsysbook-ru/books/ru/vol1/01_introduction/01_introduction.html?from=note#sec-%D0%98%D0%98'),
    'https://hunterhcl.github.io/mlsysbook-ru/books/ml-systems/vol1/01_introduction/01_introduction.html?from=note#sec-%D0%98%D0%98');
});

test('legacy root volume links go to the book, other root anchors stay in library', () => {
  assert.equal(legacyHomeURL('https://example.test/mlsysbook-ru/?a=1#vol4', 'books/ml-systems/'),
    'https://example.test/mlsysbook-ru/books/ml-systems/?a=1#vol4');
  assert.equal(legacyHomeURL('https://example.test/mlsysbook-ru/#catalog', 'books/ml-systems/'), null);
  assert.equal(legacyHomeURL('https://example.test/mlsysbook-ru/', 'books/ml-systems/'), null);
});

test('catalog search ignores case, whitespace and ё, requires all words', () => {
  const book = 'Machine Learning Systems Машинное обучение Нейронные сети Завершён';
  assert.equal(matchesBook(book, '  MACHINE   systems '), true);
  assert.equal(matchesBook(book, 'ОБУЧЕНИЕ завершен'), true);
  assert.equal(matchesBook(book, ''), true);
  assert.equal(matchesBook(book, 'обучение медицина'), false);
});
