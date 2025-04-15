export function createElement(type, props = {}, ...children) {
  const el = document.createElement(type); // Create a DOM element of the given type (e.g. 'div', 'button')
  
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && typeof value === 'function') {
      // Handle event listeners like onClick, onInput etc.
      el.addEventListener(key.substring(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      // Apply style object (e.g. style={{ color: 'red' }})
      Object.assign(el.style, value);
    } else {
      // Set any other attributes (e.g. id, class, src)
      el.setAttribute(key, value);
    }
  }
  
  children.flat().forEach(child => {
    if (typeof child === 'string') {
      // Convert string children to text nodes
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      // Append actual DOM nodes
      el.appendChild(child);
    }
  });

    return el;
  }
  