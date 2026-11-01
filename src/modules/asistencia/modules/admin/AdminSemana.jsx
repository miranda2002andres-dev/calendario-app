import React, { useState, useEffect } from 'react';
import { asistenciaService } from '../../services/firebaseService';

const AdminSemana = ({ fuente }) => {
  const [semanaLunes, setSemanaLunes] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  });
  const [buscar, setBuscar] = useState('');
  const [loading, setLoading] = useState(false);
  const [satelites, setSatelites] = useState([]);
  const [sateliteActivo, setSateliteActivo] = useState(null);
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [asistenciaSemana, setAsistenciaSemana] = useState({});

  const getFechasSemana = (lunesStr) => {
    const fechas = [];
    const base = new Date(lunesStr + "T12:00:00");
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      fechas.push(d.toISOString().split("T")[0]);
    }
    return fechas;
  };

  const fechas = getFechasSemana(semanaLunes);

  // Cargar Satélites al inicio
  useEffect(() => {
    const cargarSatelites = async () => {
      const data = await asistenciaService.getSatelites(fuente);
      setSatelites(data);
      if (data.length > 0) {
        setSateliteActivo(data[0]);
        const doms = await asistenciaService.getDomiciliarios(data[0].id);
        setDomiciliarios(doms);
      }
    };
    cargarSatelites();
  }, [fuente]);

  // Cargar la asistencia de la semana cuando cambia el satélite o la semana
  useEffect(() => {
    if (!sateliteActivo) return;
    const cargarSemana = async () => {
      setLoading(true);
      try {
        const promesas = fechas.map(async (f) => {
          const data = await asistenciaService.getAsistencia(f);
          return { fecha: f, data: data || {} };
        });
        const resultados = await Promise.all(promesas);
        const mapa = {};
        resultados.forEach(({ fecha, data }) => { mapa[fecha] = data; });
        setAsistenciaSemana(mapa);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    cargarSemana();
  }, [sateliteActivo, semanaLunes]);

  const handleSelectSatelite = async (sat) => {
    setSateliteActivo(sat);
    const doms = await asistenciaService.getDomiciliarios(sat.id);
    setDomiciliarios(doms);
  };

  const getEstado = (fecha, domId) => asistenciaSemana[fecha]?.[domId]?.estado || 'pendiente';

  return (
    <div className="admin-tab-content" style={{ padding: '20px 0' }}>
      {/* Selector de Satélite */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
        {satelites.map(sat => (
          <button key={sat.id} onClick={() => handleSelectSatelite(sat)} style={{ background: sateliteActivo?.id === sat.id ? '#ff6600' : '#0a1220', color: '#fff', border: '1px solid #1a2a4a', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            {sat.nombre}
          </button>
        ))}
      </div>

      {/* Selector de semana */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a1220', padding: '10px 15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #1a2a4a' }}>
        <button onClick={() => { const d = new Date(semanaLunes + "T12:00:00"); d.setDate(d.getDate() - 7); setSemanaLunes(d.toISOString().split("T")[0]); }} style={{ background: '#ff660020', color: '#ff6600', border: 'none', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}> ‹ </button>
        <div style={{ color: '#fff', fontWeight: 'bold' }}>Semana: {fechas[0]} al {fechas[6]}</div>
        <button onClick={() => { const d = new Date(semanaLunes + "T12:00:00"); d.setDate(d.getDate() + 7); setSemanaLunes(d.toISOString().split("T")[0]); }} style={{ background: '#ff660020', color: '#ff6600', border: 'none', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}> › </button>
      </div>

      <div style={{ background: "#0a1220", border: "1px solid #1a2a4a", borderRadius: "10px", padding: "10px 15px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
        <span style={{ color: "#666", fontSize: "14px" }}>🔍</span>
        <input type="text" placeholder="Buscar domiciliario en la semana..." value={buscar} onChange={(e) => setBuscar(e.target.value)} style={{ background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", fontFamily: "inherit", fontSize: "14px" }} />
      </div>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center' }}>⏳ Cargando datos de la semana...</p>
      ) : (
        <div style={{ background: '#0a1220', border: '1px solid #1a2a4a', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#1a2a4a', color: '#fff', fontSize: '12px' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Domiciliario</th>
                {fechas.map(f => (
                  <th key={f} style={{ padding: '10px', textAlign: 'center' }}>{f.split('-')[2]}/{f.split('-')[1]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domiciliarios.filter(d => d.nombre.toLowerCase().includes(buscar.toLowerCase())).map(dom => (
                <tr key={dom.id} style={{ borderBottom: '1px solid #1a2a4a' }}>
                  <td style={{ padding: '10px', color: '#fff', fontSize: '13px' }}>{dom.nombre}</td>
                  {fechas.map(f => {
                    const est = getEstado(f, dom.id);
                    const colores = { presente: '#22c55e', tardanza: '#f97316', ausente: '#ef4444', pendiente: '#6b7280' };
                    return (
                      <td key={f} style={{ padding: "10px", textAlign: "center" }}>
                        {est !== "pendiente" && asistenciaSemana[f]?.[dom.id]?.hora ? (
                          <span style={{ 
                            display: "inline-block", 
                            padding: "4px 8px", 
                            borderRadius: "6px", 
                            background: colores[est] + "20", 
                            color: colores[est], 
                            fontSize: "11px", 
                            fontWeight: "bold",
                            border: `1px solid ${colores[est]}40`
                          }}>
                            {asistenciaSemana[f][dom.id].hora}
                          </span>
                        ) : (
                          <span style={{ color: "#333", fontSize: "12px" }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSemana;
