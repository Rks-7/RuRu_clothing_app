import './App.css'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Landing from "./components/Landing/Landing";
import Navbar from "./components/Navbar/Navbar"
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
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App
