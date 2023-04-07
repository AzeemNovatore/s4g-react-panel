import { getDownloadURL } from "firebase/storage";

export const downloadImageUrl = async (uploadTask) =>
  getDownloadURL(uploadTask).then((res) => (res ? res : null));
