import { auth } from "..";
import { signInWithEmailAndPassword, signOut } from "../helpers";

export const signInAuth = async (formValues) =>
  signInWithEmailAndPassword(
    auth,
    formValues?.email,
    formValues?.password
  ).then((resp) => (resp ? resp : null));

export const signOutAuth = async () =>
  signOut(auth).then((res) => (res ? res : null));
