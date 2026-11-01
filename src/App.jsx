import React, { useState } from 'react';
import Header from './components/layout/Header';
import HomeView from './modules/home/HomeView';
import RacolView from './modules/racol/RacolView';
import AdminView from './modules/admin/AdminView';
import EfectividadView from './modules/efectividad/EfectividadView';
import AsistenciaView from './modules/asistencia/AsistenciaView';
import './App.css';

function App() {
  const [vista, setVista] = useState('home');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const handleSelectRacol = () => setVista('racol');
  
  const handleGoToAdmin = () => setShowAdminPin(true);
  
  // VISTA ASISTENCIA NORMAL (Viene de RACOL): Muestra DOMIS/PAMIS
  const handleGoToAsistenciaFromRacol = () => setVista('asistencia_normal');
  
  // VISTA ASISTENCIA DESDE ADMIN (Viene de las 6 tarjetas): Muestra el Panel de Admin de Asistencia
  const handleGoToAsistenciaFromAdmin = () => setVista('asistencia_admin');

  const handleGoToEfectividad = () => setVista('efectividad');

  // Funciones de regreso
  const handleBackFromAsistenciaNormal = () => setVista('racol'); // Vuelve a RACOL
  const handleBackFromAsistenciaAdmin = () => setVista('admin'); // Vuelve al Panel de 6 tarjetas
  const handleBackFromAdmin = () => setVista('racol'); // Vuelve a RACOL
  const handleBackFromEfectividad = () => setVista('admin'); // Vuelve al Panel Admin

  const verificarPin = () => {
    if (pinInput === '1234') {
      setShowAdminPin(false);
      setPinInput('');
      setVista('admin');
    } else {
      alert('PIN incorrecto. Intenta de nuevo.');
    }
  };

  if (vista === 'efectividad') {
    return <EfectividadView onBack={handleBackFromEfectividad} />;
  }
  
  // ASISTENCIA NORMAL: Pasa prop "esAdmin = false"
  if (vista === 'asistencia_normal') {
    return <AsistenciaView onBack={handleBackFromAsistenciaNormal} esAdmin={false} />;
  }

  // ASISTENCIA DESDE EL ADMIN: Pasa prop "esAdmin = true"
  if (vista === 'asistencia_admin') {
    return <AsistenciaView onBack={handleBackFromAsistenciaAdmin} esAdmin={true} />;
  }

  return (
    <div className="cc-app">
      <Header />
      <main className="cc-main">
        {vista === 'home' && <HomeView onSelectRacol={handleSelectRacol} />}
        {vista === 'racol' && (
          <RacolView 
            onBack={() => setVista('home')} 
            onGoToAdmin={handleGoToAdmin}
            onGoToAsistencia={handleGoToAsistenciaFromRacol}
          />
        )}
        {vista === 'admin' && (
          <AdminView 
            onBack={handleBackFromAdmin} 
            onGoToAsistencia={handleGoToAsistenciaFromAdmin}
            onGoToEfectividad={handleGoToEfectividad}
            onGoToUsuarios={() => alert('Usuarios en construcción')}
            onGoToAgencias={() => alert('Agencias en construcción')}
            onGoToZonas={() => alert('Zonas en construcción')}
            onGoToReportes={() => alert('Reportes en construcción')}
          />
        )}
      </main>

      {showAdminPin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0a1220', padding: '30px', borderRadius: '15px', border: '1px solid #3b82f6', textAlign: 'center', width: '300px' }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>🔒 Acceso Administrador</h3>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '20px' }}>Ingresa el PIN de seguridad</p>
            <input 
              type="password" 
              value={pinInput} 
              onChange={(e) => setPinInput(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #1a2a4a', background: '#060e1e', color: '#fff', textAlign: 'center', fontSize: '20px', marginBottom: '15px' }} 
              placeholder="****" 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowAdminPin(false); setPinInput(''); }} style={{ flex: 1, padding: '10px', background: '#1a2a4a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={verificarPin} style={{ flex: 1, padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
