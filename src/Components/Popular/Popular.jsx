
import React, { useContext, useRef } from 'react';
import './Popular.css';
import { ShopContext } from '../../Context/ShopContext';
import { Item } from '../Item/Item';

export const Popular = () => {
  const sliderRef = useRef(null);
  const { all_product, loading } = useContext(ShopContext);

  // Popular = the first 8 perfumes in all_product.js
  const popularProducts = all_product.slice(0, 8);

  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction * sliderRef.current.clientWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
  return (
    <div className="popular">
      <h1>Popular Products</h1>
      <hr />
      <p className="loading-text">Loading perfumes...</p>
    </div>
  );
  }

  return (
    <div className="popular">
      <h1>Popular Products</h1>
      <hr />

      <div className="popular-slider">
        <button
          className="popular-arrow left"
          onClick={() => scroll(-1)}
          aria-label="Scroll products left"
          type="button"
        >
          &#10094;
        </button>

        <div className="popular-item" ref={sliderRef}>
          {popularProducts.map((item) => (
            <div className="popular-card" key={item.id}>
              <Item
                id={item.id}
                name={item.name}
                new_price={item.new_price}
                old_price={item.old_price}
                image={item.image}
              />
            </div>
          ))}
        </div>

        <button
          className="popular-arrow right"
          onClick={() => scroll(1)}
          aria-label="Scroll products right"
          type="button"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};