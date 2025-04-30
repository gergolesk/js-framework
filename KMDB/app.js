import { API_BASE } from './config.js';

import { createElement } from '../framework/utils/dom.js';
import { createState } from '../framework/state.js';
import { defineRoutes, navigate, RouterView } from '../framework/router.js';
import { onMount } from '../framework/utils/lifecycle.js';
import { httpRequest } from '../framework/utils/http.js';
import { render } from '../framework/render.js';

import MovieList from './pages/movies.js';
import ActorList from './pages/actors.js';

const actors = createState([]);
const genres = createState([]);
const movies = createState([]);

defineRoutes({
  '/': HomePage,
  '/actors': ActorList,
  '/genres': GenresPage,
  '/movies': MovieList
});

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
});

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
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h1', {}, 'Movie App'),
    createElement('nav', { style: 'margin-bottom: 1rem;' },
      createElement('button', { onClick: () => navigate('/actors') }, 'Actors'),
      createElement('button', { onClick: () => navigate('/genres') }, 'Genres'),
      createElement('button', { onClick: () => navigate('/movies') }, 'Movies')
    ),
    createElement('p', {}, 'Welcome to the movie database!')
  );
}

function ActorsPage() {
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h2', {}, 'Actors'),
    ...actors.value.map(actor => createElement('div', { style: 'margin-bottom: 0.5rem;' }, actor.name))
  );
}

function GenresPage() {
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h2', {}, 'Genres'),
    ...genres.value.map(genre => createElement('div', { style: 'margin-bottom: 0.5rem;' }, genre.name))
  );
}

/*
function MoviesPage() {
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h2', {}, 'Movies'),
    ...movies.value.map(movie => createElement('div', { style: 'margin-bottom: 0.5rem;' }, movie.title))
  );
}
*/
export default HomePage;
