import React from 'react';
import GaugeChart from './GaugeChart';
import './EfectividadCard.css';

const EfectividadCard = ({ 
  efectividad = 0, 
  entregadas = 0, 
  pendiente = 0, 
  devolucion = 0,
  title = '📊 EFECTIVIDAD',
  colorClass = 'domis'
}) => {
  const total = entregadas + devolucion;
  const porcentajeDevolucion = total > 0 ? (devolucion / total) * 100 : 0;
  const porcentajePendiente = total > 0 ? (pendiente / total) * 100 : 0;

  return (
    <div className={`efectividad-card ${colorClass}`}>
      {/* ===== GAUGE CIRCULAR ===== */}
      <GaugeChart 
        value={efectividad} 
        title={title}
        colorClass={colorClass}
        meta={85}
      />
      
      {/* ===== ESTADÍSTICAS DEBAJO ===== */}
      <div className="efectividad-stats">
        <div className="stat-row success">
          <span className="stat-label">✅ Entregadas</span>
          <span className="stat-value">{entregadas}</span>
          <span className="stat-percent">{efectividad.toFixed(1)}%</span>
        </div>
        <div className="stat-row warning">
          <span className="stat-label">⏳ Pendiente</span>
          <span className="stat-value">{pendiente}</span>
          <span className="stat-percent">{porcentajePendiente.toFixed(1)}%</span>
        </div>
        <div className="stat-row danger">
          <span className="stat-label">↩️ Devolución</span>
          <span className="stat-value">{devolucion}</span>
          <span className="stat-percent">{porcentajeDevolucion.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default EfectividadCard;