import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../Components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Features/Cart/CartSlice';

const ProductCards = ({ products }) => {

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <div key={index} className="product__card relative">
          <div className="relative">
            <Link to={`/sports/${product.id}`}>
              <img
                src={product.image}
                alt="product image"
                className="h-64 w-full object-cover rounded-lg hover:scale-105 transition-all duration-300"
              />
            </Link>
          </div>

          <div className="hover:block absolute top-3 right-3">
            <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product)}}>
              <i className="ri-shopping-cart-2-line bg-primary p-1.5 text-white hover:bg-primary-dark"></i>
            </button>
          </div>

          <div className='product__card__content'>
            <h4>{product.name}</h4>
            <p>Rs. {product.price} {product.oldPrice ? <s>Rs. {product?.oldPrice}</s> : null}</p>
            <RatingStars ratings={product.rating} />
          </div>
  
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
