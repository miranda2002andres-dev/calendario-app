import React from 'react';
import './PamisView.css';

const PamisView = ({ dashboardData, effectivenessData, selectedDate, formatShortDate, onEdit, onDelete }) => {
  const diff = parseInt(dashboardData.diferencia) || 0;
  const isPositive = diff >= 0;
  const totalReal = effectivenessData.delivered + effectivenessData.returns;
  const efectividad = parseFloat((effectivenessData.effectiveness || 0).toFixed(2));
  const pctPendiente = totalReal > 0 ? parseFloat(((effectivenessData.pending / totalReal) * 100).toFixed(2)) : 0;
  const pctDevolucion = totalReal > 0 ? parseFloat(((effectivenessData.returns / totalReal) * 100).toFixed(2)) : 0;

  return (
    <div className="view-container pamis-view">
      <div className="view-header">
        <div className="view-icon">📮</div>
        <div className="view-title">
          <h2>Panel PAMIS</h2>
          <p>Gestión de entregas y devoluciones PAMIS</p>
        </div>
        <div className="view-date">
          📅 {formatShortDate(selectedDate)}
        </div>
      </div>
      
      <div className="view-actions">
        <button className="view-edit-btn" onClick={onEdit}>
          ✏️ Editar datos del día
        </button>
        <button className="view-delete-btn" onClick={onDelete}>
          🗑️ Eliminar datos del día
        </button>
      </div>
      
      <div className="pamis-hero">
        <div className="hero-kpi">
          <span className="hero-label">PAMIS</span>
          <span className="hero-value">{dashboardData.domis}</span>
        </div>
        <div className="hero-divider"></div>
        <div className="hero-kpi">
          <span className="hero-label">ASIGNACIÓN DEL DÍA</span>
          <span className="hero-value">{dashboardData.asignacionDia}</span>
          <span className="hero-status">● En progreso</span>
        </div>
      </div>
      
      <div className="pamis-stats-grid-three">
        <div className="stat-card purple">
          <div className="stat-card-icon">🎯</div>
          <div className="stat-card-content">
            <span className="stat-card-label">META</span>
            <span className="stat-card-value">{dashboardData.meta}</span>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon">📊</div>
          <div className="stat-card-content">
            <span className="stat-card-label">DIFERENCIA</span>
            <span className={`stat-card-value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? `+${diff}` : diff}
            </span>
            <span className="stat-card-sub">{isPositive ? '✅ Nos pasamos' : '⚠️ Falta llegar'}</span>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-content">
            <span className="stat-card-label">PAMIS ASISTENCIA</span>
            <span className="stat-card-value">{dashboardData.domiAsistencia}</span>
          </div>
        </div>
      </div>
      
      <div className="pamis-effectiveness-section">
        <div className="effectiveness-circle-large">
          <div className="effectiveness-circle-percent">{efectividad.toFixed(2)}%</div>
          <div className="effectiveness-circle-label">EFECTIVIDAD</div>
          <div className="effectiveness-circle-bar">
            <div className="effectiveness-circle-progress" style={{ width: `${efectividad}%` }}></div>
          </div>
        </div>
        <div className="effectiveness-stats">
          <div className="effectiveness-stat delivered">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-label">ENTREGADAS</span>
              <span className="stat-number">{effectivenessData.delivered}</span>
              <span className="stat-percent">{efectividad.toFixed(2)}%</span>
            </div>
          </div>
          <div className="effectiveness-stat pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-label">PENDIENTE</span>
              <span className="stat-number">{effectivenessData.pending}</span>
              <span className="stat-percent">{pctPendiente.toFixed(2)}%</span>
            </div>
          </div>
          <div className="effectiveness-stat returns">
            <div className="stat-icon">↩️</div>
            <div className="stat-info">
              <span className="stat-label">DEVOLUCIÓN</span>
              <span className="stat-number">{effectivenessData.returns}</span>
              <span className="stat-percent">{pctDevolucion.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PamisView;