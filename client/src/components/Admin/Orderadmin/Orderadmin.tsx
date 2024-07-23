import { Card, TextField, dialogClasses } from "@mui/material";
import React, { useEffect, useState } from "react";
import blackwhite from "../../../assets/blackwhite.jpeg";
import "../../Product/Product.css";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ObjectId } from "bson";
import { useSetRecoilState } from "recoil";
import { IAddress } from "../../Account/Account";
import Footer from "../../Footer/Footer";

interface Review {
  _id: ObjectId;
  username: string;
  productimg: string[];
  review: string;
}

export interface Product {
  _id: ObjectId;
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


export interface Iorder {
  _id:ObjectId;
  orderedproduct: Product;
  quantity: number;
  orderowner: string;
  ordertotal: number;
  paid: string;
  deliveryadr: IAddress;
  Tracking: string;
  placed: boolean;
}

const Orderadmin = () => {
  const [orders, setorders] = useState<Iorder[]>([]);
  const [allorders, setallorders] = useState<Iorder[]>([]);
  const productsPerpage = 16;
  const [currentPage, setcurrentPage] = useState(1);
  const [paystatus, setpaystatus] = useState<string[]>([]);
  const [tracking, settracking] = useState<string[]>([]);
  const [isSortbyDropdownOpen, setIsDropdownOpen] = useState(false);
  const [istrackingDropdownOpen, setistrackingDropdownOpen] = useState(false);
  const [ispaystatusDropdownOpen, setispaystatusDropdownOpen] = useState(false);
  const [searchtext, setsearchtext] = useState("");
  const [trackingactivetag, settrackingactivetag] = useState("");
  const [paystatusactivetag, setpaystatusactivetag] = useState("");
  const [sortbyactivetag, setsortbyactivetag] = useState("");

  const indexoflastproduct = currentPage * productsPerpage;
  const indexoffirstproduct = indexoflastproduct - productsPerpage;
  const currentproducts = orders.slice(
    indexoffirstproduct,
    indexoflastproduct
  );

  const pagination = (pageNumber: number) => {
    setcurrentPage(pageNumber);
  };

  const getpaystatus = (pay: string) => {
    const data: Iorder[] = orders.filter((product) => {
      return product.paid === pay;
    });
    console.log(data);
    setorders(data);
    setpaystatusactivetag(pay);
  };

  const gettracking = (track: string) => {
    const data: Iorder[] = orders.filter((product) => {
      return product.Tracking === track;
    });
    console.log(data);
    setorders(data);
    settrackingactivetag(track);
  };

  

 

  const LowtoHigh = () => {
    const data = orders.sort((a, b) => {
      if (a.ordertotal < b.ordertotal) return -1;
      if (a.ordertotal > b.ordertotal) return 1;
      return 0;
    });

    setorders(data);
    setsortbyactivetag("LowtoHigh");
  };

  const HightoLow = () => {
    const data = orders.sort((a, b) => {
      if (a.ordertotal < b.ordertotal) return 1;
      if (a.ordertotal > b.ordertotal) return -1;
      return 0;
    });

    setorders(data);
    setsortbyactivetag("HightoLow");
  };

  
  const toggleReset = () => {
    setorders(allorders);
    setpaystatusactivetag("");
    settrackingactivetag("");
    setsortbyactivetag("");
  };

  const toggleSortbyDropdown = () => {
    setIsDropdownOpen(!isSortbyDropdownOpen);
  };

  const togglepaystatusDropdown = () => {
    setispaystatusDropdownOpen(!ispaystatusDropdownOpen);
  };

  const toggletrackingDropdown = () => {
    setistrackingDropdownOpen(!istrackingDropdownOpen);
  };

  

  const toggleSearch = (searchtext: String) => {
    if (searchtext) {
      const data = allorders.filter((product) =>
        product.orderedproduct.productname.toLowerCase().includes(searchtext.toLowerCase()) || product.orderowner.toLowerCase().includes(searchtext.toLowerCase())
      );
      setorders(data);
    } else {
      setorders(allorders);
    }
  };

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/allorders`,{withCredentials:true});
      const data: Iorder[] = response.data.orders;
      setorders(data);
      setallorders(data);

      // Extract unique sizes and colours
      const uniquepay = Array.from(
        new Set(data.map((product) => product.paid))
      );
      const uniquetrack = Array.from(
        new Set(data.map((product) => product.Tracking))
      );

      setpaystatus(uniquepay);
      settracking(uniquetrack);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="product-main">
      <div>
        <div className="orderheading">ALL ORDERS:</div>

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
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={togglepaystatusDropdown}>
              <p>PAY STATUS</p>
              {ispaystatusDropdownOpen && (
                <div className="product-dropdown-content">
                  {paystatus.map((pay) => {
                    return (
                      <div
                        onClick={() => getpaystatus(pay)}
                        className={`option ${
                          paystatusactivetag === pay ? "active" : ""
                        }`}
                      >
                        {pay}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="filter-text">
            <div className="product-account" onClick={toggletrackingDropdown}>
              <p>TRACKING</p>
              {istrackingDropdownOpen && (
                <div className="product-dropdown-content">
                  {tracking.map((track) => {
                    return (
                      <div
                        onClick={() => gettracking(track)}
                        className={`option ${
                          trackingactivetag === track ? "active" : ""
                        }`}
                      >
                        {track}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="filter-text">
            <div className="product-account" onClick={() => toggleReset()}>
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
        totalproducts={orders.length}
        pagination={pagination}
        currentPage={currentPage}
      />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export interface ProductsProps {
  products: Iorder[];
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
  product: Iorder;
}
function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  return (
    <div>
      <Card
        className="product-card"
        onClick={() => {
          navigate("/singleorder/" + product._id);
        }}
      >
        <img
          src={product.orderedproduct.productimg[0] || blackwhite}
          alt={product.orderedproduct.productname}
          className="product-img"
        />
        <br />
        <div className="product-description">
          <p>{product.orderedproduct.productname}</p>

          <p className="product-price">Total- ₹{product.ordertotal}</p>
          <p className="product-price">user - {product.orderowner}</p>
          <p className="product-price">count- {product.quantity}</p>
          <p className="product-price">paid- {product.paid}</p>
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
export default Orderadmin;
