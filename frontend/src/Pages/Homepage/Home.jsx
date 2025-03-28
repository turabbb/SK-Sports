import React, { useEffect } from 'react'
import Banner from './Banner'
import Categories from './Categories'
import Hero from './Hero'
import TrendingProducts from '../Shop/TrendingProducts'
import Deals from './Deals'
import PromoBanner from './PromoBanner'
import Blogs from '../Blogs/Blogs'

const Home = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);
    
    return (
        <>
            <Banner />
            <Categories />
            <Hero />
            <TrendingProducts />
            <Deals />
            <PromoBanner />
            <Blogs />
        </>
    )
}

export default Home