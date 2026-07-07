const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001'

export const buildUrl = (path) => {
    return `${API_BASE_URL}${path}`
}

export const buildApiUrl = (path) => {
    return `${API_BASE_URL}${path}`
}

export const getAuthToken = () => {
    return localStorage.getItem('authToken')
}

export const getJsonHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
})

export const getAuthHeaders = () => ({
    ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
})

export const getApiBaseUrl = () => {
    return API_BASE_URL
}