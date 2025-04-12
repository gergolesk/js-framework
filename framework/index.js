import { createElement } from './utils/dom.js';

export function render(rootComponent, rootElement) {
  rootElement.innerHTML = '';
  rootElement.appendChild(rootComponent());
}
