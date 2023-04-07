import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LoaderContext } from "../context/loadingContext";
import { fetchAllUsers } from "../services/firebase/actions/users";

export default function useUsers(){
    const { setLoading } = useContext(LoaderContext);
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            setLoading(true);
            await fetchAllUsers().then((resp) => {
              const usersList = resp.map((doc) => ({
                data: doc.data(),
                id: doc.id,
              }));
              setUsers(usersList);
            });
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
    };
    useEffect(() => {
        getUsers();
      }, []);

      return { users, getUsers };
}