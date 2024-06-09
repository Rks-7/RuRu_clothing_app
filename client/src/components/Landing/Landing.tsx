import React, { useEffect, useRef } from 'react';
import vid from "../../assets/homevid.mp4";
import vid2 from "../../assets/cinematicclothing.mp4"
import boldvid from "../../assets/boldvid.mp4"
import beautifulvid from "../../assets/beautifulvid.mp4"
import "./Landing.css";
import dress from "../../assets/dress.jpeg"
import blackshirt from "../../assets/blackwhite.jpeg"
import Footer from "../Footer/Footer"
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate=useNavigate();
  const hiddenElementsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.4 });

    hiddenElementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);// Empty dependency array to run the effect only once, when the component mounts

  return (
    <div>
      <div className='wrapper'>
        <header>
          <video
            autoPlay
            loop
            muted
            style={{ width: "100%" }}
            className="backgroundvid"
          >
            <source src={vid} />
          </video>
          <div>
            <div className='summertxt'> RuRu Summer Collection</div>
            <div className='himherbtns'>
              <button className='himbtn' onClick={()=>navigate('/product')}>EXPLORE</button>
              {/* <button className='herbtn'>For Her</button> */}
            </div>
          </div>
        </header>
        <section className='main-section'>
          <div className='tagline'>
            <p className='reveal-type'>Your Wardrobe, </p>
            <p className='reveal-type'>your runway .</p>
          </div>

          <div className='photo-cards'>
            <section ref={(el) => hiddenElementsRef.current[0] = el} className='hidden'>
              <img src={dress} alt="" className='imgtag'/>
            </section>

            <section ref={(el) => hiddenElementsRef.current[1] = el} className='hidden'>
               <img src={blackshirt} alt="" className='imgtag' id='imgtag2'/>
            </section>

            
          </div>

          <section className='roller'>
<div>
  <section className="news-message">
    <p>China</p>
    <p>Italy</p>
    <p>India</p>
    <p>South Korea</p>
    <p>Spain</p>
    <p>France</p>
    <p>Germany</p>
    <p>United States</p>
    <p>Switzerland</p>
    </section>
 <section className="news-message">
    <p>China</p>
    <p>Italy</p>
    <p>India</p>
    <p>South Korea</p>
    <p>Spain</p>
    <p>France</p>
    <p>Germany</p>
    <p>United States</p>
    <p>Switzerland</p>
    </section>
</div>
  </section>
          <section ref={(el) => hiddenElementsRef.current[2] = el} className='hidden' id='quotehidden'>
            <p className='quote'>"Fashion is not something that exists in dresses only. Fashion is in the sky, in the street; fashion has to do with ideas, the way we live, what is happening"</p>
          </section>

          
            <div className='photo-cards2'>
            <section ref={(el) => hiddenElementsRef.current[3] = el} className='hidden'>
              <div className='bolddiv'>
                  <p className='boldtxt'>Be Bold,</p>
              {/* <img src={dress} alt="" className='boldimg'/> */}
              <video
            autoPlay
            loop
            muted
            style={{ width: "30vw",height:"80vh" }}
            className="boldvid"
          >
            <source src={boldvid} />
          </video>
              </div>

            </section>

            <section ref={(el) => hiddenElementsRef.current[4] = el} className='hidden'>
              <div className='beautifuldiv'>
                
                {/* <img src={blackshirt} alt="" className='beautifulimg' /> */}
                <video
            autoPlay
            loop
            muted
            style={{ width: "30vw",height:"80vh" }}
            className="boldvid"
          >
            <source src={beautifulvid} />
          </video>
                <p className='beautifultxt'>Be Beautiful</p>
              </div>
               
            </section>

            </div>
      
      
          <div className='videowindowheader' >
          <video
            autoPlay
            loop
            muted
            style={{ width: "100%" }}
            className="videowindowvid"
          >
            <source src={vid2} />
          </video>
        </div>
      


        
      <Footer/>
          

         
        </section>
      </div>
    </div>
  );
}

export default Landing;
