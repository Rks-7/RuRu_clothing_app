import React, { useEffect, useState } from "react";
import "./Account.css";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { BASE_URL } from "../../config";
import axios from "axios";
import { TextField } from "@mui/material";

interface IAddress {
  pincode: number;
  state: string;
  address: string;
  town: string;
  city_district: string;
}

interface IUser {
  _id: string;
  username: string;
  email: string;
  mobileno: number;
  address: IAddress[];
  password: string;
  gender: string;
  bag: string[]; // Array of Product IDs
  wishlist: string[]; // Array of Product IDs
}
interface AccountDetailsProps {
  user: IUser | null;
}
const Account = () => {
  const User = useRecoilValue(userState);
  const [user, setuser] = useState<IUser | null>(null);

  const navigate = useNavigate();

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/getuserdetails`, {
        withCredentials: true,
      });
      console.log(response.data.userac);
      setuser(response.data.userac);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };
  useEffect(() => {
    if (User.userEmail == null) {
      navigate("/signin");
    } else {
      console.log("calling init");
      init();
    }
  }, []);

  if (User.userEmail == null) {
    return (
      <div className="circularprog">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="account-main">
      <div className="account-tab-main">
        <div className="account-tab">ORDERS</div>
        <div className="account-tab">ACCOUNT</div>
        <div className="account-tab">SIGN OUT</div>
      </div>

      <div>
        <div className="selection-div">
          <Accountdetails user={user} />
        </div>
      </div>
    </div>
  );
};

function Accountdetails({ user }: AccountDetailsProps) {
  const [username, setusername] = useState(user?.username);
  const [gender, setgender] = useState(user?.gender);
  const [mobileno, setmobileno] = useState(user?.mobileno);
  const [email, setemail] = useState(user?.email);
  const [address, setaddress] = useState<IAddress[]>([]);
  const [editInd, seteditInd] = useState(-1);

  useEffect(() => {
    if (user) {
      setusername(user.username);
      setgender(user.gender);
      setmobileno(user.mobileno);
      setemail(user.email);
      setaddress(user.address)
    }
  }, [user]);

  return (
    <div className="accountoption-section">
      <h3>Username:</h3>
      <br />
      <div className="usernametxt">
        <TextField
          label=""
          variant="outlined"
          value={username}
          onChange={(e: any) => {
            setusername(e.target.value);
          }}
        />
      </div>
      <br />
      <h3>Email:</h3>
      <br />
      <div className="combinediv">
        <div className="emailtxt">{user?.email}</div>
        <div className="editbtn">edit</div>
      </div>
      <br />
      <h3>Gender:</h3>
      <br />
      <div className="gendertxt">
        <div className="gendermain">
          <input
            type="radio"
            value="male"
            checked={gender === "male"}
            onChange={() => {
              setgender("male");
            }}
          />
          <p className="choosegender">Male</p>
        </div>

        <br />

        <div className="gendermain">
          <input
            type="radio"
            value="female"
            checked={gender === "female"}
            onChange={() => {
              setgender("female");
            }}
          />
          <p className="choosegender">Female</p>
        </div>
      </div>
      <br />
      <br />
      <h3>Mobile no:</h3>
      <br />
      <div className="combinediv">
        <div className="emailtxt">{user?.mobileno}</div>
        <div className="editbtn">edit</div>
      </div>
      <br />
      <h3>Address:</h3>
      <br />
      {address.map((adr, adrindex) => (
        <div className="addressdiv">
          <p className="emailtxt">Address {adrindex + 1}:</p>
          <br />
          {editInd != -1 ? (
            <div>
              <div className="addresseditmain">
                Address:
                <br />
                <TextField
                  label=""
                  variant="outlined"
                  fullWidth={true}
                  value={adr.address}
                  onChange={(e: any) => {
                    const updatedaddress = [...address];
                    updatedaddress[adrindex + 1].address = e.target.value;
                    setaddress(updatedaddress);
                  }}
                />
              </div>
              <br />
              <div className="cityandpincode">
                <div className="cityeditmain">
                  City:
                  <br />
                  <TextField
                    label=""
                    variant="outlined"
                    value={adr.city_district}
                    onChange={(e: any) => {
                      const updatedaddress = [...address];
                      updatedaddress[adrindex + 1].city_district =
                        e.target.value;
                      setaddress(updatedaddress);
                    }}
                  />
                </div>
                <div className="towneditmain">
                  Pincode:
                  <br />
                  <TextField
                    label=""
                    variant="outlined"
                    value={adr.pincode}
                    onChange={(e: any) => {
                      const updatedaddress = [...address];
                      updatedaddress[adrindex + 1].pincode = e.target.value;
                      setaddress(updatedaddress);
                    }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="cityandpincode">
                <div className="stateeditmain">
                  State:
                  <br />
                  <TextField
                    label=""
                    variant="outlined"
                    value={adr.state}
                    onChange={(e: any) => {
                      const updatedaddress = [...address];
                      updatedaddress[adrindex + 1].state = e.target.value;
                      setaddress(updatedaddress);
                    }}
                  />
                </div>
                <div className="towneditmain">
                  Town:
                  <br />
                  <TextField
                    label=""
                    variant="outlined"
                    value={adr.town}
                    onChange={(e: any) => {
                      const updatedaddress = [...address];
                      updatedaddress[adrindex + 1].town = e.target.value;
                      setaddress(updatedaddress);
                    }}
                  />
                </div>
              </div>
              <br />
                   
            </div>
          ) : (
            <div>
              <p>
                {adr.address}
                <br />
                {adr.city_district}
                <br />
                {adr.pincode}
                <br />
                {adr.state}
                <br />
                {adr.town}
              </p>
            </div>
          )}

          <br />
          <div
            className="editbtn"
            onClick={() => {
              seteditInd(adrindex + 1);
            }}
          >
            edit
          </div>
        </div>
      ))}
      <br />
      <div className="editbtn">Add address</div>
      <br />
    </div>
  );
}
export default Account;
