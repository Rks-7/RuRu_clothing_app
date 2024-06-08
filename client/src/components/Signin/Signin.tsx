import React ,{useState} from 'react'
import {Card,TextField, dividerClasses} from '@mui/material';
import "./Signin.css"
import {BASE_URL} from "../../config"
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../store/atoms/user';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate=useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [invalid, setinvalid] = useState(0);
  const setUser=useSetRecoilState(userState);
  
  const submitSignin=async ()=>{
    try {
      setinvalid(0);
      const response = await axios.post(`${BASE_URL}/user/login`, {
        username:username,
        email: email,
        password: password,
      }, { withCredentials: true });
      console.log("hello2");
      if (response.status === 200) {
        console.log(response);
        setUser({ isLoading: false, userEmail: email, userRole: "user" });
        navigate("/");
      }
    } catch (error) {
      setinvalid(1);
      console.log("errow ")
        console.log("Error while loggin in ",error)
    }
    
    
  }

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
        {
          invalid==1?(
            <div className='errortext'>
              Invalid credentials
            </div>
          ):(
            <div></div>
           )
        }
        <br />
        <a href="/signup">Don't have an account ?</a>
      </Card>
    </div>
  );
}

export default Signin
