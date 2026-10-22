import React, { useState, useEffect } from 'react';
import { asistenciaService } from '../../services/firebaseService';
import './SatelitesView.css';

const SatelitesView = ({ fuente, onSelectSatelite, onGoToAdmin }) => {
  const [satelites, setSatelites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await asistenciaService.getSatelites(fuente);
        setSatelites(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [fuente]);

  if (loading) return <div className="satelites-loading">⏳ Cargando satélites...</div>;

  return (
    <div className="satelites-view">
      {satelites.length === 0 ? (
        <div className="satelites-empty">
          <p>📭 No hay satélites creados para {fuente === 'domis' ? 'DOMIS' : 'PAMIS'}.</p>
          <p className="satelites-empty-sub">Ve al Panel Administrador (⚙️) para crear el primero.</p>
        </div>
      ) : (
        <div className="satelites-grid">
          {satelites.map((sat) => (
            <button
              key={sat.id}
              className="satelite-card"
              onClick={() => onSelectSatelite(sat)}
            >
              <span className="satelite-icon">🛰️</span>
              <div className="satelite-info">
                <span className="satelite-codigo">{sat.codigo}</span>
                <span className="satelite-nombre">{sat.nombre}</span>
              </div>
              <span className="satelite-arrow">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SatelitesView;
