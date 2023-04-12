import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "../context/loadingContext";
import { fetchAllSubmissions } from "../services/firebase/actions/submissions";

export default function useSubmissions(){
    const { setLoading } = useContext(LoaderContext);
    const [submissions, setSubmissions] = useState([]);

    const getSubmissions = async () => {
        try {
            setLoading(true);
            await fetchAllSubmissions().then((resp) => {
              const submissionsList = resp.map((doc) => ({
                data: doc.data(),
                id: doc.id,
              }));
              setSubmissions(submissionsList);
            });
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
    };
    useEffect(() => {
        getSubmissions();
      }, []);

      return { submissions, getSubmissions };
}