import './App.css'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Landing from "./components/Landing/Landing";
import Navbar from "./components/Navbar/Navbar";
import Signin from "./components/Signin/Signin";
import Signup from './components/Signin/Signup';
import {
  RecoilRoot
} from 'recoil';

function App() {

  return (
    <RecoilRoot>
      <Navbar/>
      <Router>
        <Routes>
        <Route path={"/"} element={<Landing/>} />
        <Route path={"/signin"} element={<Signin/>} />
        <Route path={"/signup"} element={<Signup/>} />
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App
