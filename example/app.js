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

// Define application routes and their corresponding components
defineRoutes({
  '/': HomePage,
  '/actors': ActorList,
  '/genres': GenreList,
  '/movies': MovieList
});

/**
 * Re-render the application in response to state changes
 */
function rerender() {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
}

// Subscribe rerender to all global state changes
subscribe(rerender);

// Initial render on DOMContentLoaded
document.addEventListener('DOMContentLoaded', rerender);

/**
 * Home page component with navigation buttons
 */
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
