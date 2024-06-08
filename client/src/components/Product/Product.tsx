import { Card, TextField, dialogClasses } from "@mui/material";
import React, { useEffect, useState } from "react";
import blackwhite from "../../assets/blackwhite.jpeg";
import "./Product.css";
import axios from "axios";
import { BASE_URL } from "../../config";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ObjectId } from "bson";
import { useSetRecoilState } from "recoil";
import { productState } from "../../store/atoms/product";
import Footer from "../Footer/Footer";

interface Review {
  _id: ObjectId;
  username: string;
  productimg: string[];
  review: string;
}

export interface Product {
    _id:ObjectId
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
  const [allproducts, setallproducts] = useState<Product[]>([]);
  const productsPerpage = 16;
  const [currentPage, setcurrentPage] = useState(1);
  const [isSortbyDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sizes, setsizes] = useState<string[]>([]);
  const [categories, setcategories] = useState<string[]>([]);
  const [colours, setcolours] = useState<string[]>([]);
  const [isColourDropdownOpen, setIsColourDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchtext, setsearchtext] = useState("");
  const [sizeactivetag, setsizeactivetag] = useState("");
  const [colouractivetag, setcolouractivetag] = useState("");
  const [genderactivetag, setgenderactivetag] = useState("");
  const [sortbyactivetag, setsortbyactivetag] = useState("");
  const [categoryactivetag, setcategoryactivetag] = useState("");
  const setProductState=useSetRecoilState(productState);

  

  const indexoflastproduct = currentPage * productsPerpage;
  const indexoffirstproduct = indexoflastproduct - productsPerpage;
  const currentproducts = products.slice(
    indexoffirstproduct,
    indexoflastproduct
  );

  const pagination = (pageNumber: number) => {
    setcurrentPage(pageNumber);
  };

  const getcolour = (colour: string) => {
    const data: Product[] = products.filter((product) => {
      return product.colour === colour;
    });
    console.log(data);
    setproducts(data);
    setcolouractivetag(colour);
  };

  const getsize = (size: string) => {
    const data: Product[] = products.filter((product) => {
      return product.size === size;
    });
    console.log(products);
    console.log(data);
    setproducts(data);
    setsizeactivetag(size);
  };

  const getcategory = (category: string) => {
    const data: Product[] = products.filter((product) => {
      return product.category === category;
    });
    console.log(products);
    console.log(data);
    setproducts(data);
    setcategoryactivetag(category);
  };

  const getgender = (gender: string) => {
    const data: Product[] = products.filter((product) => {
      return product.gender === gender;
    });
    console.log(data);
    setproducts(data);
    setgenderactivetag(gender);
  };

  const LowtoHigh = () => {
    const data = products.sort((a, b) => {
      if (a.price < b.price) return -1;
      if (a.price > b.price) return 1;
      return 0;
    });

    setproducts(data);
    setsortbyactivetag("LowtoHigh");
  };

  const HightoLow = () => {
    const data = products.sort((a, b) => {
      if (a.price < b.price) return 1;
      if (a.price > b.price) return -1;
      return 0;
      
    });

    setproducts(data);
    setsortbyactivetag("HightoLow");
  };

  const sortRating = () => {
    const data = products.sort((a, b) => {
      if (a.rating < b.rating) return 1;
      if (a.rating > b.rating) return -1;
      return 0;
    });

    setproducts(data);
    setsortbyactivetag("sortRating");
  };

