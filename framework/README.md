# JS Frontend Framework

## Overview

**JS Frontend Framework** is a minimalist JavaScript framework for declaratively describing user interfaces, managing state, routing, events, and HTTP requests—all without external dependencies.

- Compatible with modern browsers.
- No third-party libraries or frameworks required.
- Simple to use and extend.

---

## Architecture & Design Principles

- **Component Model**: Reusable UI components with isolated state.
- **Reactive State Management**: Automatic UI updates when state changes.
- **Client-side Routing**: Display pages and components based on the URL.
- **Declarative Event Handling**: Events are described directly in components.
- **DOM Abstraction**: Create and update elements through framework APIs.
- **HTTP Utilities**: Convenient methods for working with remote APIs.
- **Lazy Rendering**: Render only the necessary part of large lists (improves performance).

---

## Installation

The framework requires no npm installation.  
Simply copy the `framework/` folder into your project and import the needed modules.

**Example index.html:**
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>JS-Frontend Framework</title>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="./app.js"></script>
  <script type="module" src="../framework/utils/lazyList.js"></script>
  <script type="module" src="../framework/utils/http.js"></script>
</body>

</html>
```

**Example app.js:**
```js
import { defineRoutes, RouterView } from '../framework/router.js';
import { render } from '../framework/render.js';
import Yourpage from './yourpage.js';

defineRoutes({
  '/': Yourpage,
});

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    render(RouterView, app);
  }
});
```

---

## Getting Started

1. **Create a Component:**
    ```js
    import { Component } from './framework/core/component.js';

    export class HelloWorld extends Component {
      render() {
        return this.createElement('div', {}, 'Hello, World!');
      }
    }
    ```

2. **Set Up Global State:**
    ```js
    import { createStore } from './framework/state.js';

    const store = createStore({ count: 0 });
    store.subscribe((state) => {
      // handle state update
    });
    ```

3. **Add Routing:**
    ```js
    import { createRouter } from './framework/router.js';

    createRouter({
      '/': HomePage,
      '/about': AboutPage,
      // ...
    });
    ```

4. **Send HTTP Requests:**
    ```js
    import { http } from './framework/utils/http.js';

    http.get('/api/data').then(data => { ... });
    ```

---

## Features

### 1. Component System

- Build custom components via classes or factory functions.
- Supports props, events, and lifecycle hooks.

**Example:**
```js
import { Component } from './framework/core/component.js';

class Button extends Component {
  render() {
    return this.createElement('button', { onClick: this.handleClick }, 'Click me');
  }
  handleClick = () => {
    alert('Button clicked!');
  }
}
```

---

### 2. State Management

- Global or local stores.
- Subscriptions to state updates.
- UI automatically reflects state changes.

**Example:**
```js
import { createStore } from './framework/state.js';

const store = createStore({ user: null });
store.setState({ user: { name: 'Alice' } });
```

---

### 3. Routing

- Map URLs to components/pages.
- Navigate programmatically via push or API.

**Example:**
```js
import { createRouter, navigate } from './framework/router.js';

createRouter({
  '/': HomePage,
  '/profile': ProfilePage,
});

navigate('/profile');
```

---

### 4. Event Handling

- Declarative event binding in components.
- Pass event handlers via props or methods.

**Example:**
```js
return this.createElement('input', {
  onInput: (e) => this.setState({ value: e.target.value })
});
```

---

### 5. DOM Manipulation

- Create and update elements via `createElement`, `setAttribute`, and `setStyle`.
- Automatic data-to-DOM binding.

---

### 6. HTTP Utilities

- Unified API for HTTP: get, post, put, delete.
- Supports async requests and error handling.

**Example:**
```js
import { http } from './framework/utils/http.js';

http.get('/api/users').then(users => { ... });
```

---

### 7. Lazy Rendering (Performance)

- Lazy rendering of large lists via a special component or utility.

**Example:**
```js
import { LazyList } from './framework/utils/lazyList.js';

// Use LazyList to render only the visible part of a large list
```

---

## Best Practices & Guidelines

- Use a single store for global state when possible.
- Split your app into small, reusable components.
- Avoid manipulating the DOM outside components.
- Make all remote requests via http.js for consistency.
- Reuse components and avoid code duplication.

---

## Contributing

- Open issues for suggestions or bugs.
- Submit pull requests with a description of your changes.

---

## Appendix

### Folder Structure:
```
framework/
  core/          # Base classes and component functions
  utils/         # Utilities for DOM, HTTP, lazy rendering, etc.
  state.js       # State management
  router.js      # Routing
  render.js      # Renderer
  README.md      # This documentation
```

---

**Full usage documentation can be found in [`example/`](../example).**