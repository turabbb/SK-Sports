import React from 'react'
import deals from '../../Assets/deals.png'

const Deals = () => {
  return (
    <section className='section__container deals__container'>
        <div className='deals__image'>
            <img src={deals} alt="deal" />
        </div>

        <div className='deals__content'>
            <h5>Get Up To 15% Discount!</h5>
            <h4>Deals of the Month</h4>
            <p>Gear up for greatness with unbeatable deals on top-quality sports gear! Shop now and score big savings on 
                cricket kits, football essentials, and accessories designed for champions.</p>

            <div className='deals__countdown flex-wrap'>
                <div className='deals__countdown__card'>
                    <h4>13</h4>
                    <p>Days</p>
                </div>
                <div className='deals__countdown__card'>
                    <h4>21</h4>
                    <p>Hours</p>
                </div>
                <div className='deals__countdown__card'>
                    <h4>35</h4>
                    <p>Mins</p>
                </div>
                <div className='deals__countdown__card'>
                    <h4>19</h4>
                    <p>Secs</p>
                </div>
            </div>
        </div>

    </section>
  )
}

export default Deals