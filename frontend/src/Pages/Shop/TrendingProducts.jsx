import React, { useState } from 'react'
import ProductCards from './ProductCards'
import { useFetchAllProductsQuery } from '../../Redux/Features/Products/products' // Adjust path based on your file structure

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8);

    // Use RTK Query to fetch products
    const { 
        data: productData, 
        error, 
        isLoading,
        refetch 
    } = useFetchAllProductsQuery({
        limit: 50, // Fetch more products to have enough for "Load More" functionality
        page: 1
    });

    const showMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    };

    const products = productData?.products || [];

    // Loading state
    if (isLoading) {
        return (
            <section className='section__container product__container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
                <div className='text-center mb-8 sm:mb-12'>
                    <h2 className='section__header text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>Hot Products</h2>
                    <p className='section__subheader text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed'>
                        Loading our hottest sports gear...
                    </p>
                </div>
                <div className='flex justify-center items-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className='section__container product__container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
                <div className='text-center mb-8 sm:mb-12'>
                    <h2 className='section__header text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>Hot Products</h2>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto'>
                        <p className='text-red-700 text-sm'>
                            {error?.data?.message || error?.message || 'Failed to load products'}
                        </p>
                        <button 
                            onClick={() => refetch()}
                            className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // No products state
    if (products.length === 0) {
        return (
            <section className='section__container product__container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
                <div className='text-center mb-8 sm:mb-12'>
                    <h2 className='section__header text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>Hot Products</h2>
                    <p className='section__subheader text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed'>
                        No products available at the moment.
                    </p>
                </div>
            </section>
        );
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