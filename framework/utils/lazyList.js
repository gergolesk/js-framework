import { createElement } from './dom.js';
import { createState } from '../state.js';

export function LazyList({ items, renderItem, pageSize = 20 }) {
  // контейнер для списка: высота рассчитывается от высоты вьюпорта
  const container = createElement('div', {
    class: 'lazy-list',
    style: 'overflow-y: auto; height: calc(100vh - 200px);'
  });

  let loadedCount = 0;

  function loadMore() {
    const nextCount = Math.min(loadedCount + pageSize, items.length);
    items.slice(loadedCount, nextCount).forEach(item => container.appendChild(renderItem(item)));
    loadedCount = nextCount;
  }

  function onScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && loadedCount < items.length) {
      loadMore();
    }
  }

  container.addEventListener('scroll', onScroll);
  loadMore();
  return container;
}