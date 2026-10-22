import { useState, useEffect, useCallback } from 'react';
import { firebaseService } from '../services/firebaseService';

export const useFirebaseData = (fechaInicial, fechaFinal) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    domis: 0,
    meta: 0,
    telemercadeo: 0,
    diferencia: '+0%',
    infoAdicional: 0,
    domiAsistencia: 0,
    proyecciones: 0,
    satelites: 0,
    asignacionDia: 0
  });
  
  const [metricsData, setMetricsData] = useState({
    telemercadeo: 0,
    contactabilidad: 0,
    noContactabilidad: 0,
    siRecibe: 0,
    devolucionDest: 0,
    porcentajes: {
      vsProyeccion: 0,
      contactabilidad: 0,
      noContactable: 0,
      siRecibe: 0,
      devolucionDest: 0
    }
  });
  
  const [efectividadData, setEfectividadData] = useState({
    efectividad: 0,
    entregadas: 0,
    pendiente: 0,
    devolucion: 0
  });
  
  const [diasSemana, setDiasSemana] = useState([]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener datos del rango de fechas
      const registros = await firebaseService.getDataByDateRange(fechaInicial, fechaFinal);
      
      if (registros && registros.length > 0) {
        // Calcular totales
        const totalEntregadas = registros.reduce((sum, r) => sum + (r.domis_entregados || 0), 0);
        const totalDevolucion = registros.reduce((sum, r) => sum + (r.domis_devolucion || 0), 0);
        const totalTelemercadeo = registros.reduce((sum, r) => sum + (r.telemercadeo_contactados || 0), 0);
        const totalInfoAdicional = registros.reduce((sum, r) => sum + (r.info_adicional || 0), 0);
        const totalDomiAsistencia = registros.reduce((sum, r) => sum + (r.domi_asistencia || 0), 0);
        
        const efectividadCalc = totalEntregadas + totalDevolucion > 0 
          ? (totalEntregadas / (totalEntregadas + totalDevolucion)) * 100 
          : 0;
        
        setDashboardData({
          domis: totalEntregadas,
          meta: 1450, // Puedes guardar esto en otra colección
          telemercadeo: totalTelemercadeo,
          diferencia: '+12%',
          infoAdicional: totalInfoAdicional,
          domiAsistencia: totalDomiAsistencia,
          proyecciones: 1890,
          satelites: 345,
          asignacionDia: totalEntregadas + totalDevolucion
        });
        
        setEfectividadData({
          efectividad: Math.round(efectividadCalc * 10) / 10,
          entregadas: totalEntregadas,
          pendiente: 0,
          devolucion: totalDevolucion
        });
        
        // Métricas de telemercadeo
        const totalContactados = registros.reduce((sum, r) => sum + (r.telemercadeo_contactados || 0), 0);
        const totalNoContactados = registros.reduce((sum, r) => sum + (r.telemercadeo_no_contactados || 0), 0);
        const totalSiRecibe = registros.reduce((sum, r) => sum + (r.telemercadeo_si_recibe || 0), 0);
        const totalDevolucionDest = registros.reduce((sum, r) => sum + (r.telemercadeo_devolucion || 0), 0);
        const totalTele = totalContactados + totalNoContactados;
        
        setMetricsData({
          telemercadeo: totalTelemercadeo,
          contactabilidad: totalContactados,
          noContactabilidad: totalNoContactados,
          siRecibe: totalSiRecibe,
          devolucionDest: totalDevolucionDest,
          porcentajes: {
            vsProyeccion: totalTele > 0 ? Math.round((totalContactados / totalTele) * 100) : 0,
            contactabilidad: totalTele > 0 ? Math.round((totalContactados / totalTele) * 100) : 0,
            noContactable: totalTele > 0 ? Math.round((totalNoContactados / totalTele) * 100) : 0,
            siRecibe: totalContactados > 0 ? Math.round((totalSiRecibe / totalContactados) * 100) : 0,
            devolucionDest: totalContactados > 0 ? Math.round((totalDevolucionDest / totalContactados) * 100) : 0
          }
        });
        
        // Preparar datos por día para la tabla
        const dias = registros.map(r => ({
          fecha: r.fecha,
          entregadas: r.domis_entregados || 0,
          devolucion: r.domis_devolucion || 0,
          efectividad: r.domis_entregados + r.domis_devolucion > 0 
            ? Math.round((r.domis_entregados / (r.domis_entregados + r.domis_devolucion)) * 100)
            : 0
        }));
        
        setDiasSemana(dias);
      }
      
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fechaInicial, fechaFinal]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return { loading, error, dashboardData, metricsData, efectividadData, diasSemana, recargar: cargarDatos };
};