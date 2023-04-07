import { db } from "..";
import { getDoc, doc, updateDoc } from "../helpers";
import { collections, documentIds } from "..";

export const fetchAllCategories = async () =>
  getDoc(doc(db, collections.category, documentIds.categoryDocId)).then(
    (snapshot) => (snapshot ? snapshot.data() : [])
  );

export const addCategoryDoc = async (payload) =>
  updateDoc(doc(db, collections.category, documentIds.categoryDocId), payload);

export const deleteCategoryDoc = async (payload) =>
  updateDoc(doc(db, collections.category, documentIds.categoryDocId), payload);

export const updateCategoryDoc = async (payload) =>
  updateDoc(doc(db, collections.category, documentIds.categoryDocId), payload);
