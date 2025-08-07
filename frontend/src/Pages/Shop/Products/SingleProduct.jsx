import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFetchProductsByIdQuery, useFetchAllProductsQuery } from '../../../Redux/Features/Products/products';
import { addToCart } from '../../../Redux/Features/Cart/CartSlice';

const SingleProduct = () => {
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
    const [availableSizes, setAvailableSizes] = useState([]);
    const [sizesLoading, setSizesLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, error, isLoading } = useFetchProductsByIdQuery(id, { skip: !id });
    const singleProduct = data?.product || {};

    const { data: allProductsData } = useFetchAllProductsQuery({ category: '', limit: 100 }, {
        skip: !singleProduct?.category
    });

    const [relatedProducts, setRelatedProducts] = useState([]);



    // Fetch sizes based on product category or use product's sizes
    useEffect(() => {
        const fetchSizes = async () => {
            if (singleProduct?.category) {
                setSizesLoading(true);
                try {
                    // First, check if product already has sizes from backend
                    if (singleProduct.sizes && Array.isArray(singleProduct.sizes) && singleProduct.sizes.length > 0) {
                        setAvailableSizes(singleProduct.sizes);
                        // Only set default size if sizes exist
                        if (singleProduct.sizes.length > 0) {
                            setSelectedSize(singleProduct.sizes[0]);
                        }
                    } else {
                        // Fallback: fetch sizes based on category
                        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/sizes/${singleProduct.category}`);
                        if (response.ok) {
                            const data = await response.json();
                            setAvailableSizes(data.sizes || []);
                            // Only set default size if sizes exist
                            if (data.sizes && data.sizes.length > 0) {
                                setSelectedSize(data.sizes[0]);
                            } else {
                                setSelectedSize(''); // No size needed for this category
                            }
                        } else {
                            // Ultimate fallback - no sizes
                            setAvailableSizes([]);
                            setSelectedSize('');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching sizes:', error);
                    // Fallback sizes
                    setAvailableSizes(['S', 'M', 'L', 'XL']);
                    setSelectedSize('M');
                } finally {
                    setSizesLoading(false);
                }
            }
        };

        fetchSizes();
    }, [singleProduct?.category, singleProduct?.sizes]);

    useEffect(() => {
        if (singleProduct?.category && allProductsData?.products) {
            const related = allProductsData.products
                .filter(product => product.category === singleProduct.category && product._id !== singleProduct._id)
                .slice(0, 4);
            setRelatedProducts(related);
        }
    }, [singleProduct, allProductsData]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const img = document.getElementById('zoom-img');
            if (!img) return;

            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            img.style.transformOrigin = `${x}% ${y}%`;
        };

        if (isModalOpen) {
            window.addEventListener('mousemove', handleMouseMove);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isModalOpen]);


    const handleAddToCart = (product) => {
        // Only check for size if the product category requires sizes
        if (availableSizes.length > 0 && !selectedSize) {
            alert('Please select a size before adding to cart');
            return;
        }

        const cartItem = {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            color: product.color,
            description: product.description,
            rating: product.rating,
            quantity: parseInt(quantity), // Ensure it's a number
            selectedSize: selectedSize || null, // null for products without sizes
        };

        console.log('Adding to cart:', cartItem); // Debug log

        dispatch(addToCart(cartItem));
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? singleProduct.image.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === singleProduct.image.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    useEffect(() => {
        if (window.fbq && singleProduct && singleProduct._id) {
            window.fbq('track', 'ViewContent', {
                content_name: singleProduct.name,
                content_ids: [singleProduct._id],
                content_type: 'product',
                value: singleProduct.price || 0,
                currency: 'PKR',
                category: singleProduct.category,
            });
            console.log('[Meta Pixel] ViewContent event fired for:', singleProduct.name);
        }
    }, [singleProduct]);

    if (isLoading) return <div className="section__container p-4 sm:p-6">Loading...</div>;
    if (error) return <div className="section__container p-4 sm:p-6">Error loading product: {error.message || 'Unknown error'}</div>;
    if (!id || !singleProduct || Object.keys(singleProduct).length === 0) return <div className="section__container p-4 sm:p-6">Product not found</div>;

    return (
        <>
            <section className='section__container bg-primary-light px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <h2 className='section__header capitalize text-2xl sm:text-3xl lg:text-4xl'>Explore Our Collection</h2>
                <div className='section__subheader space-x-2 text-sm sm:text-base'>
                    <span><Link to="/">Home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span><Link to="/sports">Products</Link></span>
                </div>
            </section>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    {/* Close Button (top-right corner of screen) */}
                    <button
                        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 text-white text-2xl sm:text-4xl font-bold hover:text-red-400 bg-black bg-opacity-50 rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center"
                        onClick={() => setIsModalOpen(false)}
                    >
                        &times;
                    </button>

                    <div
                        className="relative max-w-4xl w-full h-[80vh] p-2 sm:p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-full overflow-hidden relative group bg-black">
                            <img
                                src={modalImageSrc}
                                alt="Zoomed"
                                className="w-full h-full object-contain pointer-events-none"
                                style={{
                                    transform: `scale(2)`,
                                    transformOrigin: 'center',
                                }}
                                id="zoom-img"
                            />
                        </div>
                    </div>
                </div>
            )}

            <section className='section__container py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Left - Carousel Image */}
                    <div className="relative space-y-4 order-1 lg:order-1">
                        <div className="overflow-hidden relative h-64 sm:h-80 md:h-96 lg:h-[600px] bg-gray-50 rounded-lg">
                            <img
                                src={singleProduct.image[currentImageIndex]}
                                alt={singleProduct.name}
                                className="w-full h-full object-contain cursor-zoom-in"
                                onClick={() => {
                                    setModalImageSrc(singleProduct.image[currentImageIndex]);
                                    setIsModalOpen(true);
                                }}
                            />

                            {singleProduct.image.length > 1 && (
                                <>
                                    <button
                                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-2 sm:px-3 py-2 rounded-r shadow"
                                        onClick={handlePrevImage}
                                    >
                                        <i className="ri-arrow-left-s-line text-lg sm:text-xl"></i>
                                    </button>
                                    <button
                                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-2 sm:px-3 py-2 rounded-l shadow"
                                        onClick={handleNextImage}
                                    >
                                        <i className="ri-arrow-right-s-line text-lg sm:text-xl"></i>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {singleProduct.image.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {singleProduct.image.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            setModalImageSrc(singleProduct.image[index]);
                                            setIsModalOpen(true);
                                        }}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 object-cover border-2 rounded cursor-pointer flex-shrink-0 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Product Info */}
                    <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{singleProduct.name}</h1>

                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`ri-star-${i < Math.floor(singleProduct.rating || 0) ? 'fill' : 'line'}`}></i>
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500">({singleProduct.rating || 0} rating)</span>
                        </div>

                        <div className="text-xl sm:text-2xl font-bold text-primary">
                            Rs. {singleProduct.price?.toLocaleString() || 0}
                            {singleProduct.oldPrice && (
                                <span className="ml-2 text-gray-500 text-base sm:text-lg line-through">
                                    Rs. {singleProduct.oldPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-sm sm:text-base text-gray-600">{singleProduct.description || 'No description available'}</p>

                        <p className="text-sm sm:text-base text-gray-600">
                            Shipping internationally available. Please contact us on WhatsApp for details and customization options.
                        </p>

                        {/* Dynamic Sizes - Only show if product has sizes */}
                        {availableSizes.length > 0 && (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Size:
                                    {sizesLoading && <span className="ml-2 text-xs text-gray-500">(Loading sizes...)</span>}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`px-3 sm:px-4 py-2 border rounded-md transition-all text-sm sm:text-base ${selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300 hover:border-primary'
                                                }`}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={sizesLoading}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize && (
                                    <p className="text-sm text-gray-600">
                                        Selected size: <span className="font-medium">{selectedSize}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Quantity & Cart */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex items-center border rounded-md w-full sm:w-auto">
                                <button
                                    className="px-3 sm:px-4 py-2 border-r hover:bg-gray-100 flex-shrink-0"
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                >
                                    <i className="ri-subtract-line"></i>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => {
                                        const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                                        setQuantity(newQuantity);
                                    }}
                                    className="w-12 sm:w-16 text-center py-2 text-sm sm:text-base"
                                />
                                <button
                                    className="px-3 sm:px-4 py-2 border-l hover:bg-gray-100 flex-shrink-0"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <i className="ri-add-line"></i>
                                </button>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(singleProduct);
                                }}
                                disabled={sizesLoading || (availableSizes.length > 0 && !selectedSize)}
                                className={`flex-1 py-2 px-4 sm:px-6 rounded-md transition-colors text-sm sm:text-base font-medium ${sizesLoading || (availableSizes.length > 0 && !selectedSize)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                            >
                                {sizesLoading ? 'Loading...' : 'ADD TO CART'}
                            </button>
                        </div>

                        {/* Meta Info */}
                        <div className="pt-4 sm:pt-6 border-t space-y-2 text-sm sm:text-base">
                            <p>
                                <span className="font-medium">Category:</span>{' '}
                                <Link to={`/category/${singleProduct.category}`} className="text-gray-600 hover:text-primary">
                                    {singleProduct.category || 'Uncategorized'}
                                </Link>
                            </p>
                            {singleProduct.color && (
                                <p>
                                    <span className="font-medium">Color:</span>{' '}
                                    <span className="text-gray-600">{singleProduct.color}</span>
                                </p>
                            )}
                        </div>

                        {/* Social */}
                        <div className="flex items-center gap-4 pt-4 sm:pt-6 border-t">
                            <span className="text-sm font-medium">Share:</span>
                            <div className="flex gap-2">
                                {['facebook', 'instagram', 'whatsapp'].map((social) => (
                                    <button
                                        key={social}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                    >
                                        <i className={`ri-${social}-fill text-sm`}></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 sm:mt-16 lg:mt-24">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link key={relatedProduct._id} to={`/sports/${relatedProduct._id}`} className="block">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="h-40 sm:h-48 overflow-hidden">
                                            <img
                                                src={relatedProduct.image[0]}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                                            />
                                        </div>
                                        <div className="p-3 sm:p-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{relatedProduct.name}</h3>
                                            <p className="text-gray-600 h-10 sm:h-12 overflow-hidden text-xs sm:text-sm mt-1 sm:mt-2">{relatedProduct.description}</p>
                                            <div className="mt-3 sm:mt-4 flex items-center justify-between">
                                                <span className="text-base sm:text-lg font-bold text-primary">
                                                    Rs. {relatedProduct.price?.toLocaleString()}
                                                </span>
                                                <button
                                                    className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(addToCart({
                                                            _id: relatedProduct._id,
                                                            name: relatedProduct.name,
                                                            price: relatedProduct.price,
                                                            image: relatedProduct.image,
                                                            category: relatedProduct.category,
                                                            color: relatedProduct.color,
                                                            description: relatedProduct.description,
                                                            rating: relatedProduct.rating,
                                                            quantity: 1,
                                                            selectedSize: relatedProduct.sizes?.[0] || null
                                                        }));
                                                    }}
                                                >
                                                    <i className="ri-shopping-cart-line text-sm sm:text-base"></i>
                                                </button>
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