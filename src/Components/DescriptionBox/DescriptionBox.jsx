import React from 'react'
import './DescriptionBox.css'

export const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>

        <div className="descriptionbox-description">
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis asperiores eos eum nobis omnis corrupti. Asperiores nulla, repellendus alias quibusdam dolorem nam necessitatibus perferendis animi commodi.</p>
            <p>Lorem ipsum dolor sit amet.</p>
        </div>
    </div>
  )
}
