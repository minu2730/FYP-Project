import { useEffect } from "react";
import logo from "../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Navbar = ({ isLoginPage, isRegistrationPage }) => {
  useEffect(() => {
    // Load Google Sign-In script dynamically
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const buttonStyle = {
    borderRadius: "20px", // Set the border-radius as per your preference
  };

  return (
    <>
      <nav
        className="navbar p-2 fixed top-0 z-10"
        style={{ backgroundColor: "orange", width: "100%" }}
      >
        <ul className=" flex ">
          <li className="flex-1 sm:w-64">
            <img width={"100px"} src={logo} alt="" />
          </li>
          <div className=" flex items-center gap-2  text-center">
            {/* <li className='hidden sm:hidden  flex-1 w-auto'>
							<Button
								style={{
									...buttonStyle,
									backgroundColor: 'white',
									color: 'black',
								}}
								variant='contained'
							>
								<Link to='/memberJoin'>join</Link>
							</Button>
						</li> */}
            <li className="hidden sm:flex  flex-1 w-auto">
              <Button
                style={{
                  ...buttonStyle,
                  backgroundColor: "white",
                  color: "black",
                }}
                variant="contained"
              >
                <Link to="/">home</Link>
              </Button>
            </li>
            <li className="hidden sm:flex flex-1 w-[5.5rem] ">
              {!isLoginPage && !isRegistrationPage && (
                <Button
                  style={{ ...buttonStyle, backgroundColor: "#f96d00" }}
                  variant="contained"
                >
                  <Link to="/login" style={{ whiteSpace: "nowrap" }}>
                    Sign In
                  </Link>
                </Button>
              )}
            </li>
            <li className="hidden sm:flex  flex-1 w-30">
              {!isLoginPage && !isRegistrationPage && (
                <Button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#222831",
                    color: "white",
                  }}
                  variant="contained"
                  endIcon={<ExitToAppIcon />}
                >
                  <Link to="/Register">Register</Link>
                </Button>
              )}
            </li>
            <li className="flex-1 w-auto sm:hidden">
              <MenuIcon></MenuIcon>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
