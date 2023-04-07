import { collections, db } from "..";
import {
    collection,
    getDocs,
    doc,
  } from "../helpers";

  import { query } from "firebase/firestore";

export const fetchAllUsers = async () => 
await getDocs(
    query(collection(db, collections.users))
).then((snapshot) => (snapshot ? snapshot.docs : []));