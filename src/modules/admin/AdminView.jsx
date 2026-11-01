import React from 'react';
import './AdminView.css';

const AdminView = ({ 
  onBack, 
  onGoToUsuarios, 
  onGoToAgencias, 
  onGoToZonas, 
  onGoToAsistencia, 
  onGoToEfectividad, 
  onGoToReportes 
}) => {
  const modulos = [
    { id: 'usuarios', titulo: 'USUARIOS', subtitulo: 'Crear y asignar permisos', color: 'naranja', action: onGoToUsuarios },
    { id: 'agencias', titulo: 'AGENCIAS', subtitulo: 'Gestionar agencias', color: 'azul', action: onGoToAgencias },
    { id: 'zonas', titulo: 'ZONAS', subtitulo: 'Gestionar zonas', color: 'morado', action: onGoToZonas },
    { id: 'asistencia', titulo: 'ASISTENCIA', subtitulo: 'Ver asistencias', color: 'verde', action: onGoToAsistencia },
    { id: 'efectividad', titulo: 'EFECTIVIDAD', subtitulo: 'Ver efectividad', color: 'amarillo', action: onGoToEfectividad },
    { id: 'reportes', titulo: 'REPORTES', subtitulo: 'Generar reportes', color: 'gris', action: onGoToReportes },
  ];

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
            onClick={modulo.action}
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
