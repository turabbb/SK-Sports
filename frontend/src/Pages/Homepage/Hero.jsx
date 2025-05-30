import React from 'react';
import card1 from '../../Assets/card1.png';
import card2 from '../../Assets/card2.png';
import card3 from '../../Assets/card3.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
  const cards = [
    {
      id: 1,
      image: card1,
      trend: 'Trending 2025',
      title: 'Champions Trophy Kits',
      link: '/sports?category=SportsWear Shirts'
    },
    {
      id: 2,
      image: card2,
      trend: 'Season 10',
      title: 'PSL Kits',
      link: '/sports?category=SportsWear Shirts'
    },
    {
      id: 3,
      image: card3,
      trend: 'All time favourite',
      title: 'Football Kits',
      link: '/sports?category=SportsWear Shirts'
    },
  ];

  return (
    <section className="section__container hero__container">
      {cards.map((card) => (
        <Link key={card.id} to={card.link} className="hero__card">
          <img src={card.image} alt={card.title} /> 
          <div className="hero__content">
            <p>{card.trend}</p>
            <h4>{card.title}</h4>
            <span>Discover More</span>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default Hero;