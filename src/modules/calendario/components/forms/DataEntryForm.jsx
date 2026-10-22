import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './DataEntryForm.css';

const DataEntryForm = ({ onClose, onSuccess, fechaInicial, existingData }) => {
  const [formData, setFormData] = useState({
    // DOMIS
    entregadas: "",
    devolucion: "",
    proyeccion: "",
    meta: "",
    domiAsistencia: "",
    satelites: "",
    // TELEMERCADEO
    asignacionDomiciliario: "",
    telemercadeo: "",
    contactabilidad: "",
    noContactabilidad: "",
    siRecibe: "",
    devolucionDestTele: "",
    // INFO
    infoAdicional: "",
    novedades: "",
    mejoras: "",
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("domis");

  useEffect(() => {
    if (existingData) {
      setFormData({
        entregadas: existingData.entregadas?.toString() || "",
        devolucion: existingData.devolucion?.toString() || "",
        proyeccion: existingData.proyeccion?.toString() || "",
        meta: existingData.meta?.toString() || "",
        domiAsistencia: existingData.domi_asistencia?.toString() || "",
        satelites: existingData.satelites?.toString() || "",
        asignacionDomiciliario: existingData.asignacion_domiciliario || "",
        telemercadeo: existingData.telemercadeo?.toString() || "",
        contactabilidad: existingData.contactabilidad?.toString() || "",
        noContactabilidad: existingData.no_contactabilidad?.toString() || "",
        siRecibe: existingData.si_recibe?.toString() || "",
        devolucionDestTele: existingData.devolucion_dest_tele?.toString() || "",
        infoAdicional: existingData.info_adicional?.toString() || "",
        novedades: existingData.novedades || "",
        mejoras: existingData.mejoras || "",
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
      const metaNum = parseInt(formData.meta) || 0;
      const domiAsistenciaNum = parseInt(formData.domiAsistencia) || 0;
      const satelitesNum = parseInt(formData.satelites) || 0;
      const infoAdicionalNum = parseInt(formData.infoAdicional) || 0;
      const telemercadeoNum = parseInt(formData.telemercadeo) || 0;
      const noContactabilidadNum = parseInt(formData.noContactabilidad) || 0;
      const siRecibeNum = parseInt(formData.siRecibe) || 0;
      const devolucionDestTeleNum = parseInt(formData.devolucionDestTele) || 0;

      const contactabilidadNum = telemercadeoNum - noContactabilidadNum;

      const totalReal = entregadasNum + devolucionNum;
      const efectividad = totalReal > 0 ? (entregadasNum / totalReal) * 100 : 0;
      const tasaDevolucion = totalReal > 0 ? (devolucionNum / totalReal) * 100 : 0;

      const porcentajeTelemercadeo = proyeccionNum > 0 ? (telemercadeoNum / proyeccionNum) * 100 : 0;
      const porcentajeContactabilidad = telemercadeoNum > 0 ? (contactabilidadNum / telemercadeoNum) * 100 : 0;
      const porcentajeNoContactable = telemercadeoNum > 0 ? (noContactabilidadNum / telemercadeoNum) * 100 : 0;
      const porcentajeSiRecibe = contactabilidadNum > 0 ? (siRecibeNum / contactabilidadNum) * 100 : 0;
      const porcentajeDevolucionDest = contactabilidadNum > 0 ? (devolucionDestTeleNum / contactabilidadNum) * 100 : 0;

      const datosExistentes = await firebaseService.getDataByDate(fechaInicial, 'domis');

      const dataToSave = {
        fecha: fechaInicial,
        entregadas: entregadasNum,
        devolucion: devolucionNum,
        proyeccion: proyeccionNum,
        meta: metaNum,
        domi_asistencia: domiAsistenciaNum,
        satelites: satelitesNum,
        info_adicional: infoAdicionalNum,
        efectividad: efectividad,
        tasa_devolucion: tasaDevolucion,
        asignacion_domiciliario: formData.asignacionDomiciliario || datosExistentes?.asignacion_domiciliario || "",
        telemercadeo: telemercadeoNum,
        contactabilidad: contactabilidadNum,
        no_contactabilidad: noContactabilidadNum,
        si_recibe: siRecibeNum,
        devolucion_dest_tele: devolucionDestTeleNum,
        porcentaje_telemercadeo: porcentajeTelemercadeo,
        porcentaje_contactabilidad: porcentajeContactabilidad,
        porcentaje_no_contactable: porcentajeNoContactable,
        porcentaje_si_recibe: porcentajeSiRecibe,
        porcentaje_devolucion_dest: porcentajeDevolucionDest,
        novedades: formData.novedades || datosExistentes?.novedades || "",
        mejoras: formData.mejoras || datosExistentes?.mejoras || "",
      };

      await firebaseService.saveData(dataToSave, 'domis');
      setMessage({ type: 'success', text: '✅ Datos guardados exitosamente!' });
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
          <h2>✏️ EDITAR DATOS - {fechaInicial}</h2>
          <button className="data-entry-close" onClick={onClose}>×</button>
        </div>

        <div className="data-entry-tabs">
          <button className={`tab-btn ${activeTab === "domis" ? "active" : ""}`} onClick={() => setActiveTab("domis")}>
            🚚 DOMIS
          </button>
          <button className={`tab-btn ${activeTab === "tele" ? "active" : ""}`} onClick={() => setActiveTab("tele")}>
            📞 TELEMERCADEO
          </button>
          <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
            📝 INFO ADICIONAL
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="data-entry-body">
            {/* ========== TAB DOMIS ========== */}
            {activeTab === "domis" && (
              <>
                <div className="form-section">
                  <h3>📊 DATOS DOMIS</h3>
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
                    <div className="form-group">
                      <label>🏆 Meta:</label>
                      <input type="number" name="meta" value={formData.meta} onChange={handleChange} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label>👥 DOMI Asistencia:</label>
                      <input type="number" name="domiAsistencia" value={formData.domiAsistencia} onChange={handleChange} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label>🛰️ Satélites:</label>
                      <input type="number" name="satelites" value={formData.satelites} onChange={handleChange} placeholder="0" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ========== TAB TELEMERCADEO ========== */}
            {activeTab === "tele" && (
              <>
                <div className="form-section">
                  <h3>👤 ASIGNACIÓN</h3>
                  <div className="form-group full-width">
                    <label>Asignación Domiciliario:</label>
                    <input type="text" name="asignacionDomiciliario" value={formData.asignacionDomiciliario} onChange={handleChange} placeholder="Ej: Juan Pérez" />
                  </div>
                </div>

                <div className="form-section">
                  <h3>📊 DATOS TELEMERCADEO</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>📞 TELEMERCADEO (Total):</label>
                      <input type="number" name="telemercadeo" value={formData.telemercadeo} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>🔇 NO CONTACTABILIDAD:</label>
                      <input type="number" name="noContactabilidad" value={formData.noContactabilidad} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>📞 CONTACTABILIDAD:</label>
                      <input type="number" name="contactabilidad" value={formData.contactabilidad} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>↩️ Devolución Dest:</label>
                      <input type="number" name="devolucionDestTele" value={formData.devolucionDestTele} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>✅ SI RECIBE:</label>
                      <input type="number" name="siRecibe" value={formData.siRecibe} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ========== TAB INFO ADICIONAL ========== */}
            {activeTab === "info" && (
              <>
                <div className="form-section">
                  <h3>ℹ️ INFORMACIÓN ADICIONAL</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>📋 Info Adicional:</label>
                      <input type="number" name="infoAdicional" value={formData.infoAdicional} onChange={handleChange} placeholder="0" />
                    </div>
                  </div>
                </div>
                <div className="form-section">
                  <h3>✨ CENTRO DE NOVEDADES</h3>
                  <div className="form-group full-width">
                    <textarea name="novedades" value={formData.novedades} onChange={handleChange} rows={3} placeholder="Novedades del día..." />
                  </div>
                </div>
                <div className="form-section">
                  <h3>🔧 CENTRO DE MEJORAS</h3>
                  <div className="form-group full-width">
                    <textarea name="mejoras" value={formData.mejoras} onChange={handleChange} rows={3} placeholder="Mejoras a implementar..." />
                  </div>
                </div>
              </>
            )}
          </div>

          {message && <div className={`data-entry-message ${message.type}`}>{message.text}</div>}

          <div className="data-entry-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "💾 Guardando..." : "💾 Guardar Datos"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataEntryForm;