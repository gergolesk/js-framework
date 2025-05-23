/**
 * lazyList.js
 *
 * A utility for rendering large lists efficiently using a "lazy loading" (infinite scroll) approach.
 * Only a portion of items are rendered at a time, and more items are loaded as the user scrolls down.
 * This improves performance for long lists by not rendering all elements at once.
 *
 * Usage example:
 *   LazyList({ items, renderItem, pageSize: 20 });
 */

import { createElement } from './dom.js';

export function LazyList({ items, renderItem, pageSize = 20 }) {
  // Container for the list; its height is based on the viewport size
  const container = createElement('div', {
    class: 'lazy-list',
    style: 'overflow-y: auto; height: calc(100vh - 200px);'
  });

  let loadedCount = 0; // Tracks the number of currently loaded/rendered items

  /**
   * Loads the next page of items and appends them to the container
   */
  function loadMore() {
    const nextCount = Math.min(loadedCount + pageSize, items.length);
    items.slice(loadedCount, nextCount).forEach(item => container.appendChild(renderItem(item)));
    loadedCount = nextCount;
  }

  /**
   * Event handler for scrolling: loads more items if the user scrolls to the bottom
   */
  function onScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If close to the bottom and there are still items to load, load the next batch
    if (scrollTop + clientHeight >= scrollHeight - 10 && loadedCount < items.length) {
      loadMore();
    }
  }

  // Listen for scroll events to trigger lazy loading
  container.addEventListener('scroll', onScroll);

  // Initial load of items
  loadMore();

  return container;
}
