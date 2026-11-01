import React, { useState } from 'react';

const RacolView = ({ onBack, onGoToAdmin, onGoToAsistencia }) => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');

  const handleRuedita = () => setShowPin(true);

  const verificarPin = () => {
    if (pin === '1234') {
      setShowPin(false);
      setPin('');
      onGoToAdmin();
    } else {
      alert('PIN incorrecto. Intenta de nuevo.');
    }
  };

  return (
    <div className="racol-view" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ background: '#ff6600', border: 'none', color: '#fff', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>←</button>
        <h2 style={{ color: '#fff', margin: 0 }}>RACOL CARTAGENA</h2>
        <button onClick={handleRuedita} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>⚙️</button>
      </div>

      <div style={{ background: '#0a1220', border: '1px solid #1a2a4a', borderRadius: '16px', padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚀</div>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>RACOL CARTAGENA</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div onClick={onGoToAsistencia} style={{ background: '#0a1220', border: '1px solid #ff6600', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
          <div style={{ fontSize: '24px' }}>🕒</div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: '#ff6600', margin: 0, textTransform: 'uppercase' }}>ASISTENCIA</h3>
            <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>Registrar entrada y salida</p>
          </div>
        </div>
      </div>

      {showPin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0a1220', padding: '30px', borderRadius: '15px', border: '1px solid #3b82f6', textAlign: 'center', width: '300px' }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>🔒 Acceso Administrador</h3>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '20px' }}>Ingresa el PIN de seguridad</p>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #1a2a4a', background: '#060e1e', color: '#fff', textAlign: 'center', fontSize: '20px', marginBottom: '15px' }} placeholder="****" />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowPin(false); setPin(''); }} style={{ flex: 1, padding: '10px', background: '#1a2a4a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={verificarPin} style={{ flex: 1, padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RacolView;
