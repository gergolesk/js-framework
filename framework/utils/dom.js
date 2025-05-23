/**
 * dom.js
 *
 * A utility function for creating DOM elements in a declarative way.
 * Supports setting attributes, styles, event listeners, and nesting children.
 * This function is similar in spirit to React.createElement, but simpler and DOM-native.
 */

export function createElement(type, props = {}, ...children) {
  // If a function is passed as the tag/type, treat it as a component and invoke it
  if (typeof tag === 'function') {
    return tag({...props, children});
  }

  // Create the DOM element by type (e.g., 'div', 'input', etc.)
  const el = document.createElement(type);

  // Set all properties/attributes/event listeners on the element
  for (const [key, value] of Object.entries(props)) {
    // Add event listeners for properties starting with "on"
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), value);
    }
    // Set style properties if a style object is passed
    else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    }
    // Set the "checked" property for checkboxes/radios (must be set as a property, not attribute)
    else if (key === 'checked') {
      el.checked = value;  // <-- This is IMPORTANT for checkboxes
    }
    // Set all other attributes (including class, id, data-*, etc.)
    else {
      el.setAttribute(key, value);
    }
  }

  // Recursively append all children (can be strings, DOM nodes, or arrays)
  children.flat().forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
    // (Optionally handle null/undefined - can be added if needed)
  });

  return el;
}
