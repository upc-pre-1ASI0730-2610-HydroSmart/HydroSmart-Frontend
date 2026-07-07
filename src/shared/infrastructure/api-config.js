const DEFAULT_API_BASE_URL = 'http://localhost:5001'

export function getApiBaseUrl(...envKeys) {
  const configuredUrl = envKeys
    .map((key) => import.meta.env[key])
    .find((value) => typeof value === 'string' && value.trim().length > 0)

  return (configuredUrl || import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')
}

export function buildApiUrl(path, ...envKeys) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl(...envKeys)}${normalizedPath}`
}

export function getAuthToken() {
  return localStorage.getItem('authToken') || localStorage.getItem('token')
}

export function getJsonHeaders() {
  const token = getAuthToken()

  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}
