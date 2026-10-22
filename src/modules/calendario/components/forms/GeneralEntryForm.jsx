import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './DataEntryForm.css';

const GeneralEntryForm = ({ onClose, onSuccess, fechaInicial, existingData }) => {
  const [formData, setFormData] = useState({
    entregadas: "",
    devolucion: "",
    proyeccion: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (existingData) {
      setFormData({
        entregadas: existingData.entregadas?.toString() || "",
        devolucion: existingData.devolucion?.toString() || "",
        proyeccion: existingData.proyeccion?.toString() || "",
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const entregadasNum = parseInt(formData.entregadas) || 0;
      const devolucionNum = parseInt(formData.devolucion) || 0;
      const proyeccionNum = parseInt(formData.proyeccion) || 0;

      const totalReal = entregadasNum + devolucionNum;
      const efectividad = totalReal > 0 ? (entregadasNum / totalReal) * 100 : 0;
      const tasaDevolucion = totalReal > 0 ? (devolucionNum / totalReal) * 100 : 0;

      const datosExistentes = await firebaseService.getDataByDate(fechaInicial, 'general');

      const dataToSave = {
        fecha: fechaInicial,
        entregadas: entregadasNum,
        devolucion: devolucionNum,
        proyeccion: proyeccionNum,
        efectividad: efectividad,
        tasa_devolucion: tasaDevolucion,
        // Campos opcionales heredados
        meta: 0,
        domi_asistencia: 0,
        satelites: 0,
        telemercadeo: datosExistentes?.telemercadeo || 0,
        contactabilidad: datosExistentes?.contactabilidad || 0,
        no_contactabilidad: datosExistentes?.no_contactabilidad || 0,
        si_recibe: datosExistentes?.si_recibe || 0,
        devolucion_dest_tele: datosExistentes?.devolucion_dest_tele || 0,
        porcentaje_telemercadeo: datosExistentes?.porcentaje_telemercadeo || 0,
        porcentaje_contactabilidad: datosExistentes?.porcentaje_contactabilidad || 0,
        porcentaje_no_contactable: datosExistentes?.porcentaje_no_contactable || 0,
        porcentaje_si_recibe: datosExistentes?.porcentaje_si_recibe || 0,
        porcentaje_devolucion_dest: datosExistentes?.porcentaje_devolucion_dest || 0,
        info_adicional: datosExistentes?.info_adicional || 0,
        novedades: datosExistentes?.novedades || "",
        mejoras: datosExistentes?.mejoras || "",
      };

      await firebaseService.saveData(dataToSave, 'general');
      setMessage({ type: 'success', text: '✅ Datos generales guardados exitosamente!' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="data-entry-overlay">
      <div className="data-entry-container">
        <div className="data-entry-header">
          <h2>✏️ EDITAR DATOS GENERALES - {fechaInicial}</h2>
          <button className="data-entry-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="data-entry-body">
            <div className="form-section">
              <h3>📊 DATOS GENERALES</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>✅ Entregadas:</label>
                  <input type="number" name="entregadas" value={formData.entregadas} onChange={handleChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>↩️ Devolución:</label>
                  <input type="number" name="devolucion" value={formData.devolucion} onChange={handleChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>🎯 Proyección (Asignación):</label>
                  <input type="number" name="proyeccion" value={formData.proyeccion} onChange={handleChange} placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          {message && <div className={`data-entry-message ${message.type}`}>{message.text}</div>}

          <div className="data-entry-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "💾 Guardando..." : "💾 Guardar Datos Generales"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralEntryForm;