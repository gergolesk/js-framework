import { createElement } from '../framework/utils/dom.js';
import { createState } from '../framework/state.js';
import { defineRoutes, RouterView } from '../framework/router.js';
import { render } from '../framework/index.js';
import TodoApp from './todo.js';

defineRoutes({
  '/': TodoApp,
  '/todo': TodoApp,
});

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
});