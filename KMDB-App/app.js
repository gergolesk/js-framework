//import { createApp, Router } from './path-to-framework/index.js'; // укажи путь к своему фреймворку
import { defineRoutes, RouterView } from '../framework/router.js';
import { render } from '../framework/render.js';

import MovieList from './components/MovieList.js';
import MoviePage from './components/MoviePage.js';
import NotFound from './components/NotFound.js';

defineRoutes({
  '/': MovieList,
  '/movie/:id': MoviePage,
  '*': NotFound,
});

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
});