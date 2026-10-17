import React, { useContext, useRef } from 'react';
import './NewCollections.css';
import { ShopContext } from '../../Context/ShopContext';
import { Item } from '../Item/Item';

export const NewCollections = () => {
const sliderRef = useRef(null);
const { all_product, loading } = useContext(ShopContext);

// New Collections = the last 8 perfumes in all_product.js
const newProducts = all_product.slice(-8);

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
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <p className="loading-text">Loading perfumes...</p>
    </div>
  );
}

return ( <div className="new-collections"> <h1>NEW COLLECTIONS</h1> <hr />


  <div className="collections-slider">
    <button
      className="collections-arrow left"
      onClick={() => scroll(-1)}
      aria-label="Scroll collections left"
      type="button"
    >
      &#10094;
    </button>

    <div className="collections" ref={sliderRef}>
      {newProducts.map((item) => (
        <div className="collection-card" key={item.id}>
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
      className="collections-arrow right"
      onClick={() => scroll(1)}
      aria-label="Scroll collections right"
      type="button"
    >
      &#10095;
    </button>
  </div>
</div>


);
};
