import React, { useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { Item } from '../Components/Item/Item';
import './Shop.css';

const categories = [
  { label: 'All perfumes', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Unisex', value: 'unisex' },
];

export const Shop = () => {
  const { all_product, loading, error } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const searchTerm = (searchParams.get('search') || '').trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    let products = all_product;

    if (activeCategory !== 'all') {
      products = products.filter(
        (product) =>
          product.category?.toLowerCase() === activeCategory
      );
    }

    if (searchTerm) {
      products = products.filter((product) =>
        `${product.name} ${product.category || ''}`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    return products;
  }, [all_product, activeCategory, searchTerm]);
  const selectCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'all') nextParams.delete('category');
    else nextParams.set('category', category);
    setSearchParams(nextParams);
  };

  return (
    <main className="shop-page">
      <header className="shop-page-header">
        <p className="shop-eyebrow">ASHODI SCENTS COLLECTION</p>
        <h1>Find your signature scent</h1>
        <p>Explore our fragrance collection and discover a scent that feels like you.</p>
      </header>
      <section className="shop-catalog" aria-label="Perfume collection">
        <div className="shop-catalog-top">
          <div><h2>Shop all perfumes</h2><p className="shop-product-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'perfume' : 'perfumes'}</p></div>
          <div className="shop-category-filters" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <button key={category.value} type="button" className={`shop-filter-button ${activeCategory === category.value ? 'active' : ''}`} onClick={() => selectCategory(category.value)} aria-pressed={activeCategory === category.value}>{category.label}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="shop-empty-state">
            <h3>Loading perfumes...</h3>
          </div>
        ) : error ? (
          <div className="shop-empty-state">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="shop-product-grid">
            {filteredProducts.map((product) => <Item key={product.id} id={product.id} name={product.name} new_price={product.new_price} old_price={product.old_price} image={product.image} />)}
          </div>
        ) : (
          <div className="shop-empty-state">
            <h3>
              {searchTerm
                ? 'No matching perfumes found'
                : 'No perfumes in this category yet'}
            </h3>

            <p>
              {searchTerm
                ? `We couldn't find any perfumes matching "${searchTerm}". Try another search.`
                : `We haven't added any ${activeCategory === 'unisex' ? 'Unisex' : activeCategory} perfumes to the collection yet.`}
            </p>

            <button
              type="button"
              className="shop-filter-button active"
              onClick={() => {
                setSearchParams({});
              }}
            >
              View all perfumes
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
