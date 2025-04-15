# dot-js — Lightweight JavaScript Frontend Framework

## Overview

`dot-js` is a minimalist frontend framework that allows you to build user interfaces using plain JavaScript without external libraries.

## Design Principles

- Simplicity and readability
- DOM abstraction
- Minimal API surface
- Reactive state
- Component-based structure
- Built-in routing

## Quick Start

```js
import { render } from './framework/index.js';
import { RouterView } from './framework/router.js';

render(RouterView, document.getElementById('app'));
```

## Installation

No package installation needed. Include files from the `framework/` directory directly.

## File Structure

- `index.js` – entry point
- `dom.js` – DOM utilities
- `state.js` – reactive state management
- `router.js` – routing system

## API Reference

### `createElement(type, props, ...children)`

```js
createElement('button', {
  onClick: () => alert('Click'),
  style: 'color: red;'
}, 'Click Me');
```

### `createState(initialValue)`

```js
const counter = createState(0);
counter.set(counter.value + 1);
```

### `defineRoutes({ path: Component })`

```js
defineRoutes({ '/': HomePage });
```

### `navigate(path)`

```js
navigate('/about');
```
