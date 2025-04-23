/**
 * http.js
 * 
 * A simple helper function for making HTTP requests using the Fetch API.
 * Supports GET, POST, PUT, DELETE, etc. Automatically handles JSON payloads and responses.
 * 
 * const user = await httpRequest('/api/user', 'POST', { name: 'Alice' });
 */

export async function httpRequest(url, method = 'GET', data = null) {
  // Build the configuration object for the fetch request
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json' // Send data as JSON
    }
  };

  // If data is provided (for POST, PUT, etc), include it in the request body
  if (data) {
    config.body = JSON.stringify(data);
  }

  // Perform the HTTP request
  const res = await fetch(url, config);

  // Throw an error if the response is not successful (status not in 200–299)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  // Parse and return the response body as JSON
  return res.json();
} 
  