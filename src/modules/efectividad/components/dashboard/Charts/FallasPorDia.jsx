import React from 'react';
import './FallasPorDia.css';

const FallasPorDia = ({ dataSemana = [], source }) => {
  const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  // Construir array de días con sus totales Y fechas reales
  const porDia = dias.map((dia, idx) => {
    const item = dataSemana[idx];
    // ✅ Extraer la fecha real (formato "2026-10-06" → "06/10")
    let fechaCorta = '';
    if (item?.fecha) {
      const [year, month, day] = item.fecha.split('-');
      fechaCorta = `${day}/${month}`;
    }
    return {
      dia,
      fecha: fechaCorta,
      total: item?.totalDia || 0,
    };
  });

  const totalSemana = porDia.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className={`fallas-por-dia-card ${source}`}>
      <div className="fallas-por-dia-header">
        <h3>📅 FALLAS POR DÍA</h3>
        <span className="fallas-por-dia-badge">{totalSemana} total</span>
      </div>

      <div className="fallas-por-dia-lista">
        {porDia.map((item, idx) => (
          <div key={idx} className="fallas-por-dia-row">
            <span className="fallas-por-dia-dia">{item.dia}</span>
            {item.fecha && (
              <span className="fallas-por-dia-fecha">{item.fecha}</span>
            )}
            <span className="fallas-por-dia-separador">..................</span>
            <span className="fallas-por-dia-valor">{item.total}</span>
          </div>
        ))}
      </div>

      <div className="fallas-por-dia-total">
        <span>TOTAL SEMANA</span>
        <span className="fallas-por-dia-total-valor">{totalSemana}</span>
      </div>
    </div>
  );
};

export default FallasPorDia;