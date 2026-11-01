import React from 'react';
import './FallasTopMensajeros.css';

const FallasTopMensajeros = ({ dataSemana = [], source }) => {
  // Sumar todas las fallas de la semana por mensajero
  const conteo = {};

  dataSemana.forEach((dia) => {
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

  // Convertir a array y ordenar
  const ranking = Object.entries(conteo)
    .map(([linea, cantidad]) => ({ linea, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5); // Top 5

  const maxCantidad = ranking.length > 0 ? ranking[0].cantidad : 1;

  return (
    <div className={`fallas-top-card ${source}`}>
      <div className="fallas-top-header">
        <h3>🏆 TOP MENSAJEROS SEMANA</h3>
        <span className="fallas-top-badge">Top {ranking.length}</span>
      </div>

      {ranking.length === 0 ? (
        <div className="fallas-top-empty">
          <p>📭 Sin datos de fallas esta semana</p>
        </div>
      ) : (
        <div className="fallas-top-lista">
          {ranking.map((item, idx) => {
            const porcentaje = (item.cantidad / maxCantidad) * 100;
            // Acortar el nombre si es muy largo
            const nombreCorto = item.linea.length > 35
              ? item.linea.substring(0, 35) + '...'
              : item.linea;

            return (
              <div key={idx} className="fallas-top-row">
                <div className="fallas-top-posicion">{idx + 1}</div>
                <div className="fallas-top-info">
                  <div className="fallas-top-nombre" title={item.linea}>
                    {nombreCorto}
                  </div>
                  <div className="fallas-top-barra-container">
                    <div
                      className="fallas-top-barra"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
                <div className="fallas-top-cantidad">{item.cantidad}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FallasTopMensajeros;