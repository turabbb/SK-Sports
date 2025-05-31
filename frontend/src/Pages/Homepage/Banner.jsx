import React from 'react'
import { Link } from 'react-router-dom';
import banner from "../../Assets/banner.png"

const Banner = () => {
  return (
    <div className='section__container header__container flex flex-col lg:flex-row items-center gap-6 lg:gap-8 py-8 lg:py-12'>
        <div className='header__content z-30 flex-1 text-center lg:text-left order-2 lg:order-1'>
            <h4 className='uppercase text-sm sm:text-base lg:text-lg mb-3'>From court to field, we've got you covered.</h4>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight'>Gear Up for Victory!</h1>
            <p className='text-sm sm:text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0'>Take your performance to the next level with our premium collection of sportswear and gear. Whether you're training or competing, we provide the tools to make every move count.</p>
            <button className='btn w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base'><Link to="/sports">EXPLORE NOW</Link></button>
        </div>

        <div className='header__image flex-1 order-1 lg:order-2 w-full max-w-md lg:max-w-none mx-auto'>
            <img src={banner} alt="Banner" className='w-full h-auto object-cover' />
        </div>
    </div>
  )
}

export default Banner