import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className='footer__container section__container'>

                <div className='footer__col'>
                    <div className="max-w-4xl mx-auto">
                        <iframe
                            title="Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.0450778880013!2d74.39490397624137!3d31.495444748371973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190550d1ade647%3A0xa9ff6510d8cd3d9a!2sSk%20Sports!5e0!3m2!1sen!2s!4v1737979030106!5m2!1sen!2s"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>

                </div>

                <div className='footer__col'>
                    <h4>CONTACT US</h4>
                    <p>
                        <span><i className="ri-map-pin-fill"></i></span>
                        Besides Falcon Cambridge School, Nishal Colony, Lahore Cantt
                    </p>
                    <p>
                        <span><i className="ri-mail-fill"></i></span>
                        sksports@gmail.com
                    </p>
                    <p>
                        <span><i className="ri-phone-fill"></i></span>
                        +92 320 2440328
                    </p>

                    <h4 className='mt-9'>FOLLOW US</h4>

                    <div className="social-icons flex justify-start gap-6 mt-4">
                        <a
                            href="https://www.facebook.com/khalid03202440328"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-xl text-gray-600 hover:text-blue-600"
                        >
                            <span><i className="ri-facebook-fill"></i></span>
                        </a>

                        <a
                            href="https://www.instagram.com/khalidbinumer23/?g=5"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-xl text-gray-600 hover:text-pink-500"
                        >
                            <span><i className="ri-instagram-fill"></i></span>
                        </a>

                        <a
                            href="https://www.tiktok.com/@sksports22"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="text-xl text-gray-600 hover:text-black"
                        >
                            <i className="ri-tiktok-fill"></i>
                        </a>

                        <a
                            href="https://wa.me/+923004194105"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="text-xl text-gray-600 hover:text-green-500"
                        >
                            <span><i className="ri-whatsapp-fill"></i></span>
                        </a>
                    </div>

                </div>



                <div className='footer__col'>
                    <h4>USEFUL LINKS</h4>
                    <a href="/">Home</a>
                    <a href="/">About us</a>
                    <a href="/">Our Blogs</a>
                    <a href="/track">Track your Order</a>
                    <a href="/">Terms & Conditions</a>
                </div>
            </footer>

            <div className='footer__bar'>
                <p>&copy; 2025 SK Sports. All Rights Reserved.</p>
                <p>Designed with passion for sports enthusiasts.</p>
            </div>
        </>
    )
}

export default Footer