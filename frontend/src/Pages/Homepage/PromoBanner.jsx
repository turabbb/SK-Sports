import React from 'react'

const PromoBanner = () => {
  return (
    <section className='section__container banner__container'>
        <div className='banner__card'>
        <span><i className="ri-truck-line"></i></span>
        <h4>International Delivery</h4>
        <p>Enjoy fast international delivery and get your favorite sports gear delivered worldwide!</p>
        </div>

        <div className='banner__card'>
        <span><i className="ri-money-dollar-circle-line"></i></span>
        <h4>100% Money-Back Guarantee</h4>
        <p>Shop with confidence! We offer a money-back guarantee on all orders, ensuring your satisfaction.</p>
        </div>
        
        <div className='banner__card'>
        <span><i className="ri-customer-service-fill"></i></span>
        <h4>24/7 Support</h4>
        <p>Need help? We are always here for you 24/7 to assist with any inquiries or issues.</p>
        </div>
    </section>
  )
}

export default PromoBanner