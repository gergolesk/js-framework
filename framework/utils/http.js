/**
 * http.js
 * 
 * A simple helper function for making HTTP requests using the Fetch API.
 * Supports GET, POST, PUT, DELETE, etc. Automatically handles JSON payloads and responses.
 * 
 * const user = await httpRequest('/api/user', 'POST', { name: 'Alice' });
 */

export async function httpRequest(url, method = 'GET', data = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(url, config);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const contentType = res.headers.get('Content-Type');

  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    return null; // если ответа нет или он не JSON
  }
}