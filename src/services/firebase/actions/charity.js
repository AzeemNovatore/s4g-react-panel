import { db } from "..";
import {
  collection,
  deleteDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
} from "../helpers";

import { query, orderBy, getDoc } from "firebase/firestore";
import { collections } from "..";

export const fetchAllCharities = async () =>
  getDocs(
    query(collection(db, collections.charity), orderBy("orderBy", "desc"))
  ).then((snapshot) => (snapshot ? snapshot.docs : []));

export const addCharityDoc = async (ref, payload) => setDoc(ref, payload);

export const updateCharityDoc = async (ref, payload) => updateDoc(ref, payload);

export const singleCharity = async (ref) =>
  getDoc(ref).then((res) => (res ? res : null));

export const deleteCharityDoc = async (id) =>
  deleteDoc(doc(db, collections.charity, id));
