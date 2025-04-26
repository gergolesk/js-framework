import { API_BASE } from './config.js';

import { createElement } from '../framework/utils/dom.js';
import { createState } from '../framework/state.js';
import { onMount } from '../framework/utils/lifecycle.js';
import { httpRequest } from '../framework/utils/http.js';

const movies = createState([]);
const selectedMovieId = createState(null);

onMount(async () => {
  const response = await httpRequest(`${API_BASE}/movies`);
  movies.set(response.content); 
});

function toggleMovie(id) {
    selectedMovieId.set(selectedMovieId.value === id ? null : id);
}

export default function MovieList() {
  return createElement('div', { class: 'movie-list' },
    createElement('h2', {}, 'Movies'),
    ...movies.value.map(movie => {
      const isSelected = selectedMovieId.value === movie.id;
      return createElement('div', {
        class: 'movie-item',
        onClick: () => toggleMovie(movie.id)
      },
        createElement('div', {
          class: 'movie-header'
        },
          createElement('h3', { class: 'movie-title' }, `${movie.title} (${movie.releaseYear})`)
        ),
        createElement('div', {
          class: `movie-details${isSelected ? ' open' : ''}`
        },
          isSelected && createElement('div', {},
            createElement('p', {}, `Duration: ${movie.duration} min`),
            createElement('p', {}, `Genres: ${movie.genres.join(', ') || 'None'}`),
            createElement('p', {}, `Actors: ${movie.actors.join(', ') || 'None'}`)
          )
        )
      );
    })
  );
}

 