import {Navigate ,useLocation } from "react-router-dom";

export const setToken = (token, ttl=1800) =>{
    // set token in localStorage
    const now = new Date();
    const item = {
		token,
		expiry: now.getTime() + ttl * 1000,
	}
    localStorage.setItem('HFAadminToken', JSON.stringify(item))
}
export const fetchToken = () =>{
    // fetch the token
    const itemStr = localStorage.getItem('HFAadminToken')
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem('HFAadminToken')
        return null
    }

    return item.token;

}
const RequireToken = ({ children, navigateTo="/" }) => {
    
    let auth = fetchToken()
    let location = useLocation();
  
    if (!auth) {
      
      return <Navigate to={navigateTo} state={{ from: location }} />;
    }
  
    return children;
}

export default RequireToken;