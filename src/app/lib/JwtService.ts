import Cookies from "js-cookie";

const ID_TOKEN_KEY = "token";

/**
 * @description Get token from cookies
 */
export const getToken = (): string | undefined => {
  return Cookies.get(ID_TOKEN_KEY);
};

/**
 * @description Save token into cookies
 * @param token: string
 */
export const saveToken = (token: string): void => {     
   
  Cookies.set(ID_TOKEN_KEY, token); // Token disimpan selama 7 hari  
};

/**
 * @description Remove token from cookies
 */
export const destroyToken = (): void => {
  Cookies.remove(ID_TOKEN_KEY);
};

const ID_PERMISSIONS_KEY = "role" as string;

/**
 * @description Get token from cookies
 */
export const getAuth = (): string | undefined => {
  return Cookies.get(ID_PERMISSIONS_KEY);
};

/**
 * @description Save token into cookies
 * @param role: string
 */
export const saveAuth = (role: string): void => {    
  Cookies.set(ID_PERMISSIONS_KEY, role, ) // Token disimpan selama 7 hari  
};

/**
 * @description Remove token from cookies
 */
export const destroyAuth = (): void => {
  Cookies.remove(ID_PERMISSIONS_KEY);
};



export default { getToken, saveToken, destroyToken, getAuth, saveAuth, destroyAuth };

