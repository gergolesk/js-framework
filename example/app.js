import { createElement } from '../framework/utils/dom.js';
import { useState, subscribe } from '../framework/state.js';
import { render } from '../framework/index.js';

function Counter() {
  const [count, setCount] = useState('count', 0);

  return createElement('div', { style: { textAlign: 'center' } },
    createElement('h1', {}, `Count: ${count}`),
    createElement('button', { onClick: () => setCount(count + 1) }, 'Increment'),
    createElement('button', { onClick: () => setCount(count - 1) }, 'Decrement')
  );
}

function App() {
  return createElement('div', {}, Counter());
}

const root = document.getElementById('app');

function rerender() {
  render(App, root);
}

subscribe(rerender);
rerender();
