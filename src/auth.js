import Cookies from "js-cookie";

// Placeholder function for checking authentication
export const checkAuthentication = () => {
    const token = Cookies.get('access_token');
    if(token)
    return true;

    else
    return false;
  };