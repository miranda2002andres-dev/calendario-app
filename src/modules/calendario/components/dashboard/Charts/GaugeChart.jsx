import React from 'react';
import './GaugeChart.css';

const GaugeChart = ({ 
  value = 0, 
  title = '', 
  colorClass = 'domis',
  meta = 85 
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Ángulo de la aguja (0% = 180° izq, 100% = 0° der)
  // Ángulo desde la horizontal derecha: 180° - (valor/100)*180°
  const needleAngle = -90 + (normalizedValue / 100) * 180;
  
  // ✅ Regla: Rojo si es 85.99 o menos, Verde si es 86 o más
  const isGreen = normalizedValue >= 86;
  const needleColor = isGreen ? '#4caf50' : '#f44336';

  // ✅ CORTE CORRECTO EN 86%
  // Ángulo: 180° - (86/100)*180° = 25.2°
  // x = 100 + 80*cos(25.2°) = 172.4
  // y = 100 - 80*sin(25.2°) = 65.9
  const CORTE_X = 172.4;
  const CORTE_Y = 65.9;

  return (
    <div className={`gauge-card ${colorClass}`}>
      <div className="gauge-title">
        🎯 {title}
      </div>
      
      <div className="gauge-wrapper">
        <svg viewBox="0 0 200 130" className="gauge-svg">
          {/* ZONA ROJA: 0% a 86% */}
          <path
            d={`M 20 100 A 80 80 0 0 1 ${CORTE_X} ${CORTE_Y}`}
            fill="none"
            stroke="#f44336"
            strokeWidth="16"
            strokeLinecap="butt"
          />
          {/* ZONA VERDE: 86% a 100% */}
          <path
            d={`M ${CORTE_X} ${CORTE_Y} A 80 80 0 0 1 180 100`}
            fill="none"
            stroke="#4caf50"
            strokeWidth="16"
            strokeLinecap="butt"
          />
          
          {/* BORDE INTERNO BLANCO (sutil) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.4"
          />
          
          {/* MARCA DE LA META EN 86% — línea blanca */}
          <circle cx={CORTE_X} cy={CORTE_Y} r="2" fill="white" />
          
          {/* TICKS */}
          <line x1="20" y1="100" x2="28" y2="100" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="49" x2="41" y2="53" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="20" x2="100" y2="28" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="166" y1="49" x2="159" y2="53" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="180" y1="100" x2="172" y2="100" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          
          {/* ETIQUETAS 0 y 100 */}
          <text x="10" y="118" fontSize="12" fontWeight="bold" fill="#333" textAnchor="middle">0</text>
          <text x="190" y="118" fontSize="12" fontWeight="bold" fill="#333" textAnchor="middle">100</text>
          
          {/* AGUJA */}
          <g transform={`rotate(${needleAngle} 100 100)`}>
            <polygon
              points="100,100 96,95 100,45 104,95"
              fill={needleColor}
              stroke="#333"
              strokeWidth="1.5"
            />
          </g>
          
          {/* CÍRCULO CENTRAL */}
          <circle cx="100" cy="100" r="9" fill={needleColor} stroke="white" strokeWidth="2" />
          <circle cx="100" cy="100" r="4" fill="white" />
        </svg>
        
        {/* NÚMERO */}
        <div className="gauge-value-display">
          <span className="gauge-value-big" style={{ color: needleColor }}>
            {normalizedValue.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="gauge-meta-info">
        🎯 Meta: {meta}%
      </div>
    </div>
  );
};

export default GaugeChart;