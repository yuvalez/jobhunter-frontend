import { observer } from "mobx-react";
import { useContext } from "react";
import {Navigate ,useLocation } from "react-router-dom";
import AuthStore from "../stores/AuthStore";

const RequireToken = ({ children, navigateTo="/" }) => {
    const authStore = useContext(AuthStore);
    const { fetchToken } = authStore;
    const auth = fetchToken;
    const location = useLocation();
    if (!auth) {
      
      return <Navigate to={navigateTo} state={{ from: location }} />;
    }
  
    return children;
}

export default observer(RequireToken);