import { createElement } from './utils/dom.js';

export function render(component, root) {
  root.innerHTML = ''; // Clear existing content of the root container
  const el = component(); // Call the component function to get a DOM element

  if (el instanceof Node) {
    root.appendChild(el); // If the component returned a valid DOM node, render it
  } else {
    console.warn('Component did not return a DOM node'); // Warn if the component returned something invalid
  }
}
