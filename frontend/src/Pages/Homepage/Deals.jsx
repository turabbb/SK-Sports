import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import deals from '../../Assets/deals.png'

const Deals = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isVisible, setIsVisible] = useState(false);

    // Set target date (you can change this to any future date)
    const getTargetDate = () => {
        const now = new Date();
        const target = new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 days from now
        return target;
    };

    const [targetDate, setTargetDate] = useState(getTargetDate());

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                // Timer expired, reset to new date
                const newTarget = getTargetDate();
                setTargetDate(newTarget);
            }
        }, 1000);

        // Visibility observer for animations
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.querySelector('.deals__container');
        if (element) {
            observer.observe(element);
        }

        return () => {
            clearInterval(timer);
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [targetDate]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const countdownVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { scale: 0, rotateY: 90 },
        visible: {
            scale: 1,
            rotateY: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        },
        hover: {
            scale: 1.05,
            rotateX: 5,
            transition: { duration: 0.2 }
        }
    };

    const numberVariants = {
        initial: { y: 0 },
        animate: { y: [-5, 0, -5] },
        transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }
    };

    return (
        <motion.section 
            className='section__container deals__container grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center p-4 sm:p-6 lg:p-8'
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
        >
            <motion.div 
                className='deals__image order-2 lg:order-1 w-full max-w-md lg:max-w-none mx-auto'
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <img src={deals} alt="deal" className='w-full h-auto object-cover rounded-lg' />
            </motion.div>

            <motion.div 
                className='deals__content order-1 lg:order-2 text-center lg:text-left'
                variants={itemVariants}
            >
                <motion.h5
                    variants={itemVariants}
                    className="relative text-sm sm:text-base lg:text-lg mb-3 sm:mb-4"
                >
                    <motion.span
                        initial={{ backgroundPosition: "0% 50%" }}
                        animate={{ backgroundPosition: "100% 50%" }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                            background: "linear-gradient(90deg, currentColor 0%, rgba(255,215,0,0.8) 50%, currentColor 100%)",
                            backgroundSize: "200% 100%",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        Get Special Discounts on All Products!
                    </motion.span>
                </motion.h5>

                <motion.h4 variants={itemVariants} className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 lg:mb-6'>
                    Deals of the Month
                </motion.h4>

                <motion.p variants={itemVariants} className='text-sm sm:text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0'>
                    Gear up for greatness with unbeatable deals on top-quality sports gear! Shop now and score big savings on 
                    cricket kits, football essentials, and accessories designed for champions.
                </motion.p>

                <motion.div 
                    className='deals__countdown grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-md mx-auto lg:mx-0'
                    variants={countdownVariants}
                >
                    <AnimatePresence mode="wait">
                        <motion.div 
                            className='deals__countdown__card text-center p-3 sm:p-4 bg-white rounded-lg shadow-lg'
                            variants={cardVariants}
                            whileHover="hover"
                            style={{
                                perspective: "1000px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    ease: "easeInOut"
                                }}
                                style={{ transform: "skewX(-20deg)" }}
                            />
                            <motion.h4
                                key={timeLeft.days}
                                variants={numberVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                    ...numberVariants.transition,
                                    delay: 0
                                }}
                                className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1'
                            >
                                {String(timeLeft.days).padStart(2, '0')}
                            </motion.h4>
                            <p className='text-xs sm:text-sm text-gray-600'>Days</p>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            className='deals__countdown__card text-center p-3 sm:p-4 bg-white rounded-lg shadow-lg'
                            variants={cardVariants}
                            whileHover="hover"
                            style={{
                                perspective: "1000px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    delay: 0.5,
                                    ease: "easeInOut"
                                }}
                                style={{ transform: "skewX(-20deg)" }}
                            />
                            <motion.h4
                                key={timeLeft.hours}
                                variants={numberVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                    ...numberVariants.transition,
                                    delay: 0.2
                                }}
                                className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1'
                            >
                                {String(timeLeft.hours).padStart(2, '0')}
                            </motion.h4>
                            <p className='text-xs sm:text-sm text-gray-600'>Hours</p>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            className='deals__countdown__card text-center p-3 sm:p-4 bg-white rounded-lg shadow-lg'
                            variants={cardVariants}
                            whileHover="hover"
                            style={{
                                perspective: "1000px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    delay: 1,
                                    ease: "easeInOut"
                                }}
                                style={{ transform: "skewX(-20deg)" }}
                            />
                            <motion.h4
                                key={timeLeft.minutes}
                                variants={numberVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                    ...numberVariants.transition,
                                    delay: 0.4
                                }}
                                className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1'
                            >
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </motion.h4>
                            <p className='text-xs sm:text-sm text-gray-600'>Mins</p>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            className='deals__countdown__card text-center p-3 sm:p-4 bg-white rounded-lg shadow-lg'
                            variants={cardVariants}
                            whileHover="hover"
                            style={{
                                perspective: "1000px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    delay: 1.5,
                                    ease: "easeInOut"
                                }}
                                style={{ transform: "skewX(-20deg)" }}
                            />
                            <motion.h4
                                key={timeLeft.seconds}
                                variants={numberVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                    ...numberVariants.transition,
                                    delay: 0.6
                                }}
                                className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1'
                            >
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </motion.h4>
                            <p className='text-xs sm:text-sm text-gray-600'>Secs</p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.section>
    )
}

export default Deals