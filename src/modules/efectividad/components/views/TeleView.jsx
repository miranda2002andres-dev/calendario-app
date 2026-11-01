import React from 'react';
import './Views.css';

const TeleView = ({ metricsData, selectedDate, formatShortDate, onEdit, onDelete }) => {
  return (
    <div className="view-container tele-view">
      <div className="view-header">
        <div className="view-icon">📞</div>
        <div className="view-title">
          <h2>Panel TELEMERCADEO</h2>
          <p>Gestión de llamadas y contactabilidad</p>
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
      
      <div className="tele-stats-cards">
        <div className="tele-stat-card">
          <div className="tele-stat-icon">📞</div>
          <div className="tele-stat-info">
            <span className="tele-stat-label">TELEMERCADEO</span>
            <span className="tele-stat-value">{metricsData.telemercadeo}</span>
          </div>
        </div>
        <div className="tele-stat-card">
          <div className="tele-stat-icon">✅</div>
          <div className="tele-stat-info">
            <span className="tele-stat-label">CONTACTABILIDAD</span>
            <span className="tele-stat-value success">{metricsData.contactabilidad}</span>
          </div>
        </div>
        <div className="tele-stat-card">
          <div className="tele-stat-icon">🔇</div>
          <div className="tele-stat-info">
            <span className="tele-stat-label">NO CONTACTABILIDAD</span>
            <span className="tele-stat-value warning">{metricsData.noContactabilidad}</span>
          </div>
        </div>
        <div className="tele-stat-card">
          <div className="tele-stat-icon">✅</div>
          <div className="tele-stat-info">
            <span className="tele-stat-label">SI RECIBE</span>
            <span className="tele-stat-value success">{metricsData.siRecibe}</span>
          </div>
        </div>
        <div className="tele-stat-card">
          <div className="tele-stat-icon">↩️</div>
          <div className="tele-stat-info">
            <span className="tele-stat-label">DEVOLUCIÓN DEST</span>
            <span className="tele-stat-value danger">{metricsData.devolucionDest}</span>
          </div>
        </div>
      </div>
      
      <div className="tele-percentages-card">
        <h3>📊 PORCENTAJES DE CONTACTABILIDAD</h3>
        <div className="percentages-grid">
          <div className="percentage-row">
            <span>% vs Proyección:</span>
            <span className="percentage-value">{metricsData.porcentajes?.vsProyeccion || 0}%</span>
          </div>
          <div className="percentage-row">
            <span>% Contactabilidad:</span>
            <span className="percentage-value">{metricsData.porcentajes?.contactabilidad || 0}%</span>
          </div>
          <div className="percentage-row">
            <span>% No Contactable:</span>
            <span className="percentage-value">{metricsData.porcentajes?.noContactable || 0}%</span>
          </div>
          <div className="percentage-row">
            <span>% Si Recibe:</span>
            <span className="percentage-value">{metricsData.porcentajes?.siRecibe || 0}%</span>
          </div>
          <div className="percentage-row">
            <span>% Devolución Dest:</span>
            <span className="percentage-value">{metricsData.porcentajes?.devolucionDest || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleView;