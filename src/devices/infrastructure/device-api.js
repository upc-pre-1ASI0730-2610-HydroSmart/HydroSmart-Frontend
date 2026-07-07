import { buildApiUrl, getJsonHeaders } from '@/shared/infrastructure/api-config.js'

export async function fetchDevices() {
    const response = await fetch(buildApiUrl('/devices'), {
      method: 'GET',
      headers: getJsonHeaders()
    })

    if (!response.ok) {
        throw new Error('Error al obtener dispositivos')
    }

    return response.json()
}

export async function createDevice(deviceData) {
    const response = await fetch(buildApiUrl('/devices'), {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(deviceData)
    })

    if (!response.ok) {
        throw new Error('Error al crear dispositivo')
    }

    return response.json()
}

export async function updateDeviceById(id, updates) {
    const response = await fetch(buildApiUrl(`/devices/${id}`), {
      method: 'PUT',
      headers: getJsonHeaders(),
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
        throw new Error('Error al guardar dispositivo')
    }

    return response.json()
}
