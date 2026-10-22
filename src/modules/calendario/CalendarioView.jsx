import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import WeekNavigator from './components/layout/WeekNavigator';
import DashboardView from './components/views/DashboardView';
import DomisView from './components/views/DomisView';
import PamisView from './components/views/PamisView';
import GeneralView from './components/views/GeneralView';
import TeleView from './components/views/TeleView';
import ReportesView from './components/views/ReportesView';
import FallasView from './components/views/FallasView';
import AnalisisFallasView from './components/views/AnalisisFallasView';
import DashboardMensual from './components/dashboard/Charts/DashboardMensual';
import DashboardAnual from './components/dashboard/Charts/DashboardAnual';
import DataEntryForm from './components/forms/DataEntryForm';
import PamisEntryForm from './components/forms/PamisEntryForm';
import GeneralEntryForm from './components/forms/GeneralEntryForm';
import { firebaseService } from './services/firebaseService';
import './components/views/Views.css';

const calcEfectividad = (entregadas, devolucion) => {
  const total = (entregadas || 0) + (devolucion || 0);
  if (total === 0) return 0;
  return parseFloat(((entregadas / total) * 100).toFixed(2));
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonday = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = (day === 0 ? 6 : day - 1);
  newDate.setDate(newDate.getDate() - diff);
  return newDate;
};

const formatShortDate = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

