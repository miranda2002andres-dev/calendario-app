import React, { useState } from 'react';
import './AsistenciaView.css';
import HomeView from './modules/home/HomeView';
import SatelitesView from './modules/satelites/SatelitesView';
import DomiciliariosView from './modules/asistencia/DomiciliariosView';
import AdminView from './modules/admin/AdminView';

const AsistenciaView = ({ onBack, esAdmin }) => {
  // Si viene del Panel Admin de las 6 tarjetas, entramos directo al panel de asistencia
  const [vista, setVista] = useState(esAdmin ? "admin" : "home");
  const [fuente, setFuente] = useState(null);
  const [sateliteActivo, setSateliteActivo] = useState(null);

  // Funciones de navegación interna
  const handleSelectFuente = (f) => {
    setFuente(f);
    setVista('satelites');
  };

  const handleSelectSatelite = (sat) => {
    setSateliteActivo(sat);
    setVista('domiciliarios');
  };

  // Lógica del botón "Volver"
  const handleBack = () => {
    if (vista === 'satelites') {
      setVista('home');
    } else if (vista === 'domiciliarios') {
      setVista('satelites');
    } else if (vista === 'admin') {
      // Si estamos en el admin de asistencia:
      if (esAdmin) {
        onBack(); // Si venimos del panel de 6 tarjetas, volvemos allí
      } else {
        setVista('home'); // Si entramos desde la ruedita, volvemos a home
      }
    } else {
      onBack(); // Si estamos en home, volvemos a la vista anterior (RACOL o Admin)
    }
  };

  const getTitulo = () => {
    if (vista === 'home') return '⏰ ASISTENCIA';
    if (vista === 'satelites') return `📍 SATÉLITES ${fuente === 'domis' ? 'DOMIS' : 'PAMIS'}`;
    if (vista === 'domiciliarios') return sateliteActivo ? `👥 ${sateliteActivo.codigo} - ${sateliteActivo.nombre}` : 'DOMICILIARIOS';
    if (vista === 'admin') return '⚙️ PANEL ADMINISTRADOR DE ASISTENCIA';
    return 'ASISTENCIA';
  };

  return (
    <div className="asistencia-container">
      <div className="asistencia-header">
        <button className="asistencia-back-btn" onClick={handleBack}>←</button>
        <h1 className="asistencia-title">{getTitulo()}</h1>
      </div>

      {/* 1. VISTA HOME (DOMIS/PAMIS) */}
      {vista === 'home' && <HomeView onSelectFuente={handleSelectFuente} />}
      
      {/* 2. VISTA SATÉLITES */}
      {vista === 'satelites' && (
        <SatelitesView 
          fuente={fuente} 
          onSelectSatelite={handleSelectSatelite}
          onGoToAdmin={() => setVista('admin')} // Por si acaso hay un botón de admin aquí
        />
      )}
      
      {/* 3. VISTA DOMICILIARIOS */}
      {vista === 'domiciliarios' && sateliteActivo && (
        <DomiciliariosView fuente={fuente} satelite={sateliteActivo} />
      )}

      {/* 4. VISTA ADMIN (Ruedita / Panel de Asistencia) */}
      {vista === 'admin' && (
        <AdminView 
          onBack={() => setVista('home')} 
          onGoToAsistencia={() => setVista('satelites')} // Conecta el botón de asistencia interno
        />
      )}
    </div>
  );
};

export default AsistenciaView;
