import React from 'react';
import './WeekNavigator.css';

const WeekNavigator = ({ week, selectedDate, onDateChange, onPrevWeek, onNextWeek, onCurrentWeek }) => {
  // Formatear fecha para mostrar de forma legible
  const formatearFechaMostrar = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  };

  return (
    <div className="week-navigator-modern">
      {/* Título de la semana */}
      <div className="week-header-modern">
        <span className="week-icon">📅</span>
        <div className="week-info">
          <h2 className="week-title-modern">{week}</h2>
          <p className="week-selected-date">📌 {formatearFechaMostrar(selectedDate)}</p>
        </div>
      </div>
      
      {/* Controles de navegación */}
      <div className="week-controls-modern">
        <button className="week-nav-btn prev" onClick={onPrevWeek}>
          <span>◀</span> Semana anterior
        </button>
        <button className="week-nav-btn today" onClick={onCurrentWeek}>
          <span>📍</span> Hoy
        </button>
        <button className="week-nav-btn next" onClick={onNextWeek}>
          Semana siguiente <span>▶</span>
        </button>
      </div>
      
      {/* Selector de fecha elegante */}
      <div className="date-picker-modern">
        <label className="date-picker-label">
          📅 Seleccionar fecha:
        </label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => onDateChange(e.target.value)}
          className="date-picker-input"
        />
      </div>
    </div>
  );
};

export default WeekNavigator;