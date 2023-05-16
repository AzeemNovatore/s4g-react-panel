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
        // const fromDate = new Date(
        //   surveys[i].data?.target?.from.seconds * 1000 +
        //     surveys[i].data?.target?.from.nanoseconds / 1000000000
        // );

        const currentDate = new Date();
        const fromDate = new Date(
          surveys[i].data.target.from?.seconds * 1000 +
            surveys[i].data.target.from?.nanoseconds / 1000000000
        );
        console.log(
          "dad",
          `${fromDate.getDate()}-${
            fromDate.getMonth() + 1
          }-${fromDate.getFullYear()}`
        );
        const date1 = `${fromDate.getDate()}-${
          fromDate.getMonth() + 1
        }-${fromDate.getFullYear()}`;
        const date2 = `${currentDate.getDate()}-${
          currentDate.getMonth() + 1
        }-${currentDate.getFullYear()}`;
        // console.log(date2);
        // if (date1 === date2) {
        //   console.log("equal");
        // }

        onSnapshot(collectionRef, async (querySnapshot) => {
          if (querySnapshot !== null) {
            const submissionsarr = querySnapshot.docs.map((doc) => ({
              data: doc.data(),
              id: doc.id,
            }));

            // console.log(submissionsarr[0].data.userid,'submission');


            // if (
            //   submissionsarr?.length >= surveys[i].data.target?.surveyresponse
            // )
            //  {
            const submissionRef = doc(db, collections.survey, surveys[i].id);
            const payload = {
              target: {
                surveyresponsecomplete: submissionsarr?.length,
                // surveyResponseUsers: submissionsarr.map((item)=> item?.id),
                active:
                  submissionsarr?.length >=
                  surveys[i].data.target?.surveyresponse
                    ? false
                    : // :  >= currentDate
                    // ? true
                    date1 === date2 &&
                      submissionsarr?.length !==
                        surveys[i].data.target?.surveyresponse
                    ? // &&
                      //   submissionsarr?.length !=
                      //     surveys[i].data.target?.surveyresponse
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

  return { surveys, getSurveys, allSubmissions };
}
