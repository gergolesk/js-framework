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

  const notify = () => {
    listeners.forEach(listener => listener(value));
  };

  const state = {
    get value() {
      return value;
    },
    set(valueOrFn) {
      const newValue = typeof valueOrFn === 'function' ? valueOrFn(value) : valueOrFn;
      if (newValue !== value) {
        value = newValue;
        notify();
      }
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };

  return state;
}
