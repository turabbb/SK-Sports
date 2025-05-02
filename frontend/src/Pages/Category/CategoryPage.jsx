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

    if (isLoading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;
    if (error) return <div className='flex justify-center items-center h-screen'>Error loading products</div>;

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>{categoryName}</h2>
                <p className='section__subheader'>
                    Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.
                </p>
            </section>

            <div className='section__container'>
                <ProductCards products={filteredProducts} />
            </div>
        </>
    );
}

export default CategoryPage;
