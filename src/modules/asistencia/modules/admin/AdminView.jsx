import React, { useState, useEffect, useCallback } from 'react';
import { asistenciaService } from '../../services/firebaseService';
import './AdminView.css';
import AdminSemana from './AdminSemana';

const AdminView = ({ onBack, onGoToAsistencia, onGoToEfectividad }) => {
  const [fuente, setFuente] = useState('domis');
  const [mostrarVistaAdmin, setMostrarVistaAdmin] = useState(false);
  
  // Estados de navegación y creación
  const [satelites, setSatelites] = useState([]);
  const [sateliteActivo, setSateliteActivo] = useState(null);
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormSat, setMostrarFormSat] = useState(false);
  const [mostrarFormDom, setMostrarFormDom] = useState(false);
  const [nuevoSatCodigo, setNuevoSatCodigo] = useState('');
  const [nuevoSatNombre, setNuevoSatNombre] = useState('');
  const [nuevoDomNombre, setNuevoDomNombre] = useState('');

  // Estados del Panel Admin
  const [fechaAdmin, setFechaAdmin] = useState(new Date().toISOString().split('T')[0]);
  const [asistenciaAdmin, setAsistenciaAdmin] = useState({});
  const [buscarAdmin, setBuscarAdmin] = useState('');
  const [tabActiva, setTabActiva] = useState('asistencia');
  const [novedades, setNovedades] = useState([]);
  const [config, setConfig] = useState({ pinAdmin: '1234' });
  const [pinConfig, setPinConfig] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(null);

  // Estado para guardar TODOS los domiciliarios de la fuente (para contadores generales)
  const [todosLosDomiciliarios, setTodosLosDomiciliarios] = useState([]);

  const cargarSatelites = useCallback(async () => {
    setLoading(true);
    try { const data = await asistenciaService.getSatelites(fuente); setSatelites(data); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [fuente]);

  // Cargar TODOS los domiciliarios de la fuente para los contadores
  const cargarTodosLosDomiciliarios = useCallback(async () => {
    if (satelites.length === 0) return;
    try {
      let todos = [];
      for (const sat of satelites) {
        const doms = await asistenciaService.getDomiciliarios(sat.id);
        todos = [...todos, ...doms.map(d => ({ ...d, satNombre: sat.nombre }))];
      }
      setTodosLosDomiciliarios(todos);
    } catch (e) { console.error(e); }
  }, [satelites]);

  useEffect(() => {
    cargarSatelites();
    cargarConfig();
  }, [cargarSatelites]);

  useEffect(() => {
    if (mostrarVistaAdmin) {
      cargarTodosLosDomiciliarios();
      cargarAsistenciaAdmin(fechaAdmin);
    }
  }, [mostrarVistaAdmin, satelites, fechaAdmin, cargarTodosLosDomiciliarios]);

  const cargarDomiciliarios = async (sateliteId) => {
    setLoading(true);
    try { const doms = await asistenciaService.getDomiciliarios(sateliteId); setDomiciliarios(doms || []); } catch (e) { console.error(e); setDomiciliarios([]); } finally { setLoading(false); }
  };

  const cargarAsistenciaAdmin = async (fechaSel) => {
    try { const asist = await asistenciaService.getAsistencia(fechaSel); setAsistenciaAdmin(asist || {}); } catch (e) { console.error(e); }
  };

  const cargarNovedades = async (fechaSel) => {
    try { const novs = await asistenciaService.getNovedades(fechaSel); setNovedades(novs); } catch (e) { console.error(e); }
  };

  const cargarConfig = async () => {
    try { const conf = await asistenciaService.getConfig(); setConfig(conf); } catch (e) { console.error(e); }
  };

  useEffect(() => { if (tabActiva === 'novedades') cargarNovedades(fechaAdmin); }, [tabActiva, fechaAdmin]);

  const handleSelectSatelite = async (satelite) => { setSateliteActivo(satelite); await cargarDomiciliarios(satelite.id); await cargarAsistenciaAdmin(fechaAdmin); };

  const handleSetEstado = async (domId, estado) => {
    const nueva = { ...asistenciaAdmin, [domId]: { estado, hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) } };
    setAsistenciaAdmin(nueva);
    try { await asistenciaService.setEstadoAsistencia(fechaAdmin, domId, estado); } catch (e) { console.error(e); }
  };

  const handleCrearSatelite = async () => {
    if (!nuevoSatCodigo.trim() || !nuevoSatNombre.trim()) return alert('Completa código y nombre');
    try { await asistenciaService.crearSatelite(fuente, nuevoSatCodigo.trim(), nuevoSatNombre.trim()); setNuevoSatCodigo(''); setNuevoSatNombre(''); setMostrarFormSat(false); cargarSatelites(); } catch (e) { console.error(e); alert('Error'); }
  };

  const handleEliminarSatelite = async (sateliteId, nombre) => {
    if (!window.confirm(`¿Eliminar el satélite "${nombre}"?`)) return;
    try { await asistenciaService.eliminarSatelite(sateliteId); cargarSatelites(); if (sateliteActivo?.id === sateliteId) setSateliteActivo(null); } catch (e) { alert('Error'); }
  };

  const handleCrearDomiciliario = async () => {
    if (!nuevoDomNombre.trim() || !sateliteActivo) return alert('Completa el nombre');
    try {
      await asistenciaService.crearDomiciliario(sateliteActivo.id, nuevoDomNombre.trim());
      setNuevoDomNombre('');
      setMostrarFormDom(false);
      await cargarDomiciliarios(sateliteActivo.id);
      cargarTodosLosDomiciliarios(); 
    } catch (e) { console.error(e); alert('Error al crear domiciliario'); }
  };

  const handleEliminarDomiciliario = async (domId, nombre) => {
    if (!window.confirm(`¿Eliminar a "${nombre}"?`)) return;
    try { await asistenciaService.eliminarDomiciliario(domId); cargarDomiciliarios(sateliteActivo.id); cargarTodosLosDomiciliarios(); } catch (e) { alert('Error'); }
  };

  const handleGuardarPin = async () => {
    if (pinConfig.length < 4) return alert('El PIN debe tener al menos 4 caracteres');
    try { await asistenciaService.setConfig({ pinAdmin: pinConfig }); setConfig({ pinAdmin: pinConfig }); setPinConfig(''); alert('PIN actualizado'); } catch (e) { alert('Error'); }
  };

  // CÁLCULO DE CONTADORES GLOBALES
  const presentesGlobal = todosLosDomiciliarios.filter(d => asistenciaAdmin[d.id]?.estado === 'presente').length;
  const tardanzasGlobal = todosLosDomiciliarios.filter(d => asistenciaAdmin[d.id]?.estado === 'tardanza').length;
  const ausentesGlobal = todosLosDomiciliarios.filter(d => asistenciaAdmin[d.id]?.estado === 'ausente').length;
  const pendientesGlobal = todosLosDomiciliarios.length - presentesGlobal - tardanzasGlobal - ausentesGlobal;

  // FILTRADO DE LA LISTA
  const listaFiltrada = (filtroEstado ? todosLosDomiciliarios : domiciliarios).filter(d => {
    const coincideNombre = d.nombre.toLowerCase().includes(buscarAdmin.toLowerCase());
    if (!filtroEstado) return coincideNombre;
    const estado = asistenciaAdmin[d.id]?.estado || 'pendiente';
    return coincideNombre && estado === filtroEstado;
  });

  return (
    <div className="admin-view">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
        <button className={`admin-toggle-btn ${fuente === 'domis' && !mostrarVistaAdmin ? 'active domis' : ''}`} onClick={() => { setFuente('domis'); setMostrarVistaAdmin(false); setSateliteActivo(null); }}>📦 DOMIS</button>
        <button className={`admin-toggle-btn ${fuente === 'pamis' && !mostrarVistaAdmin ? 'active pamis' : ''}`} onClick={() => { setFuente('pamis'); setMostrarVistaAdmin(false); setSateliteActivo(null); }}>📮 PAMIS</button>
        <button className={`admin-toggle-btn ${mostrarVistaAdmin ? 'active' : ''}`} style={{ background: mostrarVistaAdmin ? '#3b82f6' : '' }} onClick={() => setMostrarVistaAdmin(!mostrarVistaAdmin)}>⚙️ ADMINISTRADOR</button>
      </div>

      {!mostrarVistaAdmin && (
        <>
          {!sateliteActivo ? (
            <>
              <div className="admin-header-actions">
                <h2>🛰️ Satélites {fuente.toUpperCase()}</h2>
                <button className="admin-btn-primary" onClick={() => setMostrarFormSat(true)}>+ Nuevo Satélite</button>
              </div>
              {mostrarFormSat && (
                <div className="admin-form">
                  <h3>Crear satélite</h3>
                  <input type="text" placeholder="Código" value={nuevoSatCodigo} onChange={(e) => setNuevoSatCodigo(e.target.value)} className="admin-input" />
                  <input type="text" placeholder="Nombre" value={nuevoSatNombre} onChange={(e) => setNuevoSatNombre(e.target.value.toUpperCase())} className="admin-input" />
                  <div className="admin-form-actions">
                    <button type="button" className="admin-btn-save" onClick={handleCrearSatelite}>✅ Crear</button>
                    <button type="button" className="admin-btn-cancel" onClick={() => setMostrarFormSat(false)}>❌ Cancelar</button>
                  </div>
                </div>
              )}
              <div className="admin-satelites-list">
                {satelites.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#0a1220', borderRadius: '12px', border: '1px dashed #ff6600' }}>
                    <p style={{ color: '#888', marginBottom: '20px' }}>No hay satélites en {fuente.toUpperCase()}.</p>
                    <button className="admin-btn-primary" onClick={() => setMostrarFormSat(true)}>+ Crear Primer Satélite</button>
                  </div>
                ) : (
                  satelites.map(sat => (
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
          ) : (
            <>
              <div className="admin-header-actions">
                <button className="admin-btn-back" onClick={() => setSateliteActivo(null)}>← Volver a Satélites</button>
                <h2>👥 Domiciliarios de {sateliteActivo.nombre}</h2>
                <button className="admin-btn-primary" onClick={() => setMostrarFormDom(true)}>+ Nuevo Domiciliario</button>
              </div>
              {mostrarFormDom && (
                <div className="admin-form">
                  <h3>Crear domiciliario</h3>
                  <input type="text" placeholder="Nombre del domiciliario" value={nuevoDomNombre} onChange={(e) => setNuevoDomNombre(e.target.value)} className="admin-input" />
                  <div className="admin-form-actions">
                    <button type="button" className="admin-btn-save" onClick={handleCrearDomiciliario}>✅ Crear</button>
                    <button type="button" className="admin-btn-cancel" onClick={() => setMostrarFormDom(false)}>❌ Cancelar</button>
                  </div>
                </div>
              )}
              <div className="admin-domiciliarios-list">
                {domiciliarios.length === 0 ? (
                  <p className="admin-empty">No hay domiciliarios en este satélite. Crea el primero.</p>
                ) : (
                  domiciliarios.map(dom => (
                    <div key={dom.id} className="admin-domiciliario-card">
                      <span className="admin-domiciliario-nombre">{dom.nombre}</span>
                      <button className="admin-btn-delete" onClick={() => handleEliminarDomiciliario(dom.id, dom.nombre)}>🗑️</button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}

      {!loading && mostrarVistaAdmin && (
        <div className="admin-dashboard-container">
          <div className="admin-tabs-header" style={{ display: 'flex', background: '#060e1e', borderBottom: '1px solid #1a2a4a', marginBottom: '20px' }}>
            <button onClick={() => setTabActiva('asistencia')} className={`admin-tab ${tabActiva === 'asistencia' ? 'active' : ''}`}>📋 Asist.</button>
            <button onClick={() => setTabActiva('novedades')} className={`admin-tab ${tabActiva === 'novedades' ? 'active' : ''}`}>📝 Novel.</button>
            <button onClick={() => setTabActiva('semana')} className={`admin-tab ${tabActiva === 'semana' ? 'active' : ''}`}>📅 Semana</button>
            <button onClick={() => setTabActiva('config')} className={`admin-tab ${tabActiva === 'config' ? 'active' : ''}`}>⚙️ Config</button>
          </div>

          {tabActiva !== 'semana' && tabActiva !== 'config' && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ background: "#0a1220", border: "1px solid #1a2a4a", borderRadius: "10px", padding: "8px 15px", display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <span style={{ color: "#ff6600", fontSize: "14px" }}>📅</span>
                <input type="date" value={fechaAdmin} onChange={(e) => { setFechaAdmin(e.target.value); cargarAsistenciaAdmin(e.target.value); cargarNovedades(e.target.value); }} style={{ background: "transparent", border: "none", color: "#fff", outline: "none", fontFamily: "inherit", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }} />
              </div>
            </div>
          )}

          {tabActiva === 'asistencia' && (
            <>
              {/* SELECTOR DE ASISTENCIA DOMIS/PAMIS */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button className={`admin-toggle-btn ${fuente === 'domis' ? 'active domis' : ''}`} onClick={() => { setFuente('domis'); setFiltroEstado(null); }} style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>📦 ASISTENCIA DOMIS</button>
                <button className={`admin-toggle-btn ${fuente === 'pamis' ? 'active pamis' : ''}`} onClick={() => { setFuente('pamis'); setFiltroEstado(null); }} style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>📮 ASISTENCIA PAMIS</button>
              </div>

              <div className="admin-stats-grid" style={{ cursor: 'pointer' }}>
                <div className={`stat-card total ${filtroEstado === null ? 'active' : ''}`} onClick={() => setFiltroEstado(null)} style={{ border: filtroEstado === null ? '2px solid #fff' : '1px solid #1a2a4a' }}><div className="stat-num">{todosLosDomiciliarios.length}</div><div className="stat-label">TOTAL {fuente.toUpperCase()}</div></div>
                <div className={`stat-card presente ${filtroEstado === 'presente' ? 'active' : ''}`} onClick={() => setFiltroEstado('presente')} style={{ border: filtroEstado === 'presente' ? '2px solid #22c55e' : '1px solid #1a2a4a' }}><div className="stat-num">{presentesGlobal}</div><div className="stat-label">PRESENTES</div></div>
                <div className={`stat-card tardanza ${filtroEstado === 'tardanza' ? 'active' : ''}`} onClick={() => setFiltroEstado('tardanza')} style={{ border: filtroEstado === 'tardanza' ? '2px solid #f97316' : '1px solid #1a2a4a' }}><div className="stat-num">{tardanzasGlobal}</div><div className="stat-label">TARDANZAS</div></div>
                <div className={`stat-card ausente ${filtroEstado === 'ausente' ? 'active' : ''}`} onClick={() => setFiltroEstado('ausente')} style={{ border: filtroEstado === 'ausente' ? '2px solid #ef4444' : '1px solid #1a2a4a' }}><div className="stat-num">{ausentesGlobal}</div><div className="stat-label">AUSENTES</div></div>
                <div className={`stat-card pendiente ${filtroEstado === 'pendiente' ? 'active' : ''}`} onClick={() => setFiltroEstado('pendiente')} style={{ border: filtroEstado === 'pendiente' ? '2px solid #6b7280' : '1px solid #1a2a4a' }}><div className="stat-num">{pendientesGlobal}</div><div className="stat-label">PENDIENTES</div></div>
              </div>
              
              <div className="admin-filters-bar">
                {satelites.map(sat => (
                  <button key={sat.id} className={`filter-btn ${sateliteActivo?.id === sat.id ? 'active' : ''}`} onClick={() => handleSelectSatelite(sat)}>{sat.nombre}</button>
                ))}
              </div>
              <div className="admin-search-row">
                <div style={{ flex: 1, background: "#0a1220", border: "1px solid #1a2a4a", borderRadius: "10px", padding: "10px 15px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>🔍</span>
                  <input type="text" placeholder="Buscar domiciliario..." value={buscarAdmin} onChange={(e) => setBuscarAdmin(e.target.value)} style={{ background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", fontFamily: "inherit", fontSize: "14px" }} />
                </div>
              </div>
              <div className="admin-list-container">
                {(!sateliteActivo && !filtroEstado) ? <div className="admin-empty-state" style={{ background: "#0a1220", padding: "40px", borderRadius: "15px", border: "1px dashed #1a2a4a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ fontSize: "30px" }}>🛰️</span>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Selecciona un satélite en la barra de arriba o haz clic en un contador.</p>
                </div> : listaFiltrada.length === 0 ? <div className="admin-empty-state">No hay domiciliarios que coincidan.</div> : (
                  listaFiltrada.map(dom => {
                    const estado = asistenciaAdmin[dom.id]?.estado || 'pendiente';
                    const hora = asistenciaAdmin[dom.id]?.hora;
                    return (
                      <div key={dom.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a1220', border: '1px solid #1a2a4a', borderRadius: '12px', padding: '15px', marginBottom: '10px' }}>
                        <div className="list-item-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="list-item-name" style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{dom.nombre}</span>
                            {hora && <span style={{ fontSize: '11px', color: '#22c55e', background: '#22c55e20', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>🕐 {hora}</span>}
                          </div>
                          <span className="list-item-sub" style={{ fontSize: '11px', color: '#ff6600', background: '#ff660015', padding: '2px 8px', borderRadius: '10px', width: 'fit-content', fontWeight: 'bold', textTransform: 'uppercase' }}>🛰️ {filtroEstado ? (dom.satNombre || 'General') : sateliteActivo.nombre}</span>
                        </div>
                        <div className="list-item-actions" style={{ display: 'flex', gap: '8px' }}>
                          <button className={`status-btn presente ${estado === 'presente' ? 'active' : ''}`} onClick={() => handleSetEstado(dom.id, 'presente')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: estado === 'presente' ? '#22c55e' : '#1a2a4a', color: estado === 'presente' ? '#fff' : '#888' }}>✅</button>
                          <button className={`status-btn tardanza ${estado === 'tardanza' ? 'active' : ''}`} onClick={() => handleSetEstado(dom.id, 'tardanza')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: estado === 'tardanza' ? '#f97316' : '#1a2a4a', color: estado === 'tardanza' ? '#fff' : '#888' }}>⏰</button>
                          <button className={`status-btn ausente ${estado === 'ausente' ? 'active' : ''}`} onClick={() => handleSetEstado(dom.id, 'ausente')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: estado === 'ausente' ? '#ef4444' : '#1a2a4a', color: estado === 'ausente' ? '#fff' : '#888' }}>❌</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {tabActiva === 'novedades' && (
            <div>
              <p style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>Aquí se muestran las novedades enviadas por los domiciliarios.</p>
              <div style={{ marginTop: '20px' }}>
                {novedades.length === 0 ? <div className="admin-empty-state">No hay novedades para esta fecha.</div> : novedades.map(nov => (
                  <div key={nov.id} className="novedad-card">
                    <div className="novedad-header"><span className="novedad-nombre">{nov.autor}</span><span className="novedad-fecha">{nov.fecha}</span></div>
                    <div className="novedad-mensaje">{nov.mensaje}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tabActiva === 'semana' && <AdminSemana fuente={fuente} />}

          {tabActiva === 'config' && (
            <div className="admin-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <h3>⚙️ Configuración de Seguridad</h3>
              <p style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>Cambia el PIN de acceso al panel de administrador.</p>
              <input type="password" placeholder="Nuevo PIN (mín 4 caracteres)" value={pinConfig} onChange={(e) => setPinConfig(e.target.value)} className="admin-input" />
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-save" onClick={handleGuardarPin}>Guardar PIN</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;
