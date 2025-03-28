import React, { useState } from 'react'
import ProductCards from './ProductCards'
import products from '../../data/products.json'

const TrendingProducts = () => {

    const [visibleProducts, setVisibleProducts] = useState(8);

    const showMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    }

    return (
        <section className='section__container product__container'>
            <h2 className='section__header'>Hot Products</h2>
            <p className='section__subheader'>Explore our hottest sports gear and apparel, crafted for peak performance and unmatched style. Get ready to level up your game and stand out like a true champion!</p>

            <div className='mt-12'>
                <ProductCards products={products.slice(0, visibleProducts)} />
            </div>

            <div className='product__btn'>
                {
                    visibleProducts < products.length && (
                        <button className='btn' onClick={showMoreProducts}>Load More</button>
                    )
                }
            </div>
        </section>
    )
}

export default TrendingProducts