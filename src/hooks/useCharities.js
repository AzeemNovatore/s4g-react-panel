import { fetchAllCharities } from "../services/firebase/actions";
import { useState, useContext, useEffect } from "react";
import { LoaderContext } from "../context/loadingContext";

export default function useCharities() {
  const { setLoading } = useContext(LoaderContext);
  const [charities, setCharities] = useState([]);

  const getCharities = async () => {
    try {
      setLoading(true);
      await fetchAllCharities().then((resp) => {
        const charitiesList = resp.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setCharities(charitiesList);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCharities();
  }, []);

  return { charities, getCharities };
}
