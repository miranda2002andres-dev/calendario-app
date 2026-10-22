import React, { useState } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './FallasUploader.css';

const FallasUploader = ({ source, fechaInicial, onClose, onSuccess, existingData }) => {
  // ✅ La fecha NO es editable, viene solo del WeekNavigator o del existingData
  const fecha = existingData?.fecha || fechaInicial || new Date().toISOString().split('T')[0];
  
  const [texto, setTexto] = useState(existingData?.textoOriginal || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Previsualización en vivo (mientras escribe/pega)
  const preview = texto.trim()
    ? firebaseService.parsearFallas(texto)
    : { total: 0, mensajeros: 0, ranking: [] };

  const handleGuardar = async () => {
    if (!texto.trim()) {
      setError('Debes pegar la lista de fallas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await firebaseService.saveFallas(fecha, source, texto);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error guardando fallas:', err);
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!existingData) return;
    if (!window.confirm(`¿Eliminar las fallas del ${existingData.fecha}?`)) return;

    setLoading(true);
    try {
      await firebaseService.deleteFallas(existingData.fecha, source);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error eliminando:', err);
      setError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fallas-modal-overlay" onClick={onClose}>
      <div
        className={`fallas-modal ${source}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="fallas-modal-header">
          <h3>
            ⚠️ {existingData ? 'Editar' : 'Registrar'} Fallas - {source === 'domis' ? 'DOMIS' : 'PAMIS'}
          </h3>
          <button className="fallas-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="fallas-modal-body">
          {/* ✅ Info de la fecha (solo lectura) */}
          <div className="fallas-modal-field">
            <label>📅 Fecha</label>
            <div className="fallas-modal-fecha-info">
              {fecha}
            </div>
          </div>

          {/* Textarea */}
          <div className="fallas-modal-field">
            <label>📋 Pega la lista de fallas</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={`Pega aquí la lista tal cual viene de Excel. Ejemplo:\n\nAPOYO DOMI XL 20074 (SAT 11955)  KAREN MARGARITA AYOLA PEREZ\t5\nAPOYO DOMI XL 18201 (SAT 14615)  MIRABEL JOSE NAVARRO MONTALVO\t4\n...`}
              className="fallas-modal-textarea"
              rows={12}
            />
          </div>

          {/* Previsualización */}
          {texto.trim() && (
            <div className="fallas-modal-preview">
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

          {/* Error */}
          {error && <div className="fallas-modal-error">⚠️ {error}</div>}
        </div>

        {/* Footer */}
        <div className="fallas-modal-footer">
          {existingData && (
            <button
              className="fallas-btn fallas-btn-danger"
              onClick={handleEliminar}
              disabled={loading}
            >
              🗑️ Eliminar
            </button>
          )}
          <div className="fallas-modal-footer-right">
            <button
              className="fallas-btn fallas-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
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

export default FallasUploader;