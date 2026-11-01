import React from 'react';
import './AsignacionDomiciliario.css';

const AsignacionDomiciliario = () => {
  return (
    <div className="asignacion-card">
      <h3 className="asignacion-title">ASIGNACIÓN DOMICILIARIO</h3>
      <div className="asignacion-content">
        <div className="domiciliario-avatar">👤</div>
        <div className="domiciliario-info">
          <span className="domiciliario-label">Domiciliario:</span>
          <span className="domiciliario-status sin-asignar">Sin asignar</span>
        </div>
      </div>
    </div>
  );
};

export default AsignacionDomiciliario;