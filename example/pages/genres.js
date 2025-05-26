import { API_BASE } from '../config.js';

import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';
import { createComponent } from '../../framework/core/component.js';

// State for the list of genres
const genres = createState([]);
// State for currently selected genre
const selectedGenreId = createState(null);
// State for the genre being edited
const editingGenreId = createState(null);
// State for movies by genre id: { [genreId]: [movies] }
const genreMovies = createState({});
// State for genre adding
const creatingGenre = createState(null);

// Fetch the genres list on component mount
onMount(async () => {
    const response = await httpRequest(`${API_BASE}/genres`);
    genres.set(response);
});

/**
 * Handles selecting/deselecting a genre, loading movies if needed
 */
async function toggleGenre(id) {
    const isSame = selectedGenreId.value === id;
    selectedGenreId.set(isSame ? null : id);

    // Fetch movies for genre if not already loaded
    if (!isSame && !genreMovies.value[id]) {
        const data = await httpRequest(`${API_BASE}/movies?genre=${id}`);
        genreMovies.set({ ...genreMovies.value, [id]: data.content || [] });
    }
}

/*
    Adds a genre
*/
async function createGenre(formData) {
    await httpRequest(`${API_BASE}/genres`, 'POST', formData);
    creatingGenre.set(false);
    const response = await httpRequest(`${API_BASE}/genres`);
    genres.set(response);
}

/**
 * Deletes the genre after confirmation and refreshes the list
 */
async function deleteGenre(genreId) {
    if (!confirm('Are you sure you want to delete this genre?')) return;

    await httpRequest(`${API_BASE}/genres/${genreId}?force=true`, 'DELETE');

    const response = await httpRequest(`${API_BASE}/genres`);
    genres.set(response);
}

/**
 * Enters edit mode for the genre
 */
function editGenre(genre) {
    selectedGenreId.set(genre.id);
    editingGenreId.set(genre.id);
}

/**
 * Saves the genre changes and refreshes the list
 */
async function saveEdit(id, formData) {
    await httpRequest(`${API_BASE}/genres/${id}`, 'PATCH', formData);
    editingGenreId.set(null);
    const response = await httpRequest(`${API_BASE}/genres`);
    genres.set(response);
}

/**
 * Cancels editing mode
 */
function cancelEdit() {
    editingGenreId.set(null);
}

/**
 * Edit form component for a genre
 */
function GenreEditForm(genre = {}, { onSave, onCancel }) {
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
            onSave({ name });
        }
    },
        nameInput,
        createElement('button', { class: 'save-btn', type: 'submit' }, 'Save'),
        createElement('button', { type: 'button', class: 'cancel-btn', onClick: onCancel }, 'Cancel')
    );
}

// === Главная реактивная функция рендера ===
function renderGenreList() {
    // Кнопка "назад"
    const backButton = createElement('button', {
        class: 'back-btn',
        style: 'margin-bottom: 1rem;',
        onClick: () => history.back()
    }, '← Back');

    const addGenreButton = createElement(
        'button',
        {
            class: 'add-btn accent-btn',
            onClick: () => creatingGenre.set(true),
            style: 'margin-bottom: 1rem'
        },
        '+ Add Genre'
    );

    const createForm = creatingGenre.value
        ? GenreEditForm({}, {
            onSave: createGenre,
            onCancel: () => creatingGenre.set(false)
        })
        : null;

    const sortedGenres = [...genres.value].sort((a, b) => a.name.localeCompare(b.name));

    // Рендер списка жанров
    return createElement('div', { class: 'entity-list' },
        backButton,
        createElement('h2', {}, 'Genres'),
        addGenreButton,
        createForm,
        ...sortedGenres.map(genre => {
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
                        onClick: e => {
                            e.stopPropagation();
                            toggleGenre(genre.id)
                        }
                    },
                        createElement('button', {
                            class: 'edit-btn',
                            onClick: (e) => {
                                e.stopPropagation();
                                editGenre(genre);
                            }
                        }, 'Edit'),
                        createElement('button', {
                            class: 'delete-btn',
                            onClick: (e) => { e.stopPropagation(); deleteGenre(genre.id); }
                        }, 'Delete')
                    )
                ),
                // Show movies and/or edit form when selected
                isSelected && createElement('div', { class: 'entity-details open' },
                    isEditing
                        ? GenreEditForm(genre, {
                            onSave: data => saveEdit(genre.id, data),
                            onCancel: cancelEdit
                        })
                        : createElement('div', {},
                            createElement('h4', {}, 'Movies:'),
                            createElement('ol', { class: 'styled-list' },
                                ...movies.map(m => createElement('li', { class: 'styled-list-item' }, `${m.title} (${m.releaseYear})`)))
                        )
                )
            );
        }),
        // Duplicate back button at the bottom for convenience
        createElement('div', { style: 'margin-top: 2rem;' }, backButton)
    );
}

// Exporting a reactive component
export default (props = {}) => createComponent(renderGenreList, props);
