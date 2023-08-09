import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain2.png'


const Logo = () => {
    return (
        <Tilt
    className="parallax-effect-glare-scale br2 shadow-2 ma3 tilt"
    perspective={500}
    glareEnable={true}
    glareMaxOpacity={0.45}
    scale={1.02}
    style={{height:100, width:100}}
  >
    <div className="inner-element">
      <div className='pa3'><img alt='logo' src={brain}></img></div>
    </div>
  </Tilt>
    )
}

export default Logo;