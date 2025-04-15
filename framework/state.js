let state = {};
const listeners = new Set();

export function useState(key, initialValue) {
  if (!(key in state)) {
    state[key] = initialValue;
  }

  const setState = (value) => {
    state[key] = value;
    listeners.forEach(fn => fn());
  };

  return [state[key], setState];
}

export function subscribe(listener) {
  listeners.add(listener);
}

export function unsubscribe(listener) {
  listeners.delete(listener);
}

export function createState(initialValue) {
  let value = initialValue;
  const listeners = new Set();

  const state = {
    get value() {
      return value;
    },
    set: (newValue) => {
      value = newValue;
      listeners.forEach(listener => listener(value));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };

  return state;
}