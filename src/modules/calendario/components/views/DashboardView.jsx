import React, { useState, useEffect } from 'react';
import EfectividadCard from '../dashboard/Charts/EfectividadCard';
import TendenciaConResumen from '../dashboard/Charts/TendenciaConResumen';
import FallasTop3Dashboard from '../dashboard/Charts/FallasTop3Dashboard';
import { firebaseService } from '../../services/firebaseService';
import './DashboardView.css';

const DashboardView = ({ 
  dashboardData, 
  pamisData,
  generalData,
  effectivenessData, 
  pamisEffectivenessData,
  generalEffectivenessData,
  chartData, 
  pamisChartData,
  generalChartData,
  weekDates,
  weekName,
  selectedDate
}) => {
  const pamisEff = pamisEffectivenessData || { effectiveness: 0, delivered: 0, pending: 0, returns: 0 };
  const generalEff = generalEffectivenessData || { effectiveness: 0, delivered: 0, pending: 0, returns: 0 };
  const pamisChart = pamisChartData || [];
  const generalChart = generalChartData || [];

  const mesActual = selectedDate ? selectedDate.getMonth() + 1 : new Date().getMonth() + 1;
  const añoActual = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();

  // ✅ NUEVO: Estado para las fallas del mes
  const [fallasDomisMes, setFallasDomisMes] = useState([]);
  const [fallasPamisMes, setFallasPamisMes] = useState([]);

  // ✅ NUEVO: Cargar fallas del mes (DOMIS y PAMIS)
  useEffect(() => {
    const cargarFallasMes = async () => {
      if (!selectedDate) return;

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const inicio = new Date(year, month, 1);
      const fin = new Date(year, month + 1, 0);

      const formatFecha = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      try {
        const domisData = await firebaseService.getFallasByRange(
          formatFecha(inicio),
          formatFecha(fin),
          'domis'
        );
        setFallasDomisMes(domisData);

        const pamisData = await firebaseService.getFallasByRange(
          formatFecha(inicio),
          formatFecha(fin),
          'pamis'
        );
        setFallasPamisMes(pamisData);
      } catch (error) {
        console.error('Error cargando fallas del mes:', error);
      }
    };

    cargarFallasMes();
  }, [selectedDate]);

  return (
    <div className="view-container dashboard-view">
      {/* 1. GAUGES */}
      <div className="efectividad-triple">
        <EfectividadCard 
          efectividad={effectivenessData.effectiveness}
          entregadas={effectivenessData.delivered}
          pendiente={effectivenessData.pending}
          devolucion={effectivenessData.returns}
          title="📦 EFECTIVIDAD DOMIS"
          colorClass="domis"
        />
        <EfectividadCard 
          efectividad={pamisEff.effectiveness}
          entregadas={pamisEff.delivered}
          pendiente={pamisEff.pending}
          devolucion={pamisEff.returns}
          title="📮 EFECTIVIDAD PAMIS"
          colorClass="pamis"
        />
        <EfectividadCard 
          efectividad={generalEff.effectiveness}
          entregadas={generalEff.delivered}
          pendiente={generalEff.pending}
          devolucion={generalEff.returns}
          title="📊 EFECTIVIDAD GENERAL"
          colorClass="general"
        />
      </div>

      {/* 2. TRES COLUMNAS: Tendencia arriba + Resumen abajo */}
      <div className="tendencias-resumen-row">
        <TendenciaConResumen 
          source="domis"
          datos={chartData}
          mes={mesActual}
          año={añoActual}
        />
        <TendenciaConResumen 
          source="pamis"
          datos={pamisChart}
          mes={mesActual}
          año={añoActual}
        />
        <TendenciaConResumen 
          source="general"
          datos={generalChart}
          mes={mesActual}
          año={añoActual}
        />
      </div>

      {/* ✅ 3. TOP 3 FALLAS DEL MES (DOMIS + PAMIS) */}
      <div className="fallas-top3-row">
        <FallasTop3Dashboard dataMes={fallasDomisMes} source="domis" />
        <FallasTop3Dashboard dataMes={fallasPamisMes} source="pamis" />
      </div>
    </div>
  );
};

export default DashboardView;