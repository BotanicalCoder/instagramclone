import React, { useReducer, useContext, createContext, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import HomeComponent from "./components/HomeComponent";
import ProfileComponent from "./components/ProfileComponent";
import SignIn from "./components/SignInComponent";
import SignUp from "./components/SignUpComponent";
import { initialState, reducer } from "./reducers/reducer";
import CreatePost from "./components/CreatePostComponent";
import EditProfile from "./components/EditProfileComponent";
import Error from "./components/ErrorComponent";
export const UserContext = createContext();

const GuardedRoutes = () => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user != null && user !== undefined) {
      dispatch({ type: "USER", payload: user });
      history.push("/");
    } else {
      history.push("/signin");
    }
    return () => {
      dispatch({ type: "CLEAR" })
      history.push("/signin");
    };
  }, [dispatch, history]);

  return (
    <Switch>
      <Route path="/" exact>
        <HomeComponent />
      </Route>
      <Route path="/profile/:username">
        <ProfileComponent />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/editprofile/:username">
        <EditProfile />
      </Route>
      <Route path="*">
        {" "}
        <Error />{" "}
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <NavbarComponent />
        <GuardedRoutes />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
