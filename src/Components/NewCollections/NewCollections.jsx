import React from 'react'
import './NewCollections.css'
import data_product from '../Assets/newcollections'
import {Item} from '../Item/Item';

export const NewCollections = () => {
  return (
    <div className="new-collections">
        <h1>NEW COLLECTIONS</h1>
        <hr/>
        <div className="collections">
             {data_product.map((item,i) => {
                return <Item key={i} id={item.id} name={item.name} new_price={item.new_price} old_price={item.old_price} image={item.image}/>
            })}
        </div>
    </div>
  )
}
