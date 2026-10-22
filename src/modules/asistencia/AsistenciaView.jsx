import React, { useState } from 'react';
import './AsistenciaView.css';
import HomeView from './modules/home/HomeView';
import SatelitesView from './modules/satelites/SatelitesView';
import DomiciliariosView from './modules/asistencia/DomiciliariosView';
import AdminView from './modules/admin/AdminView';

const AsistenciaView = ({ onBack }) => {
  const [vista, setVista] = useState('home');
  const [fuente, setFuente] = useState(null);
  const [sateliteActivo, setSateliteActivo] = useState(null);

  const handleSelectFuente = (f) => {
    setFuente(f);
    setVista('satelites');
  };

  const handleSelectSatelite = (sat) => {
    setSateliteActivo(sat);
    setVista('domiciliarios');
  };

  const handleGoToAdmin = () => {
    setVista('admin');
  };

  const handleBack = () => {
    if (vista === 'satelites') setVista('home');
    else if (vista === 'domiciliarios') setVista('satelites');
    else if (vista === 'admin') setVista('home');
    else onBack();
  };

  const getTitulo = () => {
    if (vista === 'home') return '⏰ ASISTENCIA';
    if (vista === 'satelites') return `📍 SATÉLITES ${fuente === 'domis' ? 'DOMIS' : 'PAMIS'}`;
    if (vista === 'domiciliarios') return sateliteActivo ? `👥 ${sateliteActivo.codigo} - ${sateliteActivo.nombre}` : 'DOMICILIARIOS';
    if (vista === 'admin') return '⚙️ PANEL ADMINISTRADOR';
    return 'ASISTENCIA';
  };

  return (
    <div className="asistencia-container">
      <div className="asistencia-header">
        <button className="asistencia-back-btn" onClick={handleBack}>←</button>
        <h1 className="asistencia-title">{getTitulo()}</h1>
        {/* ✅ El botón de Admin siempre visible */}
        {vista !== 'admin' && (
          <button className="asistencia-admin-btn" onClick={handleGoToAdmin}>⚙️</button>
        )}
      </div>

      {vista === 'home' && <HomeView onSelectFuente={handleSelectFuente} />}
      {vista === 'satelites' && (
        <SatelitesView 
          fuente={fuente} 
          onSelectSatelite={handleSelectSatelite}
          onGoToAdmin={handleGoToAdmin}
        />
      )}
      {vista === 'domiciliarios' && sateliteActivo && (
        <DomiciliariosView fuente={fuente} satelite={sateliteActivo} />
      )}
      {vista === 'admin' && <AdminView onBack={() => setVista('home')} />}
    </div>
  );
};

export default AsistenciaView;
