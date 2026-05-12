import { ref } from 'vue'


import { toDevice } from '../infrastructure/device.assembler.js'
import {fetchDevices} from "@/devices/infrastructure/device-api.js";

const devices = ref([])
const isLoading = ref(false)
const error = ref('')

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

    return {
        devices,
        isLoading,
        error,
        loadDevices
    }
}