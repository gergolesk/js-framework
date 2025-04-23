import { createElement } from '../framework/utils/dom.js';
import { createState } from '../framework/state.js';
import { defineRoutes, navigate } from '../framework/router.js';
import { onMount } from '../framework/utils/lifecycle.js';
import { httpRequest } from '../framework/utils/http.js';


const todos = createState([]);
const inputValue = createState('');

defineRoutes({
  '/': TodoApp,
  '/todo': TodoApp,
});

function addTodo() {
  if (inputValue.value.trim() === '') return;
  todos.set([...todos.value, { text: inputValue.value, done: false }]);
  inputValue.set('');
}

function toggleTodo(index) {
  const updated = todos.value.map((todo, i) =>
    i === index ? { ...todo, done: !todo.done } : todo
  );
  todos.set(updated);
}

function deleteTodo(index) {
  todos.set(todos.value.filter((_, i) => i !== index));
}

/*
async function loadTodosFromServer() {
  try {
    const serverTodos = await httpRequest('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const formatted = serverTodos.map(t => ({ text: t.title, done: t.completed }));
    todos.set(formatted);
  } catch (err) {
    console.error('Failed to load todos:', err.message);
  }
}
*/

onMount(async () => {
  const remoteTodos = await httpRequest('https://jsonplaceholder.typicode.com/todos?_limit=5');
  todos.set(remoteTodos.map(todo => ({
    text: todo.title,
    done: todo.completed
  })));
});

export default function TodoApp() {
  return createElement('div', { className: 'todo-app', style: 'padding: 1rem; max-width: 400px; margin: auto;' },
    createElement('h2', {}, 'Todo List'),
    createElement('input', {
      id: 'new-task',
      placeholder: 'New task...',
      value: inputValue.value,
      onInput: (e) => inputValue.set(e.target.value),
      style: 'width: 100%; padding: 0.5rem; margin-bottom: 0.5rem;'
    }),
    createElement('button', {
      onClick: addTodo,
      style: 'padding: 0.5rem 1rem; margin-bottom: 1rem;'
    }, 'Add'),
    ...todos.value.map((todo, index) =>
      createElement('div', {
        style: 'display: flex; align-items: center; margin-bottom: 0.5rem;'
      },
        createElement('input', {
          type: 'checkbox',
          checked: todo.done,
          onChange: () => toggleTodo(index),
          style: 'margin-right: 0.5rem;'
        }),
        createElement('span', {
          style: `flex: 1; text-decoration: ${todo.done ? 'line-through' : 'none'}`
        }, todo.text),
        createElement('button', {
          onClick: () => deleteTodo(index),
          style: 'margin-left: 0.5rem;'
        }, '❌')
      )
    )
  );
}