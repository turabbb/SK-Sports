import React, { useState, useEffect } from 'react';
import ProductCards from './ProductCards';
import SportsPageFilter from './SportsPageFilter';
import { useFetchAllProductsQuery } from '../../Redux/Features/Products/products';

const filters = {
    categories: [
        'All', 'Trousers', 'Hoodies', 'Zippers', 'TrackSuits', 'Shorts', 'Caps', 'Custom Shirts'
    ],

    priceRange: [
        { label: 'Under Rs.1000', min: 0, max: 1000 },
        { label: 'Rs. 1000 - Rs. 2000', min: 1000, max: 2000 },
        { label: 'Rs. 2000 - Rs. 3000', min: 2000, max: 3000 },
        { label: 'Rs. 3000 - Rs. 4000', min: 3000, max: 4000 },
        { label: 'Rs. 4000 - Rs. 5000', min: 4000, max: 5000 },
        { label: 'Rs. 5000 and above', min: 5000, max: Infinity },
    ],
}

// Default categories for Casual page
const defaultCategories = ['Trousers', 'Hoodies', 'Zippers', 'TrackSuits', 'Shorts', 'Caps', 'Custom Shirts'];

const CasualPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    const [filteredProducts, setFilteredProducts] = useState({
        category: 'All',
        color: 'All',
        priceRange: ''
    });

    const { category, color, priceRange } = filteredProducts;

    // Make sure the price range is correctly split
    const [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [0, Infinity];

    console.log("Category: ", category, " Color: ", color, " Price Range: ", priceRange, " minPrice: ", minPrice, " maxPrice: ", maxPrice);

    // Build query parameters
    let queryParams = {
        color: color !== 'All' ? color : '',
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: productsPerPage
    };

    // Handle category filtering
    if (category === 'All') {
        // Show all products from default categories when "All" is selected
        queryParams.categories = defaultCategories.join(',');
    } else {
        // Show specific category when selected
        queryParams.category = category;
    }

    // Make the request using query params
    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery(queryParams);

    console.log(products);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Reset to page 1 when filters change
        setCurrentPage(1);
    }, [category, color, priceRange]);

    const clearFilters = () => {
        setFilteredProducts({
            category: 'All',
            color: 'All',
            priceRange: ''
        });
        setCurrentPage(1);
    }

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    if (isLoading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;
    if (error) return <div className='flex justify-center items-center h-screen'>Error loading products</div>;

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    // Fix the display logic for zero products
    const getProductCountDisplay = () => {
        if (totalProducts === 0) {
            return "Showing 0 of 0 Products";
        }
        return `Showing ${startProduct} - ${endProduct} of ${totalProducts} Products`;
    };

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Casual Wear Collection</h2>
                <p className='section__subheader'>Browse through our comfortable and stylish casual clothing.</p>
            </section>

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    <SportsPageFilter
                        filters={filters}
                        filteredProducts={filteredProducts}
                        setFilteredProducts={setFilteredProducts}
                        clearFilters={clearFilters}
                    />

                    <div>
                        <h3 className='text-xl font-medium mb-4'>
                            {getProductCountDisplay()}
                        </h3>
                        <ProductCards products={products} />

                        {totalPages > 1 && (
                            <div className='mt-10 flex justify-center items-center gap-2'>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className='px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                {
                                    [...Array(totalPages)].map((_, index) => (
                                        <button
                                            onClick={() => handlePageChange(index + 1)}
                                            key={index}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 
                                                ${currentPage === index + 1
                                                    ? 'bg-primary text-white scale-110 shadow-lg'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:scale-105 shadow-md'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))
                                }

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className='px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default CasualPage;