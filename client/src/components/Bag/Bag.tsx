import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { useNavigate } from "react-router-dom";
import "./Bag.css";
import { PiBagSimpleBold } from "react-icons/pi";

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
interface Iproduct {
  productname: string;
  category: string;
  count: number;
  productimg: [string];
  gender: string;
  colour: string;
  price: number;
  size: string;
  rating: Number;
  reviews: Ireview[];
}
interface IBagItem {
  prod: Iproduct;
  quantity: number;
  _id: string;
}

const Bag = () => {
  const navigate = useNavigate();
  const User = useRecoilValue(userState);
  const [bagItems, setbagItems] = useState<IBagItem[] | null>([]);
  const [user, setuser] = useState<IUser | null>(null);

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/getbag`, {
        withCredentials: true,
      });
      console.log(response.data.bag);
      setbagItems(response.data.bag);
    } catch (error) {
      console.error("Error fetching bag details", error);
    }
  };
  const handleMinus = (id: string) => {
    setbagItems((prevbagItem) => {
      if (!prevbagItem) return prevbagItem;

      return prevbagItem.map((item) =>
        item._id == id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleRemoval = (id: string) => {
    setbagItems((prevbagItem) => {
      if (!prevbagItem) return prevbagItem;

      return prevbagItem.filter((item) => item._id !== id);
    });
  };

  const handlePlus = (id: string) => {
    setbagItems((prevbagItem) => {
      if (!prevbagItem) return prevbagItem;

      return prevbagItem.map((item) =>
        item._id == id && item.quantity<item.prod.count ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const handleNext=async()=>{
      const response = await axios.post(`${BASE_URL}/user/addorder`,{bag:bagItems}, {
        withCredentials: true,
      });

      console.log(response.data);
      navigate('/address')
  }
  useEffect(() => {
    if (User.userEmail == null) {
      return;
    } else {
      console.log("calling init");
      init();
    }
  }, []);
  return (
    <div>
      {bagItems && bagItems.length > 0 ? (
        <div>
          <div className="bagmain">
            {bagItems?.map((p) => {
              return (
                <div>
                  <SingleBag
                    p={p}
                    onMinus={handleMinus}
                    onPlus={handlePlus}
                    onRemove={handleRemoval}
                  />
                </div>
              );
            })}
            <div className="nextbuttonmain">
              <div className="nextbutton" onClick={() => handleNext()}>
                Next
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="emptybag">
          <div className="flexrow">
            <div>
              <div>
                <div>
                  <PiBagSimpleBold className="emptybaglogo" />
                </div>
                <div className="emptybagtxt">Bag is empty !</div>
              </div>
              <div className="nextbuttonmain">
                <div
                  className="nextbutton"
                  onClick={() => navigate("/product")}
                >
                  Shop
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



interface ProductType {
  p: IBagItem;
  onMinus: (id: string) => void;
  onPlus: (id: string) => void;
  onRemove: (id: string) => void;
}

function SingleBag({ p, onMinus, onPlus , onRemove }: ProductType) {
  return (
    <div>
      <div className="bagcard">
        <div className="imgdiv">
          <img src={p.prod.productimg[0]} alt="" className="imgbag" />
        </div>
        <div className="productinfo">
          <p className="productname">{p.prod.productname}</p>
          <div className="productdetail">
            <p className="productgender">gender: {p.prod.gender}</p>
            <p className="productsize">size: {p.prod.size}</p>
          </div>
        </div>
        <div className="productpriceinfo">
          <div className="productprice">₹{p.prod.price}</div>
          <div className="quantity">
            <div className="quantityflex">
              <div className="circle" onClick={() => onMinus(p._id)}>
                -
              </div>
              <div>{p.quantity}</div>
              <div className="circle" onClick={() => onPlus(p._id)}>
                +
              </div>
            </div>
          </div>
          <div className="productremove" onClick={()=>onRemove(p._id)}>remove</div>
        </div>
      </div>
    </div>
  );
}

export default Bag;
