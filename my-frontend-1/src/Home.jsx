//src/Home.jsx 
import AppBar from "@mui/material/AppBar"; 
import Button from "@mui/material/Button"; 
import Toolbar from "@mui/material/Toolbar"; 
import Typography from "@mui/material/Typography"; 
import { Outlet } from "react-router-dom"; 
import { useNavigate } from "react-router-dom"; 
import Box from "@mui/material/Box"; 

export default function Home() { 
  const navigate = useNavigate(); 
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
        </Toolbar> 
      </AppBar> 
      <Box sx={{ px: 2, pt: 2 }}> 
        <Outlet /> 
      </Box> 
    </div> 
  ); 
} 