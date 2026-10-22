import React from 'react';
import './RacolView.css';

const RacolView = ({ 
  onBack, 
  onGoToAdmin, 
  onGoToAsistencia, 
  onGoToZonas, 
  onGoToAgencias,
  onGoToCalendario 
}) => {
  return (
    <div className="racol-view">
      <div className="racol-view-header">
        <button className="racol-back-btn" onClick={onBack}>←</button>
        <div className="racol-view-logo">
          <img src="/logo-ir.svg" alt="Inter" />
        </div>
        <div>
          <h2>RACOL CARTAGENA</h2>
          <p>Cartagena</p>
        </div>
      </div>

      <div className="racol-hero">
        <div className="racol-hero-logo">
          <img src="/logo-ir.svg" alt="Inter Rapidísimo" />
        </div>
        <h1>RACOL CARTAGENA</h1>
      </div>

      <div className="racol-opciones">
        <button
          className="racol-opcion racol-opcion-naranja"
          onClick={onGoToAsistencia}
        >
          <span className="racol-opcion-icon">🕐</span>
          <div className="racol-opcion-info">
            <span className="racol-opcion-titulo">ASISTENCIA</span>
            <span className="racol-opcion-sub">Registrar entrada y salida</span>
          </div>
        </button>

        <button
          className="racol-opcion racol-opcion-azul"
          onClick={onGoToZonas}
        >
          <span className="racol-opcion-icon">🗺️</span>
          <div className="racol-opcion-info">
            <span className="racol-opcion-titulo">ZONAS</span>
            <span className="racol-opcion-sub">Registrar zonas</span>
          </div>
        </button>

        <button
          className="racol-opcion racol-opcion-morado"
          onClick={onGoToAgencias}
        >
          <span className="racol-opcion-icon">🏢</span>
          <div className="racol-opcion-info">
            <span className="racol-opcion-titulo">AGENCIAS</span>
            <span className="racol-opcion-sub">Gestionar agencias</span>
          </div>
        </button>

        <button
          className="racol-opcion racol-opcion-amarillo"
          onClick={onGoToCalendario}
        >
          <span className="racol-opcion-icon">📊</span>
          <div className="racol-opcion-info">
            <span className="racol-opcion-titulo">EFECTIVIDAD</span>
            <span className="racol-opcion-sub">Ver efectividad</span>
          </div>
        </button>

        <button
          className="racol-opcion racol-opcion-gris"
          onClick={onGoToAdmin}
        >
          <span className="racol-opcion-icon">🔐</span>
          <div className="racol-opcion-info">
            <span className="racol-opcion-titulo">PANEL ADMINISTRADOR</span>
            <span className="racol-opcion-sub">Acceso completo · PIN admin</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RacolView;