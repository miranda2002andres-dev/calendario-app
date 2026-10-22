import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, ReferenceLine, LabelList } from 'recharts';
import './TendenciaEfectividad.css';

const TendenciaEfectividad = ({ 
  source = 'domis',
  datos = [],
  pamisDatos = [],
  generalDatos = []
}) => {
  const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const META = 85;

  // ✅ Selecciona los datos según el source
  const getDatosActuales = () => {
    if (source === 'domis') return datos;
    if (source === 'pamis') return pamisDatos;
    return generalDatos;
  };

  // ✅ Color según el source
  const getColorBySource = () => {
    if (source === 'domis') return '#ff6600';
    if (source === 'pamis') return '#2196f3';
    return '#d4af37';
  };

  // ✅ Título según el source
  const getTituloBySource = () => {
    if (source === 'domis') return '📦 TENDENCIA DOMIS';
    if (source === 'pamis') return '📮 TENDENCIA PAMIS';
    return '📊 TENDENCIA GENERAL';
  };

  const datosActuales = getDatosActuales();
  const lineColor = getColorBySource();

  // Data para la gráfica (solo la línea del source seleccionado)
  const chartData = dias.map((dia, idx) => ({
    dia,
    efectividad: datosActuales?.[idx]?.effectiveness || 0,
  }));

  // Calcular stats SOLO de la fuente seleccionada
  const calcularStats = (arrDatos) => {
    const valores = dias.map((dia, idx) => ({
      dia,
      valor: arrDatos?.[idx]?.effectiveness || 0,
    }));
    const conDatos = valores.filter(v => v.valor > 0);
    const promedio = conDatos.length > 0
      ? (conDatos.reduce((s, v) => s + v.valor, 0) / conDatos.length).toFixed(1)
      : '0.0';
    const mejor = conDatos.length > 0
      ? conDatos.reduce((max, v) => v.valor > max.valor ? v : max, conDatos[0])
      : { dia: '--', valor: 0 };
    return { promedio, mejorDia: mejor.dia, mejorValor: mejor.valor };
  };

  const stats = calcularStats(datosActuales);

  return (
    <div className="tendencia-card">
      <div className="tendencia-header">
        <h3 className="tendencia-title">{getTituloBySource()}</h3>
        <span className="meta-badge">🎯 Meta: {META}%</span>
      </div>

      <div className="tendencia-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 25, right: 30, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="dia" 
              tick={{ fontSize: 11, fill: '#666' }} 
              axisLine={{ stroke: '#ddd' }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#666' }}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: '#ddd' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Efectividad']}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ 
                borderRadius: 8, 
                fontSize: 12,
                padding: '6px 10px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <ReferenceLine 
              y={META} 
              stroke="#1a237e" 
              strokeDasharray="5 5" 
              label={{ 
                value: 'Meta', 
                position: 'right', 
                fill: '#1a237e', 
                fontSize: 10 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="efectividad" 
              stroke={lineColor} 
              strokeWidth={3}
              dot={{ r: 5, fill: lineColor, stroke: 'white', strokeWidth: 2 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            >
              <LabelList 
                dataKey="efectividad" 
                position="top" 
                fill="#1a237e" 
                fontSize={11}
                fontWeight="bold"
                offset={10}
                formatter={(v) => v > 0 ? `${v}%` : ''}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ UNA SOLA tarjeta, la del source activo */}
      <div className="tendencia-stats-single">
        <div className={`stat-block ${source}`}>
          <div className="stat-block-title">
            {source === 'domis' && '📦 DOMIS'}
            {source === 'pamis' && '📮 PAMIS'}
            {source === 'general' && '📊 GENERAL'}
          </div>
          <div className="stat-block-items">
            <div className="stat-item">
              <span className="stat-label">Promedio Semanal</span>
              <span className="stat-value">{stats.promedio}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mejor Día</span>
              <span className="stat-value success">
                {stats.mejorValor}% ({stats.mejorDia})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TendenciaEfectividad;