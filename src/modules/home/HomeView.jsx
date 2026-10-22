import React from 'react';
import './HomeView.css';

const HomeView = ({ onSelectRacol }) => {
  const racoles = [
    { id: 1, nombre: 'RACOL CARTAGENA', ciudad: 'Cartagena', activa: true },
  ];

  return (
    <div className="home-view">
      <p className="home-subtitle">Selecciona una RACOL para comenzar</p>
      <div className="racol-lista">
        {racoles.map((racol) => (
          <div
            key={racol.id}
            className="racol-card"
            onClick={() => onSelectRacol(racol)}
          >
            <div className="racol-icon">
              <img src="/logo-ir.svg" alt="RACOL" />
            </div>
            <div className="racol-info">
              <h3>{racol.nombre}</h3>
              <p className="racol-ciudad">📍 {racol.ciudad}</p>
            </div>
            <div className="racol-arrow">›</div>
          </div>
        ))}
      </div>
      <div className="racol-counter">
        <span className="counter-dot"></span>
        {racoles.filter(r => r.activa).length} RACOL activa
      </div>
    </div>
  );
};

export default HomeView;