import React from 'react'
import './Offers.css'
import offers_img from '../Assets/hero-image2.jpg'

export const Offers = () => {
  return (
    <div className="offers">
        <div className="offers-left">
            <h2>Special Offers</h2>
            <h1>Offers for You</h1>
            <p>Discover our exclusive offers and discounts on a wide range of perfumes. Shop now and indulge in irresistible deals that will elevate your fragrance collection without breaking the bank.</p>
            <button>Shop Now</button>
        </div>
        <div className="offers-right">
            <img src={offers_img} alt="Special Offers" />
        </div>
    </div>
  )
}
