import { API_BASE } from '../config.js';

import { createElement } from '../../framework/utils/dom.js';
import { createState } from '../../framework/state.js';
import { onMount } from '../../framework/utils/lifecycle.js';
import { httpRequest } from '../../framework/utils/http.js';

// State for the list of genres
const genres = createState([]);
// State for currently selected genre
const selectedGenreId = createState(null);
// State for the genre being edited
const editingGenreId = createState(null);
// State for movies by genre id: { [genreId]: [movies] }
const genreMovies = createState({});

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
    selectedGenreId.set(genre.id); // Deselect if already selected
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
function GenreEditForm(genre) {
    // Local variables live as long as the form exists
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
        createElement('button', { class: 'save-btn', type: 'submit' }, 'Save'),
        createElement('button', { type: 'button', class: 'cancel-btn', onClick: cancelEdit }, 'Cancel')
    );
}

/**
 * Main component rendering the genre list with edit and movie view features
 */
export default function GenreList() {
    //console.log('Rendering GenreList, selectedGenreId =', selectedGenreId.value);

    // Button to go back in navigation
    const backButton = createElement('button', {
        class: 'back-btn',
        style: 'margin-bottom: 1rem;',
        onClick: () => history.back()
    }, '← Back');

    // Render the genre list
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
                        onClick: e => {
                            e.stopPropagation();
                            toggleGenre(genre.id)
                        }
                    },
                        isEditing
                            ? createElement('button', {
                                class: 'save-btn',
                                onClick: (e) => { e.stopPropagation(); saveEdit(genre.id); }
                            }, 'Save')
                            : createElement('button', {
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
                isSelected && createElement('div', { class: 'entity-details.open' },
                    isEditing
                        ? GenreEditForm(genre)
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
