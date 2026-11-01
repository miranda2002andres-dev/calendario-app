import React from 'react';
import './FallasStatsCards.css';

const FallasStatsCards = ({ totalHoy, totalSemana, totalMes, source }) => {
  return (
    <div className={`fallas-stats-grid ${source}`}>
      <div className="fallas-stat-card">
        <div className="fallas-stat-icon">📊</div>
        <div className="fallas-stat-content">
          <span className="fallas-stat-label">Hoy</span>
          <span className="fallas-stat-value">{totalHoy}</span>
        </div>
      </div>

      <div className="fallas-stat-card">
        <div className="fallas-stat-icon">📅</div>
        <div className="fallas-stat-content">
          <span className="fallas-stat-label">Semana</span>
          <span className="fallas-stat-value">{totalSemana}</span>
        </div>
      </div>

      <div className="fallas-stat-card">
        <div className="fallas-stat-icon">📆</div>
        <div className="fallas-stat-content">
          <span className="fallas-stat-label">Mes</span>
          <span className="fallas-stat-value">{totalMes}</span>
        </div>
      </div>
    </div>
  );
};

export default FallasStatsCards;