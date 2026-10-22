import React from 'react';
import './HomeView.css';

const HomeView = ({ onSelectFuente }) => {
  return (
    <div className="home-view">
      <p className="home-subtitle">Selecciona la fuente de asistencia</p>
      <div className="fuente-grid">
        <button className="fuente-card fuente-domis" onClick={() => onSelectFuente('domis')}>
          <span className="fuente-icon">📦</span>
          <h2>DOMIS</h2>
          <p>Registrar asistencia de domiciliarios DOMIS</p>
        </button>
        <button className="fuente-card fuente-pamis" onClick={() => onSelectFuente('pamis')}>
          <span className="fuente-icon">📮</span>
          <h2>PAMIS</h2>
          <p>Registrar asistencia de domiciliarios PAMIS</p>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
