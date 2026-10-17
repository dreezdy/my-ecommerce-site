import React from 'react'
import { useParams } from 'react-router-dom';
import { Breadcrum } from '../Components/Breadcrums/Breadcrum';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { ProductDisplay } from '../Components/ProductDisplay/ProductDisplay';
import { DescriptionBox } from '../Components/DescriptionBox/DescriptionBox';
import { RelatedProducts } from '../Components/RelatedProducts/RelatedProducts';

export const Product = () => {
  const {all_product, loading} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_product.find((e)=> e.id === Number(productId));

  if (loading) return <p style={{ padding: '60px', textAlign: 'center' }}>Loading...</p>;
  if (!product) return <p style={{ padding: '60px', textAlign: 'center' }}>Product not found.</p>;

  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts product={product}/>
    </div>
  )
}