  const toggleReset=()=>{
    setproducts(allproducts);
    setsizeactivetag("");
    setcolouractivetag("");
    setgenderactivetag("");
    setcategoryactivetag("");
    setsortbyactivetag("");
  }
  const toggleSortbyDropdown = () => {
    setIsDropdownOpen(!isSortbyDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleColourDropdown = () => {
    setIsColourDropdownOpen(!isColourDropdownOpen);
  };

  const toggleSizeDropdown = () => {
    setIsSizeDropdownOpen(!isSizeDropdownOpen);
  };

  const toggleGenderDropdown = () => {
    setIsGenderDropdownOpen(!isGenderDropdownOpen);
  };
  
  const toggleSearch=(searchtext:String)=>{
    if(searchtext){
        const data = allproducts.filter((product) =>
          product.productname.toLowerCase().includes(searchtext.toLowerCase())
        );
        setproducts(data);
    }else{
        setproducts(allproducts);
    }
    
  }

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/getallproducts`);
      const data: Product[] = response.data.products;
      setproducts(data);
      setallproducts(data);
      setProductState({isLoading:false,allproducts:data});


      // Extract unique sizes and colours
      const uniqueSizes = Array.from(
        new Set(data.map((product) => product.size))
      );
      const uniqueColours = Array.from(
        new Set(data.map((product) => product.colour))
      );
      const uniqueCategories = Array.from(
        new Set(data.map((product) => product.category))
      );
    setcategories(uniqueCategories);
      setsizes(uniqueSizes);
      setcolours(uniqueColours);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="product-main">
      <div>
        <div className="filter-main">
          <div className="filter-text">
            <div className="product-account" onClick={toggleSortbyDropdown}>
              <p>SORT BY</p>
              {isSortbyDropdownOpen && (
                <div className="product-dropdown-content">
                  <div
                    onClick={() => LowtoHigh()}
                    className={`option ${
                      sortbyactivetag === "LowtoHigh" ? "active" : ""
                    }`}
                  >
                    PRICE (Low To High)
                  </div>
                  <div
                    onClick={() => HightoLow()}
                    className={`option ${
                      sortbyactivetag === "HightoLow" ? "active" : ""
                    }`}
                  >
                    PRICE (High To Low)
                  </div>
                  <div
                    onClick={() => sortRating()}
                    className={`option ${
                      sortbyactivetag === "sortRating" ? "active" : ""
                    }`}
                  >
                    RATING
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleColourDropdown}>
              <p>COLOUR</p>
              {isColourDropdownOpen && (
                <div className="product-dropdown-content">
                  {colours.map((colour) => {
                    return (
                      <div
                        onClick={() => getcolour(colour)}
                        className={`option ${
                          colouractivetag === colour ? "active" : ""
                        }`}
                      >
                        {colour}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleSizeDropdown}>
              <p>SIZE</p>
              {isSizeDropdownOpen && (
                <div className="product-dropdown-content">
                  {sizes.map((size) => {
                    return (
                      <div
                        onClick={() => getsize(size)}
                        className={`option ${
                          sizeactivetag === size ? "active" : ""
                        }`}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleGenderDropdown}>
              <p>GENDER</p>
              {isGenderDropdownOpen && (
                <div className="product-dropdown-content">
                  <div
                    onClick={() => getgender("male")}
                    className={`option ${
                      genderactivetag === "male" ? "active" : ""
                    }`}
                  >
                    MALE
                  </div>
                  <div
                    onClick={() => getgender("female")}
                    className={`option ${
                      genderactivetag === "female" ? "active" : ""
                    }`}
                  >
                    FEMALE
                  </div>
                  <div
                    onClick={() => getgender("unisex")}
                    className={`option ${
                      genderactivetag === "unisex" ? "active" : ""
                    }`}
                  >
                    UNISEX
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggleCategoryDropdown}>
              <p>CATEGORY</p>
              {isCategoryDropdownOpen && (
                <div className="product-dropdown-content">
                  {categories.map((category) => {
                    return (
                      <div
                        onClick={() => getcategory(category)}
                        className={`option ${
                          categoryactivetag === category ? "active" : ""
                        }`}
                      >
                        {category}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="filter-text">
            <div className="product-account" onClick={()=>toggleReset()}>
              <p>RESET</p>
            </div>
          </div>
          <div>
            <input
              type="text"
              className="searchbar"
              onChange={(e: any) => {
                setsearchtext(e.target.value);
              }}
            />
            <FaSearch
              className="search-icon"
              onClick={() => toggleSearch(searchtext)}
            />
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
      <br />
      <br/>
      <Footer/>
    </div>
  );
};

export interface ProductsProps {
  products: Product[];
}

function Products({ products }: ProductsProps) {
  return (
    <div>
      <div className="productcard-main">
        {products.map((product) => {
          return <ProductCard product={product} />;
        })}
      </div>
    </div>
  );
}
export interface ProductCardProps {
  product: Product;
}
function ProductCard({ product }: ProductCardProps) {
     const navigate = useNavigate();
  return (
    <div>
      <Card className="product-card" onClick={()=>{
        navigate('/product/'+product._id);
      }}>
        <img
          src={product.productimg[0] || blackwhite}
          alt={product.productname}
          className="product-img"
        />
        <br />
        <div className="product-description">
          <p>{product.productname}</p>

          <p className="product-price">₹{product.price}</p>
        </div>
      </Card>
      
    </div>
  );
}

interface PaginationCardProps {
  productsPerpage: number;
  totalproducts: number;
  pagination: (pageNumber: number) => void;
  currentPage: number;
}

function PaginationCard({
  productsPerpage,
  totalproducts,
  pagination,
  currentPage,
}: PaginationCardProps) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalproducts / productsPerpage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-main">
      {pageNumbers.map((pageNumber) => (
        <div
          className={`page-item ${pageNumber === currentPage ? "active" : ""}`}
          onClick={() => pagination(pageNumber)}
        >
          <a className="pagination-link">{pageNumber}</a>
        </div>
      ))}
    </div>
    
  );
}
export default Product;
