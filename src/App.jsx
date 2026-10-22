import React, { useState } from 'react';
import Header from './components/layout/Header';
import HomeView from './modules/home/HomeView';
import RacolView from './modules/racol/RacolView';
import AdminView from './modules/admin/AdminView';
import CalendarioView from './modules/calendario/CalendarioView';
import AsistenciaView from './modules/asistencia/AsistenciaView';
import './App.css';

function App() {
  const [vista, setVista] = useState('home');

  const handleSelectRacol = () => setVista('racol');
  const handleGoToAdmin = () => setVista('admin');
  const handleGoToAsistencia = () => setVista('asistencia');
  const handleGoToZonas = () => setVista('zonas');
  const handleGoToAgencias = () => setVista('agencias');
  const handleGoToCalendario = () => setVista('calendario');

  const handleBack = () => {
    if (vista === 'admin' || vista === 'asistencia' || vista === 'zonas' || vista === 'agencias' || vista === 'calendario') {
      setVista('racol');
    } else if (vista === 'racol') {
      setVista('home');
    }
  };

  if (vista === 'calendario') {
    return <CalendarioView onBack={handleBack} />;
  }

  if (vista === 'asistencia') {
    return <AsistenciaView onBack={handleBack} />;
  }

  return (
    <div className="cc-app">
      <Header />
      <main className="cc-main">
        {vista === 'home' && <HomeView onSelectRacol={handleSelectRacol} />}
        {vista === 'racol' && (
          <RacolView 
            onBack={handleBack} 
            onGoToAdmin={handleGoToAdmin}
            onGoToAsistencia={handleGoToAsistencia}
            onGoToZonas={handleGoToZonas}
            onGoToAgencias={handleGoToAgencias}
            onGoToCalendario={handleGoToCalendario}
          />
        )}
        {vista === 'admin' && <AdminView onBack={handleBack} />}
        {vista === 'zonas' && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
            <h2 style={{ color: '#2196f3', marginBottom: '20px' }}>🚧 Módulo de Zonas</h2>
            <button onClick={handleBack} style={{ marginTop: '20px', padding: '10px 20px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              ← Volver
            </button>
          </div>
        )}
        {vista === 'agencias' && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
            <h2 style={{ color: '#9c27b0', marginBottom: '20px' }}>🚧 Módulo de Agencias</h2>
            <button onClick={handleBack} style={{ marginTop: '20px', padding: '10px 20px', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              ← Volver
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;