const formatLongDate = (date) => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]} ${date.getFullYear()}`;
};

const CalendarioView = ({ onBack }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showMensual, setShowMensual] = useState(false);
  const [showAnual, setShowAnual] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [source, setSource] = useState('domis');
  
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(today));
  const [existingDataForForm, setExistingDataForForm] = useState(null);
  
  const getWeekDates = useCallback(() => {
    const dates = [];
    const start = new Date(currentWeekStart);
    for (let i = 0; i < 6; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  const [weekDates, setWeekDates] = useState(getWeekDates());
  const [weekName, setWeekName] = useState("");

  useEffect(() => {
    const dates = getWeekDates();
    setWeekDates(dates);
    if (dates.length === 6) {
      setWeekName(`Semana ${formatShortDate(dates[0])} - ${formatShortDate(dates[5])}`);
    }
  }, [getWeekDates]);

  const [dashboardData, setDashboardData] = useState({
    domis: 0, meta: 0, telemercadeo: 0, diferencia: '0',
    infoAdicional: 0, domiAsistencia: 0, satelites: 0, asignacionDia: 0
  });

  const [pamisData, setPamisData] = useState({
    domis: 0, meta: 0, telemercadeo: 0, diferencia: '0',
    infoAdicional: 0, domiAsistencia: 0, satelites: 0, asignacionDia: 0
  });

  const [generalData, setGeneralData] = useState({
    domis: 0, meta: 0, telemercadeo: 0, diferencia: '0',
    infoAdicional: 0, domiAsistencia: 0, satelites: 0, asignacionDia: 0
  });

  const [metricsData, setMetricsData] = useState({
    telemercadeo: 0, contactabilidad: 0, noContactabilidad: 0, siRecibe: 0, devolucionDest: 0,
    porcentajes: { vsProyeccion: 0, contactabilidad: 0, noContactable: 0, siRecibe: 0, devolucionDest: 0 }
  });

  const [effectivenessData, setEffectivenessData] = useState({
    effectiveness: 0, delivered: 0, pending: 0, returns: 0
  });

  const [pamisEffectivenessData, setPamisEffectivenessData] = useState({
    effectiveness: 0, delivered: 0, pending: 0, returns: 0
  });

  const [generalEffectivenessData, setGeneralEffectivenessData] = useState({
    effectiveness: 0, delivered: 0, pending: 0, returns: 0
  });

  const [chartData, setChartData] = useState([]);
  const [pamisChartData, setPamisChartData] = useState([]);
  const [generalChartData, setGeneralChartData] = useState([]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const dates = weekDates;
      const newChartData = [];
      const newPamisChartData = [];
      const newGeneralChartData = [];
      const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
      
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const dateStr = formatDate(date);
        
        const domisItem = await firebaseService.getDataByDate(dateStr, 'domis');
        const dDel = domisItem?.entregadas || 0;
        const dRet = domisItem?.devolucion || 0;
        newChartData.push({
          dia: dayNames[i], date: dateStr, shortDate: formatShortDate(date),
          delivered: dDel, returns: dRet,
          effectiveness: calcEfectividad(dDel, dRet),
          projection: domisItem?.proyeccion || 0
        });
        
        const pamisItem = await firebaseService.getDataByDate(dateStr, 'pamis');
        const pDel = pamisItem?.entregadas || 0;
        const pRet = pamisItem?.devolucion || 0;
        newPamisChartData.push({
          dia: dayNames[i], date: dateStr, shortDate: formatShortDate(date),
          delivered: pDel, returns: pRet,
          effectiveness: calcEfectividad(pDel, pRet),
          projection: pamisItem?.proyeccion || 0
        });
        
        const generalItem = await firebaseService.getDataByDate(dateStr, 'general');
        const gDel = generalItem?.entregadas || 0;
        const gRet = generalItem?.devolucion || 0;
        newGeneralChartData.push({
          dia: dayNames[i], date: dateStr, shortDate: formatShortDate(date),
          delivered: gDel, returns: gRet,
          effectiveness: calcEfectividad(gDel, gRet),
          projection: generalItem?.proyeccion || 0
        });
      }
      setChartData(newChartData);
      setPamisChartData(newPamisChartData);
      setGeneralChartData(newGeneralChartData);
      
      const selectedDateStr = formatDate(selectedDate);
      
      const domisData = await firebaseService.getDataByDate(selectedDateStr, 'domis');
      if (domisData && (domisData.entregadas > 0 || domisData.devolucion > 0 || domisData.telemercadeo > 0)) {
        const assignment = domisData.proyeccion || 0;
        const goal = domisData.meta || 0;
        setDashboardData({
          domis: domisData.entregadas || 0, meta: goal,
          telemercadeo: domisData.telemercadeo || 0, diferencia: (assignment - goal).toString(),
          infoAdicional: domisData.info_adicional || 0,
          domiAsistencia: domisData.domi_asistencia || 0,
          satelites: domisData.satelites || 0,
          asignacionDia: assignment
        });
        setMetricsData({
          telemercadeo: domisData.telemercadeo || 0,
          contactabilidad: domisData.contactabilidad || 0,
          noContactabilidad: domisData.no_contactabilidad || 0,
          siRecibe: domisData.si_recibe || 0,
          devolucionDest: domisData.devolucion_dest_tele || 0,
          porcentajes: {
            vsProyeccion: parseFloat((domisData.porcentaje_telemercadeo || 0).toFixed(2)),
            contactabilidad: parseFloat((domisData.porcentaje_contactabilidad || 0).toFixed(2)),
            noContactable: parseFloat((domisData.porcentaje_no_contactable || 0).toFixed(2)),
            siRecibe: parseFloat((domisData.porcentaje_si_recibe || 0).toFixed(2)),
            devolucionDest: parseFloat((domisData.porcentaje_devolucion_dest || 0).toFixed(2))
          }
        });
        const totalReal = (domisData.entregadas || 0) + (domisData.devolucion || 0);
        setEffectivenessData({
          effectiveness: calcEfectividad(domisData.entregadas || 0, domisData.devolucion || 0),
          delivered: domisData.entregadas || 0,
          pending: Math.max(0, assignment - totalReal),
          returns: domisData.devolucion || 0
        });
      }
      
      const pamisRaw = await firebaseService.getDataByDate(selectedDateStr, 'pamis');
      if (pamisRaw && (pamisRaw.entregadas > 0 || pamisRaw.devolucion > 0)) {
        const assignment = pamisRaw.proyeccion || 0;
        const goal = pamisRaw.meta || 0;
        setPamisData({
          domis: pamisRaw.entregadas || 0, meta: goal,
          telemercadeo: 0, diferencia: (assignment - goal).toString(),
          infoAdicional: 0,
          domiAsistencia: pamisRaw.domi_asistencia || 0,
          satelites: 0, asignacionDia: assignment
        });
        const totalReal = (pamisRaw.entregadas || 0) + (pamisRaw.devolucion || 0);
        setPamisEffectivenessData({
          effectiveness: calcEfectividad(pamisRaw.entregadas || 0, pamisRaw.devolucion || 0),
          delivered: pamisRaw.entregadas || 0,
          pending: Math.max(0, assignment - totalReal),
          returns: pamisRaw.devolucion || 0
        });
      }
      
      const generalRaw = await firebaseService.getDataByDate(selectedDateStr, 'general');
      if (generalRaw && (generalRaw.entregadas > 0 || generalRaw.devolucion > 0)) {
        const assignment = generalRaw.proyeccion || 0;
        setGeneralData({
          domis: generalRaw.entregadas || 0, meta: 0,
          telemercadeo: 0, diferencia: (assignment - 0).toString(),
          infoAdicional: 0, domiAsistencia: 0,
          satelites: 0, asignacionDia: assignment
        });
        const totalReal = (generalRaw.entregadas || 0) + (generalRaw.devolucion || 0);
        setGeneralEffectivenessData({
          effectiveness: calcEfectividad(generalRaw.entregadas || 0, generalRaw.devolucion || 0),
          delivered: generalRaw.entregadas || 0,
          pending: Math.max(0, assignment - totalReal),
          returns: generalRaw.devolucion || 0
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [weekDates, selectedDate]);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  const openEditor = async () => {
    const data = await firebaseService.getDataByDate(formatDate(selectedDate), source);
    setExistingDataForForm(data);
    setShowEditor(true);
  };

  const handleViewChange = (view) => {
    if (view === 'mensual') { setShowMensual(true); }
    else if (view === 'anual') { setShowAnual(true); }
    else {
      setActiveView(view);
      if (view === 'pamis') setSource('pamis');
      else if (view === 'domis') setSource('domis');
      else if (view === 'general') setSource('general');
    }
  };

  const handleDateChange = (newDateStr) => {
    const [year, month, day] = newDateStr.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    setSelectedDate(newDate);
    setCurrentWeekStart(getMonday(newDate));
  };

  const changeWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentWeekStart(newWeekStart);
    const newSelectedDate = new Date(newWeekStart);
    newSelectedDate.setDate(newWeekStart.getDate() + 1);
    setSelectedDate(newSelectedDate);
  };

  const goToCurrentWeek = () => {
    const todayDate = new Date();
    setCurrentWeekStart(getMonday(todayDate));
    setSelectedDate(todayDate);
  };

  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            dashboardData={dashboardData}
            pamisData={pamisData}
            generalData={generalData}
            effectivenessData={effectivenessData}
            pamisEffectivenessData={pamisEffectivenessData}
            generalEffectivenessData={generalEffectivenessData}
            chartData={chartData}
            pamisChartData={pamisChartData}
            generalChartData={generalChartData}
            weekDates={weekDates}
            weekName={weekName}
            selectedDate={selectedDate}
          />
        );
      case 'general':
        return (
          <GeneralView 
            dashboardData={generalData}
            effectivenessData={generalEffectivenessData}
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
            onEdit={openEditor}
            onDelete={() => setShowConfirmDelete(true)}
          />
        );
      case 'domis':
        return (
          <DomisView 
            dashboardData={dashboardData}
            effectivenessData={effectivenessData}
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
            onEdit={openEditor}
            onDelete={() => setShowConfirmDelete(true)}
          />
        );
      case 'pamis':
        return (
          <PamisView 
            dashboardData={pamisData}
            effectivenessData={pamisEffectivenessData}
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
            onEdit={openEditor}
            onDelete={() => setShowConfirmDelete(true)}
          />
        );
      case 'tele':
        return (
          <TeleView 
            metricsData={metricsData}
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
            onEdit={openEditor}
            onDelete={() => setShowConfirmDelete(true)}
          />
        );
      case 'reportes':
        return (
          <ReportesView 
            weekName={weekName}
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
            weekDates={weekDates}
          />
        );
      case 'fallas':
        return (
          <FallasView 
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
          />
        );
      case 'analisis-fallas':
        return (
          <AnalisisFallasView 
            selectedDate={selectedDate}
            formatShortDate={formatShortDate}
          />
        );
      default:
        return (
          <DashboardView 
            dashboardData={dashboardData}
            pamisData={pamisData}
            generalData={generalData}
            effectivenessData={effectivenessData}
            pamisEffectivenessData={pamisEffectivenessData}
            generalEffectivenessData={generalEffectivenessData}
            chartData={chartData}
            pamisChartData={pamisChartData}
            generalChartData={generalChartData}
            weekDates={weekDates}
            weekName={weekName}
            selectedDate={selectedDate}
          />
        );
    }
  };

  return (
    <div className="app-container" style={{ background: '#000', minHeight: '100vh', display: 'flex' }}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={handleViewChange}
      />
      
      <div className="main-content" style={{ 
        marginLeft: '260px', 
        padding: '20px', 
        width: 'calc(100% - 260px)',
        minHeight: '100vh'
      }}>
        <div style={{
          padding: '14px 24px',
          background: 'linear-gradient(90deg, #000 0%, #1a237e 100%)',
          borderBottom: '2px solid #ff6600',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          borderRadius: '12px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: '#ff6600',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '900'
            }}
          >
            ←
          </button>
          <h1 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>
            📊 EFECTIVIDAD - INTER RAPIDÍSIMO
          </h1>
        </div>

        <WeekNavigator 
          week={weekName}
          selectedDate={formatDate(selectedDate)}
          onDateChange={handleDateChange}
          onPrevWeek={() => changeWeek('prev')}
          onNextWeek={() => changeWeek('next')}
          onCurrentWeek={goToCurrentWeek}
        />
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            ⏳ Cargando calendario...
          </div>
        ) : (
          renderView()
        )}
      </div>
      
      {showEditor && source === 'pamis' && (
        <PamisEntryForm
          onClose={() => setShowEditor(false)}
          onSuccess={() => loadAllData()}
          fechaInicial={formatDate(selectedDate)}
          existingData={existingDataForForm}
        />
      )}
      
      {showEditor && source === 'domis' && (
        <DataEntryForm
          onClose={() => setShowEditor(false)}
          onSuccess={() => loadAllData()}
          fechaInicial={formatDate(selectedDate)}
          existingData={existingDataForForm}
        />
      )}
      
      {showEditor && source === 'general' && (
        <GeneralEntryForm
          onClose={() => setShowEditor(false)}
          onSuccess={() => loadAllData()}
          fechaInicial={formatDate(selectedDate)}
          existingData={existingDataForForm}
        />
      )}
      
      {showMensual && (
        <DashboardMensual
          mes={selectedDate.getMonth() + 1}
          año={selectedDate.getFullYear()}
          onClose={() => setShowMensual(false)}
        />
      )}
      
      {showAnual && (
        <DashboardAnual
          onClose={() => setShowAnual(false)}
        />
      )}
    </div>
  );
};

export default CalendarioView;