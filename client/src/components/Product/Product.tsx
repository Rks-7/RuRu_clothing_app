import { Card, TextField, dialogClasses } from '@mui/material'
import React,{useEffect, useState} from 'react'
import blackwhite from "../../assets/blackwhite.jpeg";
import "./Product.css"
import axios from "axios"
import { BASE_URL } from '../../config';
import { FaSearch } from "react-icons/fa";


interface Review {
  username: string;
  productimg: string[];
  review: string;
}

interface Product {
  productname: string;
  category: string;
  count: number;
  productimg: string[];
  gender: string;
  colour: string;
  price: number;
  size: string;
  rating: number;
  reviews: Review[];
}

const Product = () => {
        const [products, setproducts] = useState<Product[]>([]);
        const productsPerpage=16;
        const [currentPage, setcurrentPage] = useState(1);
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const indexoflastproduct=currentPage*productsPerpage;
    const indexoffirstproduct=indexoflastproduct-productsPerpage;
    const currentproducts=products.slice(indexoffirstproduct,indexoflastproduct);


    const pagination=(pageNumber:number)=>{
        setcurrentPage(pageNumber);
    }

     const toggleDropdown = () => {
       setIsDropdownOpen(!isDropdownOpen);
     };

    const init=async()=>{
        const response=await axios.get(`${BASE_URL}/user/getallproducts`);
        setproducts(response.data.products);
    }

    useEffect(() => {
        init();
    }, []);

  return (
    <div className="product-main">
      <div>
        <div className="filter-main">
          <div className="filter-text">
            <div className="product-account" onClick={toggleDropdown}>
              <p>SORT BY</p>
              {isDropdownOpen && (
                <div className="product-dropdown-content">
                  <div>PRICE (Low To High)</div>
                  <div>PRICE (High To Low)</div>
                  <div>RATING</div>
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleDropdown}>
              <p>COLOUR</p>
              {isDropdownOpen && (
                <div className="product-dropdown-content">
                  <div>PRICE (Low To High)</div>
                  <div>PRICE (High To Low)</div>
                  <div>RATING</div>
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleDropdown}>
              <p>SIZE</p>
              {isDropdownOpen && (
                <div className="product-dropdown-content">
                  <div>PRICE (Low To High)</div>
                  <div>PRICE (High To Low)</div>
                  <div>RATING</div>
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleDropdown}>
              <p>GENDER</p>
              {isDropdownOpen && (
                <div className="product-dropdown-content">
                  <div>PRICE (Low To High)</div>
                  <div>PRICE (High To Low)</div>
                  <div>RATING</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <input type="text" className="searchbar" />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>
      <Products products={currentproducts} />

      <PaginationCard
        productsPerpage={productsPerpage}
        totalproducts={products.length}
        pagination={pagination}
        currentPage={currentPage}
      />
    </div>
  );
}

interface ProductsProps {
  products: Product[];
}

function Products({products}:ProductsProps){
    return <div>
        <div className='productcard-main'>
            {
                products.map(product=>{
                    return <ProductCard product={product}/>
                })
            }
        </div>
    </div>
}
interface ProductCardProps {
  product: Product;
}
function ProductCard({product}:ProductCardProps){
    return (
      <div>
        <Card className="product-card">
            <img src={product.productimg[0] || blackwhite} alt={product.productname} className="product-img" />
            <br />
            <div className='product-description'>
                <p>{product.productname}</p>
                
                <p className='product-price'>${product.price}</p>
            </div>
        </Card>
      
      </div>
    );
}

interface PaginationCardProps{
    productsPerpage:number;
     totalproducts:number;
     pagination:(pageNumber:number)=>void;
    currentPage:number;
}

function PaginationCard({productsPerpage,totalproducts,pagination,currentPage}:PaginationCardProps){

        const pageNumbers=[];

        for(let i=1;i<=Math.ceil(totalproducts/productsPerpage);i++){
            pageNumbers.push(i);
        }

        return (
          <div className="pagination-main">
            {pageNumbers.map((pageNumber) => (
              <div
                className={`page-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
                onClick={() => pagination(pageNumber)}
              >
                <a className="pagination-link">{pageNumber}</a>
              </div>
            ))}
          </div>
        );
}
export default Product
