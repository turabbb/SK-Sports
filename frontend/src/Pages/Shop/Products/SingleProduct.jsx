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


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, error, isLoading } = useFetchProductsByIdQuery(id, { skip: !id });
    const singleProduct = data?.product || {};

    const { data: allProductsData } = useFetchAllProductsQuery({ category: '', limit: 100 }, {
        skip: !singleProduct?.category
    });

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (singleProduct?.category && allProductsData?.products) {
            const related = allProductsData.products
                .filter(product => product.category === singleProduct.category && product._id !== singleProduct._id)
                .slice(0, 4);
            setRelatedProducts(related);
        }
    }, [singleProduct, allProductsData]);

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            ...product,
            quantity,
            selectedSize: selectedSize || 'M',
        }));
        navigate('/cart');
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

    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

    if (isLoading) return <div className="section__container">Loading...</div>;
    if (error) return <div className="section__container">Error loading product: {error.message || 'Unknown error'}</div>;
    if (!id || !singleProduct || Object.keys(singleProduct).length === 0) return <div className="section__container">Product not found</div>;

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

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative max-w-4xl w-full h-[80vh] p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-white text-3xl hover:text-red-400"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        <div className="w-full h-full overflow-hidden group relative">
                            <img
                                src={modalImageSrc}
                                alt="Zoomed"
                                className="w-full h-full object-contain transform group-hover:scale-150 transition-transform duration-300 cursor-zoom-out"
                                style={{ transitionTimingFunction: 'ease-in-out' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <section className='section__container py-12'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left - Carousel Image */}
                    <div className="relative space-y-4">
                        <div className="overflow-hidden relative h-[600px] bg-gray-50 rounded-lg">
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
                                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-3 py-2 rounded-r shadow"
                                        onClick={handlePrevImage}
                                    >
                                        <i className="ri-arrow-left-s-line text-xl"></i>
                                    </button>
                                    <button
                                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-3 py-2 rounded-l shadow"
                                        onClick={handleNextImage}
                                    >
                                        <i className="ri-arrow-right-s-line text-xl"></i>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {singleProduct.image.length > 1 && (
                            <div className="flex space-x-2">
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

                                        className={`w-20 h-20 object-cover border-2 rounded cursor-pointer ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">{singleProduct.name}</h1>

                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`ri-star-${i < Math.floor(singleProduct.rating || 0) ? 'fill' : 'line'}`}></i>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({singleProduct.rating || 0} rating)</span>
                        </div>

                        <div className="text-2xl font-bold text-primary">
                            Rs. {singleProduct.price?.toLocaleString() || 0}
                            {singleProduct.oldPrice && (
                                <span className="ml-2 text-gray-500 text-lg line-through">
                                    Rs. {singleProduct.oldPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600">{singleProduct.description || 'No description available'}</p>

                        <p className="text-gray-600">
                            Shipping internationally available. Please contact us on WhatsApp for details and customization options.
                        </p>

                        {/* Sizes */}
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

                        {/* Quantity & Cart */}
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(singleProduct);
                                }}
                                className="flex-1 bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors"
                            >
                                ADD TO CART
                            </button>
                        </div>

                        {/* Meta Info */}
                        <div className="pt-6 border-t space-y-2 text-sm">
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

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-12">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link key={relatedProduct._id} to={`/sports/${relatedProduct._id}`} className="block">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={relatedProduct.image[0]}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">{relatedProduct.name}</h3>
                                            <p className="text-gray-600 h-12 overflow-hidden text-sm">{relatedProduct.description}</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-lg font-bold text-primary">
                                                    Rs. {relatedProduct.price?.toLocaleString()}
                                                </span>
                                                <button
                                                    className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(addToCart({
                                                            ...relatedProduct,
                                                            quantity: 1,
                                                            selectedSize: 'M'
                                                        }));
                                                    }}
                                                >
                                                    <i className="ri-shopping-cart-line"></i>
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
