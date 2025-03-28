import React from 'react'
import { useState, useEffect } from 'react'
import products from '../../data/products.json'
import ProductCards from '../Shop/ProductCards';

const Search = () => {

    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    const handleSearch = () => {
        const query = search.toLowerCase();

        const filtered = products.filter(product => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));

        setFilteredProducts(filtered);
    }

    useEffect(() => {
            window.scrollTo(0, 0)
        }, []);

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Search Products</h2>
                <p className='section__subheader'>Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.</p>
            </section>

            <section className='section__container'>
                <div className='w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4'>
                    <input type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='search-bar w-full max-w-4xl p-2 border rounded'
                    placeholder='Search for Products...' />

                    <button
                    onClick={handleSearch}
                    className='search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded'>Search</button>
                </div>

                <ProductCards products={filteredProducts} />
            </section>
        </>
    )
}

export default Search