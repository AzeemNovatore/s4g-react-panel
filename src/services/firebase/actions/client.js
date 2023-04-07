import { collections, db } from "..";
import {
  collection,
  deleteDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
} from "../helpers";

import { query, orderBy, getDoc } from "firebase/firestore";

export const fetchAllClients = async () => 
getDocs(
    query(collection(db, collections.clients), orderBy("orderBy", "desc"))
).then((snapshot) => (snapshot ? snapshot.docs : []));

export const addClientDoc = async (ref, payload) => setDoc(ref, payload);

export const updateClientDoc = async (ref, payload) => updateDoc(ref, payload);

export const singleClient = async (ref) =>
getDoc(ref).then((res) => (res ? res : null));

export const deleteClientDoc = async (id) =>
    deleteDoc(doc(db, collections.clients, id));