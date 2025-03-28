import React from 'react';
import cat1 from '../../Assets/category1.jpg';
import cat2 from '../../Assets/category2.jpg';
import cat3 from '../../Assets/category3.jpg';
import cat4 from '../../Assets/category4.jpg';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Cricket', path: 'cricket', image: cat1 },
    { id: 2, name: 'Football', path: 'football', image: cat2 },
    { id: 3, name: 'Accessories', path: 'accessories', image: cat3 },
    { id: 4, name: 'Custom Kits', path: 'custom', image: cat4 },
  ];

  return (
    <div className="product__grid">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.path}`}
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
