/**
 * dom.js
 * 
 * A utility function for creating DOM elements in a declarative way.
 * Supports setting attributes, styles, event listeners, and nesting children.
 * This function is similar in spirit to React.createElement, but simpler and DOM-native.
 */

export function createElement(type, props = {}, ...children) {
  if (typeof tag === 'function') {
    return tag({...props, children});
  }

  const el = document.createElement(type);

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key === 'checked') {
      el.checked = value;  // <-- КРИТИЧЕСКИ ВАЖНО
    } else {
      el.setAttribute(key, value);
    }
  }

  children.flat().forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });

  return el;
}