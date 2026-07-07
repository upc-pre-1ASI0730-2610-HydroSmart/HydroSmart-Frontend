import { ref } from 'vue'


import { toDevice } from '../infrastructure/device.assembler.js'
import {
    fetchDevices,
    createDevice,
    updateDeviceById,
    deleteDeviceById
} from '@/devices/infrastructure/device-api.js'

const devices = ref([])
const isLoading = ref(false)
const error = ref('')
const isSaving = ref(false)
const saveError = ref('')

export function useDeviceStore() {
    const loadDevices = async () => {
        isLoading.value = true
        error.value = ''

        try {
            const data = await fetchDevices()
            devices.value = Array.isArray(data) ? data.map(toDevice) : []
        } catch (err) {
            devices.value = []
            error.value = err instanceof Error ? err.message : 'Error al cargar dispositivos'
        } finally {
            isLoading.value = false
        }
    }

    const addDevice = async (payload) => {
        isSaving.value = true
        saveError.value = ''

        try {
            const apiModel = await createDevice(payload)
            const newDevice = toDevice(apiModel)
            devices.value = [...devices.value, newDevice]
            return newDevice
        } catch (err) {
            saveError.value = err instanceof Error ? err.message : 'Error al crear dispositivo'
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const updateDevice = async (id, updates) => {
        isSaving.value = true
        saveError.value = ''

        try {
            const apiModel = await updateDeviceById(id, updates)
            const updatedDevice = toDevice(apiModel)

            devices.value = devices.value.map((device) =>
                device.id === updatedDevice.id ? updatedDevice : device
            )

            return updatedDevice
        } catch (err) {
            saveError.value = err instanceof Error ? err.message : 'Error al guardar dispositivo'
            throw err
        } finally {
            isSaving.value = false
        }
    }
    const removeDevice = async (id) => {
        isSaving.value = true
        saveError.value = ''

        try {
            await deleteDeviceById(id)

            devices.value = devices.value.filter((device) => device.id !== id)

            return true
        } catch (err) {
            saveError.value = err instanceof Error ? err.message : 'Error al eliminar dispositivo'
            throw err
        } finally {
            isSaving.value = false
        }
    }

    return {
        devices,
        isLoading,
        error,
        isSaving,
        saveError,
        loadDevices,
        addDevice,
        saveDevice: updateDevice,
        removeDevice
    }
}
