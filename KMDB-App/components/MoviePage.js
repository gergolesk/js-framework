import { createElement } from '../../framework/utils/dom.js';

export default function MoviePage({ params }) {
  return createElement('div', { style: 'padding: 1rem;' },
    createElement('h1', {}, `About movie #${params.id}`),
    createElement('p', {}, 'Detailed information will be available here...')
  );
}
