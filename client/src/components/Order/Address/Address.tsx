import { useState,useEffect } from "react";
import React from 'react'
import { BASE_URL } from "../../../config";
import axios from "axios";
import "./Address.css"

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
  mobileno: string;
  address: IAddress[];
  password: string;
  gender: string;
  bag: string[]; // Array of Product IDs
  wishlist: string[]; // Array of Product IDs
}
interface Ireview {
  username: string;
  productimg: [string];
  review: string;
}
interface IProduct{
    productname:string;
    category:string;
    count:number;
    productimg:[string];
    gender:string;
    colour:string;
    price:number;
    size:string;
    rating :number;
    reviews:[Ireview];
}
interface Iorder {
  orderedproduct: IProduct;
  quantity: number;
  orderowner: string;
  ordertotal: number;
  paid: string;
  deliveryadr: string;
  Tracking: string;
  placed: boolean;
}

const Address = () => {
    //schema has changed so add product again
    const [user, setuser] = useState<IUser | null>(null);
    const [order, setorder] = useState<Iorder[] | null>([]);
    const [addresslen, setaddresslen] = useState(0);
    const [addressindex, setaddressindex] = useState(-1);
    const [curradr, setcurradr] = useState<IAddress|null>(null);

     const init = async () => {
       try {
         const [userDetailsResponse,bagDetailsResponse] = await Promise.all([
            axios.get(`${BASE_URL}/user/getuserdetails`, {
           withCredentials: true,
         }),
         axios.get(`${BASE_URL}/user/getorderdetails`,{
            withCredentials:true,
         })
         ]) 
         console.log(userDetailsResponse.data.userac);
         console.log("Order details : ",bagDetailsResponse.data.orders);
         console.log(userDetailsResponse.data.userac.address.length);

         setuser(userDetailsResponse.data.userac);
         setorder(bagDetailsResponse.data.orders);
         setaddresslen(userDetailsResponse.data.userac.address.length);
       } catch (error) {
         console.error("Error fetching user details", error);
       }
     };
    useEffect(() => {
        
        init()

    }, []);

     const getOrderTotal = () => {
       if (order && order.length > 0) {
         return order[0].ordertotal;
       }
       return 0;
     };

  return (
    <div className="address">
      <div className="addressmain">
        <div className="addressdiv">
          <div className="addressheading">Address:</div>
          <div>select address : </div>
          <br />

          {user?.address.map((ad, index) => {
            return (
              <div>
                <div
                  className={`addressblock ${
                    addressindex === index ? "active" : ""
                  }`}
                  onClick={() => {
                    setaddressindex(index);
                    setcurradr(ad);
                  }}
                >
                  <div>{ad.address}</div>
                  <div className="twocombine">
                    <div>{ad.pincode}</div>
                    <div>{ad.state}</div>
                  </div>
                  <div className="twocombine">
                    <div>{ad.city_district}</div>
                    <div>{ad.town}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bill">
          <div>Bill:</div>
          <br />
          <div>
            {order?.map((p) => {
              return (
                <div className="oneproddiv">
                  <div>{p.orderedproduct.productname}</div>
                  <div>{p.quantity}X ₹{p.orderedproduct.price}</div>
                </div>
              );
            })}
          </div>
          <hr />
          <div className="ordertotal">Total: ₹{getOrderTotal()}</div>
          <br />
          <br />
          <div className="paydiv">
            <div className="paytxt">Proceed to pay</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address
