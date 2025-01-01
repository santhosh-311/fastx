import React, { useContext,useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import "../styles/Header.css";
import DataContext from "./context/DataContext";

const { Header: AntHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const {
    userDetails,
    setUserDetails,
    setToken,
    loginFlag,
    setLoginFlag,
    logout,
    userFlag,
    setUserFlag,
    opFlag,
    setOpFlag,
    adminFlag,
    setAdminFlag,
    routesFrom, setRoutesFrom, routesTo, setRoutesTo
  } = useContext(DataContext);

  const BASE_URL = "http://localhost:8084/";

  const handleMenuClick = (key) => {
    navigate(key);
  };

  useEffect(() => {
      const fetchRoutes = async () => {
        try {
          const res = await axios.get(BASE_URL + "route/getall");
          const routesData = res.data;
          const routesFromData = [...new Set(routesData.map((r) => r.routeFrom))];
          const routesToData = [...new Set(routesData.map((r) => r.routeTo))];
  
          setRoutesFrom(routesFromData);
          setRoutesTo(routesToData);
        } catch (err) {
          console.error("Error during route loading:", err);
        }
      };
  
      fetchRoutes();
    }, []);

  const login = (email, password) => {
    console.log("Logging In...");
    axios
      .post(BASE_URL + "user/login", { username: email, password })
      .then((res) => {
        message.success("Login Successful");
        setToken(res.data.jwt);
        setUserDetails(res.data);
        localStorage.setItem("userDetails", JSON.stringify(res.data));
        localStorage.setItem("token", res.data.jwt);
        setLoginFlag(true);

        const role = res.data.role;
        if (role === "USER") setUserFlag(true);
        else if (role === "OPERATOR") setOpFlag(true);
        else setAdminFlag(true);
      })
      .catch((err) => {
        message.error("Login Failed");
        console.log("Error During Login " + err);
      });
  };

  const signup = (userdata) => {
    console.log("Signing up...");
    axios
      .post(BASE_URL + "user/register", userdata)
      .then((res) => {
        console.log("User registered successfully", res.data);
        message.success("Signup successful");
      })
      .catch((err) => {
        console.log("Error During Signup " + err);
        message.error("Signup failed");
      });
  };

  return (
    <AntHeader className="header">
      <div className="logo" onClick={() => navigate("/")}>
        FastX
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        className="menu"
        onClick={({ key }) => handleMenuClick(key)}
        style={{ minWidth: "800px", display: "flex", justifyContent: "center" }}
      >
        <Menu.Item key="/">Home</Menu.Item>
        <Menu.Item key="/about">About</Menu.Item>
        <Menu.Item key="/contact">Contact</Menu.Item>
        {userFlag || userDetails?.role === "USER" ? (
          <Menu.Item key="/booking">Bookings</Menu.Item>
        ) : opFlag || userDetails?.role === "OPERATOR" ? (
          <>
            <Menu.Item key="/busdetails">Bookings</Menu.Item>
            <Menu.Item key="/managebuses">Buses</Menu.Item>
          </>
        ) : adminFlag || userDetails?.role === "ADMIN" ? (
          <>
            <Menu.Item key="/routes">Routes</Menu.Item>
            <Menu.Item key="/manageusers">Users</Menu.Item>
            <Menu.Item key="/managebookinga">Bookings</Menu.Item>
          </>
        ) : null}
        {(userFlag || opFlag || userDetails?.role==="USER" || userDetails?.role==="OPERATOR") && (
          <Menu.Item key="/profile">Profile</Menu.Item>
        )}
      </Menu>
      {userDetails === "" ? (
        <div className="header-btns">
          <SignUpModal signup={signup} />
          <LoginModal login={login} flag={loginFlag} />
        </div>
      ) : (
        <div className="user-details">
          <p>{userDetails.userName.split("@")[0]}</p>
          <LogoutOutlined onClick={logout} className="logout-btn" />
        </div>
      )}
    </AntHeader>
  );
}

export default Header;
