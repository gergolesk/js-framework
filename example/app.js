import { createElement } from '../framework/utils/dom.js';
import { useState, subscribe } from '../framework/state.js';
import { render } from '../framework/index.js';
import { createComponent } from '../framework/core/component.js';

function Counter({ name }) {
  const [count, setCount] = useState(name, 0);

  return createElement('div', { style: { textAlign: 'center', margin: '10px' } },
    createElement('h2', {}, `${name}: ${count}`),
    createElement('button', { onClick: () => setCount(count + 1) }, '➕'),
    createElement('button', { onClick: () => setCount(count - 1) }, '➖')
  );
}

function App() {
  const CounterA = createComponent(Counter, { name: 'Apples' });
  const CounterB = createComponent(Counter, { name: 'Bananas' });

  return createElement('div', {},
    createElement('h1', {}, 'My Fruit Counter 🍌🍎'),
    CounterA(),
    CounterB()
  );
}

const root = document.getElementById('app');

function rerender() {
  render(App, root);
}

subscribe(rerender);
rerender();