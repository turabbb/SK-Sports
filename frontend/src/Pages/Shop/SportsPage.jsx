import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCards from './ProductCards';
import SportsPageFilter from './SportsPageFilter';
import Pagination from '../../Components/Pagination';
import { useFetchAllProductsQuery } from '../../Redux/Features/Products/products';

const filters = {
    categories: [
        'All', 'Hard Ball Bat', 'Tape Ball Bat', 'Pads', 'Thigh Pads', 'Batting Gloves', 'Keeping Gloves', 'Helmet', 'Guard', 'Tape Ball', 'Hard Ball', 'Kit Bags',
        'Boots', 'Football', 'Gym Accessories', 'SportsWear Shirts', 'Basketball Jerseys', 'PSL Jerseys', 'IPL Jerseys', 'Big Bash League Jerseys', 'Football Jerseys', 'Trousers', 'Hoodies', 'Zippers', 'TrackSuits',
        'Shorts', 'Caps', 'Custom Shirts', 'Indoor Games'
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

const SportsPage = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filteredProducts, setFilteredProducts] = useState({
        category: 'All',
        color: 'All',
        priceRange: ''
    });

    const { category, color, priceRange } = filteredProducts;

    // Parse URL parameters for initial filtering
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromUrl = urlParams.get('category');
        const categoriesFromUrl = urlParams.get('categories');
        const colorFromUrl = urlParams.get('color');
        const priceFromUrl = urlParams.get('price');

        // Set initial filters based on URL parameters
        if (categoryFromUrl || categoriesFromUrl || colorFromUrl || priceFromUrl) {
            setFilteredProducts({
                category: categoryFromUrl || 'All',
                color: colorFromUrl || 'All',
                priceRange: priceFromUrl || ''
            });
        }
    }, [location.search]);

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

    // Handle URL parameters for categories
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get('category');
    const categoriesFromUrl = urlParams.get('categories');

    // Priority: User filter selection > URL parameters
    if (category !== 'All') {
        // User has selected a specific category from filter
        queryParams.category = category;
    } else if (categoryFromUrl) {
        // URL has single category parameter
        queryParams.category = categoryFromUrl;
    } else if (categoriesFromUrl) {
        // URL has multiple categories parameter
        queryParams.categories = categoriesFromUrl;
    }
    // If none of the above, show all products (default behavior)

    // Make the request using query params
    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery(queryParams);

    console.log('Query params being sent:', queryParams);
    console.log('Products received:', products);

    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentPage(1);
    }, [category, color, priceRange, location.search]);

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
        // Scroll to top when page changes
        window.scrollTo(0, 0);
    }
}

    if (isLoading) return <div className='flex justify-center items-center h-screen text-base sm:text-lg'>Loading...</div>;
    if (error) return <div className='flex justify-center items-center h-screen text-base sm:text-lg'>Error loading products</div>;

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    // Fix the display logic for zero products
    const getProductCountDisplay = () => {
        if (totalProducts === 0) {
            return "Showing 0 of 0 Products";
        }
        return `Showing ${startProduct} - ${endProduct} of ${totalProducts} Products`;
    };

    // Dynamic page title based on URL parameters
    const getPageTitle = () => {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromUrl = urlParams.get('category');
        const categoriesFromUrl = urlParams.get('categories');

        if (categoryFromUrl === 'Custom Shirts') return 'Custom Kits';
        if (categoriesFromUrl) {
            if (categoriesFromUrl.includes('Hard Ball Bat') || categoriesFromUrl.includes('Cricket')) return 'Cricket Equipment';
            if (categoriesFromUrl.includes('Football')) return 'Football Equipment';
        }
        return 'Explore Our Collection';
    };

    const getPageSubtitle = () => {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromUrl = urlParams.get('category');
        const categoriesFromUrl = urlParams.get('categories');

        if (categoryFromUrl === 'Custom Shirts') return 'Browse our custom sports shirts and team kits.';
        if (categoriesFromUrl) {
            if (categoriesFromUrl.includes('Hard Ball Bat') || categoriesFromUrl.includes('Cricket')) return 'Browse through our premium cricket gear and equipment.';
            if (categoriesFromUrl.includes('Football')) return 'Browse through our football boots and equipment.';
        }
        return 'Browse through our wide range of premium sports gear and apparel.';
    };

    return (
        <>
            <section className='section__container bg-primary-light px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <h2 className='section__header capitalize text-2xl sm:text-3xl lg:text-4xl'>{getPageTitle()}</h2>
                <p className='section__subheader text-sm sm:text-base lg:text-lg'>{getPageSubtitle()}</p>
            </section>

            <section className='section__container px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <div className='flex flex-col lg:flex-row lg:gap-8 xl:gap-12 gap-6 sm:gap-8'>
                    {/* Mobile Filter Toggle */}
                    <div className='lg:hidden'>
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className='w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow'
                        >
                            <div className='flex items-center gap-3'>
                                <i className="ri-filter-3-line text-xl text-primary"></i>
                                <span className='font-medium text-gray-900'>Filters & Categories</span>
                            </div>
                            <i className={`ri-arrow-${showMobileFilters ? 'up' : 'down'}-s-line text-xl text-gray-500 transition-transform`}></i>
                        </button>

                        {/* Mobile Filter Panel */}
                        <div className={`mt-4 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${showMobileFilters ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div className='p-4 space-y-6'>
                                {/* Mobile Categories Filter */}
                                <div>
                                    <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                        <i className="ri-list-check text-primary"></i>
                                        Categories
                                    </h4>
                                    <select
                                        value={category}
                                        onChange={(e) => setFilteredProducts(prev => ({ ...prev, category: e.target.value }))}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                                    >
                                        {filters.categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mobile Price Range Filter */}
                                <div>
                                    <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                        <i className="ri-money-dollar-circle-line text-primary"></i>
                                        Price Range
                                    </h4>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setFilteredProducts(prev => ({ ...prev, priceRange: e.target.value }))}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                                    >
                                        <option value="">All Prices</option>
                                        {filters.priceRange.map((range) => (
                                            <option key={range.label} value={`${range.min}-${range.max}`}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
                                <div className='pt-4 border-t border-gray-200'>
                                    <button
                                        onClick={() => {
                                            clearFilters();
                                            setShowMobileFilters(false);
                                        }}
                                        className='w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium'
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Filter Sidebar */}
                    <div className='hidden lg:block lg:w-1/4 xl:w-1/5'>
                        <SportsPageFilter
                            filters={filters}
                            filteredProducts={filteredProducts}
                            setFilteredProducts={setFilteredProducts}
                            clearFilters={clearFilters}
                        />
                    </div>

                    <div className='w-full lg:w-3/4 xl:w-4/5'>
                        <h3 className='text-lg sm:text-xl font-medium mb-4 sm:mb-6'>
                            {getProductCountDisplay()}
                        </h3>
                        <ProductCards products={products} />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            maxVisiblePages={5} // You can adjust this number
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default SportsPage;