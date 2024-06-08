import React, { useState } from "react";
import { PiBagSimpleBold } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import "./Navbar.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user";
import {BASE_URL} from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const User=useRecoilValue(userState);
  const setUser=useSetRecoilState(userState);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout=async()=>{
    const response=await axios.post(`${BASE_URL}/user/logout`);
    console.log(response);
    setUser({isLoading:false,userEmail:null,userRole:null});
    navigate("/");

  }

  return (
    <div>
      <div className="navbar">
        <div className="account" onClick={toggleDropdown}>
          <FiUser className="userlogo" />
          {isDropdownOpen && (
            <div className="dropdown-content">
              {/* Dropdown content goes here */}
              {User.userEmail !== null ? (
                <div onClick={handleLogout}>LOGOUT</div>
              ) : (
                <div
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  SIGN IN
                </div>
              )}
              <div
                onClick={() => {
                  if (User.userEmail !== null) {
                    //path to the orders section of the user
                  }
                }}
              >
                ORDERS
              </div>
              <div onClick={()=>{
                navigate('/account')
              }}>ACCOUNT</div>
            </div>
          )}
        </div>
        <a className="logo">
          <div>
            <p
              onClick={() => {
                navigate("/");
              }}
              className="rurulogo"
            >
              RuRu
            </p>{" "}
          </div>
        </a>
        <div className="rightbtns">
          <div className="bag">
            <PiBagSimpleBold className="baglogo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
