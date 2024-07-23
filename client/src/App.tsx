import './App.css'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Landing from "./components/Landing/Landing";
import Navbar from "./components/Navbar/Navbar";
import Signin from "./components/Signin/Signin";
import Signup from './components/Signin/Signup';
import Singleproduct from './components/Singleproduct/Singleproduct';
import Account from "./components/Account/Account"
import Address from './components/Order/Address/Address';
import VerifymobileOTP from './components/Verifyotp/VerifymobileOTP';
import {
  RecoilRoot
} from 'recoil';
import Product from './components/Product/Product';
import Verifyotp from './components/Verifyotp/Verifyotp';
import Bag from './components/Bag/Bag';
import Adminsignin from './components/Signin/Adminsignin';
import Addproduct from './components/Admin/Addproduct/Addproduct';
import Orderadmin from './components/Admin/Orderadmin/Orderadmin';
import Singleorder from './components/Admin/Orderadmin/Singleorder';
import Orderuser from './components/Order/Address/Orderuser';
import SingleOrderuser from './components/Order/Address/SingleOrderuser';

function App() {

  return (
    <RecoilRoot>
      <Router>
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/signin"} element={<Signin />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/product"} element={<Product />} />
          <Route path={"/account"} element={<Account />} />
          <Route path={"/address"} element={<Address />} />
          <Route path={"/addproduct"} element={<Addproduct/>} />
          <Route path={"/singleorder/:orderId"} element={<Singleorder/>} />
          <Route path={"/singleorderuser/:orderId"} element={<SingleOrderuser/>} />
          <Route path={"/adminorders"} element={<Orderadmin/>} />
          <Route path={"/userorders"} element={<Orderuser/>} />
          <Route path={"/bag"} element={<Bag/>} />
          <Route path={"/verifyotp/:userId"} element={<Verifyotp />} />
          <Route path={"/verifymobileOTP/:userId/:mobileno"} element={<VerifymobileOTP />} />
          <Route path={"/product/:productId"} element={<Singleproduct />} />
          <Route path={"/adminsignin"} element={<Adminsignin />} />

        </Routes>
      
      </Router>
    </RecoilRoot>
  );
}

export default App
