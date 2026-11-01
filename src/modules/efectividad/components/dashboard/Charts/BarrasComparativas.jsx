import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import './BarrasComparativas.css';

const BarrasComparativas = ({ domisData, pamisData, weekDates, weekName }) => {
  const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const combinedData = [];

  for (let i = 0; i < dayNames.length; i++) {
    const domisItem = domisData[i] || {};
    const pamisItem = pamisData[i] || {};
    const fecha = weekDates && weekDates[i]
      ? `${weekDates[i].getDate()}/${weekDates[i].getMonth() + 1}`
      : '';

    combinedData.push({
      dia: dayNames[i],
      fecha: fecha,
      domisEntregas: domisItem.delivered || 0,
      domisDevolucion: domisItem.returns || 0,
      pamisEntregas: pamisItem.delivered || 0,
      pamisDevolucion: pamisItem.returns || 0,
    });
  }

  // Custom dot para mostrar valor encima del punto
  const CustomDotDomis = (props) => {
    const { cx, cy, value } = props;
    if (value === 0) return <circle cx={cx} cy={cy} r={4} fill="#4caf50" />;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#4caf50" stroke="white" strokeWidth={2} />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="#4caf50" fontSize={11} fontWeight="bold">
          {value}
        </text>
      </g>
    );
  };

  const CustomDotPamis = (props) => {
    const { cx, cy, value } = props;
    if (value === 0) return <circle cx={cx} cy={cy} r={4} fill="#2196f3" />;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#2196f3" stroke="white" strokeWidth={2} />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="#2196f3" fontSize={11} fontWeight="bold">
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="barras-comparativas-card">
      <div className="barras-header">
        <h3>📈 TENDENCIA SEMANAL - DOMIS vs PAMIS</h3>
        <p>{weekName}</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#1a237e' }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            label={{ value: 'Entregas', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'domisEntregas') return [value, '📦 DOMIS - Entregas'];
              if (name === 'pamisEntregas') return [value, '📮 PAMIS - Entregas'];
              return [value, name];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return `${label} ${payload[0].payload.fecha}`;
              }
              return label;
            }}
          />
          <Legend
            formatter={(value) => {
              if (value === 'domisEntregas') return '📦 DOMIS';
              if (value === 'pamisEntregas') return '📮 PAMIS';
              return value;
            }}
            wrapperStyle={{ paddingTop: 15 }}
          />
          <Line
            type="monotone"
            dataKey="domisEntregas"
            stroke="#4caf50"
            strokeWidth={3}
            name="domisEntregas"
            dot={<CustomDotDomis />}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="pamisEntregas"
            stroke="#2196f3"
            strokeWidth={3}
            name="pamisEntregas"
            dot={<CustomDotPamis />}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Etiquetas de fechas debajo */}
      <div className="barras-fechas">
        {combinedData.map((item, idx) => (
          <div key={idx} className="fecha-item">
            <span className="fecha-dia">{item.dia}</span>
            <span className="fecha-numero">{item.fecha}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarrasComparativas;