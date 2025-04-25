import { createElement } from '../framework/utils/dom.js';
import { defineRoutes, navigate } from '../framework/router.js';
import { httpRequest } from '../framework/utils/http.js';
import { 
    movies, 
    loading, 
    editingMovie,
    formData,
    resetForm,
    setFormData
} from './stores/movies.js';

import MovieList from './pages/MovieList.js';
import MovieForm from './pages/MovieForm.js';

// Инициализация API
import './api/movies.js';

// Обработчики действий
async function handleSubmit(movieData) {
    const movie = {
        ...movieData,
        year: parseInt(movieData.year)
    };

    try {
        if (editingMovie.value) {
            await updateMovie(editingMovie.value.id, movie);
        } else {
            await createMovie(movie);
        }
        
        const data = await getMovies();
        movies.set(data);
        resetForm();
        navigate('/');
    } catch (error) {
        console.error('Failed to save movie:', error);
    }
}

function handleEditRoute() {
    if (!editingMovie.value) {
        navigate('/');
        return null;
    }
    setFormData(editingMovie.value);
    return createElement(MovieForm, { onSubmit: handleSubmit });
}

// Роутинг
defineRoutes({
    '/': () => createElement(MovieList),
    '/movies': () => createElement(MovieList),
    '/add': () => createElement(MovieForm, { onSubmit: handleSubmit }),
    '/edit': handleEditRoute
});

// Главный компонент
export default function App() {
    return createElement('div', { id: 'app' },
        createElement(MovieList)
    );
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const app = App();
    document.getElementById('app').appendChild(app);
});