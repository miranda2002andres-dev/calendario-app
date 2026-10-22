import React from 'react';
import './AdminView.css';

const AdminView = ({ onBack }) => {
  const modulos = [
    { id: 'usuarios', titulo: 'USUARIOS', subtitulo: 'Crear y asignar permisos', color: 'naranja' },
    { id: 'agencias', titulo: 'AGENCIAS', subtitulo: 'Gestionar agencias', color: 'azul' },
    { id: 'zonas', titulo: 'ZONAS', subtitulo: 'Gestionar zonas', color: 'morado' },
    { id: 'asistencia', titulo: 'ASISTENCIA', subtitulo: 'Ver asistencias', color: 'verde' },
    { id: 'efectividad', titulo: 'EFECTIVIDAD', subtitulo: 'Ver efectividad', color: 'amarillo' },
    { id: 'reportes', titulo: 'REPORTES', subtitulo: 'Generar reportes', color: 'gris' },
  ];

  const handleClick = (modulo) => {
    console.log('Módulo seleccionado:', modulo.id);
  };

  return (
    <div className="admin-view">
      <div className="admin-view-header">
        <button className="admin-back-btn" onClick={onBack}>←</button>
        <div>
          <h2>PANEL ADMINISTRADOR</h2>
          <p>RACOL CARTAGENA</p>
        </div>
      </div>

      <div className="admin-modulos-grid">
        {modulos.map((modulo) => (
          <button
            key={modulo.id}
            className={`admin-modulo-card admin-modulo-${modulo.color}`}
            onClick={() => handleClick(modulo)}
          >
            <div className="admin-modulo-info">
              <span className="admin-modulo-titulo">{modulo.titulo}</span>
              <span className="admin-modulo-sub">{modulo.subtitulo}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminView;