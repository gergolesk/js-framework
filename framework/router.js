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
  root.innerHTML = '';
  root.appendChild(currentComponent());
}

export function RouterView() {
  const container = document.createElement('div');
  root = container;

  const Component = routes[getPath()];
  currentComponent = Component || NotFound;
  container.appendChild(currentComponent());

  window.addEventListener('hashchange', updateView);

  return container;
}
