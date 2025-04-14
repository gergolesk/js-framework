# dot-js Frontend Framework

A lightweight JavaScript frontend framework for building single-page applications using components, reactive state, and custom routing — with **zero dependencies**.

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/dot-js.git
cd dot-js
```

Start a local server (for example using `serve` or `http-server`):

```bash
npx serve .
```

Open `index.html` in your browser.

---

## 🚀 Getting Started

Create an `index.html` with:

```html
<div id="app"></div>
<script type="module" src="./example/app.js"></script>
```

In `example/app.js`:

```js
import { render } from '../framework/index.js';
import { RouterView, defineRoutes } from '../framework/router.js';
import { createElement } from '../framework/utils/dom.js';

function HomePage() {
  return createElement('div', {}, 'Welcome!');
}

defineRoutes({
  '/': HomePage,
});

render(RouterView, document.getElementById('app'));
```

---

## 🧱 Architecture Overview

The framework consists of several core modules:

- **`render`** — mounts a component into the DOM
- **`state.js`** — reactive state management
- **`router.js`** — custom SPA router with URL-based navigation
- **`utils/dom.js`** — DOM creation and manipulation utilities
- **`http.js`** — lightweight wrapper for `fetch`
- **`virtual-list.js`** — lazy rendering for large lists

---

## 🔨 Core Concepts & Features

### Components

Components are JavaScript functions that return DOM elements:

```js
function Counter() {
  return createElement('div', {}, 'Hello!');
}
```

You can reuse them and pass props:

```js
function Greeting({ name }) {
  return createElement('h1', {}, `Hello, ${name}`);
}
```

---

### State Management

```js
import { createState } from '../framework/state.js';

const count = createState(0);

const Counter = () => createElement('div', {},
  createElement('span', {}, `Count: ${count.value}`),
  createElement('button', { onClick: () => count.set(count.value + 1) }, '+')
);
```

---

### Routing

```js
import { defineRoutes, RouterView, navigate } from '../framework/router.js';

defineRoutes({
  '/': HomePage,
  '/about': AboutPage,
});

// Use navigate() to programmatically switch
navigate('/about');
```

---

### Event Handling

Use `onClick`, `onInput`, `onSubmit`, etc. as props on created elements:

```js
createElement('button', { onClick: () => alert('Clicked!') }, 'Click me');
```

---

### DOM Utilities

```js
createElement('div', { className: 'box' },
  createElement('span', {}, 'Nested content')
);
```

Supports setting:
- Attributes
- Styles
- Event listeners
- Children (as strings or elements)

---

### HTTP Requests

```js
import { httpGet } from '../framework/http.js';

httpGet('https://jsonplaceholder.typicode.com/users')
  .then(data => console.log(data));
```

---

### Lazy Rendering

Use `VirtualList` for large datasets:

```js
import { VirtualList } from '../framework/utils/virtual-list.js';

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

createElement(VirtualList, {
  items,
  renderItem: item => createElement('div', {}, item),
  itemHeight: 24,
  height: 400
});
```

---

## ✅ Best Practices

- Keep components small and pure
- Use `createState()` only where needed
- Favor composition over conditionals
- Route components should return actual DOM trees
- Avoid direct DOM manipulation (use `createElement`)

---

## ✨ Example Project

See the `/example` directory for a sample app using:

- Routing
- State
- HTTP
- Lazy rendering
- Components with props

---

## 📌 License

MIT License