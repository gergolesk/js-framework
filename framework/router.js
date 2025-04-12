import { subscribe } from './state.js';

let routes = {};
let notFoundComponent = () => document.createTextNode('404 - Not Found');

export function defineRoutes(routeMap) {
  routes = routeMap;
}

export function setNotFound(component) {
  notFoundComponent = component;
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  notifySubscribers();
}

function getCurrentPath() {
  return window.location.pathname;
}

function notifySubscribers() {
  subscribers.forEach((fn) => fn(getCurrentPath()));
}

const subscribers = new Set();

export function onRouteChange(listener) {
  subscribers.add(listener);
  window.addEventListener('popstate', () => listener(getCurrentPath()));
}

export function RouterView() {
  let currentPath = getCurrentPath();
  let currentComponent = routes[currentPath] || notFoundComponent;

  const container = document.createElement('div');
  container.appendChild(currentComponent());

  onRouteChange((newPath) => {
    currentPath = newPath;
    currentComponent = routes[currentPath] || notFoundComponent;
    container.innerHTML = '';
    container.appendChild(currentComponent());
  });

  return container;
}
