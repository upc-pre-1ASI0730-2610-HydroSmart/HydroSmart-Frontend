const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001'

const buildUrl = (path) => {
    return `${API_BASE_URL}${path}`
}

const getAuthToken = () => {
    return localStorage.getItem('authToken')
}

const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
})

export async function fetchDevices() {
    const response = await fetch(buildUrl('/api/v1/devices'), {
        method: 'GET',
        headers: getHeaders()
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Error al obtener dispositivos (${response.status})`)
    }

    return response.json()
}

export async function createDevice(deviceData) {
    const response = await fetch(buildUrl('/api/v1/devices'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(deviceData)
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Error al crear dispositivo (${response.status})`)
    }

    return response.json()
}

export async function updateDeviceById(id, updates) {
    const response = await fetch(buildUrl(`/api/v1/devices/${id}`), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Error al actualizar dispositivo (${response.status})`)
    }

    return response.json()
}

export async function deleteDeviceById(id) {
    const response = await fetch(buildUrl(`/api/v1/devices/${id}`), {
        method: 'DELETE',
        headers: getHeaders()
    })

    if (!response.ok && response.status !== 204) {
        const errorText = await response.text()
        throw new Error(errorText || `Error al eliminar dispositivo (${response.status})`)
    }

    return true
}
