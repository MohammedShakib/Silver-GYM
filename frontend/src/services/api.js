const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

export const getApiHealth = async () => {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error('API health check failed')
  }

  return response.json()
}
