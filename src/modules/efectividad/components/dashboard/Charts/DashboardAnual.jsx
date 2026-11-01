import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, ReferenceLine, Area } from 'recharts';
import { firebaseService } from '../../../services/firebaseService';
import SourceToggle from './SourceToggle';
import './DashboardAnual.css';

const DashboardAnual = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [año, setAño] = useState(new Date().getFullYear());
  const [source, setSource] = useState('domis');
  const [datosAnuales, setDatosAnuales] = useState([]);
  const [resumen, setResumen] = useState({
    totalEntregas: 0,
    totalDevoluciones: 0,
    efectividad: 0,
    mesesConDatos: 0
  });

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const datosPorMes = [];
        let totalEntregas = 0;
        let totalDevoluciones = 0;
        let mesesConDatos = 0;

        for (let i = 1; i <= 12; i++) {
          const mesStr = String(i).padStart(2, '0');
          const fechaInicio = `${año}-${mesStr}-01`;
          const ultimoDia = new Date(año, i, 0).getDate();
          const fechaFin = `${año}-${mesStr}-${ultimoDia}`;
          
          const datos = await firebaseService.getDataByDateRange(fechaInicio, fechaFin, source);
          
          let entregasMes = 0;
          let devolucionesMes = 0;
          
          for (const data of datos) {
            entregasMes += data?.entregadas || 0;
            devolucionesMes += data?.devolucion || 0;
          }
          
          if (entregasMes > 0 || devolucionesMes > 0) {
            mesesConDatos++;
            totalEntregas += entregasMes;
            totalDevoluciones += devolucionesMes;
          }
          
          const totalMes = entregasMes + devolucionesMes;
          const efectividadMes = totalMes > 0 ? (entregasMes / totalMes) * 100 : 0;
          
          datosPorMes.push({
            mes: meses[i - 1],
            entregas: entregasMes,
            devoluciones: devolucionesMes,
            efectividad: Math.round(efectividadMes * 10) / 10,
            tieneDatos: entregasMes > 0 || devolucionesMes > 0
          });
        }
        
        const efectividadTotal = (totalEntregas + totalDevoluciones) > 0 
          ? (totalEntregas / (totalEntregas + totalDevoluciones)) * 100 
          : 0;
        
        setDatosAnuales(datosPorMes);
        setResumen({
          totalEntregas: totalEntregas,
          totalDevoluciones: totalDevoluciones,
          efectividad: Math.round(efectividadTotal * 10) / 10,
          mesesConDatos: mesesConDatos
        });
        
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [año, source]);

  const cambiarAño = (direccion) => {
    const nuevoAño = direccion === 'prev' ? año - 1 : año + 1;
    setAño(nuevoAño);
  };

  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#333"
        textAnchor="middle"
        fontSize={11}
        fontWeight="bold"
      >
        {value.toLocaleString()}
      </text>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="anual-card">
        <div className="anual-header">
          <div className="header-controls">
            <button className="year-nav" onClick={() => cambiarAño('prev')}>◀</button>
            <h2>📊 Dashboard Anual <span className="año-actual">{año}</span></h2>
            <button className="year-nav" onClick={() => cambiarAño('next')}>▶</button>
          </div>
          <div className="header-right">
            <SourceToggle source={source} onChange={setSource} />
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        
        <div className="anual-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando datos anuales...</p>
            </div>
          ) : (
            <>
              <div className="resumen-anual">
                <div className="resumen-card">
                  <div className="resumen-icon">📦</div>
                  <div className="resumen-info">
                    <span className="resumen-label">TOTAL ENTREGAS</span>
                    <span className="resumen-value">{resumen.totalEntregas.toLocaleString()}</span>
                  </div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">↩️</div>
                  <div className="resumen-info">
                    <span className="resumen-label">TOTAL DEVOLUCIONES</span>
                    <span className="resumen-value">{resumen.totalDevoluciones.toLocaleString()}</span>
                  </div>
                </div>
                <div className="resumen-card highlight">
                  <div className="resumen-icon">🎯</div>
                  <div className="resumen-info">
                    <span className="resumen-label">EFECTIVIDAD ANUAL</span>
                    <span className="resumen-value">{resumen.efectividad}%</span>
                  </div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">📅</div>
                  <div className="resumen-info">
                    <span className="resumen-label">MESES CON DATOS</span>
                    <span className="resumen-value">{resumen.mesesConDatos} / 12</span>
                  </div>
                </div>
              </div>
              
              <div className="meses-grid">
                {datosAnuales.map((item, index) => (
                  <div key={index} className={`mes-card ${item.tieneDatos ? 'con-datos' : 'sin-datos'}`}>
                    <div className="mes-nombre">{item.mes}</div>
                    {item.tieneDatos ? (
                      <>
                        <div className="mes-entregas">{item.entregas.toLocaleString()}</div>
                        <div className="mes-efectividad">{item.efectividad}%</div>
                        <div className="mes-bar">
                          <div className="mes-progress" style={{ width: `${Math.min(item.efectividad, 100)}%` }}></div>
                        </div>
                      </>
                    ) : (
                      <div className="mes-sin-datos">📭 Sin datos</div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="chart-container">
                <h3>📊 ENTREGAS vs DEVOLUCIONES POR MES</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={datosAnuales} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, angle: -45, textAnchor: 'end', height: 60 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name === 'entregas' ? '✅ Entregas' : '↩️ Devoluciones']} />
                    <Legend formatter={(value) => value === 'entregas' ? '✅ Entregas' : '↩️ Devoluciones'} />
                    <Bar dataKey="entregas" fill="#4caf50" name="entregas" radius={[8, 8, 0, 0]} label={<CustomLabel />} />
                    <Bar dataKey="devoluciones" fill="#f44336" name="devoluciones" radius={[8, 8, 0, 0]} label={<CustomLabel />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="chart-container">
                <h3>📈 TENDENCIA DE EFECTIVIDAD MENSUAL</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={datosAnuales} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, angle: -45, textAnchor: 'end', height: 60 }} />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Efectividad']} />
                    <Legend />
                    <ReferenceLine y={85} stroke="#1a237e" strokeDasharray="5 5" label={{ value: 'Meta 85%', position: 'right', fill: '#1a237e', fontSize: 11 }} />
                    <Area type="monotone" dataKey="efectividad" stroke="#ff6600" fill="rgba(255, 102, 0, 0.1)" name="Efectividad" strokeWidth={3} />
                    <Line type="monotone" dataKey="efectividad" stroke="#ff6600" name="Tendencia" strokeWidth={3} dot={{ r: 5, fill: '#ff6600' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
        
        <div className="anual-footer">
          <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnual;