import React from 'react';
import cat1 from '../../Assets/category1.jpg';
import cat2 from '../../Assets/category2.jpg';
import cat3 from '../../Assets/category3.jpg';
import cat4 from '../../Assets/category4.jpg';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    { 
      id: 1, 
      name: 'Cricket', 
      path: '/sports?categories=Hard Ball Bat,Tape Ball Bat,Pads,Thigh Pads,Gloves,Helmet,Guard,Tape Ball,Hard Ball,Kit Bags,Cricket Spikes', 
      image: cat1 
    },
    { 
      id: 2, 
      name: 'Football', 
      path: '/sports?categories=Football Boots,Football', 
      image: cat2 
    },
    { 
      id: 3, 
      name: 'Accessories', 
      path: '/accessories', // This will use your existing AccessoriesPage
      image: cat3 
    },
    { 
      id: 4, 
      name: 'Custom Kits', 
      path: '/sports?category=Custom Shirts', // Single category filter
      image: cat4 
    },
  ];

  return (
    <div className="product__grid">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={category.path}
          className="categories__card"
        >
          <img src={category.image} alt={category.name} />
          <h4>{category.name}</h4>
        </Link>
      ))}
    </div>
  );
};

export default Categories;