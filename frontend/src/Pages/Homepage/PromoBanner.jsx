import React from 'react'

const PromoBanner = () => {
  return (
    <section className='section__container banner__container grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6'>
        <div className='banner__card text-center p-4 sm:p-6'>
        <span className='block mb-3 sm:mb-4'><i className="ri-truck-line text-2xl sm:text-3xl lg:text-4xl text-blue-600"></i></span>
        <h4 className='text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3'>International Delivery</h4>
        <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>Enjoy fast international delivery and get your favorite sports gear delivered worldwide!</p>
        </div>

        <div className='banner__card text-center p-4 sm:p-6'>
        <span className='block mb-3 sm:mb-4'><i className="ri-money-dollar-circle-line text-2xl sm:text-3xl lg:text-4xl text-green-600"></i></span>
        <h4 className='text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3'>100% Money-Back Guarantee</h4>
        <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>Shop with confidence! We offer a money-back guarantee on all orders, ensuring your satisfaction.</p>
        </div>
        
        <div className='banner__card text-center p-4 sm:p-6'>
        <span className='block mb-3 sm:mb-4'><i className="ri-customer-service-fill text-2xl sm:text-3xl lg:text-4xl text-purple-600"></i></span>
        <h4 className='text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3'>24/7 Support</h4>
        <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>Need help? We are always here for you 24/7 to assist with any inquiries or issues.</p>
        </div>
    </section>
  )
}

export default PromoBanner