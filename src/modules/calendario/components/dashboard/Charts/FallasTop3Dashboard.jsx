import React from 'react';
import './FallasTop3Dashboard.css';

const FallasTop3Dashboard = ({ dataMes = [], source }) => {
  // Sumar todas las fallas del mes por mensajero
  const conteo = {};

  dataMes.forEach((dia) => {
    if (dia?.ranking && Array.isArray(dia.ranking)) {
      dia.ranking.forEach((item) => {
        const key = item.linea;
        if (!conteo[key]) {
          conteo[key] = 0;
        }
        conteo[key] += item.cantidad;
      });
    }
  });

  // Ordenar y tomar Top 3
  const ranking = Object.entries(conteo)
    .map(([linea, cantidad]) => ({ linea, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 3);

  const totalMes = Object.values(conteo).reduce((s, c) => s + c, 0);

  return (
    <div className={`fallas-top3-card ${source}`}>
      <div className="fallas-top3-header">
        <h3>
          {source === 'domis' ? '📦 TOP 3 FALLAS DOMIS' : '📮 TOP 3 FALLAS PAMIS'}
        </h3>
        <div className={`fallas-top3-total-header ${source}`}>
          <span className="fallas-top3-total-label">TOTAL MES</span>
          <span className="fallas-top3-total-value">{totalMes}</span>
        </div>
      </div>

      {ranking.length === 0 ? (
        <div className="fallas-top3-empty">
          📭 Sin fallas registradas este mes
        </div>
      ) : (
        <div className="fallas-top3-lista">
          {ranking.map((item, idx) => (
            <div key={idx} className="fallas-top3-row">
              <span className="fallas-top3-nombre" title={item.linea}>
                {item.linea}
              </span>
              <span className="fallas-top3-cantidad">{item.cantidad}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FallasTop3Dashboard;