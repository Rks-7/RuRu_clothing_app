import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Iorder } from "./Orderadmin";
import "../../Singleproduct/Singleproduct.css";
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import axios from "axios";
import { IAddress } from "../../Account/Account";
import Footer from "../../Footer/Footer";
import TextField from "@mui/material/TextField";

type RouteParams = {
  orderId: string;
};
const Singleorder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<RouteParams>();
  const [mainprod, setmainprod] = useState<Iorder | null>(null);
  const [currimg, setcurrimg] = useState("");
  const [ordername, setordername] = useState("");
  const [quantity, setquantity] = useState(0);
  const [colour, setcolour] = useState("");
  const [orderowner, setorderowner] = useState("");
  const [paid, setpaid] = useState("");
  const [ordertotal, setordertotal] = useState(0);
  const [tracking, settracking] = useState("");
  const [addr, setaddr] = useState<IAddress | null>({
    pincode: 0,
    state: "",
    address: "",
    town: "",
    city_district: "",
  });


  const handleOrderupdate=async()=>{
    const response=await axios.post(`${BASE_URL}/admin/editorder/${orderId}`,{
        quantity: quantity,
        orderowner: orderowner,
        ordertotal: ordertotal,
        paid: paid,
        deliveryadr: addr,
        Tracking: tracking,
    },{
        withCredentials:true
    })

    if(response.status==200){
        alert("Order details updated successfully !")
        navigate("/adminorders")
    }
  }
  const init = async () => {
    const getresponse = await axios.get(`${BASE_URL}/admin/allorders`, {
      withCredentials: true,
    });
    const data: Iorder[] = getresponse.data.orders;

    const response = data.find((product) => {
      return product._id?.toString() === orderId;
    });

    

    if (response) {
      console.log(response);
      setmainprod(response);
      setaddr(response.deliveryadr);
      setcolour(response.orderedproduct.colour);
      setordername(response.orderedproduct.productname);
      setorderowner(response.orderowner);
      setpaid(response.paid);
      setquantity(response.quantity);
      settracking(response.Tracking);
      setcurrimg(response.orderedproduct.productimg[0]);
      setordertotal(response.ordertotal)
    } else {
      console.error("Product not found:", orderId);
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="prodmaindiv">
        
      <div className="singleproddiv">
        
        <div className="display-img-main">
          <div>
            <img src={currimg} className="display-img" alt="" />
          </div>
          <div className="next-imgs-main">
            {mainprod?.orderedproduct.productimg.map((prod) => {
              return (
                <div>
                  <div className="next-imgs-div">
                    <img
                      src={prod}
                      alt=""
                      className="next-imgs"
                      onClick={() => {
                        setcurrimg(prod);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="singleprod-desc">
          <div>
            <p className="subhead">Product Name: </p>
            <TextField
              variant="outlined"
              value={ordername}
              onChange={(e) => {
                setordername(e.target.value);
              }}
            />
          </div>

          <br />

          <br />
          <div className="addrdiv">
            <div className="addrsubdiv">
              <p className="subhead">quantity:</p>
              <TextField
                variant="outlined"
                value={quantity}
                onChange={(e) => {
                  setquantity(Number(e.target.value));
                }}
              />
            </div>
            <br />
            <div className="addrsubdiv">
              <p className="subhead">colour: </p>
              <TextField
                variant="outlined"
                value={colour}
                onChange={(e) => {
                  setcolour(e.target.value);
                }}
              />
            </div>
          </div>
          <br />
          <div>
            <p className="subhead">Order Owner:</p>
            <br />
            <TextField
              variant="outlined"
              value={orderowner}
              onChange={(e) => {
                setorderowner(e.target.value);
              }}
            />
          </div>
          <br />
          <div className="addrdiv">
            <div className="addrsubdiv">
              <p className="subhead">paid:</p>
              <br />
              <TextField
                variant="outlined"
                value={paid}
                onChange={(e) => {
                  setpaid(e.target.value);
                }}
              />
            </div>

            <div className="addrsubdiv">
              <p className="subhead">tracking:</p>
              <br />
              <TextField
                variant="outlined"
                value={tracking}
                onChange={(e) => {
                  settracking(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <p className="subhead">order total:</p>
            <br />
            <TextField
                variant="outlined"
                value={ordertotal}
                onChange={(e) => {
                  setordertotal(Number(e.target.value));
                }}
              />
          </div>

          <br />
          <div>
            <div>
              <p className="subhead">Address: </p>
              <TextField
                variant="outlined"
                value={addr?.address}
                onChange={(e) => {
                  if (addr) {
                    setaddr({ ...addr, address: e.target.value });
                  }
                }}
              />
            </div>
            <br />
            <div className="addrdiv">
              <div className="addrsubdiv">
                <p className="subhead">pincode:</p>
                <TextField
                  variant="outlined"
                  value={addr?.pincode}
                  onChange={(e) => {
                    const pin = Number(e.target.value);
                    if (addr) {
                      setaddr({ ...addr, pincode: pin });
                    }
                  }}
                />
              </div>
              <br />
              <div className="addrsubdiv">
                <p className="subhead">town:</p>
                <TextField
                  variant="outlined"
                  value={addr?.town}
                  onChange={(e) => {
                    if (addr) {
                      setaddr({ ...addr, town: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
            <br />
            <div className="addrdiv">
              <div className="addrsubdiv">
                <p className="subhead">state:</p>
                <TextField
                  variant="outlined"
                  value={addr?.state}
                  onChange={(e) => {
                    if (addr) {
                      setaddr({ ...addr, state: e.target.value });
                    }
                  }}
                />
              </div>
              <br />
              <div className="addrsubdiv">
                <p className="subhead">city:</p>
                <TextField
                  variant="outlined"
                  value={addr?.city_district}
                  onChange={(e) => {
                    if (addr) {
                      setaddr({ ...addr, city_district: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
            <br />
            <div className="addtobag" onClick={() => handleOrderupdate()}>
              <p>Update</p>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Singleorder;
