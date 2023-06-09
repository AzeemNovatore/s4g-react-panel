// import { components } from "react-select";
import {
  Dashboard,
  BannerImages,
  Categories,
  Charity,
  Surveys,
  DraftsSurveys,
  CharityForm,
  SingleItemCharity,
  AddSurvey,
  UpdateSurvey,
  SingleItemSurvey,
  Clients,
  ClientSurveyDetails,
  AddClient,
} from "../../pages";
import SingleItemClient from "../../pages/clients/viewClient";
import Notifications from "../../pages/notifications";
import AddNotification from "../../pages/notifications/addNotfication";

import {
  addCharity,
  addSurvey,
  bannerImages,
  categories,
  charities,
  clients,
  dashboard,
  drafts,
  surveys,
  updateCharity,
  updateSurvey,
  viewCharity,
  viewSurvey,
  clientSurveyDetails,
  addClient,
  updateClient,
  viewClient,
  notifications,
  addNotification,
} from "../pathnames";

const privateRoutes = [
  {
    title: "Dashboard",
    component: Dashboard,
    path: dashboard,
  },
  {
    title: "Charities",
    component: Charity,
    path: charities,
  },
  {
    title: "Surveys",
    component: Surveys,
    path: surveys,
  },
  {
    title: "Draft Surveys",
    component: DraftsSurveys,
    path: drafts,
  },
  {
    title: "Add Charity",
    component: CharityForm,
    path: addCharity,
  },
  {
    title: "Add Survey",
    component: AddSurvey,
    path: addSurvey,
  },
  {
    title: "View Charity",
    component: SingleItemCharity,
    path: viewCharity,
  },
  {
    title: "View Survey",
    component: SingleItemSurvey,
    path: viewSurvey,
  },
  {
    title: "Update Survey",
    component: UpdateSurvey,
    path: updateSurvey,
  },
  {
    title: "Categories",
    component: Categories,
    path: categories,
  },
  {
    title: "Banner Images",
    component: BannerImages,
    path: bannerImages,
  },
  {
    title: "Update Charity",
    component: CharityForm,
    path: updateCharity,
  },
  {
    title: "Clients",
    component: Clients,
    path: clients,
  },
  {
    title: "Client",
    component: ClientSurveyDetails,
    path: clientSurveyDetails,
  },
  {
    title: "Edit Client",
    component: AddClient,
    path: updateClient,
  },
  {
    title: "Client Detail",
    component: SingleItemClient,
    path: viewClient,
  },
  {
    title: "Add Client ",
    component: AddClient,
    path: addClient,
  },
  {
    title: "Notifications",
    component: Notifications,
    path: notifications,
  },
  {
    title: "Add New Notification",
    component: AddNotification,
    path: addNotification,
  }
];

export default privateRoutes;
