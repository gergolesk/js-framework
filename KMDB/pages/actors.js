import { API_BASE } from '../config.js';

import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';

const actors = createState([]);
const selectedActorId = createState(null);
const editingActorId = createState(null);
const actorMovies = createState({}); // объект: { [actorId]: [movies] }

onMount(async () => {
  const response = await httpRequest(`${API_BASE}/actors`);
  actors.set(response); 
});

async function toggleActor(id) {
    const isSame = selectedActorId.value === id;
    selectedActorId.set(selectedActorId.value === id ? null : id);
    //editingMovieId.set(null); // Закрыть форму редактирования при открытии другого фильма
    if (!isSame && !actorMovies.value[id]) {
        const movies = await httpRequest(`${API_BASE}/movies?actor=${id}`);
        actorMovies.set({ ...actorMovies.value, [id]: movies.content });
        
      }
}

async function deleteActor(actorId) {
    if (!confirm('Are you sure you want to delete this actor?')) return;
  
    await httpRequest(`${API_BASE}/actors/${actorId}`, 'DELETE');
  
    const response = await httpRequest(`${API_BASE}/actors`);
    actors.set(response);
}

/*
export default function ActorList() {
  const backButton = createElement('button', {
    class: 'back-btn',
    style: 'margin-bottom: 1rem;',
    onClick: () => history.back()
  }, '← Back');

  return createElement('div', { class: 'movie-list' },
    backButton,
    createElement('h2', {}, 'Actors'),
    ...actors.value.map(actor => {
      const isSelected = selectedActorId.value === actor.id;
      const isEditing = editingActorId.value === actor.id;

      return createElement('div', {
        class: 'movie-item',
        onClick: () => toggleActor(actor.id)
      },
        createElement('div', {
          class: 'movie-header'
        },
          createElement('h3', { class: 'movie-title' }, `${actor.name}`),
          createElement('div', { class: 'movie-actions', onClick: (e) => e.stopPropagation() },
            createElement('button', { class: 'edit-btn', onClick: () => editActor(actor) }, 'Edit'),
            createElement('button', { class: 'delete-btn', onClick: () => deleteActor(actor.id) }, 'Delete')
          )
        ),
        createElement('div', {
          class: `movie-details${isSelected ? ' open' : ''}`
        },
          isSelected && (isEditing
            ? createElement('form', { onClick: (e) => e.stopPropagation(), onSubmit: (e) => { e.preventDefault(); saveEdit(actor.id); } },
                createElement('input', {
                  type: 'number',
                  value: editFormState.value.birthDate || '',
                  placeholder: 'Birthdate',
                  onInput: e => handleInputChange('birthDate', e.target.value)
                })
              )
            : createElement('div', {},
                createElement('p', {}, `Birthdate: ${actor.birthDate}`)
              )
          )
        )
      );
    }),
    createElement('div', { style: 'margin-top: 2rem;' }, backButton)
  );
}
*/

export default function ActorList() {
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
        const movies = actorMovies.value[actor.id] || [];
  
        return createElement('div', {
          class: 'entity-item',
          onClick: () => toggleActor(actor.id)
        },
          createElement('div', { class: 'entity-header' },
            createElement('h3', {}, actor.name),
            createElement('div', {
              class: 'entity-actions',
              onClick: e => e.stopPropagation()
            },
              createElement('button', { class: 'delete-btn', onClick: () => deleteActor(actor.id) }, 'Delete')
            )
          ),
          isSelected && createElement('div', { class: 'movie-movies' },
            createElement('p', {}, `Birthdate: ${actor.birthDate}`),
            createElement('h4', {}, 'Movies:'),
            ...movies.map(m =>
              createElement('div', {}, `${m.title} (${m.releaseYear})`)
            )
          )
        );
      }),
      createElement('div', { style: 'margin-top: 2rem;' }, backButton)
    );
  }
