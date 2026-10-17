import React, { useContext } from 'react'
import './RelatedProducts.css'
import { ShopContext } from '../../Context/ShopContext'
import { Item } from '../Item/Item'

export const RelatedProducts = ({ product }) => {
  const { all_product } = useContext(ShopContext)

  // Same category as the product being viewed, but not the product itself.
  // Show at most 4.
  const related = all_product
    .filter((item) => item.category === product?.category && item.id !== product?.id)
    .slice(0, 4)

  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
            {related.map((item) => {
                return <Item key={item.id} id={item.id} name={item.name} new_price={item.new_price} old_price={item.old_price} image={item.image}/>
            })}
        </div>
    </div>
  )
}
