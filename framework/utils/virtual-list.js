import { createElement } from './dom.js';

/**
 * Создаёт виртуальный список с ленивой отрисовкой.
 * @param {Array} items - Массив элементов
 * @param {number} itemHeight - Высота одного элемента в px
 * @param {(item: any, index: number) => HTMLElement} renderItem - Функция создания элемента
 * @param {number} [buffer=5] - Кол-во дополнительных элементов сверху и снизу
 */
export function createVirtualList({ items, itemHeight, renderItem, buffer = 5 }) {
  const totalHeight = items.length * itemHeight;

  const container = createElement('div', {
    style: {
      position: 'relative',
      height: '100%',
      overflowY: 'auto',
      border: '1px solid #ccc',
    },
  });

  const spacer = createElement('div', {
    style: {
      height: `${totalHeight}px`,
    },
  });

  const visibleArea = createElement('div', {
    style: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
    },
  });

  container.appendChild(spacer);
  container.appendChild(visibleArea);

  function renderVisibleItems() {
    const scrollTop = container.scrollTop;
    const viewHeight = container.clientHeight;

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(items.length, Math.ceil((scrollTop + viewHeight) / itemHeight) + buffer);

    visibleArea.innerHTML = '';

    for (let i = startIndex; i < endIndex; i++) {
      const el = renderItem(items[i], i);
      el.style.position = 'absolute';
      el.style.top = `${i * itemHeight}px`;
      el.style.left = '0';
      el.style.right = '0';
      visibleArea.appendChild(el);
    }
  }

  container.addEventListener('scroll', renderVisibleItems);
  renderVisibleItems();

  return container;
}
