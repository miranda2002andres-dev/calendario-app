import React, { useState, useEffect } from 'react';
import ComparativoSemanas from '../dashboard/Charts/ComparativoSemanas';
import TendenciaEfectividad from '../dashboard/Charts/TendenciaEfectividad';
import SourceToggle from '../dashboard/Charts/SourceToggle';
import { firebaseService } from '../../services/firebaseService';
import './Views.css';

const ReportesView = ({ weekName, selectedDate, formatShortDate, weekDates }) => {
  const [source, setSource] = useState('domis');
  const [chartData, setChartData] = useState([]);
  const [pamisChartData, setPamisChartData] = useState([]);
  const [generalChartData, setGeneralChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fechaObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
  const fechaFormateada = formatShortDate(fechaObj);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!weekDates || weekDates.length === 0) return;
      
      setLoading(true);
      try {
        const nuevosDatosDomis = [];
        const nuevosDatosPamis = [];
        const nuevosDatosGeneral = [];
        const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        
        for (let i = 0; i < weekDates.length; i++) {
          const date = weekDates[i];
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          
          // DOMIS
          const domisData = await firebaseService.getDataByDate(dateStr, 'domis');
          const domisDelivered = domisData?.entregadas || 0;
          const domisReturns = domisData?.devolucion || 0;
          const domisEffectiveness = domisDelivered + domisReturns > 0 
            ? Math.round((domisDelivered / (domisDelivered + domisReturns)) * 100) 
            : 0;
          
          nuevosDatosDomis.push({
            dia: dayNames[i], date: dateStr, shortDate: formatShortDate(date),
            delivered: domisDelivered, returns: domisReturns,
            effectiveness: domisEffectiveness, projection: domisData?.proyeccion || 0
          });
          
          // PAMIS
          const pamisData = await firebaseService.getDataByDate(dateStr, 'pamis');
          const pamisDelivered = pamisData?.entregadas || 0;
          const pamisReturns = pamisData?.devolucion || 0;
          const pamisEffectiveness = pamisDelivered + pamisReturns > 0 
            ? Math.round((pamisDelivered / (pamisDelivered + pamisReturns)) * 100) 
            : 0;
          
          nuevosDatosPamis.push({
            dia: dayNames[i], date: dateStr, shortDate: formatShortDate(date),
            delivered: pamisDelivered, returns: pamisReturns,
            effectiveness: pamisEffectiveness, projection: pamisData?.proyeccion || 0
          });
          
          // GENERAL
          const generalData = await firebaseService.getDataByDate(dateStr, 'general');
          const generalDelivered = generalData?.entregadas || 0;
          const generalReturns = generalData?.devolucion || 0;
          const generalEffectiveness = generalDelivered + generalReturns > 0 
            ? Math.round((generalDelivered / (generalDelivered + generalReturns)) * 100) 
            : 0;
          
          nuevosDatosGeneral.push({
            dia: dayNames[i], date: dateStr, shortDate: formatShortDate(date),
            delivered: generalDelivered, returns: generalReturns,
            effectiveness: generalEffectiveness, projection: generalData?.proyeccion || 0
          });
        }
        
        setChartData(nuevosDatosDomis);
        setPamisChartData(nuevosDatosPamis);
        setGeneralChartData(nuevosDatosGeneral);
      } catch (error) {
        console.error(`Error cargando reportes:`, error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [weekDates]);

  const datosBarras = 
    source === 'domis' ? chartData :
    source === 'pamis' ? pamisChartData :
    generalChartData;

  return (
    <div className="view-container reportes-view">
      <div className="view-header">
        <div className="view-icon">📈</div>
        <div className="view-title">
          <h2>Panel de Reportes</h2>
          <p>Análisis gráfico de rendimiento</p>
        </div>
        <div className="view-date">📅 {fechaFormateada}</div>
      </div>
      
      <div className="reportes-source-toggle">
        <SourceToggle source={source} onChange={setSource} />
      </div>
      
      {loading ? (
        <div className="reportes-loading">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="reportes-grid">
            <ComparativoSemanas datos={datosBarras} week={weekName} />
            <TendenciaEfectividad 
              source={source}
              datos={chartData}
              pamisDatos={pamisChartData}
              generalDatos={generalChartData}
            />
          </div>
          
          <div className="info-box">
            <h4>📊 Interpretación de Gráficas</h4>
            <ul>
              <li><span className="bullet green"></span> Barras verdes: Entregas exitosas</li>
              <li><span className="bullet red"></span> Barras rojas: Devoluciones</li>
              <li><span className="bullet orange"></span> Línea naranja: Tendencia DOMIS</li>
              <li><span className="bullet blue"></span> Línea azul: Tendencia PAMIS</li>
              <li><span className="bullet gold"></span> Línea dorada: Tendencia GENERAL</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportesView;