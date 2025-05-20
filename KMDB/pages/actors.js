import { API_BASE } from '../config.js';

import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';
import { LazyList } from '../../framework/utils/lazyList.js';

const actors = createState([]);
const selectedActorId = createState(null);
const editingActorId = createState(null);
const actorMovies = createState({});  // { [actorId]: [movies] }
const filterLetter = createState('All');

// буквы A–Z + “All”
const alphabet = ['All', ...Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)];

onMount(async () => {
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
});

// универсальная функция: докачивает страницы, а затем плавно скроллит нужный элемент
function ensureVisible(id) {
  requestAnimationFrame(() => {
    const selector = `.entity-item[data-actor-id="${id}"]`;
    let el = document.querySelector(selector);
    const container = document.querySelector('.lazy-list');

    if (container && !el) {
      let prevCount;
      // докачиваем, пока элемент не появится
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

async function toggleActor(id) {
  const wasSelected = selectedActorId.value === id;
  selectedActorId.set(wasSelected ? null : id);

  if (!wasSelected && !actorMovies.value[id]) {
    const data = await httpRequest(`${API_BASE}/movies?actor=${id}`);
    actorMovies.set({ ...actorMovies.value, [id]: data.content || [] });
  }

  if (!wasSelected) {
    ensureVisible(id);
  }
}

async function deleteActor(actorId) {
  if (!confirm('Are you sure you want to delete this actor?')) return;

  await httpRequest(`${API_BASE}/actors/${actorId}?force=true`, 'DELETE');
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
}

function editActor(actor) {
  editingActorId.set(actor.id);
  // прокручиваем карточку в момент включения режима редактирования
  ensureVisible(actor.id);
}

async function saveEdit(id, formData) {
  await httpRequest(`${API_BASE}/actors/${id}`, 'PATCH', formData);
  editingActorId.set(null);

  // обновляем весь список (перерендерит) и затем скроллим
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
  ensureVisible(id);
}

function cancelEdit() {
  editingActorId.set(null);
}

function ActorEditForm(actor) {
  let name = actor.name || '';
  let birthDate = actor.birthDate || '';

  const nameInput = createElement('input', {
    name: 'name',
    type: 'text',
    placeholder: 'Name',
    value: name,
    onInput: e => name = e.target.value
  });

  const birthDateInput = createElement('input', {
    name: 'birthDate',
    type: 'date',
    placeholder: 'Birthdate',
    value: birthDate,
    onInput: e => birthDate = e.target.value
  });

  return createElement('form',
    {
      onClick: e => e.stopPropagation(),
      onSubmit: e => {
        e.preventDefault();
        saveEdit(actor.id, { name, birthDate });
      }
    },
    nameInput,
    birthDateInput,
    createElement('button', { class: 'save-btn', type: 'submit' }, 'Save'),
    createElement('button', { type: 'button', class: 'cancel-btn', onClick: cancelEdit }, 'Cancel')
  );
}

export default function ActorList() {
  const filteredActors = actors.value
    .filter(a =>
      filterLetter.value === 'All' ||
      a.name.toUpperCase().startsWith(filterLetter.value)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const backButton = createElement(
    'button',
    { class: 'back-btn', onClick: () => history.back() },
    '← Back'
  );

  const alphabetNav = createElement(
    'div',
    {
      class: 'alphabet-nav',
      style: 'display:flex; flex-wrap: wrap; gap:0.5rem; margin:1rem 0;'
    },
    ...alphabet.map(letter =>
      createElement(
        'button',
        {
          class: filterLetter.value === letter ? 'letter-btn active' : 'letter-btn',
          onClick: () => filterLetter.set(letter)
        },
        letter
      )
    )
  );

  function renderActor(actor) {
    const isSelected = selectedActorId.value === actor.id;
    const isEditing = editingActorId.value === actor.id;
    const moviesList = actorMovies.value[actor.id] || [];

    return createElement('div',
      {
        class: 'entity-item',
        'data-actor-id': actor.id,
        onClick: () => toggleActor(actor.id)
      },
      createElement('div',
        { class: 'entity-header' },
        createElement('h3', { class: 'entity-title' }, actor.name),
        createElement('div',
          {
            class: 'entity-actions',
            onClick: e => e.stopPropagation()
          },
          isEditing
            ? createElement('button',
                {
                  class: 'save-btn',
                  onClick: e => {
                    e.stopPropagation();
                    saveEdit(actor.id, { name: actor.name, birthDate: actor.birthDate });
                  }
                },
                'Save'
              )
            : createElement('button',
                {
                  class: 'edit-btn',
                  onClick: e => {
                    e.stopPropagation();
                    editActor(actor);
                  }
                },
                'Edit'
              ),
          createElement('button',
            {
              class: 'delete-btn',
              onClick: e => {
                e.stopPropagation();
                deleteActor(actor.id);
              }
            },
            'Delete'
          )
        )
      ),
      createElement('div',
        { class: `entity-details${isSelected ? ' open' : ''}` },
        isSelected && (
          isEditing
            ? ActorEditForm(actor)
            : createElement('div',
                {},
                createElement('p', {}, `Birthdate: ${actor.birthDate}`),
                createElement('h4', {}, 'Movies:'),
                createElement('ol', { class: 'styled-list' },
                  ...moviesList.map(m =>
                    createElement('li', { class: 'styled-list-item' },
                      `${m.title} (${m.releaseYear})`
                    )
                  )
                )
              )
        )
      )
    );
  }

  const content = filteredActors.length === 0
    ? createElement('p', { class: 'no-actors' }, 'No actors found.')
    : LazyList({ items: filteredActors, renderItem: renderActor, pageSize: 20 });

  return createElement(
    'div',
    { class: 'entity-list' },
    backButton,
    createElement('h2', {}, 'Actors'),
    alphabetNav,
    content
  );
}
