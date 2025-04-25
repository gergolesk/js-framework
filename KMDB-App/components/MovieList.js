import { createElement } from '../../framework/utils/dom.js';


export default function MovieList() {
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h1', {}, 'List of movies'),
    createElement('p', {}, 'The movie list will be here...')
  );
}