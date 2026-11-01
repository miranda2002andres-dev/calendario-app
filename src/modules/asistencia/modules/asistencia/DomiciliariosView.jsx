import React, { useState, useEffect } from 'react';
import { asistenciaService } from '../../services/firebaseService';
import './DomiciliariosView.css';

const colores = { presente: "#22c55e", ausente: "#ef4444", tardanza: "#f97316", pendiente: "#6b7280" };
const icons = { presente: "✅", ausente: "❌", tardanza: "⏰", pendiente: "⏳" };

const DomiciliariosView = ({ fuente, satelite }) => {
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [loading, setLoading] = useState(true);
  const [nuevaNovedad, setNuevaNovedad] = useState({}); // Objeto para guardar por ID
  const [mensajeExito, setMensajeExito] = useState('');
  const fecha = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const doms = await asistenciaService.getDomiciliarios(satelite.id);
        setDomiciliarios(doms);
        const asist = await asistenciaService.getAsistencia(fecha);
        setAsistencia(asist || {});
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    cargar();
  }, [satelite.id, fecha]);

  const handleSetEstado = async (domiciliarioId, estado) => {
    setAsistencia({ ...asistencia, [domiciliarioId]: { estado, hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) } });
    try { await asistenciaService.setEstadoAsistencia(fecha, domiciliarioId, estado); } catch (error) { console.error('Error:', error); }
  };

  const handleEnviarNovedad = async (dom) => {
    const texto = nuevaNovedad[dom.id];
    if (!texto || !texto.trim()) return;
    const nov = { id: Date.now(), mensaje: texto, fecha: new Date().toLocaleString(), autor: dom.nombre };
    try { 
      await asistenciaService.crearNovedad(fecha, nov); 
      setMensajeExito(`Novedad de ${dom.nombre} enviada ✅`); 
      setNuevaNovedad(prev => ({ ...prev, [dom.id]: '' })); 
      setTimeout(() => setMensajeExito(''), 3000); 
    } catch (error) { console.error('Error:', error); }
  };

  const getEstado = (id) => asistencia[id]?.estado || 'pendiente';
  const getHora = (id) => asistencia[id]?.hora || null;

  if (loading) return <div className="domiciliarios-loading">⏳ Cargando domiciliarios...</div>;

  return (
    <div className="domiciliarios-view">
      {mensajeExito && <div style={{ background: '#22c55e20', color: '#22c55e', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>{mensajeExito}</div>}
      {domiciliarios.length === 0 ? (
        <div className="domiciliarios-empty"><p>📭 No hay domiciliarios en este satélite.</p></div>
      ) : (
        <div className="domiciliarios-lista">
          {domiciliarios.map((dom) => {
            const estado = getEstado(dom.id);
            const hora = getHora(dom.id);
            return (
              <div key={dom.id} className="domiciliario-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="domiciliario-info">
                    <div className="domiciliario-nombre">{dom.nombre}</div>
                    <div className="domiciliario-estado" style={{ color: colores[estado] }}>{icons[estado]} {estado.charAt(0).toUpperCase() + estado.slice(1)}{hora && <span className="domiciliario-hora"> · {hora}</span>}</div>
                  </div>
                  <div className="domiciliario-botones">
                    <button className={`btn-estado ${estado === 'presente' ? 'active' : ''}`} style={{ background: estado === 'presente' ? colores.presente : colores.presente + '25', color: estado === 'presente' ? '#fff' : colores.presente }} onClick={() => handleSetEstado(dom.id, 'presente')}>✅</button>
                    <button className={`btn-estado ${estado === 'tardanza' ? 'active' : ''}`} style={{ background: estado === 'tardanza' ? colores.tardanza : colores.tardanza + '25', color: estado === 'tardanza' ? '#fff' : colores.tardanza }} onClick={() => handleSetEstado(dom.id, 'tardanza')}>⏰</button>
                    <button className={`btn-estado ${estado === 'ausente' ? 'active' : ''}`} style={{ background: estado === 'ausente' ? colores.ausente : colores.ausente + '25', color: estado === 'ausente' ? '#fff' : colores.ausente }} onClick={() => handleSetEstado(dom.id, 'ausente')}>❌</button>
                  </div>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <input type="text" placeholder="Escribir novedad..." value={nuevaNovedad[dom.id] || ''} onChange={(e) => setNuevaNovedad({...nuevaNovedad, [dom.id]: e.target.value})} style={{ flex: 1, background: '#060e1e', border: '1px solid #1a2a4a', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px' }} />
                  <button onClick={() => handleEnviarNovedad(dom)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DomiciliariosView;
