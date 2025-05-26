/**
 * component.js
 * 
 * A utility for creating reactive components.
 * Subscribes the component to state updates and re-evaluates its output
 * whenever state changes.
 */


import { subscribe, unsubscribe } from '../state.js';

export function createComponent(componentFn, props = {}) {
  let root = document.createElement('div'); // root container
  let currentEl = null;

  function rerender() {
    const newEl = componentFn(props);
    if (currentEl) {
      root.replaceChild(newEl, currentEl);
    } else {
      root.appendChild(newEl);
    }
    currentEl = newEl;
  }

  subscribe(rerender);
  rerender();

  // Allows you to clear a subscription (e.g. when removed from the DOM)
  root.cleanup = () => unsubscribe(rerender);
  return root;
}
