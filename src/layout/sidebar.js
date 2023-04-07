import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { appLogo } from "../utils/image";
import { routesList } from "../routes/sideMenu";
import { signOutAuth } from "../services/firebase/actions";
import { LoaderContext } from "../context/loadingContext";
import { useContext } from "react";
import { AuthContext } from "../context/authenticationContext";
import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const { setLoading } = useContext(LoaderContext);
  const { dispatch } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  const logout = async () => {
    setLoading(true);
    setTimeout(async () => {
      await signOutAuth()
        .then(() => {
          dispatch({ type: "LOGOUT", payload: currentUser });
          setLoading(false);
          history.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }, 2000);
  };

  return (
    <>
      <div className="sidebar__section__open">
        <div className="list__sidebar">
          <div className="main-logo">
            <img src={appLogo} alt="" />
          </div>
          <div className="side__menu">
            {routesList.map((item, i) => (
              <div key={i}>
                <NavLink to={item.path} activeClassName="active">
                  <li>
                    <span>
                      <img
                        src={item.icon}
                        alt=""
                        className="filter-green sidebar-icon"
                      />
                      <span className="nav-color">{item.name}</span>
                    </span>
                  </li>
                </NavLink>
              </div>
            ))}
          </div>
          <div className="main-logout">
            <Link onClick={logout}>
              <li className="logout-list">
                <span>
                  <i class="ri-logout-box-line">
                    {" "}
                    <span>Logout</span>{" "}
                  </i>
                </span>
              </li>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
