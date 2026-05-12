export class Device {
    constructor({ id, name, section, status, lastActive, alerts, consumption }) {
        this.id = id
        this.name = name
        this.section = section
        this.status = status
        this.lastActive = lastActive
        this.alerts = alerts
        this.consumption = consumption
    }

    get isActive() {
        return this.status === 'active'
    }

    static empty() {
        return new Device({
            id: null,
            name: '',
            section: '',
            status: 'inactive',
            lastActive: '',
            alerts: 0,
            consumption: ''
        })
    }
}