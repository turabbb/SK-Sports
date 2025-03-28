import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import products from '../../../data/products.json';

const SingleProduct = () => {
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, [id]);

    // Convert id to number since it comes as string from URL params
    const product = products.find(p => p.id === parseInt(id));

    // Find related products based on category or description
    const relatedProducts = products.filter(
        (p) =>
            p.id !== product.id && // Exclude the current product
            (p.category === product.category || p.description.includes(product.description))
    );

    // Default sizes array since it's not in your data
    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        // Add to cart logic here
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    if (!product) {
        return (
            <div className="section__container">
                <h2>Product not found</h2>
            </div>
        );
    }

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Explore Our Collection</h2>
                <div className='section__subheader space-x-2'>
                    <span><Link to="/">Home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span><Link to="/sports">Products</Link></span>
                </div>
            </section>

            <section className='section__container py-12'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column - Image */}
                    <div className="space-y-6">
                        <div
                            className="relative overflow-hidden rounded-lg bg-gray-50 h-[600px]"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-300 cursor-zoom-in"
                                style={{
                                    transform: isHovered ? 'scale(2)' : 'scale(1)',
                                    transformOrigin: `${position.x}% ${position.y}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'}`}></i>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.rating} rating)</span>
                        </div>

                        {/* Price */}
                        <div className="text-2xl font-bold text-primary">
                            Rs. {product.price?.toLocaleString()}
                            {product.oldPrice && (
                                <span className="ml-2 text-gray-500 text-lg line-through">
                                    Rs. {product.oldPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600">
                            {product.description}
                        </p>

                        {/* International Shipping Note */}
                        <p className="text-gray-600 ">
                            Shipping internationally available. Please contact us on WhatsApp for details and customization options.
                        </p>

                        {/* Size Selection */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Size:</label>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`px-4 py-2 border rounded-md transition-all ${selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300 hover:border-primary'
                                            }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-md">
                                <button
                                    className="px-4 py-2 border-r hover:bg-gray-100"
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                >
                                    <i className="ri-subtract-line"></i>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 text-center py-2"
                                />
                                <button
                                    className="px-4 py-2 border-l hover:bg-gray-100"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <i className="ri-add-line"></i>
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors"
                            >
                                ADD TO CART
                            </button>
                        </div>

                        {/* Wishlist and Size Guide */}
                        <div className="flex items-center gap-6 text-sm">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                                <i className="ri-ruler-line"></i>
                                Size Guide
                            </button>
                        </div>

                        {/* Product Meta */}
                        <div className="pt-6 border-t space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Category:</span>{' '}
                                <Link to={`/category/${product.category}`} className="text-gray-600 hover:text-primary">
                                    {product.category}
                                </Link>
                            </p>
                            {product.color && (
                                <p>
                                    <span className="font-medium">Color:</span>{' '}
                                    <span className="text-gray-600">{product.color}</span>
                                </p>
                            )}
                        </div>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-4 pt-6 border-t">
                            <span className="text-sm font-medium">Share:</span>
                            <div className="flex gap-2">
                                {['facebook', 'instagram', 'whatsapp'].map((social) => (
                                    <button
                                        key={social}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                    >
                                        <i className={`ri-${social}-fill`}></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-12">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link key={relatedProduct.id} to={`/sports/${relatedProduct.id}`} className="block">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{relatedProduct.name}</h3>
                                            <p className="text-gray-600">{relatedProduct.description}</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-lg font-bold text-primary">
                                                    Rs. {relatedProduct.price?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default SingleProduct;