import { API_BASE } from '../config.js';
import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { httpRequest } from '../../framework/utils/http.js';
import { LazyList } from '../../framework/utils/lazyList.js';

const movies = createState([]);
const genresList = createState([]);
const actorsList = createState([]);
const selectedMovieId = createState(null);
const editingMovieId = createState(null);
const filterLetter = createState('All');
const alphabet = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

// Загрузка фильмов, жанров, актёров
(async function fetchData() {
  const [moviesRes, genresRes, actorsRes] = await Promise.all([
    httpRequest(`${API_BASE}/movies?page=0&size=1000`),
    httpRequest(`${API_BASE}/genres?page=0&size=1000`),
    httpRequest(`${API_BASE}/actors?page=0&size=1000`)
  ]);
  movies.set(Array.isArray(moviesRes.content) ? moviesRes.content : moviesRes);
  genresList.set(Array.isArray(genresRes.content) ? genresRes.content : genresRes);
  actorsList.set(Array.isArray(actorsRes.content) ? actorsRes.content : actorsRes);
})();

function ensureVisible(id) {
  setTimeout(() => {
    const selector = `.entity-item[data-movie-id="${id}"]`;
    let el = document.querySelector(selector);
    const container = document.querySelector('.lazy-list');
    if (container && !el) {
      let prev;
      do {
        prev = container.childElementCount;
        container.scrollTop = container.scrollHeight;
        container.dispatchEvent(new Event('scroll'));
      } while (!document.querySelector(selector) && container.childElementCount > prev);
      el = document.querySelector(selector);
    }
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
}

function toggleMovie(id) {
  const was = selectedMovieId.value === id;
  selectedMovieId.set(was ? null : id);
  editingMovieId.set(null);
  if (!was) ensureVisible(id);
}

async function deleteMovie(id) {
  if (!confirm('Delete this movie?')) return;
  await httpRequest(`${API_BASE}/movies/${id}`, 'DELETE');
  const resp = await httpRequest(`${API_BASE}/movies?page=0&size=1000`);
  movies.set(Array.isArray(resp.content) ? resp.content : resp);
}

function namesToIds(names, dict) {
  if (!Array.isArray(names) || !Array.isArray(dict)) return [];
  return names
    .map(name => {
      const found = dict.find(item => item.name === name);
      return found ? Number(found.id) : null;
    })
    .filter(id => id !== null);
}

function editMovie(movie) {
  editingMovieId.set(movie.id);
  ensureVisible(movie.id);
}

function cancelEdit() {
  editingMovieId.set(null);
}

function renderCheckboxGroup(options, selectedIds, onChange) {
  const selectedNums = (selectedIds || []).map(Number);
  return createElement('div', { style: 'display:flex; flex-wrap:wrap; gap:1rem; margin:0.5rem 0;' },
    ...options.map(opt =>
      createElement('label', { style: 'display:flex; align-items:center; gap:0.3em;' },
        createElement('input', {
          type: 'checkbox',
          checked: selectedNums.includes(Number(opt.id)),
          onChange: e => onChange(Number(opt.id), e.target.checked)
        }),
        opt.name
      )
    )
  );
}

// Основная форма редактирования, без глобального состояния на каждый ввод!
function MovieEditForm({ movie, onSave, onCancel, genresList, actorsList }) {
  // Инициализируем локальные переменные
  let title = movie.title ?? '';
  let releaseYear = movie.releaseYear ?? '';
  let duration = movie.duration ?? '';
  let genres = namesToIds(movie.genres, genresList);
  let actors = namesToIds(movie.actors, actorsList);

  return createElement('form',
    {
      onClick: e => e.stopPropagation(),
      onSubmit: e => {
        e.preventDefault();
        onSave({
          title,
          releaseYear,
          duration,
          genres,
          actors
        });
      }
    },
    createElement('input', {
      type: 'text',
      value: title,
      placeholder: 'Title',
      onInput: e => (title = e.target.value)
    }),
    createElement('input', {
      type: 'number',
      value: releaseYear,
      placeholder: 'Release Year',
      onInput: e => (releaseYear = e.target.value)
    }),
    createElement('input', {
      type: 'number',
      value: duration,
      placeholder: 'Duration (min)',
      onInput: e => (duration = e.target.value)
    }),
    createElement('label', { style: 'margin-top:0.5em; font-weight:bold;' }, 'Genres:'),
    renderCheckboxGroup(
      genresList || [],
      genres,
      (id, checked) => {
        id = Number(id);
        if (checked && !genres.includes(id)) genres.push(id);
        if (!checked) genres = genres.filter(g => g !== id);
      }
    ),
    createElement('label', { style: 'margin-top:0.5em; font-weight:bold;' }, 'Actors:'),
    createElement('div', {
      class: 'actor-checkbox-list'
    },
      renderCheckboxGroup(
        [...(actorsList || [])].sort((a, b) => a.name.localeCompare(b.name)),
        actors,
        (id, checked) => {
          id = Number(id);
          if (checked && !actors.includes(id)) actors.push(id);
          if (!checked) actors = actors.filter(a => a !== id);
        }
      )
    ),
    createElement('div', { class: 'edit-actions' },
      createElement('button', { type: 'submit', class: 'save-btn' }, 'Save'),
      createElement('button', { type: 'button', class: 'cancel-btn', onClick: onCancel }, 'Cancel')
    )
  );
}

async function saveEdit(id, f) {
  const updated = {
    title:       f.title,
    releaseYear: Number(f.releaseYear),
    duration:    Number(f.duration),
    genres:      (f.genres || []).map(i => ({ id: i })),
    actors:      (f.actors || []).map(i => ({ id: i }))
  };
  await httpRequest(`${API_BASE}/movies/${id}`,'PATCH',updated,{ 'Content-Type': 'application/json' });
  const resp = await httpRequest(`${API_BASE}/movies?page=0&size=1000`);
  movies.set(Array.isArray(resp.content) ? resp.content : resp);
  editingMovieId.set(null);
  ensureVisible(id);
}

export default function MovieList() {
  const filtered = movies.value
    .filter(m => filterLetter.value === 'All' || m.title[0].toUpperCase() === filterLetter.value)
    .sort((a, b) => a.title.localeCompare(b.title));

  function renderMovie(movie) {
    const isSel = selectedMovieId.value === movie.id;
    const isEd  = editingMovieId.value === movie.id;
    const genresReady = Array.isArray(genresList.value) && genresList.value.length > 0;
    const actorsReady = Array.isArray(actorsList.value) && actorsList.value.length > 0;

    const showNames = arr => Array.isArray(arr) && arr.length
      ? arr.join(', ')
      : 'None';

    return createElement('div',
      { class: 'entity-item', 'data-movie-id': movie.id, onClick: () => toggleMovie(movie.id) },
      createElement('div',
        { class: 'entity-header' },
        createElement('h3', { class: 'entity-title' }, `${movie.title} (${movie.releaseYear})`),
        createElement('div',
          { class: 'entity-actions', onClick: e => e.stopPropagation() },
          createElement('button', { class: 'edit-btn', onClick: e => { e.stopPropagation(); editMovie(movie); } }, 'Edit'),
          createElement('button', { class: 'delete-btn', onClick: e => { e.stopPropagation(); deleteMovie(movie.id); } }, 'Delete')
        )
      ),
      createElement('div',
        { class: `entity-details${isSel ? ' open' : ''}` },
        isSel && (isEd
          ? (genresReady && actorsReady
              ? MovieEditForm({
                  movie,
                  onSave: (formData) => saveEdit(movie.id, formData),
                  onCancel: cancelEdit,
                  genresList: genresList.value,
                  actorsList: actorsList.value
                })
              : createElement('div', {}, 'Loading dictionaries...')
            )
          : createElement('div', {},
              createElement('p', {}, `Duration: ${movie.duration} min`),
              createElement('p', {}, `Genres: ${showNames(movie.genres)}`),
              createElement('p', {}, `Actors: ${showNames(movie.actors)}`)
            )
        )
      )
    );
  }

  const content = filtered.length
    ? LazyList({ items: filtered, renderItem: renderMovie, pageSize: 20 })
    : createElement('p', { class: 'no-movies' }, 'No movies found.');

  return createElement('div',
    { class: 'entity-list' },
    createElement('button',
      { class: 'back-btn', style: 'margin-bottom:1rem;', onClick: () => history.back() },
      '← Back'
    ),
    createElement('h2', {}, 'Movies'),
    createElement('div',
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
    ),
    content
  );
}
