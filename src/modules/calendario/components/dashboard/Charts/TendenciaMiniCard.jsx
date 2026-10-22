import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from 'recharts';
import './TendenciaMiniCard.css';

const TendenciaMiniCard = ({ datos = [], source = 'domis', title = '', color }) => {
  const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  
  const chartData = dias.map((dia, idx) => ({
    dia: dia,
    efectividad: datos?.[idx]?.effectiveness || 0,
  }));

  const getColorBySource = () => {
    if (source === 'domis') return '#ff6600';
    if (source === 'pamis') return '#2196f3';
    if (source === 'general') return '#d4af37';
    return '#999';
  };

  const getLabelBySource = () => {
    if (source === 'domis') return '📦 DOMIS';
    if (source === 'pamis') return '📮 PAMIS';
    if (source === 'general') return '📊 GENERAL';
    return '';
  };

  const lineColor = color || getColorBySource();

  const conDatos = chartData.filter(d => d.efectividad > 0);
  const promedio = conDatos.length > 0
    ? conDatos.reduce((sum, d) => sum + d.efectividad, 0) / conDatos.length
    : 0;

  return (
    <div className={`tendencia-mini-card ${source}`}>
      <div className="tendencia-mini-header">
        <h4>{title || getLabelBySource()}</h4>
        <span className="tendencia-mini-promedio">
          Prom: {promedio.toFixed(1)}%
        </span>
      </div>
      
      {/* ✅ Contenedor que centra la gráfica verticalmente */}
      <div className="tendencia-mini-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="dia" 
              tick={{ fontSize: 10, fill: '#666' }} 
              axisLine={{ stroke: '#ddd' }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 9, fill: '#666' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Efectividad']}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ 
                borderRadius: 8, 
                fontSize: 11,
                padding: '4px 8px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="efectividad" 
              stroke={lineColor} 
              strokeWidth={3}
              dot={{ r: 4, fill: lineColor, stroke: 'white', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TendenciaMiniCard;