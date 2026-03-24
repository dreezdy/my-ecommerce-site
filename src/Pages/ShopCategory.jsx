import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import './CSS/ShopCategory.css'
import dropdown_icon from '../Components/Assets/arrow_icon.png'
import { Item } from "../Components/Item/Item";

export const ShopCategory = (props) => {
    const {all_product} = useContext(ShopContext);
  return (
    <div className="shop-category">
        <img src={props.banner} alt="" className="banner"/>
        <div className="shopcategory-indexSort">
            <p>
                <span>Showing 1-12</span> out of 20 products
            </p>
            <div className="shopcategory-sort">
                Sort by <img src={dropdown_icon} className="arrow-icon" alt="" />
            </div>
        </div>

        <div className="shopcategory-products">
            {all_product.map((item,i) => {
                if(item.category === props.category){
                    return <Item  key={i} id={item.id} name={item.name} new_price={item.new_price} old_price={item.old_price} image={item.image}/>
                }
                else {
                    return null;
                }
            })}
        </div>
        <div className="shopcategory-loadmore">
            Explore More
        </div>
    </div>
  )
}
