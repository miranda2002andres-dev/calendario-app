import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  deleteDoc,
  orderBy,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

const COLECCION_SATELITES = 'satelites';
const COLECCION_DOMICILIARIOS = 'domiciliarios';
const COLECCION_ASISTENCIA = 'asistencia';

export const asistenciaService = {
  // ========== SATÉLITES ==========
  async getSatelites(fuente) {
    try {
      // ✅ Sin orderBy para evitar índice compuesto
      const q = query(
        collection(db, COLECCION_SATELITES),
        where("fuente", "==", fuente)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // Ordenar en JavaScript
      data.sort((a, b) => (a.codigo || '').localeCompare(b.codigo || ''));
      return data;
    } catch (error) {
      console.error('Error getting satelites:', error);
      return [];
    }
  },

  async crearSatelite(fuente, codigo, nombre, color) {
    try {
      const docRef = await addDoc(collection(db, COLECCION_SATELITES), {
        fuente,
        codigo,
        nombre,
        color: color || '#ff6600',
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, fuente, codigo, nombre, color };
    } catch (error) {
      console.error('Error creating satelite:', error);
      throw error;
    }
  },

  async eliminarSatelite(sateliteId) {
    try {
      const q = query(
        collection(db, COLECCION_DOMICILIARIOS),
        where("sateliteId", "==", sateliteId)
      );
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      await deleteDoc(doc(db, COLECCION_SATELITES, sateliteId));
      return true;
    } catch (error) {
      console.error('Error deleting satelite:', error);
      throw error;
    }
  },

  // ========== DOMICILIARIOS ==========
  async getDomiciliarios(sateliteId) {
    try {
      // ✅ Sin orderBy para evitar índice compuesto
      const q = query(
        collection(db, COLECCION_DOMICILIARIOS),
        where("sateliteId", "==", sateliteId)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      data.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
      return data;
    } catch (error) {
      console.error('Error getting domiciliarios:', error);
      return [];
    }
  },

  async crearDomiciliario(sateliteId, nombre) {
    try {
      const docRef = await addDoc(collection(db, COLECCION_DOMICILIARIOS), {
        sateliteId,
        nombre,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, sateliteId, nombre };
    } catch (error) {
      console.error('Error creating domiciliario:', error);
      throw error;
    }
  },

  async eliminarDomiciliario(domiciliarioId) {
    try {
      await deleteDoc(doc(db, COLECCION_DOMICILIARIOS, domiciliarioId));
      return true;
    } catch (error) {
      console.error('Error deleting domiciliario:', error);
      throw error;
    }
  },

  // ========== ASISTENCIA ==========
  async getAsistencia(fecha) {
    try {
      const docRef = doc(db, COLECCION_ASISTENCIA, fecha);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return {};
    } catch (error) {
      console.error('Error getting asistencia:', error);
      return {};
    }
  },

  async guardarAsistencia(fecha, data) {
    try {
      const docRef = doc(db, COLECCION_ASISTENCIA, fecha);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving asistencia:', error);
      throw error;
    }
  },

  async setEstadoAsistencia(fecha, domiciliarioId, estado) {
    try {
      const docRef = doc(db, COLECCION_ASISTENCIA, fecha);
      await setDoc(docRef, {
        [domiciliarioId]: {
          estado,
          hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting estado:', error);
      throw error;
    }
  },
};
