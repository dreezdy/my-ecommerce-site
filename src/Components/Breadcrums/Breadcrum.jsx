import React from 'react'
import './Breadcrum.css'
import { Link } from 'react-router-dom';
// import arrow_icon from '../Assets/arrow_icon.png'

export const Breadcrum = (props) => {
    const {product} = props;
  return (
    // <div className='breadcrum'>
    //     HOME <img src={arrow_icon} alt="" className='arrow_icon' /> SHOP <img src={arrow_icon} alt="" className='arrow_icon' /> {product.category} <img src={arrow_icon} alt="" className='arrow_icon' /> {product.name}
    // </div>
     <div className='breadcrum'>
        <Link to="/home" className='breadcrum-link'>
          HOME 
        </Link>\
        <Link to="/shop" className='breadcrum-link'>
          SHOP 
        </Link>\
        <Link to="/shop" className='breadcrum-link'>
          {product.category}  
        </Link>\
         {product.name}
    </div>
  )
}
