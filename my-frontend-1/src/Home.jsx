//src/Home.jsx 
import AppBar from "@mui/material/AppBar"; 
import Button from "@mui/material/Button"; 
import Toolbar from "@mui/material/Toolbar"; 
import Typography from "@mui/material/Typography"; 
import { Outlet } from "react-router-dom"; 
import { useNavigate } from "react-router-dom"; 
import Box from "@mui/material/Box"; 
import { useContext, useEffect } from "react"; 
import { UserContext } from "./context/UserContext"; 
 
export default function Home() { 
  const navigate = useNavigate(); 
  const { user, isLoggedIn, isInitializing, logout, } = useContext(UserContext); 
 
  useEffect(() => { 
    if (!isLoggedIn && !isInitializing) { 
      navigate("/login"); 
    } 
  }, [isLoggedIn,isInitializing,navigate]); 

  if (isInitializing) {
    return <></>;
  }

  return ( 
    <div> 
      <AppBar position="static"> 
        <Toolbar> 

          <Typography variant="h5" sx={{ flexGrow: 1 }}> 
            My Frontend 1.0 
          </Typography> 

          <Button 
            color="inherit" 
            onClick={() => { 
              navigate("/item"); 
            }} 
          >
            Item 
          </Button> 
          {user?.role === "ADMIN" && ( 
            <Button 
              color="inherit" 
              onClick={() => { 
                navigate("/user"); 
              }} 
            > 
              User 
            </Button> 
          )} 
          {/* LOGOUT */}
          <Button
            color="inherit"
            onClick={async () => {
              await logout();
            }}
          >
            Logout
          </Button>
          
        </Toolbar> 
      </AppBar> 
      <Box sx={{ px: 2, pt: 2 }}> 
        <Outlet /> 
      </Box> 
    </div> 
  ); 
} 