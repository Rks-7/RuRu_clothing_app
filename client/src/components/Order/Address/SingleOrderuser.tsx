import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Iorder } from "../../Admin/Orderadmin/Orderadmin";
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
const SingleOrderuser = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<RouteParams>();
  const [mainprod, setmainprod] = useState<Iorder | null>(null);
  const [currimg, setcurrimg] = useState("");
  const [ordername, setordername] = useState("");
  const [quantity, setquantity] = useState(0);
  const [colour, setcolour] = useState("");
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

  
  const init = async () => {
    const getresponse = await axios.get(`${BASE_URL}/user/allorders`, {
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
      setpaid(response.paid);
      setquantity(response.quantity);
      settracking(response.Tracking);
      setcurrimg(response.orderedproduct.productimg[0]);
      setordertotal(response.ordertotal);
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
            <p className="ordername">{ordername}</p>
          </div>

          <br />

          <br />
          <div className="addrdiv">
            <div className="addrsubdiv">
              <p className="subhead">quantity: {quantity}</p>
            </div>
            <br />
            <div className="addrsubdiv">
              <p className="subhead">colour: {colour} </p>
            </div>
          </div>
          <br />

          <div className="addrsubdiv">
            <p className="subhead">paid: {paid}</p>
            <br />
          </div>

          <div className="addrsubdiv">
            <p className="subhead">
              tracking: <p className="trackingtxt">{tracking}</p>
            </p>
            <br />
          </div>

          <div>
            <p className="subhead">order total: {ordertotal}</p>
            <br />
          </div>
          <br />
          <div>
            <div>
              <p className="subhead">Address: {addr?.address} </p>
            </div>
            <br />
            <div className="addrdiv">
              <div className="addrsubdiv">
                <p className="subhead">pincode: {addr?.pincode}</p>
              </div>
              <br />
              <div className="addrsubdiv">
                <p className="subhead">town: {addr?.town}</p>
              </div>
            </div>
            <br />
            <div className="addrdiv">
              <div className="addrsubdiv">
                <p className="subhead">state: {addr?.state}</p>
              </div>
              <br />
              <div className="addrsubdiv">
                <p className="subhead">city: {addr?.city_district}</p>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default SingleOrderuser;
