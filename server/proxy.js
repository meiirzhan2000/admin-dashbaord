// server/proxy.js

// This file sets up a simple proxy server to bypass CORS issues during development

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    
    // Check if the request is for the API
    if (url.pathname.startsWith('/api/')) {
      // Get request method
      const method = event.method;
      
      // Get the API path
      const apiPath = url.pathname.replace('/api/', '');
      
      // Get the API URL
      const apiUrl = `https://gaya-web-service.onrender.com/api/${apiPath}`;
      
      // Get the request body for POST, PUT, etc.
      let body = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        body = await readBody(event);
      }
      
      try {
        // Get query parameters
        const query = getQuery(event);
        
        // Make the request to the API
        const response = await $fetch(apiUrl, {
          method,
          body,
          query,
          headers: {
            'Content-Type': 'application/json',
            // Forward authentication header if present
            ...event.headers.authorization 
              ? { 'Authorization': event.headers.authorization } 
              : {}
          }
        });
        
        // Return the response
        return response;
      } catch (error) {
        // Handle error
        console.error(`Error proxying to ${apiUrl}:`, error);
        
        // Return error response
        return createError({
          statusCode: error.statusCode || 500,
          statusMessage: error.message || 'Internal Server Error',
          data: error.data
        });
      }
    }
  });