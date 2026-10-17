import React, { useContext, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

export const Navbar = () => {
  const { getTotalCartItems, all_product, user, logout } = useContext(ShopContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);

    if (menuRef.current) {
      menuRef.current.classList.remove('nav-menu-visible');
    }
  };

  const toggleMobileMenu = () => {
    closeSearch();
    setMobileMenuOpen((open) => {
      const nextOpen = !open;

      if (menuRef.current) {
        menuRef.current.classList.toggle(
          'nav-menu-visible',
          nextOpen
        );
      }

      return nextOpen;
    });
  };

  const searchResults = searchTerm.trim()
    ? (all_product || [])
        .filter((product) =>
          `${product.name} ${product.category || ''}`
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        )
        .slice(0, 6)
    : [];

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchTerm('');
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    closeSearch();
    closeMobileMenu();
  };

  const openProduct = (product) => {
    navigate(`/product/${product.id}`);
    closeSearch();
    closeMobileMenu();
  };

  const openSearchFromMenu = () => {
  closeMobileMenu();
  setSearchOpen(true);
  setSearchTerm('');
  setTimeout(() => searchRef.current?.focus(), 0);
  };

  return (
    <header className="navbar">
      <Link
        to="/"
        className="nav-logo"
        aria-label="Ashodi Scents home"
        onClick={closeMobileMenu}
      >
        <img src={logo} alt="Ashodi Scents Logo" className="logo" />
        <p>Ashodi Scents</p>
      </Link>

      <button
        className={`nav-dropdown-button ${mobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        type="button"
        aria-label={
          mobileMenuOpen
            ? 'Close navigation menu'
            : 'Open navigation menu'
        }
        aria-expanded={mobileMenuOpen}
      >
        <img className="nav-dropdown" src={nav_dropdown} alt="" />
      </button>

      <nav aria-label="Main navigation">
        <ul
          ref={menuRef}
          className={`nav-menu ${mobileMenuOpen ? 'nav-menu-visible' : ''}`}
        >
          <li>
            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `nav-li ${isActive ? 'active' : ''}`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/shop"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `nav-li ${isActive ? 'active' : ''}`
              }
            >
              Shop
            </NavLink>
          </li>
          {user && user.role === 'admin' && (
          <li>
            <NavLink
              to="/admin"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `nav-li ${isActive ? 'active' : ''}`
              }
            >
              Admin
            </NavLink>
          </li>
           )}

          {user && (
            <li>
              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `nav-li ${isActive ? 'active' : ''}`
                }
              >
                Profile
              </NavLink>
            </li>
          )}

          <li className="nav-mobile-only">
          <button
            type="button"
            className="nav-li nav-li-button"
            onClick={openSearchFromMenu}
          >
            Search
          </button>
        </li>

        <li className="nav-mobile-only">
          {user ? (
            <button
              type="button"
              className="nav-li nav-li-button"
              onClick={() => { logout(); closeMobileMenu(); }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-li" onClick={closeMobileMenu}>
              Login
            </Link>
          )}
        </li>
        
        <li className="nav-mobile-only">
          <Link to="/cart" className="nav-li" onClick={closeMobileMenu}>
            Cart ({getTotalCartItems()})
          </Link>
        </li>
        </ul>
      </nav>

      <div className="nav-login-cart">
        <button
          type="button"
          className="nav-search-toggle"
          onClick={() => {
            setSearchOpen((open) => !open);
            setSearchTerm('');

            if (!searchOpen) {
              setTimeout(() => searchRef.current?.focus(), 0);
            }
          }}
          aria-label={searchOpen ? 'Close search' : 'Open search'}
          aria-expanded={searchOpen}
        >
          {searchOpen ? (
            <span className="search-close-icon">×</span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="23"
              height="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
          )}
        </button>

        {user ? (
          <button type="button" onClick={logout} title={user.email}>Logout</button>
        ) : (
          <Link to="/login">
            <button type="button">Login</button>
          </Link>
        )}

        <Link
          to="/cart"
          className="nav-cart-link"
          aria-label={`Shopping cart, ${getTotalCartItems()} items`}
        >
          <img src={cart_icon} alt="" className="cart-icon" />
          <span className="nav-cart-count">
            {getTotalCartItems()}
          </span>
        </Link>
      </div>

      {searchOpen && (
        <div className="navbar-search-panel">
          <form onSubmit={handleSearch} className="navbar-search-form">
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>

            <input
              ref={searchRef}
              type="search"
              placeholder="Search perfumes..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search perfumes"
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}

            <button type="submit" className="search-submit">
              Search
            </button>
            <button
              type="button"
              className="search-panel-close"
              onClick={closeSearch}
              aria-label="Close search"
            >
              ×
            </button>
          </form>

          {searchTerm.trim() && (
            <div className="navbar-search-results">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="navbar-search-result"
                    onClick={() => openProduct(product)}
                  >
                    <img src={product.image} alt="" />

                    <span className="search-result-name">
                      {product.name}
                    </span>

                    <span className="search-result-price">
                      ₦{Number(product.new_price).toLocaleString()}
                    </span>
                  </button>
                ))
              ) : (
                <p className="search-no-results">
                  No matching perfumes found.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

