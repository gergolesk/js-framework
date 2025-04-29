import { API_BASE } from './config.js';

import { createElement } from '../framework/utils/dom.js';
import { createState } from '../framework/state.js';
import { onMount } from '../framework/utils/lifecycle.js';
import { httpRequest } from '../framework/utils/http.js';

const movies = createState([]);
const selectedMovieId = createState(null);
const editingMovieId = createState(null);
const editFormState = createState({});

onMount(async () => {
  const response = await httpRequest(`${API_BASE}/movies?page=0&size=90`);
  movies.set(response.content); 
});

function toggleMovie(id) {
    selectedMovieId.set(selectedMovieId.value === id ? null : id);
    editingMovieId.set(null); // Закрыть форму редактирования при открытии другого фильма

}

async function deleteMovie(movieId) {
  if (!confirm('Are you sure you want to delete this movie?')) return;
  
  await httpRequest(
    `${API_BASE}/movies/${movieId}`,
    'DELETE'
  );

  // Refresh movies list after deletion
  const response = await httpRequest(`${API_BASE}/movies?page=0&size=90`);
  movies.set(response.content);
}

function editMovie(movie) {
  editingMovieId.set(movie.id);
  editFormState.set({ 
    title: movie.title,
    releaseYear: movie.releaseYear,
    duration: movie.duration,
    genres: movie.genres.join(', '),
    actors: movie.actors.join(', ')
  });
}

function cancelEdit() {
  editingMovieId.set(null);
}

async function saveEdit(movieId) {
  const updatedMovie = {
    ...editFormState.value,
    genres: editFormState.value.genres.split(',').map(g => g.trim()),
    actors: editFormState.value.actors.split(',').map(a => a.trim()),
  };

  await httpRequest(
    `${API_BASE}/movies/${movieId}`,
    'PATCH',
    JSON.stringify(updatedMovie),
    { 'Content-Type': 'application/json' }
  );

  const response = await httpRequest(`${API_BASE}/movies`);
  movies.set(response.content);
  editingMovieId.set(null);
}

function handleInputChange(field, value) {
  editFormState.set({ ...editFormState.value, [field]: value });
}
/*
export default function MovieList() {
  return createElement('div', { class: 'movie-list' },
    createElement('h2', {}, 'Movies'),
    ...movies.value.map(movie => {
      const isSelected = selectedMovieId.value === movie.id;
      const isEditing = editingMovieId.value === movie.id;

      return createElement('div', {
        class: 'movie-item',
        onClick: () => toggleMovie(movie.id)
      },
        createElement('div', {
          class: 'movie-header'
        },
          createElement('h3', { class: 'movie-title' }, `${movie.title} (${movie.releaseYear})`),
          createElement('div', { class: 'movie-actions', onClick: (e) => e.stopPropagation() },
            createElement('button', { class: 'edit-btn', onClick: () => editMovie(movie) }, 'Edit'),
            createElement('button', { class: 'delete-btn', onClick: () => deleteMovie(movie.id) }, 'Delete')
          )
        ),
        createElement('div', {
          class: `movie-details${isSelected ? ' open' : ''}`
        },
          isSelected && (isEditing
            ? createElement('form', { onClick: (e) => e.stopPropagation(), onSubmit: (e) => { e.preventDefault(); saveEdit(movie.id); } },
                createElement('input', {
                  type: 'text',
                  value: editFormState.value.title || '',
                  placeholder: 'Title',
                  onInput: e => handleInputChange('title', e.target.value)
                }),
                createElement('input', {
                  type: 'number',
                  value: editFormState.value.releaseYear || '',
                  placeholder: 'Release Year',
                  onInput: e => handleInputChange('releaseYear', e.target.value)
                }),
                createElement('input', {
                  type: 'number',
                  value: editFormState.value.duration || '',
                  placeholder: 'Duration (min)',
                  onInput: e => handleInputChange('duration', e.target.value)
                }),
                createElement('input', {
                  type: 'text',
                  value: editFormState.value.genres || '',
                  placeholder: 'Genres (comma separated)',
                  onInput: e => handleInputChange('genres', e.target.value)
                }),
                createElement('input', {
                  type: 'text',
                  value: editFormState.value.actors || '',
                  placeholder: 'Actors (comma separated)',
                  onInput: e => handleInputChange('actors', e.target.value)
                }),
                createElement('div', { class: 'edit-actions' },
                  createElement('button', { type: 'submit', class: 'save-btn' }, 'Save'),
                  createElement('button', { type: 'button', class: 'cancel-btn', onClick: cancelEdit }, 'Cancel')
                )
              )
            : createElement('div', {},
                createElement('p', {}, `Duration: ${movie.duration} min`),
                createElement('p', {}, `Genres: ${movie.genres.join(', ') || 'None'}`),
                createElement('p', {}, `Actors: ${movie.actors.join(', ') || 'None'}`)
              )
          )
        )
      );
    })
  );
}
  */
