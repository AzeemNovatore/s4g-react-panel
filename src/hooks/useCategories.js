import { fetchAllCategories } from "../services/firebase/actions";
import { LoaderContext } from "../context/loadingContext";
import { useContext, useState } from "react";

export default function useCategories() {
  const { setLoading } = useContext(LoaderContext);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      setLoading(true);
      await fetchAllCategories().then((resp) => setCategories(resp.categories));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { categories, setCategories, getCategories };
}
