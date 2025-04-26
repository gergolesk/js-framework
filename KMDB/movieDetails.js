import { API_BASE } from './config.js';

import { createState } from '../framework/state.js';
import { onMount } from '../framework/utils/lifecycle.js';
import { httpRequest } from '../framework/utils/http.js';
import { createElement } from '../framework/utils/dom.js';

export default function MovieDetailPage({ params }) {
  const movie = createState(null);

  onMount(async () => {
    try {
      const response = await httpRequest(`${API_BASE}/movies/${params.id}`);
      movie.set(response);
    } catch (err) {
      console.error('Failed to load movie:', err.message);
    }
  });

  return createElement('div', { className: 'movie-detail-page', style: 'padding: 1rem;' },
    movie.value ? [
      createElement('h2', {}, movie.value.title),
      createElement('p', {}, `Release Year: ${movie.value.releaseYear}`),
      createElement('p', {}, `Duration: ${movie.value.duration} min`),
      createElement('p', {}, `Genres: ${movie.value.genres.join(', ')}`),
      createElement('p', {}, `Actors: ${movie.value.actors.join(', ')}`),
    ] : createElement('p', {}, 'Loading...')
  );
}
