import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../../services/firebaseService';
import './ResumenMensualCard.css';

const ResumenMensualCard = ({ source = 'domis', mes, año, titulo, colorClass }) => {
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState({
    totalEntregadas: 0,
    totalDevoluciones: 0,
    efectividad: 0,
    diasConDatos: 0,
    totalDias: 0
  });

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const fechaInicio = `${año}-${String(mes).padStart(2, '0')}-01`;
        const ultimoDia = new Date(año, mes, 0).getDate();
        const fechaFin = `${año}-${String(mes).padStart(2, '0')}-${ultimoDia}`;
        
        const datos = await firebaseService.getDataByDateRange(fechaInicio, fechaFin, source);
        
        let totalEntregadas = 0;
        let totalDevoluciones = 0;
        let diasConDatos = 0;
        
        for (const data of datos) {
          const entregadas = data?.entregadas || 0;
          const devolucion = data?.devolucion || 0;
          
          if (entregadas > 0 || devolucion > 0) {
            diasConDatos++;
            totalEntregadas += entregadas;
            totalDevoluciones += devolucion;
          }
        }
        
        const total = totalEntregadas + totalDevoluciones;
        const efectividad = total > 0 ? (totalEntregadas / total) * 100 : 0;
        
        setResumen({
          totalEntregadas,
          totalDevoluciones,
          efectividad: Math.round(efectividad * 10) / 10,
          diasConDatos,
          totalDias: ultimoDia
        });
      } catch (error) {
        console.error(`Error cargando resumen mensual ${source}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [source, mes, año]);

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className={`resumen-mensual-compact ${colorClass || source}`}>
      <div className="resumen-mensual-compact-header">
        <h4>{titulo || `📦 ${source.toUpperCase()}`}</h4>
        <span className="resumen-mensual-compact-mes">{meses[mes - 1]} {año}</span>
      </div>
      
      {loading ? (
        <div className="resumen-loading">
          <div className="mini-spinner"></div>
        </div>
      ) : (
        <div className="resumen-mensual-compact-body">
          <div className="resumen-mini-card">
            <span className="resumen-mini-icon">📦</span>
            <div className="resumen-mini-info">
              <span className="resumen-mini-label">ENTREGADAS</span>
              <span className="resumen-mini-value">{resumen.totalEntregadas.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="resumen-mini-card">
            <span className="resumen-mini-icon">↩️</span>
            <div className="resumen-mini-info">
              <span className="resumen-mini-label">DEVOLUCIONES</span>
              <span className="resumen-mini-value">{resumen.totalDevoluciones.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="resumen-mini-card highlight">
            <span className="resumen-mini-icon">🎯</span>
            <div className="resumen-mini-info">
              <span className="resumen-mini-label">EFECTIVIDAD</span>
              <span className="resumen-mini-value">{resumen.efectividad}%</span>
            </div>
          </div>
          
          <div className="resumen-mini-card">
            <span className="resumen-mini-icon">📅</span>
            <div className="resumen-mini-info">
              <span className="resumen-mini-label">DÍAS</span>
              <span className="resumen-mini-value">{resumen.diasConDatos} / {resumen.totalDias}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenMensualCard;