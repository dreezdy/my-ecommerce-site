import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import './Item.css';

export const Item = (props) => {
  const { addToCart } = useContext(ShopContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(props.id);
  };

  return (
    <div className="item">
      <div className="item-image-container">
        <Link to={`/product/${props.id}`}>
          <img
            src={props.image}
            alt={props.name}
            className="item-image"
          />
        </Link>

        <button
          type="button"
          className="item-add-to-cart"
          onClick={handleAddToCart}
          aria-label={`Add ${props.name} to cart`}
          title="Add to cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>

      <Link
        to={`/product/${props.id}`}
        className="item-details-link"
      >
        <p>{props.name}</p>

        <div className="item-prices">
          <div className="item-price-new">
            ₦{Number(props.new_price).toLocaleString('en-NG')}
          </div>

          {props.old_price != null && (
            <div className="item-price-old">
              ₦{Number(props.old_price).toLocaleString('en-NG')}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};