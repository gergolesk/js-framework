import { defineRoutes, RouterView } from '../framework/router.js';
import { render } from '../framework/render.js';
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