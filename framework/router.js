import { subscribe } from './state.js';

let routes = {};
let currentComponent = null;

export function defineRoutes(routeMap) {
  routes = routeMap;
}

export function navigate(path) {
  window.location.hash = path;
}

function getPath() {
  return window.location.hash.replace(/^#/, '') || '/';
}

function updateView() {
  const Component = routes[getPath()];
  currentComponent = Component || NotFound;
  rerender();
}

function NotFound() {
  const el = document.createElement('h1');
  el.textContent = '404 - Not Found';
  return el;
}

let root = null;


function rerender() {
  if (!root || !currentComponent) return;

  const active = document.activeElement;
  const selectionStart = active?.selectionStart;
  const selectionEnd = active?.selectionEnd;
  const id = active?.id;

  root.innerHTML = '';
  root.appendChild(currentComponent());

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

export function RouterView() {
  const container = document.createElement('div');
  root = container;

  const Component = routes[getPath()];
  currentComponent = Component || NotFound;
  container.appendChild(currentComponent());

  window.addEventListener('hashchange', updateView);

  subscribe(updateView);

  return container;
}
