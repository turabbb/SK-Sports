import React from 'react'

const RatingStars = ({ratings}) => {

    const stars = [];

    for(let i=0; i<5; i++){
        stars.push(
            <span key={i} className={`ri-star${i <= ratings ? '-fill' : '-line'}`}></span>
        )
    }
  return (
    <div className='product__rating'>{stars}</div>
  )
}

export default RatingStars