import { useState } from "react";
import { Product } from "../../Product/Product";
import { TextField } from "@mui/material";
import "./Addproduct.css"
import React from 'react'
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";


const Addproduct = () => {
  const navigate=useNavigate();
  const [productname, setproductname] = useState("");
  const [category, setcategory] = useState("");
  const [count, setcount] = useState(0);
  const [img, setimg] = useState("");
  const [productimg, setproductimg] = useState<string[]>([]);
  const [gender, setgender] = useState("");
  const [colour, setcolour] = useState("");
  const [price, setprice] = useState(0);
  const [size, setsize] = useState("");
  const [invalidcred, setinvalidcred] = useState(0);
 
  const [errors, seterrors] = useState({
    productname: false,
    category: false,
    count: false,
    price: false,
    gender: false,
    colour: false,
    size: false,
    img: false,
  });


  const handleSaveprod=async()=>{
    setinvalidcred(0);
    const newErrors = {
      productname: !productname,
      category: !category,
      count: count<=0,
      price: price<=0,
      gender: !gender,
      colour: !colour,
      size: !size,
      img: productimg?.length==0,
    };

    seterrors(newErrors);

    const isValid=Object.values(newErrors).every((error)=>!error);

    if(isValid){
      try {
          const response = await axios.post(
            `${BASE_URL}/admin/addproduct`,
            {
              productimg,
              productname,
              count,
              colour,
              price,
              gender,
              size,
              category,
            },
            {
              withCredentials: true,
            }
          );

          console.log(response.data);
          if(response.status==200){
            alert('product saved successfully!')
            navigate('/')
          }
          
      } catch (error) {
        setinvalidcred(1);
        console.log("error happened in axios: ",error);
      }
      

      
    }else{
      setinvalidcred(1);
    }
    
  }

  
  return (
    <div className="apmaindiv">
      <div className="namediv">
        <div className="productdiv">
          <div className="prodblock">
            <div className="addprodtitle">ADD PRODUCT :</div>
            <div className="prodheading">
              <p className="subhead">product name:</p>
            </div>

            <TextField
              variant="outlined"
              value={productname}
              onChange={(e) => {
                setproductname(e.target.value);
              }}
            />
          </div>

          <div className="prodblock">
            <div className="prodheading">
              <p className="subhead">Category:</p>
            </div>

            <TextField
              variant="outlined"
              value={category}
              onChange={(e) => {
                setcategory(e.target.value);
              }}
            />
          </div>
          <div className="prodblock">
            <div className="prodheading">
              <p className="subhead">price(in INR):</p>
            </div>

            <TextField
              variant="outlined"
              type="number"
              value={price}
              onChange={(e) => {
                setprice(Number(e.target.value));
              }}
            />
          </div>

          <div className="smallblocks">
            <div className="smalldiv">
              <div className="prodheading">
                <p className="subhead">count:</p>
              </div>

              <TextField
                className="smalltxt"
                variant="outlined"
                type="number"
                value={count}
                onChange={(e) => {
                  setcount(Number(e.target.value));
                }}
              />
            </div>
            <div className="smalldiv">
              <div className="prodheading">
                <p className="subhead">Gender:</p>
              </div>

              <TextField
                className="smalltxt"
                variant="outlined"
                value={gender}
                onChange={(e) => {
                  setgender(e.target.value);
                }}
              />
            </div>
            <div className="smalldiv">
              <div className="prodheading">
                <p className="subhead">Size:</p>
              </div>

              <TextField
                className="smalltxt"
                variant="outlined"
                value={size}
                onChange={(e) => {
                  setsize(e.target.value);
                }}
              />
            </div>
            <div className="smalldiv">
              <div className="prodheading">
                <p className="subhead">colour:</p>
              </div>

              <TextField
                className="smalltxt"
                variant="outlined"
                value={colour}
                onChange={(e) => {
                  setcolour(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="categorydiv">
          <div className="prodimages">
            <p className="subhead">Images:</p>
            <div>
              <TextField
                variant="outlined"
                value={img}
                onChange={(e) => {
                  setimg(e.target.value);
                }}
              />
              <div className="adddiv">
                <div
                  className="addbtn"
                  onClick={() => {
                    const ispresent = productimg?.includes(img);
                    if (!ispresent && productimg && img != "") {
                      setproductimg([...productimg, img]);
                      setimg("");
                    }
                  }}
                >
                  Add
                </div>
              </div>
            </div>

            <div className="displayimgs">
              {productimg?.map((i, ind) => {
                return (
                  <div className="addimgdiv">
                    <img src={i} alt="h" className="disimg" />
                    <div
                      className="dltbtn"
                      onClick={() => {
                        const updatedarr = productimg.filter(
                          (_, index) => index !== ind
                        );
                        setproductimg(updatedarr);
                      }}
                    >
                      delete
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="addprodsave" onClick={() => handleSaveprod()}>
            Save
          </div>
          <br />

          {invalidcred == 1 && (
            <div className="warningtxt">something went wrong !</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Addproduct
