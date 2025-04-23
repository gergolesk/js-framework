/**
 * lifecycle.js
 * 
 * Provides a simple lifecycle hook system for components.
 * Currently supports `onMount(callback)`, which registers a callback
 * that will be executed once the component is mounted (rendered).
 * 
 * Usage:
 * onMount(() => {
 *   // code that should run after the component is rendered
 * });
 * 
 * Internally used by the framework to trigger setup logic like data fetching,
 * DOM manipulation, or event subscriptions after the DOM is ready.
 */

const mountCallbacks = [];

/**
 * Register a function to run once the component is mounted.
 * @param {Function} callback - Function to execute after component is rendered.
 */
export function onMount(callback) {
  mountCallbacks.push(callback);
}

/**
 * Internal function: executes all registered onMount callbacks.
 * Called by the framework after the component is rendered to the DOM.
 */
export async function runMountCallbacks() {
  for (const cb of mountCallbacks) {
    await cb(); // execute each registered callback
  }
  mountCallbacks.length = 0; // clear the callbacks after execution
}
