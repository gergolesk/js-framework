import { createElement } from '../../framework/utils/dom.js';

export default function NotFound() {
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h1', {}, '404 — Страница не найдена')
  );
}
