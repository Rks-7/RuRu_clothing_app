import React from 'react'
import {Card,TextField} from '@mui/material';
import axios from "axios";
import { useState } from 'react';
import {BASE_URL} from "../../config"
import "./Signin.css"
import { useNavigate } from 'react-router-dom';
import {userState } from "../../store/atoms/user"
import { useSetRecoilState } from 'recoil';


const Signup = () => {
     const navigate=useNavigate();
    const [email, setemail] = useState("");
    const [invalidemail, setinvalidemail] = useState(false);
    const [invalidpassword, setinvalidpassword] = useState(false);
    const [invalidusername, setinvalidusername] = useState(false);
    const [password, setpassword] = useState("");
    const [username, setusername] = useState("");
    const setUser=useSetRecoilState(userState);


    const emailregex=/^[^/s@]+@[^/s@]+\.[^/s@]+$/;
    const passowrdregex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-za-z\d@$!%*?&]{8,}$/;
    const usernameregex=/^[A-Za-z][A-Za-z0-9_-]{2,14}$/;

    const handleSubmit= async ()=>{
      
      if(emailregex.test(email) && usernameregex.test(username) && passowrdregex.test(password)){

           const response =await axios.post(`${BASE_URL}/user/signup`,{
            username:username,
            email:email,
            password:password
           })
           console.log(response);
           setUser({isLoading:false,userEmail:email,userRole:"user"})
           navigate("/");

      }else{
           if(!emailregex.test(email)){
              setinvalidemail(true);
            }
           if(!usernameregex.test(username)){
              setinvalidusername(true);
             }
           if(!passowrdregex.test(password)){
              setinvalidpassword(true);
             }
      }

     


    }

  return (
    <div className='signindiv'>
      <Card variant="outlined" className='signincard'>
        <p className="signinhead" >Sign Up</p>
        <br />
        <div >
        
        
        <br />
        <TextField  className='signininput'
                        id="email"
                        label="Email"
                        variant="outlined"
                        // fullWidth={true}
                        onChange={(e:any) => {
                            setemail(e.target.value);
                        }}
        />
        <br />
        
        <br />
        <TextField className='signininput'
                        id="username"
                        label="Username"
                        variant="outlined"
                        // fullWidth={true}
                        onChange={(e:any) => {
                            setusername(e.target.value);
                        }}
        />
        <br />
        
        <br />
        <TextField  className='signininput' 
                        type="password"
                        id="password"
                        label="Password"
                        variant="outlined"
                        // fullWidth={true}
                        onChange={(e:any) => {
                            setpassword(e.target.value);
                        }}
         />
        </div>
        
        <br />
        <button className='signinbutton' onClick={handleSubmit}>Sign Up</button>
        <br />
        <a href="">Already have an account ?</a>
        

          <br />
        <div className='errortext'>
          
        <div>
            {invalidemail && <p className='warning'>- invalid email !</p>}
       </div>
          <br />
        <div>
          {invalidpassword && <p className='warning'>- Password must be at least 8 characters long,not exceed 20 characters ,must contain at least one uppercase letter and at least one number and one special character (e.g., !, @, #, $, %)</p>}
        </div>
          <br />
        <div>
          {invalidusername && <p className='warning'>- Username should begin with a letter and should be 3 to 15 characters long</p>}
        </div>

        </div>
        
      </Card>
    </div>
  )
}

export default Signup
