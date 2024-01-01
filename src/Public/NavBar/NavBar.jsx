import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopNavBar from './DesktopNavBar';
import { useState, useEffect } from 'react';
import MobileNavBar from './MobileNavBar';
import { Divider } from '@mui/material';
function NavBar() {

    const [mobo, setMobo] = useState(window.innerWidth <= 700);

    useEffect(() => {
      const handleResize = () => {
        setMobo(window.innerWidth <= 700);
      };
  
      window.addEventListener("resize", handleResize);
  
      // Cleanup the event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

  return (
    <>
        {mobo ? (<>
        <MobileNavBar />
        </>) : (<>
            <DesktopNavBar /></>)}
            
            <Divider />
        
    </>
  )
}

export default NavBar