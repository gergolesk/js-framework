import { createApp, Router } from './path-to-framework/index.js'; // укажи путь к своему фреймворку

import MovieList from './components/MovieList.js';
import MoviePage from './components/MoviePage.js';
import NotFound from './components/NotFound.js';

const router = new Router({
  routes: {
    '/': MovieList,
    '/movie/:id': MoviePage,
  },
  notFound: NotFound
});

createApp(document.getElementById('app'), router);
