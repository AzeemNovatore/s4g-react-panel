import {
  Banners,
  Categories,
  Charities,
  DashboardSvg,
  DraftSurveys,
  Surveys,
  Clients,
  Notifications,
} from "../utils/image";

import {
  dashboard,
  charities,
  surveys,
  categories,
  bannerImages,
  drafts, clients, addNotification
} from "./pathnames";

export const routesList = [
  {
    name: "Dashboard",
    icon: DashboardSvg,
    path: dashboard,
  },
  {
    name: "Charities",
    icon: Charities,
    path: charities,
  },
  {
    name: "Categories",
    icon: Categories,
    path: categories,
  },
  {
    name: "Surveys",
    icon: Surveys,
    path: surveys,
  },
  {
    name: "Banners",
    icon: Banners,
    path: bannerImages,
  },
  {
    name: "Drafts",
    icon: DraftSurveys,
    path: drafts,
  },
  {
    name: "Clients",
    icon: Clients,
    path: clients,
  },
  {
    name: "Notifications",
    icon: Notifications,
    path: addNotification,
  }
];
