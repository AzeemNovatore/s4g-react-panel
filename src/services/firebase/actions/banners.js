import { db } from "..";
import { getDoc, doc, updateDoc } from "../helpers";
import { collections, documentIds } from "..";

export const fetchAllBanners = async () =>
  getDoc(doc(db, "ApplicationData", "appData")).then((snapshot) =>
    snapshot ? snapshot.data() : null
  );

export const updateBannerImages = async (payload) =>
  updateDoc(doc(db, collections.banner, documentIds.bannerDocId), payload);

export const deleteBannerImage = async (payload) =>
  updateDoc(doc(db, collections.banner, documentIds.bannerDocId), payload);

export const updateSurveyCompletedImage = async (payload) =>
  updateDoc(doc(db, collections.banner, documentIds.bannerDocId), payload);
