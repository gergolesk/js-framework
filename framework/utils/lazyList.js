import { createElement } from '../framework/utils/dom.js';
import { createState } from '../framework/state.js';

export function LazyList({ items, renderItem, pageSize = 20 }) {
  const visibleCount = createState(pageSize);

  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      visibleCount.set(visibleCount.value + pageSize);
    }
  };

  return createElement('div', {
    style: 'overflow-y: auto; max-height: 500px;',
    onScroll
  },
    ...items.slice(0, visibleCount.value).map(renderItem)
  );
}