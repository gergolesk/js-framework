/**
 * component.js
 * 
 * A utility for creating reactive components.
 * Subscribes the component to state updates and re-evaluates its output
 * whenever state changes.
 */

/*
import { subscribe } from '../state.js';

export function createComponent(componentFn, props = {}) {
  let rendered = componentFn(props); // Initial rendering of the component

  const rerender = () => {
    rendered = componentFn(props); // Re-render the component on state change
  };

  subscribe(rerender); // Subscribe to global state changes

  return () => rendered; // Return a function that always gives the latest rendered value
}
  */
import { subscribe, unsubscribe } from '../state.js';

export function createComponent(componentFn, props = {}) {
  let root = document.createElement('div'); // корневой контейнер
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

  // Позволяет очистить подписку (например, при удалении из DOM)
  root.cleanup = () => unsubscribe(rerender);
  return root;
}
