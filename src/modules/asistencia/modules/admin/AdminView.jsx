import React, { useState, useEffect, useCallback } from 'react';
import { asistenciaService } from '../../services/firebaseService';
import './AdminView.css';

const AdminView = ({ onBack }) => {
  const [fuente, setFuente] = useState('domis');
  const [tab, setTab] = useState('asistencia');
  const [satelites, setSatelites] = useState([]);
  const [sateliteActivo, setSateliteActivo] = useState(null);
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [mostrarFormSat, setMostrarFormSat] = useState(false);
  const [mostrarFormDom, setMostrarFormDom] = useState(false);
  const [nuevoSatCodigo, setNuevoSatCodigo] = useState('');
  const [nuevoSatNombre, setNuevoSatNombre] = useState('');
  const [nuevoDomNombre, setNuevoDomNombre] = useState('');

  const cargarSatelites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await asistenciaService.getSatelites(fuente);
      setSatelites(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [fuente]);

  const cargarDomiciliarios = async (sateliteId) => {
    setLoading(true);
    try {
      const doms = await asistenciaService.getDomiciliarios(sateliteId);
      setDomiciliarios(doms);
      const asist = await asistenciaService.getAsistencia(fecha);
      setAsistencia(asist || {});
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSatelites();
    setSateliteActivo(null);
    setDomiciliarios([]);
  }, [cargarSatelites]);

  const handleSelectSatelite = (satelite) => {
    setSateliteActivo(satelite);
    cargarDomiciliarios(satelite.id);
  };

  const handleCrearSatelite = async () => {
    if (!nuevoSatCodigo.trim() || !nuevoSatNombre.trim()) {
      alert('Completa código y nombre');
      return;
    }
    try {
      await asistenciaService.crearSatelite(fuente, nuevoSatCodigo.trim(), nuevoSatNombre.trim());
      setNuevoSatCodigo('');
      setNuevoSatNombre('');
      setMostrarFormSat(false);
      cargarSatelites();
    } catch (error) {
      alert('Error al crear satélite');
    }
  };

  const handleEliminarSatelite = async (sateliteId, nombre) => {
    if (!window.confirm(`¿Eliminar el satélite "${nombre}" y todos sus domiciliarios?`)) return;
    try {
      await asistenciaService.eliminarSatelite(sateliteId);
      cargarSatelites();
      if (sateliteActivo?.id === sateliteId) {
        setSateliteActivo(null);
        setDomiciliarios([]);
      }
    } catch (error) {
      alert('Error al eliminar satélite');
    }
  };

  const handleCrearDomiciliario = async () => {
    if (!nuevoDomNombre.trim() || !sateliteActivo) {
      alert('Completa el nombre');
      return;
    }
    try {
      await asistenciaService.crearDomiciliario(sateliteActivo.id, nuevoDomNombre.trim());
      setNuevoDomNombre('');
      setMostrarFormDom(false);
      cargarDomiciliarios(sateliteActivo.id);
    } catch (error) {
      alert('Error al crear domiciliario');
    }
  };

  const handleEliminarDomiciliario = async (domId, nombre) => {
    if (!window.confirm(`¿Eliminar a "${nombre}"?`)) return;
    try {
      await asistenciaService.eliminarDomiciliario(domId);
      cargarDomiciliarios(sateliteActivo.id);
    } catch (error) {
      alert('Error al eliminar domiciliario');
    }
  };

  const handleSetEstado = async (domId, estado) => {
    const nuevaAsistencia = {
      ...asistencia,
      [domId]: {
        estado,
        hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      }
    };
    setAsistencia(nuevaAsistencia);
    try {
      await asistenciaService.setEstadoAsistencia(fecha, domId, estado);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getEstado = (domId) => asistencia[domId]?.estado || 'pendiente';

  const getColorEstado = (estado) => {
    if (estado === 'presente') return '#22c55e';
    if (estado === 'tardanza') return '#f97316';
    if (estado === 'ausente') return '#ef4444';
    return '#6b7280';
  };

  const renderTabContent = () => {
    if (!sateliteActivo) return null;

    if (tab === 'asistencia') {
      const total = domiciliarios.length;
      const presentes = domiciliarios.filter(d => getEstado(d.id) === 'presente').length;
      const tardanzas = domiciliarios.filter(d => getEstado(d.id) === 'tardanza').length;
      const ausentes = domiciliarios.filter(d => getEstado(d.id) === 'ausente').length;
      const pendientes = total - presentes - tardanzas - ausentes;

      return (
        <div className="admin-tab-content">
          <div className="admin-fecha-row">
            <label>📅 Fecha:</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>

          <div className="admin-stats-row">
            <div className="admin-stat-box total"><span className="stat-num">{total}</span><span className="stat-label">TOTAL</span></div>
            <div className="admin-stat-box present" style={{ borderColor: '#22c55e' }}><span className="stat-num" style={{ color: '#22c55e' }}>{presentes}</span><span className="stat-label">PRESENTES</span></div>
            <div className="admin-stat-box tardy" style={{ borderColor: '#f97316' }}><span className="stat-num" style={{ color: '#f97316' }}>{tardanzas}</span><span className="stat-label">TARDANZAS</span></div>
            <div className="admin-stat-box absent" style={{ borderColor: '#ef4444' }}><span className="stat-num" style={{ color: '#ef4444' }}>{ausentes}</span><span className="stat-label">AUSENTES</span></div>
            <div className="admin-stat-box pending" style={{ borderColor: '#6b7280' }}><span className="stat-num" style={{ color: '#6b7280' }}>{pendientes}</span><span className="stat-label">PENDIENTES</span></div>
          </div>

          <div className="admin-header-actions">
            <div>
              <button className="admin-btn-back" onClick={() => setSateliteActivo(null)}>← Volver</button>
              <h2 style={{ display: 'inline-block', marginLeft: '16px' }}>
                👥 {sateliteActivo.codigo} - {sateliteActivo.nombre}
              </h2>
            </div>
            <button className="admin-btn-primary" onClick={() => setMostrarFormDom(true)}>+ Nuevo Domiciliario</button>
          </div>

          {mostrarFormDom && (
            <div className="admin-form">
              <h3>Crear nuevo domiciliario</h3>
              <input
                type="text"
                placeholder="Nombre completo"
                value={nuevoDomNombre}
                onChange={(e) => setNuevoDomNombre(e.target.value)}
                className="admin-input"
              />
              <div className="admin-form-actions">
                <button className="admin-btn-save" onClick={handleCrearDomiciliario}>✅ Crear</button>
                <button className="admin-btn-cancel" onClick={() => setMostrarFormDom(false)}>❌ Cancelar</button>
              </div>
            </div>
          )}

          <div className="admin-domiciliarios-list">
            {domiciliarios.length === 0 ? (
              <p className="admin-empty">No hay domiciliarios. Crea el primero.</p>
            ) : (
              domiciliarios.map((dom) => {
                const estado = getEstado(dom.id);
                return (
                  <div key={dom.id} className="admin-domiciliario-card">
                    <span className="admin-domiciliario-nombre">{dom.nombre}</span>
                    <div className="admin-domiciliario-estado">
                      <span style={{ color: getColorEstado(estado), marginRight: '8px', fontWeight: 'bold' }}>
                        {estado === 'presente' ? '✅' : estado === 'tardanza' ? '⏰' : estado === 'ausente' ? '❌' : '⏳'} {estado.toUpperCase()}
                      </span>
                      <button className="btn-estado-sm" style={{ background: getColorEstado('presente') + '20', color: getColorEstado('presente') }} onClick={() => handleSetEstado(dom.id, 'presente')}>✅</button>
                      <button className="btn-estado-sm" style={{ background: getColorEstado('tardanza') + '20', color: getColorEstado('tardanza') }} onClick={() => handleSetEstado(dom.id, 'tardanza')}>⏰</button>
                      <button className="btn-estado-sm" style={{ background: getColorEstado('ausente') + '20', color: getColorEstado('ausente') }} onClick={() => handleSetEstado(dom.id, 'ausente')}>❌</button>
                    </div>
                    <button className="admin-btn-delete" onClick={() => handleEliminarDomiciliario(dom.id, dom.nombre)}>🗑️</button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    if (tab === 'novedades') {
      return (
        <div className="admin-tab-content">
          <div className="admin-header-actions">
            <button className="admin-btn-back" onClick={() => setSateliteActivo(null)}>← Volver</button>
            <h2>📝 Novedades</h2>
          </div>
          <p className="admin-empty">Módulo de Novedades en construcción.</p>
        </div>
      );
    }

    if (tab === 'semana') {
      return (
        <div className="admin-tab-content">
          <div className="admin-header-actions">
            <button className="admin-btn-back" onClick={() => setSateliteActivo(null)}>← Volver</button>
            <h2>📅 Resumen Semanal</h2>
          </div>
          <p className="admin-empty">Cargando datos de la semana...</p>
        </div>
      );
    }

    if (tab === 'equipo') {
      return (
        <div className="admin-tab-content">
          <div className="admin-header-actions">
            <h2>👥 Equipo por Satélite</h2>
          </div>
          <div className="admin-equipo-grid">
            {satelites.map((sat) => (
              <div key={sat.id} className="admin-equipo-card" onClick={() => handleSelectSatelite(sat)}>
                <div className="admin-equipo-header">
                  <span>🛰️ {sat.codigo} - {sat.nombre}</span>
                  <span className="admin-equipo-count">{domiciliarios.length} domiciliarios</span>
                </div>
                <div className="admin-equipo-body">
                  <p className="admin-equipo-more">Click para gestionar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tab === 'config') {
      return (
        <div className="admin-tab-content">
          <div className="admin-header-actions">
            <button className="admin-btn-back" onClick={() => setSateliteActivo(null)}>← Volver</button>
            <h2>⚙️ Configuración</h2>
          </div>
          <p className="admin-empty">Configuración en construcción.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="admin-view">
      <div className="admin-toggle">
        <button className={`admin-toggle-btn ${fuente === 'domis' ? 'active domis' : ''}`} onClick={() => setFuente('domis')}>📦 DOMIS</button>
        <button className={`admin-toggle-btn ${fuente === 'pamis' ? 'active pamis' : ''}`} onClick={() => setFuente('pamis')}>📮 PAMIS</button>
      </div>

      {loading && <div className="admin-loading">⏳ Cargando...</div>}

      {!loading && !sateliteActivo && (
        <>
          <div className="admin-header-actions">
            <h2>🛰️ Satélites {fuente === 'domis' ? 'DOMIS' : 'PAMIS'}</h2>
            <button className="admin-btn-primary" onClick={() => setMostrarFormSat(true)}>+ Nuevo Satélite</button>
          </div>

          {mostrarFormSat && (
            <div className="admin-form">
              <h3>Crear nuevo satélite</h3>
              <input type="text" placeholder="Código (ej: 11955)" value={nuevoSatCodigo} onChange={(e) => setNuevoSatCodigo(e.target.value)} className="admin-input" />
              <input type="text" placeholder="Nombre (ej: BOSQUE)" value={nuevoSatNombre} onChange={(e) => setNuevoSatNombre(e.target.value.toUpperCase())} className="admin-input" />
              <div className="admin-form-actions">
                <button className="admin-btn-save" onClick={handleCrearSatelite}>✅ Crear</button>
                <button className="admin-btn-cancel" onClick={() => setMostrarFormSat(false)}>❌ Cancelar</button>
              </div>
            </div>
          )}

          <div className="admin-satelites-list">
            {satelites.length === 0 ? (
              <p className="admin-empty">No hay satélites. Crea el primero.</p>
            ) : (
              satelites.map((sat) => (
                <div key={sat.id} className="admin-satelite-card">
                  <div className="admin-satelite-info" onClick={() => handleSelectSatelite(sat)}>
                    <span className="admin-satelite-codigo">{sat.codigo}</span>
                    <span className="admin-satelite-nombre">{sat.nombre}</span>
                  </div>
                  <button className="admin-btn-delete" onClick={() => handleEliminarSatelite(sat.id, sat.nombre)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {!loading && sateliteActivo && (
        <>
          <div className="admin-tabs">
            <button className={`admin-tab ${tab === 'asistencia' ? 'active' : ''}`} onClick={() => setTab('asistencia')}>📋 Asist.</button>
            <button className={`admin-tab ${tab === 'novedades' ? 'active' : ''}`} onClick={() => setTab('novedades')}>📝 Novel.</button>
            <button className={`admin-tab ${tab === 'semana' ? 'active' : ''}`} onClick={() => setTab('semana')}>📅 Semana</button>
            <button className={`admin-tab ${tab === 'equipo' ? 'active' : ''}`} onClick={() => setTab('equipo')}>👥 Equipo</button>
            <button className={`admin-tab ${tab === 'config' ? 'active' : ''}`} onClick={() => setTab('config')}>⚙️ Config</button>
          </div>
          {renderTabContent()}
        </>
      )}
    </div>
  );
};

export default AdminView;
