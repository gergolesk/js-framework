// Простейшая обёртка над fetch

export async function get(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function post(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  // (по желанию: put, del и кэширование)
  