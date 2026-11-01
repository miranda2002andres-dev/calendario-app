import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import { db } from '../../../config/firebase';

export const asistenciaService = {
  getSatelites: async (fuente) => {
    try { const q = query(collection(db, "satelites"), where("fuente", "==", fuente)); const snapshot = await getDocs(q); return snapshot.docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { return []; }
  },
  crearSatelite: async (fuente, codigo, nombre) => { await addDoc(collection(db, "satelites"), { fuente, codigo, nombre }); },
  eliminarSatelite: async (id) => { await deleteDoc(doc(db, "satelites", id)); },
  getDomiciliarios: async (sateliteId) => {
    try { const q = query(collection(db, "domiciliarios"), where("sateliteId", "==", sateliteId)); const snapshot = await getDocs(q); return snapshot.docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { return []; }
  },
  crearDomiciliario: async (sateliteId, nombre) => { await addDoc(collection(db, "domiciliarios"), { sateliteId, nombre }); },
  eliminarDomiciliario: async (id) => { await deleteDoc(doc(db, "domiciliarios", id)); },
  getAsistencia: async (fecha) => { const docRef = doc(db, "asistencia", fecha); const docSnap = await getDoc(docRef); return docSnap.exists() ? docSnap.data() : {}; },
  setEstadoAsistencia: async (fecha, domId, estado) => { const docRef = doc(db, "asistencia", fecha); const docSnap = await getDoc(docRef); const data = docSnap.exists() ? docSnap.data() : {}; const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }); await setDoc(docRef, { ...data, [domId]: { estado, hora } }, { merge: true }); },
  getNovedades: async (fecha) => { const docRef = doc(db, "novedades", fecha); const docSnap = await getDoc(docRef); return docSnap.exists() ? docSnap.data().lista || [] : []; },
  crearNovedad: async (fecha, novedad) => { const docRef = doc(db, "novedades", fecha); const docSnap = await getDoc(docRef); const lista = docSnap.exists() ? docSnap.data().lista || [] : []; await setDoc(docRef, { lista: [...lista, novedad] }, { merge: true }); },
  getConfig: async () => { const docRef = doc(db, "configuracion", "general"); const docSnap = await getDoc(docRef); return docSnap.exists() ? docSnap.data() : { pinAdmin: "1234" }; },
  setConfig: async (config) => { await setDoc(doc(db, "configuracion", "general"), config, { merge: true }); }
};
