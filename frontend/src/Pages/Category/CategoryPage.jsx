import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../../Redux/Features/Products/products';  // Assuming you're using Redux for API calls
import ProductCards from '../../Pages/Shop/ProductCards';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch all products with a filter for the category
    const { data: { products = [] } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: categoryName, // Fetch based on the category name from the URL
    });

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
    }, []);

    useEffect(() => {
        // If products are fetched successfully, filter them based on the category
        if (products.length > 0) {
            const filtered = products.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
            setFilteredProducts(filtered);
        }
    }, [products, categoryName]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen py-8 px-4'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4'></div>
                    <p className='text-gray-600 text-sm sm:text-base'>Loading {categoryName} products...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen py-8 px-4'>
                <div className='text-center'>
                    <div className='text-red-500 text-4xl sm:text-6xl mb-4'>⚠️</div>
                    <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>Error loading products</h2>
                    <p className='text-gray-600 text-sm sm:text-base mb-4'>We couldn't load the {categoryName} products. Please try again.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className='px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base'
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className='section__container bg-primary-light py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8'>
                <div className='text-center max-w-4xl mx-auto'>
                    <h2 className='section__header capitalize text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6'>
                        {categoryName}
                    </h2>
                    <p className='section__subheader text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto'>
                        Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.
                    </p>
                    
                    {/* Category Badge */}
                    <div className='mt-6 sm:mt-8'>
                        <span className='inline-block bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium text-gray-700 shadow-md'>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
                        </span>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <div className='section__container py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8'>
                {filteredProducts.length === 0 ? (
                    <div className='text-center py-12 sm:py-16 lg:py-20'>
                        <div className='text-6xl sm:text-8xl mb-6'>📦</div>
                        <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-4'>
                            No {categoryName} Products Found
                        </h3>
                        <p className='text-gray-600 mb-8 text-sm sm:text-base max-w-md mx-auto'>
                            We're currently out of stock in this category, but check back soon for new arrivals!
                        </p>
                        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
                            <button 
                                onClick={() => window.history.back()}
                                className='w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base'
                            >
                                ← Go Back
                            </button>
                            <button 
                                onClick={() => window.location.href = '/'}
                                className='w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base'
                            >
                                Browse All Products
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filter/Sort Bar - Mobile Friendly */}
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 lg:mb-12'>
                            <div className='text-gray-600 text-sm sm:text-base'>
                                Showing <span className='font-semibold'>{filteredProducts.length}</span> {categoryName.toLowerCase()} products
                            </div>
                            
                            {/* Sort Dropdown - You can add sorting functionality here */}
                            <select className='w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base'>
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest First</option>
                                <option>Best Selling</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <ProductCards products={filteredProducts} />
                        
                        {/* Category Description - Below Products */}
                        <div className='mt-12 sm:mt-16 lg:mt-20 bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-12'>
                            <div className='max-w-3xl mx-auto text-center'>
                                <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6'>
                                    Why Choose Our {categoryName} Collection?
                                </h3>
                                <p className='text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8'>
                                    Our {categoryName.toLowerCase()} collection features premium quality products from trusted brands, 
                                    designed to enhance your performance and style. Each item is carefully selected to meet 
                                    the highest standards of durability, comfort, and functionality.
                                </p>
                                
                                {/* Features Grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                                    <div className='text-center'>
                                        <div className='text-2xl sm:text-3xl mb-2'>🏆</div>
                                        <h4 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>Premium Quality</h4>
                                        <p className='text-xs sm:text-sm text-gray-600'>Top-tier materials and construction</p>
                                    </div>
                                    <div className='text-center'>
                                        <div className='text-2xl sm:text-3xl mb-2'>🚚</div>
                                        <h4 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>Fast Delivery</h4>
                                        <p className='text-xs sm:text-sm text-gray-600'>Quick and reliable shipping</p>
                                    </div>
                                    <div className='text-center sm:col-span-2 lg:col-span-1'>
                                        <div className='text-2xl sm:text-3xl mb-2'>💯</div>
                                        <h4 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>Satisfaction Guaranteed</h4>
                                        <p className='text-xs sm:text-sm text-gray-600'>100% satisfaction or money back</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default CategoryPage;