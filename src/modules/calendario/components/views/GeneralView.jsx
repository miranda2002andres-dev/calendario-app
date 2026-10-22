import React from 'react';
import './GeneralView.css';

const GeneralView = ({ dashboardData, effectivenessData, selectedDate, formatShortDate, onEdit, onDelete }) => {
  const totalReal = effectivenessData.delivered + effectivenessData.returns;

  return (
    <div className="view-container general-view">
      <div className="view-header">
        <div className="view-icon">📊</div>
        <div className="view-title">
          <h2>Panel DATOS GENERALES</h2>
          <p>Gestión general de entregas y devoluciones</p>
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
      
      <div className="general-hero">
        <div className="hero-kpi">
          <span className="hero-label">GENERAL</span>
          <span className="hero-value">{dashboardData.domis}</span>
        </div>
        <div className="hero-divider"></div>
        <div className="hero-kpi">
          <span className="hero-label">ASIGNACIÓN DEL DÍA</span>
          <span className="hero-value">{dashboardData.asignacionDia}</span>
          <span className="hero-status">● En progreso</span>
        </div>
      </div>
      
      <div className="general-effectiveness-section">
        <div className="effectiveness-circle-large">
          <div className="effectiveness-circle-percent">{effectivenessData.effectiveness}%</div>
          <div className="effectiveness-circle-label">EFECTIVIDAD</div>
          <div className="effectiveness-circle-bar">
            <div className="effectiveness-circle-progress" style={{ width: `${effectivenessData.effectiveness}%` }}></div>
          </div>
        </div>
        <div className="effectiveness-stats">
          <div className="effectiveness-stat delivered">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-label">ENTREGADAS</span>
              <span className="stat-number">{effectivenessData.delivered}</span>
              <span className="stat-percent">{effectivenessData.effectiveness}%</span>
            </div>
          </div>
          <div className="effectiveness-stat pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-label">PENDIENTE</span>
              <span className="stat-number">{effectivenessData.pending}</span>
              <span className="stat-percent">{totalReal > 0 ? ((effectivenessData.pending / totalReal) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
          <div className="effectiveness-stat returns">
            <div className="stat-icon">↩️</div>
            <div className="stat-info">
              <span className="stat-label">DEVOLUCIÓN</span>
              <span className="stat-number">{effectivenessData.returns}</span>
              <span className="stat-percent">{totalReal > 0 ? ((effectivenessData.returns / totalReal) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralView;