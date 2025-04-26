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
    return createElement('div', { className: 'movie-list', style: 'padding: 1rem; max-width: 600px; margin: auto;' },
      createElement('h2', {}, 'Movies'),
      ...movies.value.map(movie => {
        const isSelected = selectedMovieId.value === movie.id;
        return createElement('div', {
          style: 'border: 1px solid #ccc; margin-bottom: 1rem; border-radius: 8px; overflow: hidden; transition: box-shadow 0.3s;',
          onClick: () => toggleMovie(movie.id)
        },
          createElement('div', {
            style: 'padding: 1rem; cursor: pointer; background: #f9f9f9;'
          },
            createElement('h3', { style: 'margin: 0;' }, movie.title + ` (${movie.releaseYear})`)
          ),
          createElement('div', {
            style: `
              max-height: ${isSelected ? '500px' : '0'};
              opacity: ${isSelected ? '1' : '0'};
              overflow: hidden;
              transition: max-height 0.5s ease, opacity 0.5s ease;
              background: #fff;
              padding: ${isSelected ? '1rem' : '0 1rem'};
            `
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
