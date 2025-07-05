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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
      {products.map((product, index) => (
        <div key={index} className="product__card relative">
          <div className="relative">
            <Link to={`/sports/${product._id}`}>
              <img
                src={product.image?.[0] || '/placeholder-image.jpg'}
                alt="product image"
                className="h-48 sm:h-64 w-full object-cover rounded-lg hover:scale-105 transition-all duration-300"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </Link>
          </div>

          <div className="hover:block absolute top-2 right-2 sm:top-3 sm:right-3">
            <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product)}}>
              <i className="ri-shopping-cart-2-line bg-primary p-1 sm:p-1.5 text-white hover:bg-primary-dark text-sm sm:text-base"></i>
            </button>
          </div>

          <div className='product__card__content'>
            <h4 className="text-sm sm:text-base">{product.name}</h4>
            <p className="text-sm sm:text-base">Rs. {product.price} {product.oldPrice ? <s>Rs. {product?.oldPrice}</s> : null}</p>
            <div className="scale-90 sm:scale-100 origin-left">
              <RatingStars ratings={product.rating} />
            </div>
          </div>
  
        </div>
      ))}
    </div>
  );
};

export default ProductCards;