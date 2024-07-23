import React, { useState, useEffect } from "react";
import { Card, TextField, dividerClasses } from "@mui/material";
import "./Signin.css";
import { BASE_URL } from "../../config";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user";
import { useNavigate } from "react-router-dom";
import { saveState } from "../../utils/localStorage";

const Adminsignin = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [invalid, setinvalid] = useState(0);
  const setUser = useSetRecoilState(userState);
  const User = useRecoilValue(userState);

  const submitSignin = async () => {
    try {
      setinvalid(0);
      const response = await axios.post(
        `${BASE_URL}/admin/login`,
        {
          username: username,
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      console.log("hello2");
      if (response.status === 200) {
        const newUserState = {
          isLoading: false,
          userEmail: email,
          userRole: "admin",
        };
        setUser(newUserState);
        saveState("userState", newUserState);
        navigate("/");
      } else {
        setinvalid(1);
      }
    } catch (error) {
      setinvalid(1);
      console.log("errow ");
      console.log("Error while loggin in ", error);
    }
  };

  useEffect(() => {
    console.log("User state in Signin component:", User);
    saveState("userState", User);
  }, [User]);

  return (
    <div className="signindiv">
      <Card variant="outlined" className="signincard">
        <p className="signinhead">Sign In</p>
        <br />
        <div>
          <br />
          <TextField
            variant="outlined"
            className="signininput"
            id="username"
            label="Username"
            onChange={(e: any) => {
              setusername(e.target.value);
            }}
          />
          <br />
          <br />
          <br />
          <TextField
            variant="outlined"
            className="signininput"
            id="email"
            label="Email"
            onChange={(e: any) => {
              setemail(e.target.value);
            }}
          />
          <br />
          <br />

          <br />
          <TextField
            variant="outlined"
            className="signininput"
            type="password"
            id="password"
            label="Password"
            onChange={(e: any) => {
              setpassword(e.target.value);
            }}
          />
        </div>
        <br />
        <button className="signinbutton" onClick={submitSignin}>
          Sign In
        </button>
        <br />
        {invalid == 1 ? (
          <div className="errortext">Invalid credentials</div>
        ) : (
          <div></div>
        )}
        <br />
      </Card>
    </div>
  );
};

export default Adminsignin;
