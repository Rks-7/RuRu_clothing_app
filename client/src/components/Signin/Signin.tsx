import React ,{useState} from 'react'
import {Card,TextField} from '@mui/material';
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
  const setUser=useSetRecoilState(userState);
  
  const submitSignin=async ()=>{
    const response=await axios.post(`${BASE_URL}/user/login`,{
      email:email,
      password:password
    });
    console.log(response);
    setUser({isLoading:false,userEmail:email,userRole:"user"});
    navigate("/");
    
  }

  return (
    <div className='signindiv'>
      <Card variant="outlined" className='signincard'>
        <p className="signinhead" >Sign In</p>
        <br />
        <div >
        
        <br />
        <TextField variant='outlined' className='signininput'
        id='email' label='Email'
        onChange={(e:any)=>{
            setemail(e.target.value);
        }}
        />
        <br /><br />
        
        <br />
        <TextField variant='outlined' className='signininput' type="password"
        id='password' label="Password" onChange={(e:any)=>{
          setpassword(e.target.value);
        }} />
        </div>
        <br />
        <button className='signinbutton' onClick={submitSignin}>Sign In</button>
        <br />
        <a href="">Don't have an account ?</a>
        

        
      </Card>
    </div>
  )
}

export default Signin
