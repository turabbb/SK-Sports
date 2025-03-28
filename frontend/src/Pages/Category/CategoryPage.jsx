import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import products from '../../data/products.json'
import ProductCards from '../../Pages/Shop/ProductCards'

const CategoryPage = () => {
    const {categoryName} = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const filtered = products.filter((product) => product.category === categoryName.toLowerCase());
        setFilteredProducts(filtered);
    },[categoryName]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  return (
    <>
    <section className='section__container bg-primary-light'>
        <h2 className='section__header capitalize'>{categoryName}</h2>
        <p className='section__subheader'>Explore premium sports gear, custom kits, and accessories designed for performance, style, and every game.</p>
    </section>

    <div className='section__container'>
        <ProductCards products={filteredProducts} />
    </div>
    </>
  )
}

export default CategoryPage