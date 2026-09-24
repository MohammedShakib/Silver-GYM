const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1');

const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Create headers object
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    // Add credentials to send secure HttpOnly cookies for session
    credentials: 'include',
  };

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      config.url = `${url}?${qs}`;
    } else {
      config.url = url;
    }
  } else {
    config.url = url;
  }

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    const response = await fetch(config.url, config);
    let data;
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'API Error');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return { data, status: response.status, headers: response.headers };
  } catch (err) {
    console.error(`API Request failed: ${endpoint}`, err);
    throw err;
  }
};

const api = {
  get: (url, config) => request(url, { ...config, method: 'GET' }),
  post: (url, data, config) => request(url, { ...config, method: 'POST', data }),
  put: (url, data, config) => request(url, { ...config, method: 'PUT', data }),
  patch: (url, data, config) => request(url, { ...config, method: 'PATCH', data }),
  delete: (url, config) => request(url, { ...config, method: 'DELETE' }),
};

export const getApiHealth = async () => {
  return request('/health');
};

export default api;
