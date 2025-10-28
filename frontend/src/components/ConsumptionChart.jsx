import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import './ConsumptionChart.css'

function ConsumptionChart({ devices }) {
  // Préparer les données pour le graphique
  const chartData = devices
    .map((device) => {
      const powerStatus = device.status?.find(s => s.code === 'cur_power')
      const power = powerStatus ? powerStatus.value / 10 : 0

      return {
        name: device.name.length > 20 ? device.name.substring(0, 20) + '...' : device.name,
        fullName: device.name,
        consommation: parseFloat(power.toFixed(1)),
        isOn: device.status?.find(s => s.code === 'switch_1' || s.code === 'switch')?.value || false,
      }
    })
    .filter(item => item.consommation > 0) // Ne montrer que les appareils qui consomment
    .sort((a, b) => b.consommation - a.consommation) // Trier par consommation décroissante

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>Aucune consommation détectée</p>
        <p className="chart-empty-hint">Allumez vos appareils pour voir leur consommation</p>
      </div>
    )
  }

  // Calculer la consommation totale
  const totalConsumption = chartData.reduce((sum, item) => sum + item.consommation, 0)

  // Couleurs pour les barres
  const COLORS = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  return (
    <div className="consumption-chart">
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Appareils actifs</span>
          <span className="summary-value">{chartData.length}</span>
        </div>
        <div className="summary-item highlight">
          <span className="summary-label">Consommation totale</span>
          <span className="summary-value">{totalConsumption.toFixed(1)} W</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Coût estimé/heure</span>
          <span className="summary-value">{((totalConsumption / 1000) * 0.15).toFixed(3)} €</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Consommation (W)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value, name, props) => {
              const item = props.payload
              return [
                <div key="tooltip" className="chart-tooltip">
                  <div className="tooltip-device">{item.fullName}</div>
                  <div className="tooltip-power">{value} W</div>
                  <div className="tooltip-cost">
                    ~{((value / 1000) * 0.15).toFixed(4)} €/h
                  </div>
                </div>
              ]
            }}
            labelFormatter={() => ''}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={() => 'Consommation (W)'}
          />
          <Bar
            dataKey="consommation"
            fill="#667eea"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <p className="legend-text">
          Les valeurs affichées représentent la consommation en temps réel de vos appareils.
        </p>
        <p className="legend-text">
          Coût estimé basé sur un tarif de 0,15 €/kWh (tarif moyen en France).
        </p>
      </div>
    </div>
  )
}

export default ConsumptionChart
