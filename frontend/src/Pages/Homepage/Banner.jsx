import React from 'react'
import { Link } from 'react-router-dom';
import banner from "../../Assets/banner.png"

const Banner = () => {
  return (
    <div className='section__container header__container'>
        <div className='header__content z-30'>
            <h4 className='uppercase'>From court to field, we've got you covered.</h4>
            <h1>Gear Up for Victory!</h1>
            <p>Take your performance to the next level with our premium collection of sportswear and gear. Whether you're training or competing, we provide the tools to make every move count.</p>
            <button className='btn'><Link to="/sports">EXPLORE NOW</Link></button>
        </div>

        <div className='header__image'>
            <img src={banner} alt="Banner" />
        </div>
    </div>
  )
}

export default Banner