import { Device } from '../domain/model/device.entity.js'

export function toDevice(apiModel) {
    if (!apiModel) return Device.empty()

    return new Device({
        id: Number(apiModel.id) || null,
        name: apiModel.name ?? '',
        section: apiModel.section ?? '',
        status: apiModel.status ?? 'inactive',
        lastActive: apiModel.lastActive ?? '',
        alerts: Number(apiModel.alerts) || 0,
        consumption: apiModel.consumption ?? ''
    })
}