import React,{useEffect,useState} from 'react'
import { useParams } from "react-router";
import {Product} from "../Product/Product";
import { useRecoilValue } from 'recoil';
import { productState } from '../../store/atoms/product';
import "../Singleproduct/Singleproduct.css"

type RouteParams={
    productId:string;
}
const Singleproduct = () => {
    const {productId}=useParams<RouteParams>();
    const [mainprod, setmainprod] = useState<Product|null>(null);
    const productatom=useRecoilValue(productState)

    const init=async()=>{
        console.log(productId);
        console.log(productatom.allproducts)
        const response= productatom.allproducts.find(product=>{
            
            return product._id?.toString()===productId
        })
        

        if (response) {
            console.log(response)
          setmainprod(response);
        } else {
          console.error("Product not found:", productId);
        }
    }

    useEffect(() => {

        init();
    }, []);
  return (
    <div className="singleproddiv">
      <div className="display-img-main">
        <div>
          <img src={mainprod?.productimg[0]} className="display-img" alt="" />
        </div>
        <div className="next-imgs-main">
          {mainprod?.productimg.map((prod) => {
            return (
              <div>
                <div className="next-imgs-div">
                  <img src={prod} alt="" className="next-imgs" />
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
          <p>Material Used : </p>
          <br />
          <div>
            <p>Composition:</p>
            <br />
            <div>Shell: Cotton 60%, Polyester 40% Hood lining:Cotton 100%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singleproduct
