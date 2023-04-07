import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { configs } from "../../configs";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: configs.firbase.apiKey,
  authDomain: configs.firbase.authDomain,
  databaseURL: configs.firbase.databaseURL,
  projectId: configs.firbase.projectId,
  storageBucket: configs.firbase.storageBucket,
  messagingSenderId: configs.firbase.messagingSenderId,
  appId: configs.firbase.appId,
  measurementId: configs.firbase.measurementId,
};

export const collections = {
  charity: "charities",
  survey: "surveys",
  banner: "ApplicationData",
  category: "categories",
  submissions: "submissions",
  clients: "clients",
  users: "users"
};

export const documentIds = {
  bannerDocId: "appData",
  categoryDocId: "categoriesdata",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storageGet = getStorage(app);

export default app;
