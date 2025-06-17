import React from 'react';
import card2 from '../../Assets/card2.png';
import IPL from '../../Assets/IPL.webp'
import BigBash from '../../Assets/BigBash.webp'
import { Link } from 'react-router-dom';

const Hero = () => {
  const cards = [
    {
      id: 1,
      image: BigBash,
      trend: 'Trending 2025',
      title: 'BigBash League Jerseys',
      link: '/sports?category=Big Bash League Jerseys'
    },
    {
      id: 2,
      image: card2,
      trend: 'Season 10',
      title: 'PSL Jerseys',
      link: '/sports?category=PSL Jerseys'
    },
    {
      id: 3,
      image: IPL,
      trend: 'All time favourite',
      title: 'IPL Jerseys',
      link: '/sports?category=IPL Jerseys'
    },
  ];

  return (
    <section className="section__container hero__container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6">
      {cards.map((card) => (
        <Link key={card.id} to={card.link} className="hero__card">
          <img src={card.image} alt={card.title} className="w-full h-auto object-cover" /> 
          <div className="hero__content">
            <p className="text-xs sm:text-sm">{card.trend}</p>
            <h4 className="text-base sm:text-lg lg:text-xl">{card.title}</h4>
            <span className="text-xs sm:text-sm">Discover More</span>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default Hero;