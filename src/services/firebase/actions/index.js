import {
  fetchAllCharities,
  addCharityDoc,
  updateCharityDoc,
  deleteCharityDoc,
  singleCharity,
} from "./charity";
import {
  fetchAllCategories,
  addCategoryDoc,
  deleteCategoryDoc,
  updateCategoryDoc,
} from "./category";
import {
  fetchAllBanners,
  updateBannerImages,
  deleteBannerImage,
  updateSurveyCompletedImage,
} from "./banners";
import {
  deleteSurveyDoc,
  surveySubmissionDoc,
  updateSurveyDoc,
  fetchAllSurveys,
  addSurveyDoc,
} from "./survey";
import{
  fetchAllClients,
  addClientDoc,
  singleClient,
  updateClientDoc,
  deleteClientDoc,
} from "./client";
import { signInAuth, signOutAuth } from "./auth";
import { downloadImageUrl } from "./imageDownload";

export {
  fetchAllCharities,
  fetchAllSurveys,
  fetchAllCategories,
  fetchAllBanners,
  signInAuth,
  signOutAuth,
  addCharityDoc,
  downloadImageUrl,
  updateCharityDoc,
  singleCharity,
  addSurveyDoc,
  updateSurveyDoc,
  addCategoryDoc,
  deleteCategoryDoc,
  updateCategoryDoc,
  updateBannerImages,
  deleteBannerImage,
  updateSurveyCompletedImage,
  deleteCharityDoc,
  deleteSurveyDoc,
  surveySubmissionDoc,
  fetchAllClients,
  addClientDoc,
  singleClient,
  updateClientDoc,
  deleteClientDoc,
};
