import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Assets/arrow_icon.png'

export const Breadcrum = (props) => {
    const {product} = props;
  return (
    // <div className='breadcrum'>
    //     HOME <img src={arrow_icon} alt="" className='arrow_icon' /> SHOP <img src={arrow_icon} alt="" className='arrow_icon' /> {product.category} <img src={arrow_icon} alt="" className='arrow_icon' /> {product.name}
    // </div>
     <div className='breadcrum'>
        HOME > SHOP > {product.category} > {product.name}
    </div>
  )
}
