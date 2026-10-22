import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, ReferenceLine, Area } from 'recharts';
import { firebaseService } from '../../../services/firebaseService';
import SourceToggle from './SourceToggle';
import './DashboardMensual.css';

const DashboardMensual = ({ mes: mesInicial, año: añoInicial, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(mesInicial);
  const [año, setAño] = useState(añoInicial);
  const [source, setSource] = useState('domis');
  const [datosMensuales, setDatosMensuales] = useState([]);
  const [resumen, setResumen] = useState({
    totalEntregadas: 0,
    totalDevoluciones: 0,
    efectividadPromedio: 0,
    mejorDia: null,
    totalDiasConDatos: 0,
    totalDias: 0
  });

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const fechaInicio = `${año}-${String(mes).padStart(2, '0')}-01`;
        const ultimoDia = new Date(año, mes, 0).getDate();
        const fechaFin = `${año}-${String(mes).padStart(2, '0')}-${ultimoDia}`;
        
        const datos = await firebaseService.getDataByDateRange(fechaInicio, fechaFin, source);
        
        const datosPorDia = [];
        let totalEntregadas = 0;
        let totalDevoluciones = 0;
        let diasConDatos = 0;
        let mejorEfectividad = 0;
        let mejorDiaData = null;
        
        for (let dia = 1; dia <= ultimoDia; dia++) {
          const fechaStr = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
          const data = datos.find(d => d.fecha === fechaStr);
          
          const entregadas = data?.entregadas || 0;
          const devolucion = data?.devolucion || 0;
          const total = entregadas + devolucion;
          const efectividad = total > 0 ? (entregadas / total) * 100 : 0;
          
          if (entregadas > 0 || devolucion > 0) {
            diasConDatos++;
            totalEntregadas += entregadas;
            totalDevoluciones += devolucion;
            
            if (efectividad > mejorEfectividad && total > 0) {
              mejorEfectividad = efectividad;
              mejorDiaData = { dia, entregadas, devolucion, efectividad };
            }
          }
          
          datosPorDia.push({
            dia: dia,
            fecha: fechaStr,
            entregadas: entregadas,
            devolucion: devolucion,
            efectividad: Math.round(efectividad * 10) / 10
          });
        }
        
        const efectividadPromedio = (totalEntregadas + totalDevoluciones) > 0 
          ? (totalEntregadas / (totalEntregadas + totalDevoluciones)) * 100 
          : 0;
        
        setDatosMensuales(datosPorDia);
        setResumen({
          totalEntregadas,
          totalDevoluciones,
          efectividadPromedio: Math.round(efectividadPromedio * 10) / 10,
          mejorDia: mejorDiaData,
          totalDiasConDatos: diasConDatos,
          totalDias: ultimoDia
        });
        
      } catch (error) {
        console.error('Error cargando datos mensuales:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [mes, año, source]);

  const cambiarMes = (direccion) => {
    let nuevoMes = mes + direccion;
    let nuevoAño = año;
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAño++;
    } else if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAño--;
    }
    setMes(nuevoMes);
    setAño(nuevoAño);
  };

  return (
    <div className="modal-overlay">
      <div className="mensual-card">
        <div className="mensual-header">
          <div className="header-controls">
            <button className="month-nav" onClick={() => cambiarMes(-1)}>◀</button>
            <h2>📊 Dashboard Mensual - {meses[mes - 1]} {año}</h2>
            <button className="month-nav" onClick={() => cambiarMes(1)}>▶</button>
          </div>
          <div className="header-right">
            <SourceToggle source={source} onChange={setSource} />
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        
        <div className="mensual-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando datos mensuales...</p>
            </div>
          ) : (
            <>
              {/* Tarjetas de resumen */}
              <div className="resumen-mensual">
                <div className="resumen-card">
                  <div className="resumen-icon">📦</div>
                  <div className="resumen-info">
                    <span className="resumen-label">TOTAL ENTREGADAS</span>
                    <span className="resumen-value">{resumen.totalEntregadas.toLocaleString()}</span>
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
                    <span className="resumen-label">EFECTIVIDAD MENSUAL</span>
                    <span className="resumen-value">{resumen.efectividadPromedio}%</span>
                  </div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">📅</div>
                  <div className="resumen-info">
                    <span className="resumen-label">DÍAS CON DATOS</span>
                    <span className="resumen-value">{resumen.totalDiasConDatos} / {resumen.totalDias}</span>
                  </div>
                </div>
              </div>
              
              {/* Gráfico de barras */}
              <div className="chart-container">
                <h3>📊 Entregas vs Devoluciones por Día</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={datosMensuales} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name === 'entregadas' ? '✅ Entregadas' : '↩️ Devoluciones']} labelFormatter={(label) => `Día ${label}`} />
                    <Legend formatter={(value) => value === 'entregadas' ? '✅ Entregadas' : '↩️ Devoluciones'} />
                    <Bar dataKey="entregadas" fill="#4caf50" name="entregadas" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="devolucion" fill="#f44336" name="devolucion" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Gráfico de tendencia */}
              <div className="chart-container">
                <h3>📈 Tendencia de Efectividad - Mes</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={datosMensuales} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Efectividad']} />
                    <Legend />
                    <ReferenceLine y={85} stroke="#1a237e" strokeDasharray="5 5" label={{ value: 'Meta 85%', position: 'right', fill: '#1a237e', fontSize: 11 }} />
                    <Area type="monotone" dataKey="efectividad" stroke="#ff6600" fill="rgba(255, 102, 0, 0.1)" name="Efectividad" strokeWidth={3} />
                    <Line type="monotone" dataKey="efectividad" stroke="#ff6600" name="Tendencia" strokeWidth={2} dot={{ r: 4, fill: '#ff6600' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Mejor día - SOLO este, ya no hay "Día a Mejorar" */}
              <div className="info-mensual-single">
                <div className="info-card">
                  <h4>🏆 Mejor Día del Mes</h4>
                  {resumen.mejorDia ? (
                    <>
                      <p><strong>Día {resumen.mejorDia.dia}</strong></p>
                      <p>✅ Entregadas: {resumen.mejorDia.entregadas}</p>
                      <p>↩️ Devoluciones: {resumen.mejorDia.devolucion}</p>
                      <p className="alta">🎯 Efectividad: {Math.round(resumen.mejorDia.efectividad)}%</p>
                    </>
                  ) : (
                    <p>No hay datos disponibles</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mensual-footer">
          <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMensual;