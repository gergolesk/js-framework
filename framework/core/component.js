import { subscribe } from '../state.js';

export function createComponent(componentFn, props = {}) {
  let rendered = componentFn(props);

  const rerender = () => {
    rendered = componentFn(props);
  };

  subscribe(rerender);

  return () => rendered;
}