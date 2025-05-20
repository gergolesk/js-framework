import { API_BASE } from '../config.js';
import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';
import { LazyList } from '../../framework/utils/lazyList.js';

const movies = createState([]);
const selectedMovieId = createState(null);
const editingMovieId = createState(null);
const editFormState = createState({});
const filterLetter = createState('All');

const alphabet = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

onMount(async () => {
  const response = await httpRequest(`${API_BASE}/movies?page=0&size=1000`);
  movies.set(response.content);
});

/** 
 * Докачивает следующую «страницу» LazyList, пока не найдёт карточку,
 * а затем плавно проскроллит её в центр.
 */
function ensureVisible(id) {
  requestAnimationFrame(() => {
    const selector = `.entity-item[data-movie-id="${id}"]`;
    let el = document.querySelector(selector);
    const container = document.querySelector('.lazy-list');

    if (container && !el) {
      let prevCount;
      do {
        prevCount = container.childElementCount;
        container.scrollTop = container.scrollHeight;
        container.dispatchEvent(new Event('scroll'));
      } while (!document.querySelector(selector) && container.childElementCount > prevCount);

      el = document.querySelector(selector);
    }

    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}

function toggleMovie(id) {
  const was = selectedMovieId.value === id;
  selectedMovieId.set(was ? null : id);
  editingMovieId.set(null);

  if (!was) {
    ensureVisible(id);
  }
}

async function deleteMovie(movieId) {
  if (!confirm('Are you sure you want to delete this movie?')) return;

  await httpRequest(`${API_BASE}/movies/${movieId}`, 'DELETE');

  const response = await httpRequest(`${API_BASE}/movies?page=0&size=1000`);
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
  ensureVisible(movie.id);
}

function cancelEdit() {
  editingMovieId.set(null);
}

async function saveEdit(movieId) {
  const updated = {
    ...editFormState.value,
    genres: editFormState.value.genres.split(',').map(g => g.trim()),
    actors: editFormState.value.actors.split(',').map(a => a.trim()),
  };

  await httpRequest(
    `${API_BASE}/movies/${movieId}`,
    'PATCH',
    JSON.stringify(updated),
    { 'Content-Type': 'application/json' }
  );

  const response = await httpRequest(`${API_BASE}/movies?page=0&size=1000`);
  movies.set(response.content);
  editingMovieId.set(null);

  ensureVisible(movieId);
}

function handleInputChange(field, value) {
  editFormState.set({ ...editFormState.value, [field]: value });
}

export default function MovieList() {
  const filtered = movies.value
    .filter(m => filterLetter.value === 'All' || m.title.toUpperCase().startsWith(filterLetter.value))
    .sort((a, b) => a.title.localeCompare(b.title));

  const backButton = createElement('button',
    { class: 'back-btn', style: 'margin-bottom:1rem;', onClick: () => history.back() },
    '← Back'
  );

  const alphabetNav = createElement('div',
    { style: 'display:flex; flex-wrap:wrap; gap:0.5rem; margin:1rem 0;' },
    ...alphabet.map(letter =>
      createElement('button',
        {
          class: filterLetter.value === letter ? 'letter-btn active' : 'letter-btn',
          onClick: () => filterLetter.set(letter)
        },
        letter
      )
    )
  );

  function renderMovie(movie) {
    const isSelected = selectedMovieId.value === movie.id;
    const isEditing = editingMovieId.value === movie.id;

    return createElement('div',
      {
        class: 'entity-item',
        'data-movie-id': movie.id,
        onClick: () => toggleMovie(movie.id)
      },
      createElement('div',
        { class: 'entity-header' },
        createElement('h3',
          { class: 'entity-title' },
          `${movie.title} (${movie.releaseYear})`
        ),
        createElement('div',
          {
            class: 'entity-actions',
            onClick: e => e.stopPropagation()
          },
          createElement('button',
            { class: 'edit-btn', onClick: e => { e.stopPropagation(); editMovie(movie); } },
            'Edit'
          ),
          createElement('button',
            { class: 'delete-btn', onClick: e => { e.stopPropagation(); deleteMovie(movie.id); } },
            'Delete'
          )
        )
      ),
      createElement('div',
        { class: `entity-details${isSelected ? ' open' : ''}` },
        isSelected && (isEditing
          ? createElement('form',
              {
                onClick: e => e.stopPropagation(),
                onSubmit: e => { e.preventDefault(); saveEdit(movie.id); }
              },
              createElement('input',
                {
                  type: 'text',
                  value: editFormState.value.title || '',
                  placeholder: 'Title',
                  onInput: e => handleInputChange('title', e.target.value)
                }
              ),
              createElement('input',
                {
                  type: 'number',
                  value: editFormState.value.releaseYear || '',
                  placeholder: 'Release Year',
                  onInput: e => handleInputChange('releaseYear', e.target.value)
                }
              ),
              createElement('input',
                {
                  type: 'number',
                  value: editFormState.value.duration || '',
                  placeholder: 'Duration (min)',
                  onInput: e => handleInputChange('duration', e.target.value)
                }
              ),
              createElement('input',
                {
                  type: 'text',
                  value: editFormState.value.genres || '',
                  placeholder: 'Genres (comma separated)',
                  onInput: e => handleInputChange('genres', e.target.value)
                }
              ),
              createElement('input',
                {
                  type: 'text',
                  value: editFormState.value.actors || '',
                  placeholder: 'Actors (comma separated)',
                  onInput: e => handleInputChange('actors', e.target.value)
                }
              ),
              createElement('div',
                { class: 'edit-actions' },
                createElement('button', { type: 'submit', class: 'save-btn' }, 'Save'),
                createElement('button', { type: 'button', class: 'cancel-btn', onClick: cancelEdit }, 'Cancel')
              )
            )
          : createElement('div',
              {},
              createElement('p', {}, `Duration: ${movie.duration} min`),
              createElement('p', {}, `Genres: ${movie.genres.join(', ') || 'None'}`),
              createElement('p', {}, `Actors: ${movie.actors.join(', ') || 'None'}`)
            )
        )
      )
    );
  }

  const content = filtered.length === 0
    ? createElement('p', { class: 'no-movies' }, 'No movies found.')
    : LazyList({ items: filtered, renderItem: renderMovie, pageSize: 20 });

  return createElement('div',
    { class: 'entity-list' },
    backButton,
    createElement('h2', {}, 'Movies'),
    alphabetNav,
    content
  );
}
