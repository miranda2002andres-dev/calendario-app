import React from 'react';
import './FallasTopMes.css';

const FallasTopMes = ({ dataMes = [], source }) => {
  const conteo = {};

  dataMes.forEach((dia) => {
    if (dia?.ranking && Array.isArray(dia.ranking)) {
      dia.ranking.forEach((item) => {
        const key = item.linea;
        if (!conteo[key]) {
          conteo[key] = { cantidad: 0, dias: 0 };
        }
        conteo[key].cantidad += item.cantidad;
        conteo[key].dias += 1;
      });
    }
  });

  const ranking = Object.entries(conteo)
    .map(([linea, data]) => ({ linea, ...data }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const maxCantidad = ranking.length > 0 ? ranking[0].cantidad : 1;
  const totalMes = Object.values(conteo).reduce((s, c) => s + c.cantidad, 0);
  const mensajerosUnicos = Object.keys(conteo).length;
  const promedio = mensajerosUnicos > 0
    ? (totalMes / mensajerosUnicos).toFixed(1)
    : '0.0';

  return (
    <div className={`fallas-top-mes-card ${source}`}>
      <div className="fallas-top-mes-header">
        <h3>🏆 TOP MENSAJEROS MES</h3>
        <span className="fallas-top-mes-badge">Top {ranking.length}</span>
      </div>

      {ranking.length === 0 ? (
        <div className="fallas-top-mes-empty">
          <p>📭 Sin datos de fallas este mes</p>
        </div>
      ) : (
        <>
          <div className="fallas-top-mes-lista">
            {ranking.map((item, idx) => {
              const porcentaje = (item.cantidad / maxCantidad) * 100;
              const nombreCorto = item.linea.length > 35
                ? item.linea.substring(0, 35) + '...'
                : item.linea;

              return (
                <div key={idx} className="fallas-top-mes-row">
                  <div className="fallas-top-mes-posicion">{idx + 1}</div>
                  <div className="fallas-top-mes-info">
                    <div className="fallas-top-mes-nombre" title={item.linea}>
                      {nombreCorto}
                    </div>
                    <div className="fallas-top-mes-barra-container">
                      <div
                        className="fallas-top-mes-barra"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                    <div className="fallas-top-mes-dias">
                      📅 {item.dias} día{item.dias !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="fallas-top-mes-cantidad">{item.cantidad}</div>
                </div>
              );
            })}
          </div>

          <div className="fallas-top-mes-resumen">
            <div className="fallas-top-mes-resumen-item">
              <span className="fallas-top-mes-resumen-label">Total mes</span>
              <span className="fallas-top-mes-resumen-valor">{totalMes}</span>
            </div>
            <div className="fallas-top-mes-resumen-item">
              <span className="fallas-top-mes-resumen-label">Mensajeros</span>
              <span className="fallas-top-mes-resumen-valor">{mensajerosUnicos}</span>
            </div>
            <div className="fallas-top-mes-resumen-item">
              <span className="fallas-top-mes-resumen-label">Promedio</span>
              <span className="fallas-top-mes-resumen-valor">{promedio}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FallasTopMes;