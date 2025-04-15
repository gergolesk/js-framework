import { subscribe } from './state.js';
// Import the 'subscribe' function from state.js, used to reactively re-render when state changes

let routes = {};
let currentComponent = null;

// Defines application routes: a mapping between paths and components
export function defineRoutes(routeMap) {
  routes = routeMap;
}

// Navigates to a new path by updating the hash in the URL
export function navigate(path) {
  window.location.hash = path;
}

// Gets the current path from the hash part of the URL (e.g., #/about => /about)
function getPath() {
  return window.location.hash.replace(/^#/, '') || '/';
}

// Updates the currently displayed view based on the current path
function updateView() {
  const Component = routes[getPath()];
  currentComponent = Component || NotFound; // If no match, render the NotFound component
  rerender(); // Re-render the view
}

// Fallback component shown when no route matches
function NotFound() {
  const el = document.createElement('h1');
  el.textContent = '404 - Not Found';
  return el;
}

let root = null; // Will hold the root DOM element where views are rendered

// Renders the current component into the root container
function rerender() {
  if (!root || !currentComponent) return;

  // Save current focus and text selection before re-rendering
  const active = document.activeElement;
  const selectionStart = active?.selectionStart;
  const selectionEnd = active?.selectionEnd;
  const id = active?.id;

  root.innerHTML = ''; // Clear the container
  root.appendChild(currentComponent()); // Render the new component

  // Restore focus and selection if possible
  if (id) {
    const restored = document.getElementById(id);
    if (restored) {
      restored.focus();
      if (restored.setSelectionRange && selectionStart !== null) {
        restored.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }
}

// Initializes the router view, sets up event listeners and renders the initial component
export function RouterView() {
  const container = document.createElement('div');
  root = container;

  const Component = routes[getPath()];
  currentComponent = Component || NotFound;
  container.appendChild(currentComponent());

  // Re-render view when the URL hash changes
  window.addEventListener('hashchange', updateView);

  // Subscribe to application state changes and re-render when they happen
  subscribe(updateView);

  return container;
}
