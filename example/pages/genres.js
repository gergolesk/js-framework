import { API_BASE } from '../config.js';

import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';

const genres = createState([]);
const selectedGenreId = createState(null);
const editingGenreId = createState(null);
const genreMovies = createState({}); // объект: { [genreId]: [movies] }

onMount(async () => {
  const response = await httpRequest(`${API_BASE}/genres`);
  genres.set(response); 
});

async function toggleGenre(id) {
    const isSame = selectedGenreId.value === id;
    selectedGenreId.set(isSame ? null : id);
      
    if (!isSame && !genreMovies.value[id]) {
      const data = await httpRequest(`${API_BASE}/movies?genre=${id}`);
      genreMovies.set({ ...genreMovies.value, [id]: data.content || [] });
    }  
}

async function deleteGenre(genreId) {
    if (!confirm('Are you sure you want to delete this genre?')) return;
  
    await httpRequest(`${API_BASE}/genres/${genreId}?force=true`, 'DELETE');
  
    const response = await httpRequest(`${API_BASE}/genres`);
    genres.set(response);
}

function editGenre(genre) {
    editingGenreId.set(genre.id);
}
  
async function saveEdit(id, formData) {
    await httpRequest(`${API_BASE}/genres/${id}`, 'PATCH', formData);
    editingGenreId.set(null);  
    const response = await httpRequest(`${API_BASE}/genres`);
    genres.set(response);
}

function cancelEdit() {
    editingGenreId.set(null);
}

function GenreEditForm(genre) {
    // Локальные переменные живут при первом создании формы
    let name = genre.name || '';

    const nameInput = createElement('input', {
        name: 'name',
        type: 'text',
        placeholder: 'Name',
        value: name,
        onInput: e => name = e.target.value
    });

    return createElement('form', {
        onClick: e => e.stopPropagation(),
        onSubmit: e => {
        e.preventDefault();
        saveEdit(genre.id, {
            name
        });
        }
    },
        nameInput,
        createElement('button', {class: 'save-btn', type: 'submit' }, 'Save'),
        createElement('button', { type: 'button', class: 'cancel-btn', onClick: cancelEdit }, 'Cancel')
    );
}


export default function GenreList() {
    //console.log('Rendering GenreList, selectedGenreId =', selectedGenreId.value);

    const backButton = createElement('button', {
        class: 'back-btn',
        style: 'margin-bottom: 1rem;',
        onClick: () => history.back()
    }, '← Back');

    return createElement('div', { class: 'entity-list' },
        backButton,
        createElement('h2', {}, 'Genres'),
        ...genres.value.map(genre => {
        const isSelected = selectedGenreId.value === genre.id;
        const isEditing = editingGenreId.value === genre.id;
        const movies = genreMovies.value[genre.id] || [];

        return createElement('div', {
            class: 'entity-item',
            onClick: () => toggleGenre(genre.id)
        },
            createElement('div', { class: 'entity-header' },
            createElement('h3', {}, genre.name),
            createElement('div', {
                class: 'entity-actions',
                onClick: e => {e.stopPropagation();
                toggleGenre(genre.id)
                }
            },
                isEditing
                ? createElement('button', {
                    class: 'edit-btn',
                    onClick: (e) => { e.stopPropagation(); saveEdit(genre.id); }
                    }, 'Save')
                : createElement('button', {
                    class: 'edit-btn',
                    onClick: (e) => { e.stopPropagation(); editGenre(genre); }
                    }, 'Edit'),
                createElement('button', {
                class: 'delete-btn',
                onClick: (e) => { e.stopPropagation(); deleteGenre(genre.id); }
                }, 'Delete')
            )
            ),
            isSelected && createElement('div', { class: 'entity-details.open' },
            isEditing
                ? GenreEditForm(genre)
                : createElement('div', {},
                    createElement('h4', {}, 'Movies:'),
                    createElement('ol',  {class: 'styled-list'}, 
                        ...movies.map(m => createElement('li', {class: 'styled-list-item'}, `${m.title} (${m.releaseYear})`)))
                    
                )
            )
        );
        }),
        createElement('div', { style: 'margin-top: 2rem;' }, backButton)
    );
}