import React,{useEffect,useState} from 'react'
import { useParams } from "react-router";
import {Product} from "../Product/Product";
import "../Singleproduct/Singleproduct.css"
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';
import axios from 'axios';


type RouteParams={
    productId:string;
}
const Singleproduct = () => {
    const navigate=useNavigate();
    const {productId}=useParams<RouteParams>();
    const [mainprod, setmainprod] = useState<Product|null>(null);
    const [relatedprod, setrelatedprod] = useState<Product[]>([]);
    const [currimg, setcurrimg] = useState("");


    const init=async()=>{
            const getresponse=await axios.get(`${BASE_URL}/user/getallproducts`)
            const data: Product[] = getresponse.data.products;
            

           
        const response=data.find(product=>{
            
            return product._id?.toString()===productId
        })

         let filtereddata=data.filter(prod=> prod._id?.toString()!==productId).filter(p=> p.category===response?.category).filter(p=>p.gender===response?.gender);
         if(filtereddata.length==0){
           filtereddata = data.filter(
              (prod) => prod._id?.toString() !== productId
            ).filter(prod => prod.gender==response?.gender);
            
         }
         const relateddata=filtereddata.slice(0,4);
         setrelatedprod(relateddata);
        

        if (response) {
            console.log(response)
          setmainprod(response);
          setcurrimg(response.productimg[0]);

        } else {
          console.error("Product not found:", productId);
        }

        
    }

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
            {mainprod?.productimg.map((prod) => {
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
          <p className="mainprod-productname">{mainprod?.productname}</p>
          <br />
          <div>Rating: {mainprod?.rating}</div>
          <br />
          <div>
            <p className="mainprod-price-mrp">MRP inclusive of taxes</p>

            <p className="mainprod-price">₹{mainprod?.price}</p>
          </div>
          <br />
          <div>
            <p>colour: </p>
            <br />
            <div className="mainprod-colour">{mainprod?.colour}</div>
          </div>
          <br />
          <div>
            <p>sizes:</p>
            <br />
            <div className="mainprod-colour">{mainprod?.size}</div>
          </div>
          <br />
          <div className="addtobag">
            <p>ADD TO BAG</p>
          </div>
          <br />
          <div className="materialused">
            <div className="materialheadingdiv">
              <p className="materials">Materials : </p>
            </div>

            <br />
            <div>
              <p>
                {" "}
                <b> Composition:</b>
              </p>
              <br />
              <div>
                <p className="">
                  {" "}
                  <b>Shell:</b> Cotton 60%, Polyester 40%{" "}
                </p>
                <br />
                <p>
                  {" "}
                  <b>Hood lining: </b> Cotton 100%
                </p>
              </div>
            </div>
          </div>
          <br />
          <div className="materialused">
            <div className="materialheadingdiv">
              <p className="materials">Care guide : </p>
            </div>

            <br />
            <div>
              <div>
                <p>
                  You too can help the environment and make fashion more
                  sustainable. Bring unwanted clothes or home textiles to any
                  RuRu store and they will be reworn, reused or recycled.
                </p>
                <br />
                <p>
                  <b className="caretext">Care Instructions</b>
                </p>
                <br />
                <ul>
                  <li className="carebulletpoint">Line dry</li>
                  <li className="carebulletpoint">
                    Only non-chlorine bleach when needed
                  </li>
                  <li className="carebulletpoint">Machine wash at 40°</li>
                  <li className="carebulletpoint">Medium iron</li>
                  <li className="carebulletpoint">Can be dry cleaned</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relatedmain">
        <div className="relatedproductdiv">
          <div className="relatedcarousel">
            {relatedprod.map((prod) => {
              return (
                <div>
                  <a href={`/product/${prod?._id}`}>
                    <Card className="product-card">
                      <img
                        src={prod?.productimg[0]}
                        alt={prod?.productname}
                        className="product-img"
                      />
                      <br />
                      <div className="product-description">
                        <p>{prod?.productname}</p>

                        <p className="product-price">₹{prod?.price}</p>
                      </div>
                    </Card>
                  </a>
                </div>
              );
            })}
          </div>
          <div className="seemorebtnmain">
            <a href="/product">
              <div className="seemorebtn">SEE MORE</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singleproduct
