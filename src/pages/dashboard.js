import React, { useEffect, useState } from "react";
import Cards from "../component/dashboard/cards";
import { Container, Row } from "reactstrap";
import {
  CharitiesCountIcon,
  SurveyCountIcon,
  MobileUsersCount,
} from "../utils/image";
import useSurveys from "../hooks/useSurveys";
import useCharities from "../hooks/useCharities";
import { dashboard } from "../constants";
import useUsers from "../hooks/useUser";

export default function Dashboard() {
  const [liveSurveys, setLiveSurveys] = useState([]);
  const { surveys } = useSurveys();
  const { charities } = useCharities();
  const {users} = useUsers();

  console.log(users, "users"); 

  useEffect(() => {
    const liveSurveys = surveys.filter(
      (item) => item.data.target?.isDraft === false
    );
    setLiveSurveys(liveSurveys);
  }, [surveys]);

  return (
    <Container>
      <Row>
        <Cards
          icon={CharitiesCountIcon}
          data={charities.length ?? []}
          label={dashboard.charities}
        />
        <Cards
          icon={SurveyCountIcon}
          data={liveSurveys.length ?? []}
          label={dashboard.surveys}
        />
        <Cards
          icon={MobileUsersCount}
          data={users.length ?? []}
          label={dashboard.mobileUsers}
        />
      </Row>
    </Container>
  );
}
