import { useState, useEffect, useContext } from "react";
import { LoaderContext } from "../context/loadingContext";
import { fetchAllClients } from "../services/firebase/actions";

export default function useClients() {
  const { setLoading } = useContext(LoaderContext);
  const [clients, setClients] = useState([]);

  const getClients = async () => {
    try {
      setLoading(true);
      await fetchAllClients().then((resp) => {
        const clientsList = resp.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setClients(clientsList);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
// console.log(clients,'clients');
  useEffect(() => {
    getClients();
  }, []);

  return { clients, getClients };
}