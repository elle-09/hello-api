//src/context/UseContext.jsx 

import { createContext, useEffect, useRef, useState } from "react"; 

const API_URL = import.meta.env.VITE_API_URL; 
export const UserContext = createContext(); 
export function UserProvider({ children }) { 
  const isInit = useRef(false); 
  const [user, setUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loginErrorMsg, setLoginErrorMsg] = useState(""); 
  const [isLogInError, setIsLoginError] = useState(false); 
  const [isInitializing, setIsInitializing] = useState(true); 

  useEffect(() => { 
    if (isInit.current) return;
    isInit.current = true; 
    me(); 
  }, []); 

  const me = async () => { 
    const result = await fetch(`${API_URL}/api/me`, { 
      credentials: "include", 
    }); 
    if (result.ok) { 
      const data = await result.json(); 

      console.log("==>user data: ", data); 

      setUser(data.user); 
      setIsLoggedIn(true); 
    }else {
      setUser(null);
      setIsLoggedIn(false);
    }
    
    setIsInitializing(false); 
  }; 

  const login = async (email, password) => { 
    const body = { 
      email: email, 
      password: password, 
    }; 

    console.log("==>Login body: ", body); 
    const result = await fetch(`${API_URL}/api/auth/login`, { 
      method: "POST", 
      headers: {
      "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(body), 
    }); 

    if (result.ok) { 
      const data = await result.json(); 
      setUser(data.user); 
      setIsLoggedIn(true); 
      return true; 
    } else { 
      const errData = await result.json(); 
      console.log("==>Login failed: ", errData.message); 
      setIsLoggedIn(false); 
      setIsLoginError(true); 
      setLoginErrorMsg(errData.message); 
      return false; 
    } 
  }; 

  const logout = async () => { 
    const result = await fetch(`${API_URL}/api/auth/logout`, { 
      method: "GET", 
      credentials: "include", 
    }); 
  }; 

  return ( 
    <UserContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isLoggedIn, 
        isLogInError, 
        loginErrorMsg, 
        isInitializing, 
      }} 
    > 
      {children} 
    </UserContext.Provider> 
  ); 
} 