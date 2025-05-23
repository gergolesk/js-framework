/**
 * http.js
 *
 * A simple helper function for making HTTP requests using the Fetch API.
 * Supports GET, POST, PUT, DELETE, etc. Automatically handles JSON payloads and responses.
 *
 * Usage example:
 *   const user = await httpRequest('/api/user', 'POST', { name: 'Alice' });
 */

export async function httpRequest(url, method = 'GET', data = null) {
  // Prepare fetch configuration with method and JSON headers
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // If there is a request body (for POST/PUT/PATCH), serialize it as JSON
  if (data) {
    config.body = JSON.stringify(data);
  }

  // Send the HTTP request and wait for response
  const res = await fetch(url, config);

  // If the response is not ok (status not 2xx), throw an error
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  // Check the response Content-Type header to decide how to parse the response
  const contentType = res.headers.get('Content-Type');

  // If the response is JSON, parse and return it
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    return null; // If there is no response body or it's not JSON, return null
  }
}
