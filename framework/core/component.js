/**
 * component.js
 * 
 * A utility for creating reactive components.
 * Subscribes the component to state updates and re-evaluates its output
 * whenever state changes.
 */

import { subscribe } from '../state.js';

export function createComponent(componentFn, props = {}) {
  let rendered = componentFn(props); // Initial rendering of the component

  const rerender = () => {
    rendered = componentFn(props); // Re-render the component on state change
  };

  subscribe(rerender); // Subscribe to global state changes

  return () => rendered; // Return a function that always gives the latest rendered value
}