export default function MovieList() {
  const backButton = createElement('button', {
    class: 'back-btn',
    style: 'margin-bottom: 1rem;',
    onClick: () => history.back()
  }, '← Back');

  return createElement('div', { class: 'movie-list' },
    backButton,
    createElement('h2', {}, 'Movies'),
    ...movies.value.map(movie => {
      const isSelected = selectedMovieId.value === movie.id;
      const isEditing = editingMovieId.value === movie.id;

      return createElement('div', {
        class: 'movie-item',
        onClick: () => toggleMovie(movie.id)
      },
        createElement('div', {
          class: 'movie-header'
        },
          createElement('h3', { class: 'movie-title' }, `${movie.title} (${movie.releaseYear})`),
          createElement('div', { class: 'movie-actions', onClick: (e) => e.stopPropagation() },
            createElement('button', { class: 'edit-btn', onClick: () => editMovie(movie) }, 'Edit'),
            createElement('button', { class: 'delete-btn', onClick: () => deleteMovie(movie.id) }, 'Delete')
          )
        ),
        createElement('div', {
          class: `movie-details${isSelected ? ' open' : ''}`
        },
          isSelected && (isEditing
            ? createElement('form', { onClick: (e) => e.stopPropagation(), onSubmit: (e) => { e.preventDefault(); saveEdit(movie.id); } },
                createElement('input', {
                  type: 'text',
                  value: editFormState.value.title || '',
                  placeholder: 'Title',
                  onInput: e => handleInputChange('title', e.target.value)
                }),
                createElement('input', {
                  type: 'number',
                  value: editFormState.value.releaseYear || '',
                  placeholder: 'Release Year',
                  onInput: e => handleInputChange('releaseYear', e.target.value)
                }),
                createElement('input', {
                  type: 'number',
                  value: editFormState.value.duration || '',
                  placeholder: 'Duration (min)',
                  onInput: e => handleInputChange('duration', e.target.value)
                }),
                createElement('input', {
                  type: 'text',
                  value: editFormState.value.genres || '',
                  placeholder: 'Genres (comma separated)',
                  onInput: e => handleInputChange('genres', e.target.value)
                }),
                createElement('input', {
                  type: 'text',
                  value: editFormState.value.actors || '',
                  placeholder: 'Actors (comma separated)',
                  onInput: e => handleInputChange('actors', e.target.value)
                }),
                createElement('div', { class: 'edit-actions' },
                  createElement('button', { type: 'submit', class: 'save-btn' }, 'Save'),
                  createElement('button', { type: 'button', class: 'cancel-btn', onClick: cancelEdit }, 'Cancel')
                )
              )
            : createElement('div', {},
                createElement('p', {}, `Duration: ${movie.duration} min`),
                createElement('p', {}, `Genres: ${movie.genres.join(', ') || 'None'}`),
                createElement('p', {}, `Actors: ${movie.actors.join(', ') || 'None'}`)
              )
          )
        )
      );
    }),
    createElement('div', { style: 'margin-top: 2rem;' }, backButton)
  );
}