import React from 'react';
import './MetricasTelemercadeo.css';

const MetricasTelemercadeo = ({ data }) => {
  return (
    <div className="metricas-card">
      <div className="metricas-header">
        <div className="metricas-icon">📞</div>
        <h3 className="metricas-title">MÉTRICAS TELEMERCADEO</h3>
      </div>
      
      <div className="metricas-grid">
        <div className="metrica-item">
          <div className="metrica-label">TELEMERCADEO</div>
          <div className="metrica-value">{data.telemercadeo}</div>
        </div>
        
        <div className="metrica-item">
          <div className="metrica-label">CONTACTABILIDAD</div>
          <div className="metrica-value">{data.contactabilidad}</div>
        </div>
        
        <div className="metrica-item">
          <div className="metrica-label">NO CONTACTABILIDAD</div>
          <div className="metrica-value">{data.noContactabilidad}</div>
        </div>
        
        <div className="metrica-item">
          <div className="metrica-label">SI RECIBE</div>
          <div className="metrica-value">{data.siRecibe}</div>
        </div>
        
        <div className="metrica-item">
          <div className="metrica-label">DEVOLUCIÓN DEST</div>
          <div className="metrica-value">{data.devolucionDest}</div>
        </div>
      </div>
      
      <div className="metricas-porcentajes">
        <div className="porcentaje-item">
          <span>% vs Proyección:</span>
          <span>{data.porcentajes?.vsProyeccion || 0}%</span>
        </div>
        <div className="porcentaje-item">
          <span>% Contactabilidad:</span>
          <span>{data.porcentajes?.contactabilidad || 0}%</span>
        </div>
        <div className="porcentaje-item">
          <span>% No Contactable:</span>
          <span>{data.porcentajes?.noContactable || 0}%</span>
        </div>
        <div className="porcentaje-item">
          <span>% Si Recibe:</span>
          <span>{data.porcentajes?.siRecibe || 0}%</span>
        </div>
        <div className="porcentaje-item">
          <span>% Devolución Dest:</span>
          <span>{data.porcentajes?.devolucionDest || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default MetricasTelemercadeo;