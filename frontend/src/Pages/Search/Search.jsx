import React from 'react'
import { useState, useEffect } from 'react'
import { useFetchAllProductsQuery } from '../../Redux/Features/Products/products'; // Import your API hook
import ProductCards from '../Shop/ProductCards';
import { motion } from 'framer-motion';

const Search = () => {
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products from API instead of static JSON
    const { data: { products = [] } = {}, isLoading, isError, refetch } = useFetchAllProductsQuery({
        page: 1,
        limit: 1000, // Get all products
    });

    const handleSearch = () => {
        const query = search.toLowerCase().trim();

        if (!query) {
            // If search is empty, show all products
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.color && product.color.toLowerCase().includes(query))
        );

        setFilteredProducts(filtered);
    }

    // Update filtered products when products data changes
    useEffect(() => {
        if (products.length > 0) {
            setFilteredProducts(products);
        }
    }, [products]);

    // Handle real-time search as user types
    useEffect(() => {
        if (search.trim() === '') {
            setFilteredProducts(products);
        } else {
            handleSearch();
        }
    }, [search, products]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <section className='section__container bg-primary-light'>
                    <h2 className='section__header capitalize'>Search Products</h2>
                    <p className='section__subheader'>Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.</p>
                </section>

                <section className='section__container'>
                    <div className="flex items-center justify-center py-20">
                        <motion.div
                            className="flex flex-col items-center gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-lg text-gray-600">Loading products...</p>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen">
                <section className='section__container bg-primary-light'>
                    <h2 className='section__header capitalize'>Search Products</h2>
                    <p className='section__subheader'>Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.</p>
                </section>

                <section className='section__container'>
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-red-500 text-xl mb-4">⚠️ Error loading products</div>
                        <motion.button
                            onClick={() => refetch()}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                </section>
            </div>
        );
    }

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Search Products</h2>
                <p className='section__subheader'>Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.</p>
            </section>

            <section className='section__container'>
                <motion.div 
                    className='w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative w-full max-w-4xl">
                        <input 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            className='search-bar w-full p-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                            placeholder='Search for products by name, category, color...' 
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            🔍
                        </div>
                        {search && (
                            <motion.button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                ✕
                            </motion.button>
                        )}
                    </div>

                    <motion.button
                        onClick={handleSearch}
                        className='search-button w-full md:w-auto py-3 px-8 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold shadow-lg'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Search
                    </motion.button>
                </motion.div>

                {/* Search Results Info */}
                <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                                {search ? (
                                    <>
                                        Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> results for 
                                        <span className="font-semibold text-primary"> "{search}"</span>
                                    </>
                                ) : (
                                    <>
                                        Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> total products
                                    </>
                                )}
                            </span>
                        </div>
                        
                        {search && (
                            <motion.button
                                onClick={() => setSearch('')}
                                className="text-sm px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Clear Search
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* No Results Message */}
                {search && filteredProducts.length === 0 && (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">
                            We couldn't find any products matching "<span className="font-semibold">{search}</span>"
                        </p>
                        <motion.button
                            onClick={() => setSearch('')}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View All Products
                        </motion.button>
                    </motion.div>
                )}

                {/* Product Results */}
                {filteredProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ProductCards products={filteredProducts} />
                    </motion.div>
                )}
            </section>
        </>
    )
}

export default Search