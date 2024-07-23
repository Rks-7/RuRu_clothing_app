import React, { useEffect, useState } from "react";
import "./Account.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { BASE_URL } from "../../config";
import axios from "axios";
import { TextField } from "@mui/material";

export interface IAddress {
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
  mobileno: string;
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
  const setUser=useSetRecoilState(userState)
  const [user, setuser] = useState<IUser | null>(null);
  const [sectionNo, setsectionNo] = useState(1);

  const navigate = useNavigate();
  
  const handlelogout=async()=>{
    const response = await axios.post(`${BASE_URL}/user/logout`);
    console.log(response);
    setUser({ isLoading: false, userEmail: null, userRole: null });
    navigate("/");
  }
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
        <div className="account-tab" onClick={() => navigate('/userorders')}>
          ORDERS
        </div>
        <div className="account-tab" onClick={() => setsectionNo(1)}>
          ACCOUNT
        </div>
        <div className="account-tab" onClick={handlelogout}>SIGN OUT</div>
      </div>

      <div>
        <div className="selection-div">
          {sectionNo == 0 ? (
            <div>
              hello
            </div>
          ) : (
            <div>
              <Accountdetails user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Accountdetails({ user }: AccountDetailsProps) {
  const navigate=useNavigate();
  const [gender, setgender] = useState(user?.gender);
  const [mobileno, setmobileno] = useState(user?.mobileno);
  const [email, setemail] = useState(user?.email);
  const [address, setaddress] = useState<IAddress[]>([]);
  const [editInd, seteditInd] = useState(-1);
  const [editMob, seteditMob] = useState(-1);
  const [errormsg, seterrormsg] = useState("");

  useEffect(() => {
    if (user) {
      setgender(user.gender);
      setmobileno(user.mobileno);
      setemail(user.email);
      setaddress(user.address)
    }
  }, [user]);

  const handleAddquestions=async()=>{
    setaddress([
      ...address,
      {
        pincode: 0,
        state: "",
        address: "",
        town: "",
        city_district: "",
      },
    ]);

    seteditInd(address.length + 1);
  }

  const Submitaccountdetails=async()=>{
    const response = await axios.post(
      `${BASE_URL}/user/updateuserdetails`,
      {
        gender:gender,
        mobileno:mobileno,
        email:email,
        address:address
      },
      {
        withCredentials: true,
      }
    );

    if(response.status==403){
      console.log("response ::: ", response.data.msg);
      seterrormsg(response.data.msg);
    }
    
  }

  const handleDelete=(index:number)=>{
   const updatedAddress = [...address]; 
   updatedAddress.splice(index, 1); 
   setaddress(updatedAddress); 
  
  }

  const handlemobilesubmit=async(mobileno:string)=>{
    try {
         const response = await axios.post(`${BASE_URL}/user/sendmobileotp`,{
          id:user?._id,
          mobileno:mobileno
         });

         navigate("/verifymobileOTP/" + user?._id + "/" + mobileno);
    } catch (error:any) {
      console.error("Error fetching user details", error);
    }
   
  }
      

  return (
    <div className="accountoption-section">
      <h3>Username:</h3>
      <br />
      <div className="editbtn">{user?.username}</div>
      <br />
      <h3>Email:</h3>
      <br />

      <div className="combinediv">
        <div className="emailtxt">{user?.email}</div>
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
        {editMob != 1 ? (
          <div className="combinediv">
            <div className="emailtxt">{user?.mobileno}</div>
            <div className="editbtn" onClick={async() => {
              seteditMob(1)
              const response = await axios.post(`${BASE_URL}/user/updateuserdetails`,{
                verifiedmobile:false,
                mobileno:""
              })
              console.log(response);
            }}>
              edit
            </div>
          </div>
        ) : (
          <div className="combinediv">
            <TextField
              label=""
              variant="outlined"
              value={mobileno}
              onChange={(e: any) => {
                setmobileno(e.target.value);
              }}
            />
            <div className="editbtn" onClick={() => {
              if(mobileno)
              handlemobilesubmit(mobileno)}}>
              save
            </div>
          </div>
        )}
      </div>
      <br />
      <h3>Address:</h3>
      <br />
      {address.map((adr, adrindex) => (
        <div className="addressdiv">
          <p className="emailtxt">Address {adrindex + 1}:</p>
          <br />
          {editInd == adrindex + 1 ? (
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
                    updatedaddress[adrindex].address = e.target.value;
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
                      updatedaddress[adrindex].city_district = e.target.value;
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
                      updatedaddress[adrindex].pincode = e.target.value;
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
                      updatedaddress[adrindex].state = e.target.value;
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
                      updatedaddress[adrindex].town = e.target.value;
                      setaddress(updatedaddress);
                    }}
                  />
                </div>
              </div>
              <br />
              <div>
                <div
                  className="editbtn"
                  onClick={() => {
                    seteditInd(-1);
                  }}
                >
                  Save
                </div>
              </div>
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
          {editInd == -1 && (
            <div className="combinediv">
              <div
                className="editbtn"
                onClick={() => {
                  seteditInd(adrindex + 1);
                }}
              >
                edit
              </div>
              <div
                className="editbtndelete"
                onClick={() => handleDelete(adrindex)}
              >
                delete
              </div>
            </div>
          )}
        </div>
      ))}
      <br />
      <div className="editbtn" onClick={handleAddquestions}>
        Add address
      </div>
      <br />
      <br /><br />
      <div className="savebtn" onClick={Submitaccountdetails}>Save details</div>
      <div className="errormsg">
        {errormsg}
      </div>
    </div>
  );
}
export default Account;
