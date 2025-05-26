import { API_BASE, PAGE_SIZE } from '../config.js';
import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';
import { LazyList } from '../../framework/utils/lazyList.js';
import { createComponent } from '../../framework/core/component.js';

// State for the list of actors
const actors = createState([]);
// State for currently selected actor
const selectedActorId = createState(null);
// State for the actor being edited
const editingActorId = createState(null);
// State for movies by actor id: { [actorId]: [movies] }
const actorMovies = createState({});
// State for active letter filter
const filterLetter = createState('All');
// State for adding an actor
const creatingActor = createState(null);

// Letters A–Z + "All"
const alphabet = ['All', ...Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)];

// Fetch the actors list on component mount
onMount(async () => {
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
});

/**
 * Universal function: loads more pages if needed,
 * then smoothly scrolls the desired element into view
 */
function ensureVisible(id) {
  requestAnimationFrame(() => {
    const selector = `.entity-item[data-actor-id="${id}"]`;
    let el = document.querySelector(selector);
    const container = document.querySelector('.lazy-list');

    if (container && !el) {
      let prevCount;
      // Keep loading more until the element appears
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

/**
 * Handles selecting/deselecting an actor, loading movies if needed
 */
async function toggleActor(id) {
  const wasSelected = selectedActorId.value === id;
  selectedActorId.set(wasSelected ? null : id);

  // Fetch movies for actor if not already loaded
  if (!wasSelected && !actorMovies.value[id]) {
    const data = await httpRequest(`${API_BASE}/movies?actor=${id}`);
    actorMovies.set({ ...actorMovies.value, [id]: data.content || [] });
  }

  // Scroll the selected actor into view
  if (!wasSelected) {
    ensureVisible(id);
  }
}

/*
  Creates an actor
*/
async function createActor(formData) {
  await httpRequest(`${API_BASE}/actors`, 'POST', formData);
  creatingActor.set(false);

  // Обновить список актёров
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
}


/**
 * Deletes the actor after confirmation and refreshes the list
 */
async function deleteActor(actorId) {
  if (!confirm('Are you sure you want to delete this actor?')) return;

  await httpRequest(`${API_BASE}/actors/${actorId}?force=true`, 'DELETE');
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
}

/**
 * Enters edit mode for the actor, scrolling it into view
 */
function editActor(actor) {
  selectedActorId.set(actor.id); // Deselect if already selected
  editingActorId.set(actor.id);
}

/**
 * Saves the actor changes and refreshes the list, then scrolls into view
 */
async function saveEdit(id, formData) {
  await httpRequest(`${API_BASE}/actors/${id}`, 'PATCH', formData);
  editingActorId.set(null);

  // Refresh the entire list (re-render) and scroll to updated item
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response);
  ensureVisible(id);
}

/**
 * Cancels editing mode
 */
function cancelEdit() {
  editingActorId.set(null);
}

/**
 * Edit form component for an actor
 */
function ActorEditForm(actor = {}, { onSave, onCancel }) {
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
        onSave({ name, birthDate });
      }
    },
    nameInput,
    birthDateInput,
    createElement('button', { class: 'save-btn', type: 'submit' }, 'Save'),
    createElement('button', { type: 'button', class: 'cancel-btn', onClick: onCancel }, 'Cancel')
  );
}


/**
 * Main rendering function for the actor list with filtering and edit features
 */
function renderActorList() {
  // Filter actors by selected letter and sort alphabetically
  const filteredActors = actors.value
    .filter(a =>
      filterLetter.value === 'All' ||
      a.name.toUpperCase().startsWith(filterLetter.value)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Button to go back in navigation
  const backButton = createElement(
    'button',
    { class: 'back-btn', onClick: () => history.back() },
    '← Back'
  );

  //Add Actor Button
  const addActorButton = createElement(
    'button',
    {
      class: 'add-btn',
      onClick: () => creatingActor.set(true),
      style: 'margin-bottom: 1rem'
    },
    '+ Add Actor'
  );

  const createForm = creatingActor.value
    ? ActorEditForm({}, { 
        onSave: createActor,
        onCancel: () => creatingActor.set(false)
      })
    : null;

  // Alphabet navigation buttons for filtering
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

  /**
   * Renders a single actor item, including details, edit form, and actions
   */
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
            ? ActorEditForm(actor, {onSave: data => saveEdit(actor.id, data),onCancel: cancelEdit})
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

  // Show message if no actors found, otherwise render paginated lazy list
  const content = filteredActors.length === 0
    ? createElement('p', { class: 'no-actors' }, 'No actors found.')
    : LazyList({ items: filteredActors, renderItem: renderActor, pageSize: PAGE_SIZE });

  // Main render of the component
  return createElement(
    'div',
    { class: 'entity-list' },
    backButton,
    createElement('h2', {}, 'Actors'),
    addActorButton,
    createForm,
    alphabetNav,
    content
  );
}

// Exporting a reactive component
export default (props = {}) => createComponent(renderActorList, props);
