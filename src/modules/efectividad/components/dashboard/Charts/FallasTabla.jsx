import React from 'react';
import './FallasTabla.css';

const FallasTabla = ({ ranking = [], totalDia = 0, fecha = '', source }) => {
  const maxCantidad = ranking.length > 0 ? ranking[0].cantidad : 1;

  return (
    <div className={`fallas-tabla-card ${source}`}>
      <div className="fallas-tabla-header">
        <h3>📋 MENSAJEROS DEL DÍA ({fecha})</h3>
        <span className="fallas-tabla-badge">
          {totalDia} fallas · {ranking.length} mensajeros
        </span>
      </div>

      <div className="fallas-tabla-lista">
        {ranking.map((item, idx) => {
          const porcentaje = (item.cantidad / maxCantidad) * 100;
          const nombreCorto = item.linea.length > 60
            ? item.linea.substring(0, 60) + '...'
            : item.linea;

          return (
            <div key={idx} className="fallas-tabla-row">
              <div className="fallas-tabla-posicion">{idx + 1}</div>
              <div className="fallas-tabla-info">
                <div className="fallas-tabla-nombre" title={item.linea}>
                  {nombreCorto}
                </div>
                <div className="fallas-tabla-barra-container">
                  <div
                    className="fallas-tabla-barra"
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>
              <div className="fallas-tabla-cantidad">{item.cantidad}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FallasTabla;