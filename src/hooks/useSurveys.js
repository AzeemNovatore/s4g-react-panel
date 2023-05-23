import { useContext, useState, useEffect } from "react";
import { LoaderContext } from "../context/loadingContext";
import {
  fetchAllSurveys,
  surveySubmissionDoc,
} from "../services/firebase/actions";
import { collections } from "../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { doc } from "firebase/firestore";
export default function useSurveys() {
  const { setLoading } = useContext(LoaderContext);
  const [surveys, setSurveys] = useState([]);

  const getSurveys = async () => {
    try {
      setLoading(true);
      await fetchAllSurveys().then((resp) => {
        const surveysList = resp.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setSurveys(surveysList);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const allSubmissions = () => {
    try {
      for (let i = 0; i < surveys?.length; i++) {        
        let collectionRef = collection(
          db,
          collections.survey,
          surveys[i].id,
          collections.submissions
        );

        const currentDate = new Date().getTime();
        const surveyStartDate = new Date(surveys[i].data.target.from.seconds * 1000).getTime();
        const surveyEndDate = new Date(surveys[i].data.target.to.seconds * 1000).getTime();

        console.log(currentDate,"currentDate");

        onSnapshot(collectionRef, async (querySnapshot) => {
          if (querySnapshot !== null) {
            const submissionsarr = querySnapshot.docs.map((doc) => ({
              data: doc.data(),
              id: doc.id,
            }));

            const submissionRef = doc(db, collections.survey, surveys[i].id);
            const payload = {
              target: {
                surveyresponsecomplete: submissionsarr?.length,
                active:
                currentDate >= surveyEndDate  || submissionsarr?.length >=
                  surveys[i].data.target?.surveyresponse
                    ? false
                    :
                    currentDate >= surveyStartDate &&
                      submissionsarr?.length !==
                        surveys[i].data.target?.surveyresponse
                    ?
                      true
                    : surveys[i].data?.target?.active,
                      isDraft: surveys[i].data.target?.isDraft,
                      age: surveys[i].data.target?.age,
                      ageIds: surveys[i].data.target?.ageIds,
                      education: surveys[i].data.target?.education,
                      gender: surveys[i].data.target?.gender,
                      kids: surveys[i].data.target?.kids,
                      relationStatus: surveys[i].data.target?.relationStatus,
                      surveyresponse: surveys[i].data.target?.surveyresponse,
                      from: surveys[i].data.target?.from,
                      to: surveys[i].data.target?.to,
              },
            };
            await surveySubmissionDoc(submissionRef, payload);
          }
          // }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSurveys();
  }, []);

    useEffect(() => {
    // Run allSubmissions every 1 minute (adjust the interval as needed)
    const intervalId = setInterval(allSubmissions, 60000);

    // const intervalId = setInterval(() => {
    //   const currentDateInvalid = new Date().getTime();
    //   const secondsUntilNextMinute = 60000 - (currentDateInvalid % 60000);
    //   setTimeout(() => {
    //     allSubmissions();
    //   }, secondsUntilNextMinute);
    // }, 60000);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, [allSubmissions]);
  

  return { surveys, getSurveys, allSubmissions };
}
