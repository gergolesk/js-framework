/**
 * state.js
 * 
 * A minimal reactive state management system.
 * Provides hooks for shared state (`useState`) and standalone state (`createState`),
 * along with subscription management for automatic re-renders.
 */

let state = {}; // Global key-value store for state variables
const listeners = new Set(); // A set of functions to call when state updates

export function useState(key, initialValue) {
  if (!(key in state)) {
    state[key] = initialValue; // Initialize state if it doesn't exist
  }

  const setState = (value) => {
    state[key] = value; // Update the state value
    listeners.forEach(fn => fn()); // Notify all listeners to re-render or update
  };

  return [state[key], setState]; // Return current value and updater function
}

export function subscribe(listener) {
  listeners.add(listener); // Register a listener to be notified on state change
}

export function unsubscribe(listener) {
  listeners.delete(listener); // Remove a previously registered listener
}

export function createState(initialValue) {
  let value = initialValue;
  const state = {
    get value() {
      return value; // Getter for the current value
    },
    set: (newValue) => {
      value = newValue; // Setter for the new value
      listeners.forEach((cb) => cb()); // Notify all listeners
    }
  };
  return state;
}