// ============================================
// SERVICIO DE FIREBASE (FIRESTORE)
// Parametrizado para soportar múltiples fuentes: domis | pamis | general
// ============================================

import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  deleteDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";

const COLLECTIONS = {
  domis: 'dashboard_diario',
  pamis: 'pamis_diario',
  general: 'general_diario',
};

const FALLAS_COLLECTION = 'fallas';

const getCollectionName = (source = 'domis') => {
  return COLLECTIONS[source] || COLLECTIONS.domis;
};

const cleanForFirebase = (obj) => {
  const cleaned = {};
  for (const key in obj) {
    const value = obj[key];
    if (value === undefined) {
      cleaned[key] = null;
    } else if (value === null) {
      cleaned[key] = null;
    } else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      cleaned[key] = cleanForFirebase(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// ✅ NUEVO: Parser del texto de fallas
// Recibe el texto pegado y devuelve { total, mensajeros, ranking }
const parsearFallas = (texto) => {
  if (!texto || typeof texto !== 'string') {
    return { total: 0, mensajeros: 0, ranking: [] };
  }

  const lineas = texto.split('\n').filter(l => l.trim() !== '');
  const ranking = [];
  let total = 0;
  let mensajeros = 0;

  lineas.forEach((linea) => {
    // Buscar el último número al final de la línea (puede estar tras un tab o espacios)
    const match = linea.match(/(\d+)\s*$/);
    if (match) {
      const cantidad = parseInt(match[1], 10);
      // La "línea" es todo el texto sin el número final
      const lineaSinNumero = linea.replace(/\s*\d+\s*$/, '').trim();
      
      if (lineaSinNumero && cantidad > 0) {
        total += cantidad;
        mensajeros += 1;
        ranking.push({
          linea: lineaSinNumero,
          cantidad: cantidad,
        });
      }
    }
  });

  // Ordenar ranking de mayor a menor
  ranking.sort((a, b) => b.cantidad - a.cantidad);

  return { total, mensajeros, ranking };
};

export const firebaseService = {
  // ... (todos los métodos existentes se mantienen igual) ...

  async getDataByDate(fecha, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const docRef = doc(db, collectionName, fecha);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: fecha, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document [${source}]:`, error);
      return null;
    }
  },

  async getDataByWeek(fechaInicio, fechaFin, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const q = query(
        collection(db, collectionName),
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin),
        orderBy("fecha", "asc")
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.error(`Error getting week data [${source}]:`, error);
      return [];
    }
  },

  async getDataByDateRange(fechaInicio, fechaFin, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const q = query(
        collection(db, collectionName),
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin),
        orderBy("fecha", "asc")
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.error(`Error getting date range data [${source}]:`, error);
      return [];
    }
  },

  async saveData(data, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const cleanData = cleanForFirebase(data);
      
      if (!cleanData.fecha) {
        throw new Error("La fecha es obligatoria");
      }

      if (cleanData.entregadas !== undefined && cleanData.devolucion !== undefined) {
        const total = cleanData.entregadas + cleanData.devolucion;
        cleanData.efectividad = total > 0 ? (cleanData.entregadas / total) * 100 : 0;
        cleanData.tasa_devolucion = total > 0 ? (cleanData.devolucion / total) * 100 : 0;
      }

      if (cleanData.telemercadeo !== undefined && cleanData.no_contactabilidad !== undefined) {
        const contactables = cleanData.telemercadeo - cleanData.no_contactabilidad;
        cleanData.contactabilidad = contactables > 0 ? contactables : 0;
      }

      if (cleanData.telemercadeo !== undefined && cleanData.proyeccion !== undefined) {
        cleanData.porcentaje_telemercadeo = cleanData.proyeccion > 0 
          ? (cleanData.telemercadeo / cleanData.proyeccion) * 100 : 0;
      }
      
      if (cleanData.telemercadeo !== undefined && cleanData.contactabilidad !== undefined) {
        cleanData.porcentaje_contactabilidad = cleanData.telemercadeo > 0 
          ? (cleanData.contactabilidad / cleanData.telemercadeo) * 100 : 0;
        cleanData.porcentaje_no_contactable = cleanData.telemercadeo > 0 
          ? (cleanData.no_contactabilidad / cleanData.telemercadeo) * 100 : 0;
      }
      
      if (cleanData.contactabilidad !== undefined && cleanData.si_recibe !== undefined) {
        cleanData.porcentaje_si_recibe = cleanData.contactabilidad > 0 
          ? (cleanData.si_recibe / cleanData.contactabilidad) * 100 : 0;
        cleanData.porcentaje_devolucion_dest = cleanData.contactabilidad > 0 
          ? (cleanData.devolucion_dest_tele / cleanData.contactabilidad) * 100 : 0;
      }

      const docRef = doc(db, collectionName, cleanData.fecha);
      await setDoc(docRef, {
        ...cleanData,
        updatedAt: Timestamp.now(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error(`Error saving document [${source}]:`, error);
      throw error;
    }
  },

  async deleteDataByDate(fecha, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const docRef = doc(db, collectionName, fecha);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document by date [${source}]:`, error);
      throw error;
    }
  },

  async deleteWeekData(fechaInicio, fechaFin, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const q = query(
        collection(db, collectionName),
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin)
      );
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error(`Error deleting week data [${source}]:`, error);
      throw error;
    }
  },

  async deleteAllData(source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error(`Error deleting all data [${source}]:`, error);
      throw error;
    }
  },

  async existsDataByDate(fecha, source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const docRef = doc(db, collectionName, fecha);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error(`Error checking document [${source}]:`, error);
      return false;
    }
  },

  async getAllDatesWithData(source = 'domis') {
    try {
      const collectionName = getCollectionName(source);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const fechas = [];
      querySnapshot.forEach((doc) => {
        fechas.push(doc.id);
      });
      return fechas.sort();
    } catch (error) {
      console.error(`Error getting all dates [${source}]:`, error);
      return [];
    }
  },

  // ============================================
  // ⚠️ NUEVOS MÉTODOS PARA FALLAS
  // ============================================

  /**
   * Guarda o actualiza las fallas de una fecha+source.
   * El ID del documento es: `${source}_${fecha}` (ej: "domis_2025-10-07")
   */
  async saveFallas(fecha, source, textoOriginal) {
    try {
      // Parsear el texto para calcular totales
      const { total, mensajeros, ranking } = parsearFallas(textoOriginal);

      const docId = `${source}_${fecha}`;
      const docRef = doc(db, FALLAS_COLLECTION, docId);

      // Verificar si ya existe para preservar createdAt
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : null;

      await setDoc(docRef, {
        fecha,
        source,
        textoOriginal,
        totalDia: total,
        totalMensajeros: mensajeros,
        ranking,
        createdAt: existingData?.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
      }, { merge: true });

      return { total, mensajeros, ranking };
    } catch (error) {
      console.error(`Error saving fallas [${source} - ${fecha}]:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las fallas de una fecha+source específica.
   */
  async getFallasByDate(fecha, source = 'domis') {
    try {
      const docId = `${source}_${fecha}`;
      const docRef = doc(db, FALLAS_COLLECTION, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting fallas [${source} - ${fecha}]:`, error);
      return null;
    }
  },

  /**
   * Obtiene todas las fallas de un rango de fechas + source.
   * Útil para semana/mes.
   */
  async getFallasByRange(fechaInicio, fechaFin, source = 'domis') {
    try {
      // Como el ID es `${source}_${fecha}`, necesitamos filtrar por source y fecha
      const q = query(
        collection(db, FALLAS_COLLECTION),
        where("source", "==", source),
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin),
        orderBy("fecha", "asc")
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.error(`Error getting fallas range [${source}]:`, error);
      return [];
    }
  },

  /**
   * Actualiza las fallas (fecha + textoOriginal).
   * Si cambia la fecha, se crea un nuevo documento y se elimina el anterior.
   */
  async updateFallas(oldFecha, source, nuevaFecha, nuevoTexto) {
    try {
      // Si la fecha cambió, eliminar el doc viejo y crear el nuevo
      if (oldFecha !== nuevaFecha) {
        await this.deleteFallas(oldFecha, source);
      }
      return await this.saveFallas(nuevaFecha, source, nuevoTexto);
    } catch (error) {
      console.error(`Error updating fallas [${source}]:`, error);
      throw error;
    }
  },

  /**
   * Elimina las fallas de una fecha+source.
   */
  async deleteFallas(fecha, source = 'domis') {
    try {
      const docId = `${source}_${fecha}`;
      const docRef = doc(db, FALLAS_COLLECTION, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting fallas [${source} - ${fecha}]:`, error);
      throw error;
    }
  },

  /**
   * Obtiene TODAS las fallas de un source (útil para análisis histórico).
   */
  async getAllFallas(source = 'domis') {
    try {
      const q = query(
        collection(db, FALLAS_COLLECTION),
        where("source", "==", source),
        orderBy("fecha", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.error(`Error getting all fallas [${source}]:`, error);
      return [];
    }
  },

  // ✅ Exportar el parser para usarlo en el modal
  parsearFallas,
};