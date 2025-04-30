import { API_BASE } from '../config.js';

import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';

const actors = createState([]);
const selectedActorId = createState(null);
const editingActorId = createState(null);
const actorMovies = createState({}); // объект: { [actorId]: [movies] }
const editFormState = createState({});


onMount(async () => {
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response); 
});

async function toggleActor(id) {
    const isSame = selectedActorId.value === id;
    selectedActorId.set(isSame ? null : id);
  
    if (!isSame && !actorMovies.value[id]) {
      const data = await httpRequest(`${API_BASE}/movies?actor=${id}`);
      actorMovies.set({ ...actorMovies.value, [id]: data.content || [] });
    }
  
    // 🔁 Форсируем перерисовку
    actors.set([...actors.value]);
  }

async function deleteActor(actorId) {
    if (!confirm('Are you sure you want to delete this actor?')) return;
  
    await httpRequest(`${API_BASE}/actors/${actorId}?force=true`, 'DELETE');
  
    const response = await httpRequest(`${API_BASE}/actors`);
    actors.set(response);
}

function editActor(actor) {
    editingActorId.set(actor.id);
    editFormState.set({ name: actor.name, birthDate: actor.birthDate });
  }
  
  function handleInputChange(field, value) {
    editFormState.set({ ...editFormState.value, [field]: value });
  }
  
  async function saveEdit(actorId) {
    await httpRequest(`${API_BASE}/actors/${actorId}`, 'PATCH', editFormState.value);
    editingActorId.set(null);
    
    const response = await httpRequest(`${API_BASE}/actors`);
    actors.set(response);
  }

  export default function ActorList() {
    //console.log('Rendering ActorList, selectedActorId =', selectedActorId.value);

    const backButton = createElement('button', {
      class: 'back-btn',
      style: 'margin-bottom: 1rem;',
      onClick: () => history.back()
    }, '← Back');
  
    return createElement('div', { class: 'entity-list' },
      backButton,
      createElement('h2', {}, 'Actors'),
      ...actors.value.map(actor => {
        const isSelected = selectedActorId.value === actor.id;
        const isEditing = editingActorId.value === actor.id;
        const movies = actorMovies.value[actor.id] || [];
  
        return createElement('div', {
          class: 'entity-item',
          onClick: () => toggleActor(actor.id)
        },
          createElement('div', { class: 'entity-header' },
            createElement('h3', {}, actor.name),
            createElement('div', {
              class: 'entity-actions',
              onClick: e => {e.stopPropagation();
                toggleActor(actor.id)
              }
            },
              isEditing
                ? createElement('button', {
                    onClick: (e) => { e.stopPropagation(); saveEdit(actor.id); }
                  }, 'Save')
                : createElement('button', {
                    onClick: (e) => { e.stopPropagation(); editActor(actor); }
                  }, 'Edit'),
              createElement('button', {
                onClick: (e) => { e.stopPropagation(); deleteActor(actor.id); }
              }, 'Delete')
            )
          ),
          isSelected && createElement('div', { class: 'entity-details.open' },
            isEditing
              ? createElement('form', {
                  onClick: e => e.stopPropagation(),
                  onSubmit: e => { e.preventDefault(); saveEdit(actor.id); }
                },
                  createElement('input', {
                    type: 'text',
                    value: editFormState.value.name || '',
                    placeholder: 'Name',
                    onInput: e => handleInputChange('name', e.target.value)
                  }),
                  createElement('input', {
                    type: 'date',
                    value: editFormState.value.birthDate || '',
                    placeholder: 'Birthdate',
                    onInput: e => handleInputChange('birthDate', e.target.value)
                  }),
                  createElement('button', { type: 'submit' }, 'Save')
                )
              : createElement('div', {},
                  createElement('p', {}, `Birthdate: ${actor.birthDate}`),
                  createElement('h4', {}, 'Movies:'),
                  ...movies.map(m => createElement('div', {}, `${m.title} (${m.year})`))
                )
          )
        );
      }),
      createElement('div', { style: 'margin-top: 2rem;' }, backButton)
    );
  }
