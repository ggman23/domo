import DeviceCard from './DeviceCard'
import './DeviceGrid.css'

function DeviceGrid({ devices, onDeviceUpdate }) {
  return (
    <div className="device-grid">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onUpdate={onDeviceUpdate}
        />
      ))}
    </div>
  )
}

export default DeviceGrid
