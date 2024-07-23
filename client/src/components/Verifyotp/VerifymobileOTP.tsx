import React, { useState } from "react";
import { useParams } from "react-router";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Verify.css";
import { BASE_URL } from "../../config";
import axios from "axios";
type RouteParams = {
  userId: string;
  mobileno:string;
};
type Route2Params = {
  id: string;
};
const VerifymobileOTP = () => {
  const navigate = useNavigate();
  const [otpno, setotpno] = useState<number>(0);
  const { userId,mobileno } = useParams<RouteParams>();
  const { id } = useParams<Route2Params>();
  const [errormsg, seterrormsg] = useState("");

  const handleverification = async () => {
    try {
      seterrormsg("");
      const response = await axios.post(
        `${BASE_URL}/user/verifyOTP/${userId}/${mobileno}`,
        {
          otp: otpno,
        }
      );
      if (response.status == 200) {
        // seterrormsg(response)
        console.log("otp verified successfully", response);

        navigate("/account");
      }
    } catch (error: any) {
      console.log("error ::", error.response.data.msg);
      seterrormsg(error.response.data.msg);
    }
  };
  return (
    <div className="otpmain">
      <div className="otpdiv">
        <div className="otptextbox">
          <TextField
            variant="outlined"
            className="signininput"
            id="username"
            label="OTP"
            onChange={(e: any) => {
              setotpno(e.target.value);
            }}
          />
        </div>
        <div className="btndiv">
          <div className="editbtn" onClick={handleverification}>
            Verify
          </div>
          <div className="editbtn">Resend</div>
        </div>
        <br />
        <div className="errormsg">{errormsg}</div>
      </div>
    </div>
  );
};

export default VerifymobileOTP;
