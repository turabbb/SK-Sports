import React, { useState } from 'react'
import ProductCards from './ProductCards'
import products from '../../data/products.json'

const TrendingProducts = () => {

    const [visibleProducts, setVisibleProducts] = useState(8);

    const showMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    }

    return (
        <section className='section__container product__container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
            <div className='text-center mb-8 sm:mb-12'>
                <h2 className='section__header text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>Hot Products</h2>
                <p className='section__subheader text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed'>
                    Explore our hottest sports gear and apparel, crafted for peak performance and unmatched style. Get ready to level up your game and stand out like a true champion!
                </p>
            </div>

            <div className='mt-8 sm:mt-12'>
                <ProductCards products={products.slice(0, visibleProducts)} />
            </div>

            <div className='product__btn text-center mt-8 sm:mt-12'>
                {
                    visibleProducts < products.length && (
                        <button 
                            className='btn px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg' 
                            onClick={showMoreProducts}
                        >
                            Load More
                        </button>
                    )
                }
            </div>
        </section>
    )
}

export default TrendingProducts