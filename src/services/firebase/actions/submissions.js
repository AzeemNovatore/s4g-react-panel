import { collections, db } from "..";
import {
    collection,
    getDocs,
    doc,
  } from "../helpers";

  import { query } from "firebase/firestore";

export const fetchAllSubmissions = async () => 
await getDocs(
    query(collection(db, collections.submissions))
).then((snapshot) => (snapshot ? snapshot.docs : []));