import React from 'react'
import {Card,TextField} from '@mui/material';
import "./Signin.css"

const Signin = () => {
  return (
    <div className='signindiv'>
      <Card variant="outlined" className='signincard'>
        <p className="signinhead" >Sign In</p>
        <br />
        <div ><p>Email:</p>
        
        <br />
        <TextField variant='outlined' className='signininput' />
        <br /><br />
        <p>Password:</p>
        
        <br />
        <TextField variant='outlined' className='signininput' type="password" />
        </div>
        <br />
        <button className='signinbutton'>Sign In</button>
        <br />
        <a href="">Don't have an account ?</a>
        

        
      </Card>
    </div>
  )
}

export default Signin
