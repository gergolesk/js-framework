/**
 * render.js
 * 
 * Renders a component function into a given DOM container.
 * Clears previous content, appends the new DOM node, and triggers mount callbacks.
 * This function ensures consistent setup of the DOM when a component is re-rendered.
 */

import { runMountCallbacks } from './utils/lifecycle.js';

export function render(componentFn, container) {
  container.innerHTML = '';
  const el = componentFn();
  container.appendChild(el);
  runMountCallbacks(); // add a call
}
