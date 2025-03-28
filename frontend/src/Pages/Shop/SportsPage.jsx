import React,{useState} from 'react'
import productsData from '../../data/products.json'
import { useEffect } from 'react';
import ProductCards from './ProductCards';
import SportsPageFilter from './SportsPageFilter';

const filters = {
    categories: ['All','Hard Ball Bat','Tape Ball Bat', 'Pads','Thigh Pads','Gloves','Helmet','Guard','Tape Ball','Hard Ball','Kit Bags','Cricket Spikes',
        'Football Boots','Football','Gym Accessories','SportsWear Shirts','Trousers','Hoodies','Zippers','TrackSuits','Shorts','Caps','Custom Shirts',
        'Indoor Games'],

    priceRange: [
        {label: 'Under Rs.1000', min: 0, max: 1000},
        {label: 'Rs. 1000 - Rs. 2000', min: 1000, max: 2000},
        {label: 'Rs. 2000 - Rs. 3000', min: 2000, max: 3000},
        {label: 'Rs. 3000 - Rs. 4000', min: 3000, max: 4000},
        {label: 'Rs. 4000 - Rs. 5000', min: 4000, max: 5000},
        {label: 'Rs. 5000 and above', min: 5000, max: Infinity},
    ],
    }

const SportsPage = () => {

    const[products, setProducts] = useState(productsData);
    const [filteredProducts, setFilteredProducts] = useState({
        category: 'All',
        priceRange: '' // Default price range
    });

    const applyFilters = () => {
        let filtered = productsData;
    
        // Apply category filter
        if (filteredProducts && filteredProducts.category !== 'All') {
            filtered = filtered.filter(product => product.category === filteredProducts.category);
        }
    
        // Apply price range filter
        if (filteredProducts.priceRange) {
            const [minPrice, maxPrice] = filteredProducts.priceRange.split('-').map(Number);
            filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
        }
    
        setProducts(filtered);
    }


    useEffect(()=>{applyFilters()},[filteredProducts]);

    useEffect(() => {window.scrollTo(0, 0)}, []);

    const clearFilters = () => {
        setFilteredProducts({
            category: 'All',
            priceRange: ''
        });
    }

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Explore Our Collection</h2>
                <p className='section__subheader'>Browse through our wide range of premium sports gear and apparel.</p>
            </section>

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    
                    <SportsPageFilter filters={filters} filteredProducts={filteredProducts} setFilteredProducts={setFilteredProducts} clearFilters={clearFilters} />

                    <div>
                        <h3 className='tetxt-xl font-medium mb-4'>Available Products: {products.length}</h3>
                        <ProductCards products={products} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default SportsPage