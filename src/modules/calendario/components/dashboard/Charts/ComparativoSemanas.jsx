import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ComparativaSemanal.css';

const ComparativoSemanas = ({ datos, week = "Semana" }) => {
  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#333"
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="comparativa-card">
      <div className="comparativa-header">
        <h3 className="comparativa-title">📊 COMPARATIVA SEMANAL</h3>
        <p className="comparativa-subtitle">{week}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={datos} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="dia" 
            tick={{ fontSize: 13, fontWeight: 'bold', fill: '#1a237e' }} 
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#666' }} 
            label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#666' } }} 
          />
          <Tooltip 
            formatter={(value, name) => [value, name === 'delivered' ? '✅ Entregadas' : '↩️ Devolución']} 
            contentStyle={{ borderRadius: 10, backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Bar dataKey="delivered" fill="#4caf50" name="delivered" radius={[8, 8, 0, 0]} label={<CustomLabel />} />
          <Bar dataKey="returns" fill="#f44336" name="returns" radius={[8, 8, 0, 0]} label={<CustomLabel />} />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color legend-entregadas"></div>
          <span>✅ Entregadas</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-devolucion"></div>
          <span>↩️ Devolución</span>
        </div>
      </div>
    </div>
  );
};

export default ComparativoSemanas;