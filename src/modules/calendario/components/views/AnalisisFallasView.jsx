import React, { useState, useEffect, useCallback } from 'react';
import { firebaseService } from '../../services/firebaseService';
import FallasStatsCards from '../dashboard/Charts/FallasStatsCards';
import FallasPorDia from '../dashboard/Charts/FallasPorDia';
import FallasTopMensajeros from '../dashboard/Charts/FallasTopMensajeros';
import FallasTopMes from '../dashboard/Charts/FallasTopMes';
import FallasTabla from '../dashboard/Charts/FallasTabla';
import './AnalisisFallasView.css';

const AnalisisFallasView = ({ selectedDate, formatShortDate }) => {
  const [source, setSource] = useState('domis');
  const [loading, setLoading] = useState(false);
  const [fallasHoy, setFallasHoy] = useState(null);
  const [totalHoy, setTotalHoy] = useState(0);
  const [totalSemana, setTotalSemana] = useState(0);
  const [totalMes, setTotalMes] = useState(0);
  const [dataSemana, setDataSemana] = useState([]);
  const [dataMes, setDataMes] = useState([]);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    return d;
  };

  const getWeekRange = () => {
    const monday = getMonday(selectedDate);
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);
    return { inicio: formatDate(monday), fin: formatDate(saturday) };
  };

  const getMonthRange = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    return {
      inicio: formatDate(new Date(year, month, 1)),
      fin: formatDate(new Date(year, month + 1, 0)),
    };
  };

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const fechaStr = formatDate(selectedDate);
      const { inicio: semanaInicio, fin: semanaFin } = getWeekRange();
      const { inicio: mesInicio, fin: mesFin } = getMonthRange();

      const hoyData = await firebaseService.getFallasByDate(fechaStr, source);
      setFallasHoy(hoyData);
      setTotalHoy(hoyData?.totalDia || 0);

      const semanaData = await firebaseService.getFallasByRange(semanaInicio, semanaFin, source);
      setTotalSemana(semanaData.reduce((sum, d) => sum + (d.totalDia || 0), 0));

      const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
      const diasSemana = [];
      const monday = getMonday(selectedDate);
      for (let i = 0; i < 6; i++) {
        const diaActual = new Date(monday);
        diaActual.setDate(monday.getDate() + i);
        const diaStr = formatDate(diaActual);
        const itemSemana = semanaData.find((d) => d.fecha === diaStr);
        diasSemana.push({
          dia: dias[i],
          fecha: diaStr,
          totalDia: itemSemana?.totalDia || 0,
          totalMensajeros: itemSemana?.totalMensajeros || 0,
          ranking: itemSemana?.ranking || [],
        });
      }
      setDataSemana(diasSemana);

      const mesData = await firebaseService.getFallasByRange(mesInicio, mesFin, source);
      setTotalMes(mesData.reduce((sum, d) => sum + (d.totalDia || 0), 0));
      setDataMes(mesData);
    } catch (error) {
      console.error('Error cargando fallas:', error);
    } finally {
      setLoading(false);
    }
  }, [source, selectedDate]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return (
    <div className="view-container analisis-fallas-view">
      <div className="view-header">
        <div className="view-icon">📊</div>
        <div className="view-title">
          <h2>Análisis de Fallas</h2>
          <p>KPIs, tendencias y rankings de fallas</p>
        </div>
        <div className="view-date">
          📅 {formatShortDate(selectedDate)}
        </div>
      </div>

      <div className="fallas-toggle">
        <button
          className={`fallas-toggle-btn ${source === 'domis' ? 'active domis' : ''}`}
          onClick={() => setSource('domis')}
        >
          📦 DOMIS
        </button>
        <button
          className={`fallas-toggle-btn ${source === 'pamis' ? 'active pamis' : ''}`}
          onClick={() => setSource('pamis')}
        >
          📮 PAMIS
        </button>
      </div>

      {loading ? (
        <div className="analisis-fallas-loading">Cargando análisis...</div>
      ) : (
        <>
          <FallasStatsCards
            totalHoy={totalHoy}
            totalSemana={totalSemana}
            totalMes={totalMes}
            source={source}
          />

          <div className="fallas-charts-grid">
            <FallasPorDia dataSemana={dataSemana} source={source} />
            <FallasTopMensajeros dataSemana={dataSemana} source={source} />
          </div>

          <div className="fallas-top-mes-container">
            <FallasTopMes dataMes={dataMes} source={source} />
          </div>

          {fallasHoy && fallasHoy.ranking && fallasHoy.ranking.length > 0 && (
            <div className="fallas-tabla-container">
              <FallasTabla
                ranking={fallasHoy.ranking}
                totalDia={fallasHoy.totalDia}
                fecha={fallasHoy.fecha}
                source={source}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalisisFallasView;