import React, { useState, useEffect, useCallback } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './FallasView.css';

const FallasView = ({ selectedDate, formatShortDate }) => {
  const [source, setSource] = useState('domis');
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [fallasHoy, setFallasHoy] = useState(null);
  const [preview, setPreview] = useState({ total: 0, mensajeros: 0 });

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const fechaStr = formatDate(selectedDate);

  // Cargar las fallas del día seleccionado
  const cargarFallasDia = useCallback(async () => {
    try {
      const data = await firebaseService.getFallasByDate(fechaStr, source);
      setFallasHoy(data);
      setTexto(data?.textoOriginal || '');
    } catch (error) {
      console.error('Error cargando fallas:', error);
    }
  }, [fechaStr, source]);

  useEffect(() => {
    cargarFallasDia();
  }, [cargarFallasDia]);

  // Previsualización en vivo
  useEffect(() => {
    if (texto.trim()) {
      const p = firebaseService.parsearFallas(texto);
      setPreview({ total: p.total, mensajeros: p.mensajeros });
    } else {
      setPreview({ total: 0, mensajeros: 0 });
    }
  }, [texto]);

  const handleGuardar = async () => {
    if (!texto.trim()) {
      setMensaje('⚠️ Debes pegar la lista de fallas');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      await firebaseService.saveFallas(fechaStr, source, texto);
      setMensaje('✅ Fallas guardadas correctamente');
      await cargarFallasDia();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error guardando:', error);
      setMensaje('❌ Error al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!fallasHoy) return;
    if (!window.confirm(`¿Eliminar las fallas del ${fechaStr}?`)) return;

    setLoading(true);
    try {
      await firebaseService.deleteFallas(fechaStr, source);
      setTexto('');
      setFallasHoy(null);
      setMensaje('✅ Fallas eliminadas');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error eliminando:', error);
      setMensaje('❌ Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setTexto('');
    setMensaje('');
  };

  return (
    <div className="view-container fallas-view">
      {/* Header */}
      <div className="view-header">
        <div className="view-icon">⚠️</div>
        <div className="view-title">
          <h2>Registrar Fallas</h2>
          <p>Pega la lista de fallas del día</p>
        </div>
        <div className="view-date">
          📅 {formatShortDate(selectedDate)}
        </div>
      </div>

      {/* Toggle DOMIS / PAMIS */}
      <div className="fallas-toggle">
        <button
          className={`fallas-toggle-btn ${source === 'domis' ? 'active domis' : ''}`}
          onClick={() => setSource('domis')}
        >
          📦 DOMIS
        </button>
        <button
          className={`fallas-toggle-btn ${source === 'pamis' ? 'active pamis' : ''}`}
          onClick={() => setSource('pamis')}
        >
          📮 PAMIS
        </button>
      </div>

      {/* Info del día */}
      <div className="fallas-ingreso-info">
        <div className="fallas-ingreso-fecha">
          📅 Registrando fallas del: <strong>{fechaStr}</strong>
        </div>
        {fallasHoy && (
          <div className="fallas-ingreso-existente">
            ✅ Ya hay {fallasHoy.totalDia} fallas registradas
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="fallas-ingreso-card">
        <label className="fallas-ingreso-label">
          📋 Pega la lista de fallas {source === 'domis' ? 'de DOMIS' : 'de PAMIS'}
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`Pega aquí la lista tal cual viene de Excel. Ejemplo:\n\nAPOYO DOMI XL 20074 (SAT 11955)  KAREN MARGARITA AYOLA PEREZ\t5\nAPOYO DOMI XL 18201 (SAT 14615)  MIRABEL JOSE NAVARRO MONTALVO\t4\n...`}
          className="fallas-ingreso-textarea"
          rows={14}
        />

        {/* Previsualización */}
        {texto.trim() && (
          <div className="fallas-ingreso-preview">
            <div className="fallas-preview-item">
              <span className="fallas-preview-label">Total detectado</span>
              <span className="fallas-preview-value">{preview.total}</span>
            </div>
            <div className="fallas-preview-item">
              <span className="fallas-preview-label">Mensajeros</span>
              <span className="fallas-preview-value">{preview.mensajeros}</span>
            </div>
          </div>
        )}

        {/* Mensaje */}
        {mensaje && (
          <div className={`fallas-ingreso-mensaje ${mensaje.includes('✅') ? 'success' : 'error'}`}>
            {mensaje}
          </div>
        )}

        {/* Botones */}
        <div className="fallas-ingreso-actions">
          {fallasHoy && (
            <button
              className="fallas-btn fallas-btn-danger"
              onClick={handleEliminar}
              disabled={loading}
            >
              🗑️ Eliminar
            </button>
          )}
          <div className="fallas-ingreso-actions-right">
            <button
              className="fallas-btn fallas-btn-cancel"
              onClick={handleLimpiar}
              disabled={loading}
            >
              Limpiar
            </button>
            <button
              className={`fallas-btn fallas-btn-save ${source}`}
              onClick={handleGuardar}
              disabled={loading || !texto.trim()}
            >
              {loading ? 'Guardando...' : '💾 Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallasView;