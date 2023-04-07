import { db } from "..";
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "../helpers";

import { collections } from "..";

export const fetchAllSurveys = async () =>
  getDocs(collection(db, collections.survey)).then((snapshot) =>
    snapshot ? snapshot.docs : []
  );

export const addSurveyDoc = async (ref, payload) => setDoc(ref, payload);

export const updateSurveyDoc = async (ref, payload) => updateDoc(ref, payload);

export const surveySubmissionDoc = async (ref, payload) =>
  updateDoc(ref, payload);

export const deleteSurveyDoc = async (id) =>
  deleteDoc(doc(db, collections.survey, id));
