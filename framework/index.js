import { createElement } from './utils/dom.js';

/*
export function render(rootComponent, rootElement) {
  rootElement.innerHTML = '';
  rootElement.appendChild(rootComponent());
}
  */
export function render(component, root) {
  root.innerHTML = '';
  const el = component();
  if (el instanceof Node) {
    root.appendChild(el);
  } else {
    console.warn('Component did not return a DOM node');
  }
}
