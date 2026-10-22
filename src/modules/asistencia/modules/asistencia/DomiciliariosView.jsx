import React, { useState, useEffect } from 'react';
import { asistenciaService } from '../../services/firebaseService';
import './DomiciliariosView.css';

const colores = {
  presente: "#22c55e",
  ausente: "#ef4444",
  tardanza: "#f97316",
  pendiente: "#6b7280",
};

const icons = {
  presente: "✅",
  ausente: "❌",
  tardanza: "⏰",
  pendiente: "⏳",
};

const DomiciliariosView = ({ fuente, satelite }) => {
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [loading, setLoading] = useState(true);
  const [fecha] = useState(new Date().toISOString().split('T')[0]); // Fecha fija, sin input

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const doms = await asistenciaService.getDomiciliarios(satelite.id);
        setDomiciliarios(doms);
        const asist = await asistenciaService.getAsistencia(fecha);
        setAsistencia(asist || {});
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [satelite.id, fecha]);

  const handleSetEstado = async (domiciliarioId, estado) => {
    setAsistencia({
      ...asistencia,
      [domiciliarioId]: {
        estado,
        hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      }
    });
    try {
      await asistenciaService.setEstadoAsistencia(fecha, domiciliarioId, estado);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getEstado = (domiciliarioId) => asistencia[domiciliarioId]?.estado || 'pendiente';
  const getHora = (domiciliarioId) => asistencia[domiciliarioId]?.hora || null;

  if (loading) return <div className="domiciliarios-loading">⏳ Cargando domiciliarios...</div>;

  return (
    <div className="domiciliarios-view">
      {domiciliarios.length === 0 ? (
        <div className="domiciliarios-empty">
          <p>📭 No hay domiciliarios en este satélite.</p>
          <p className="domiciliarios-empty-sub">Ve al Panel Administrador (⚙️) para crear el primero.</p>
        </div>
      ) : (
        <div className="domiciliarios-lista">
          {domiciliarios.map((dom) => {
            const estado = getEstado(dom.id);
            const hora = getHora(dom.id);
            return (
              <div key={dom.id} className="domiciliario-card">
                <div className="domiciliario-info">
                  <div className="domiciliario-nombre">{dom.nombre}</div>
                  <div className="domiciliario-estado" style={{ color: colores[estado] }}>
                    {icons[estado]} {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    {hora && <span className="domiciliario-hora"> · {hora}</span>}
                  </div>
                </div>
                <div className="domiciliario-botones">
                  <button
                    className={`btn-estado ${estado === 'presente' ? 'active' : ''}`}
                    style={{
                      background: estado === 'presente' ? colores.presente : colores.presente + '25',
                      color: estado === 'presente' ? '#fff' : colores.presente
                    }}
                    onClick={() => handleSetEstado(dom.id, 'presente')}
                  >
                    ✅
                  </button>
                  <button
                    className={`btn-estado ${estado === 'tardanza' ? 'active' : ''}`}
                    style={{
                      background: estado === 'tardanza' ? colores.tardanza : colores.tardanza + '25',
                      color: estado === 'tardanza' ? '#fff' : colores.tardanza
                    }}
                    onClick={() => handleSetEstado(dom.id, 'tardanza')}
                  >
                    ⏰
                  </button>
                  <button
                    className={`btn-estado ${estado === 'ausente' ? 'active' : ''}`}
                    style={{
                      background: estado === 'ausente' ? colores.ausente : colores.ausente + '25',
                      color: estado === 'ausente' ? '#fff' : colores.ausente
                    }}
                    onClick={() => handleSetEstado(dom.id, 'ausente')}
                  >
                    ❌
                  </button>
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
