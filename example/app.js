import { API_BASE } from './config.js';

import { createElement } from '../framework/utils/dom.js';
import { createState, subscribe } from '../framework/state.js';
import { defineRoutes, navigate, RouterView } from '../framework/router.js';
import { onMount } from '../framework/utils/lifecycle.js';
import { httpRequest } from '../framework/utils/http.js';
import { render } from '../framework/render.js';

import MovieList from './pages/movies.js';
import ActorList from './pages/actors.js';
import GenreList from './pages/genres.js';

const actors = createState([]);
const genres = createState([]);
const movies = createState([]);

defineRoutes({
  '/': HomePage,
  '/actors': ActorList,
  '/genres': GenreList,
  '/movies': MovieList
});

function rerender() {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
}

subscribe(rerender);

/*
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
});
*/

document.addEventListener('DOMContentLoaded', rerender);

async function loadActors() {
  const data = await httpRequest(`${API_BASE}/actors`);
  actors.set(data);
}

async function loadGenres() {
  const data = await httpRequest(`${API_BASE}/genres`);
  genres.set(data);
}

async function loadMovies() {
  const data = await httpRequest(`${API_BASE}/movies`);
  const moviesList = data.content;
  movies.set(moviesList);
}

onMount(() => {
  loadActors();
  loadGenres();
  loadMovies();
});

// Страницы

function HomePage() {
  return createElement('div', { class: 'homepage' },
    createElement('h1', { class: 'homepage-title' }, '🎬 Movie App'),

    createElement('p', { class: 'homepage-description' },
      'Welcome to your personal movie database!'
    ),

    createElement('nav', { class: 'homepage-nav' },
      createElement('button', {
        class: 'homepage-button',
        onClick: () => navigate('/actors')
      }, 'Actors'),

      createElement('button', {
        class: 'homepage-button',
        onClick: () => navigate('/genres')
      }, 'Genres'),

      createElement('button', {
        class: 'homepage-button',
        onClick: () => navigate('/movies')
      }, 'Movies')
    )
  );
}


export default HomePage;
