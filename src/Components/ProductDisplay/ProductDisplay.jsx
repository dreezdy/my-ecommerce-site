import React, { useContext, useState, useEffect } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const MAX_QUANTITY = 99 // same limit as the cart and backend

export const ProductDisplay = (props) => {
  const {product} = props;
  const {addToCart} = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // If the person opens a different perfume, start again at 1
  useEffect(() => {
    setQuantity(1)
    setAdded(false)
  }, [product.id])

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
    setQuantity(1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }
  return (
    <div className='productdisplay'>
      <div className='productdisplay-left'>
        <div className="productdisplay-img">
            <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>
      <div className='productdisplay-right'>
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_dull_icon} alt="" />
            <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">₦{Number(product.old_price).toLocaleString('en-NG')}</div>
          <div className="productdisplay-right-price-new">₦{Number(product.new_price).toLocaleString('en-NG')}</div>
        </div>
        <div className="productdisplay-right-description">
            A smooth, warm fragrance that opens with a hint of citrus, settles into soft florals, and finishes with a rich blend of amber and musk—clean, elegant, and subtly addictive.
        </div>
          
          <div className="productdisplay-right-size">
            <div className="productdisplay-quantity">
              <span className="productdisplay-quantity-label">Quantity</span>
              <div className="quantity-selector">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(q + 1, MAX_QUANTITY))}
                  disabled={quantity >= MAX_QUANTITY}
                >
                  +
                </button>
              </div>
            </div>
            <button onClick={handleAddToCart}>{added ? 'ADDED ✓' : 'ADD TO CART'}</button>
            <p className='productdisplay-right-category'>
              <span><b>Categories: </b></span>
               {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ''}
              <span> Fragrance</span>
            </p>
          </div>
        
      </div>
    </div>
  )
}
