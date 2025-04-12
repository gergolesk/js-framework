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
