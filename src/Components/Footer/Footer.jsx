import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo.png'
import instagram_icon from '../Assets/instagram_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'

export const Footer = () => {
  return (
    <div className="footer">
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>Ashodi Scents</p>
        </div>

        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About Us</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social">
            <div className="footer-icon-container">
                <a href="https://www.instagram.com/alabiolaj"><img src={instagram_icon} alt="Instagram" /></a>
            </div>
            <div className="footer-icon-container">
                <a href="https://wa.me/2348055630599"><img src={whatsapp_icon} alt="WhatsApp" /></a>
            </div>
            <div className="footer-icon-container">
                <a href="https://www.facebook.com/ashodiscents"><img src={facebook_icon} alt="Facebook" /></a>
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>&copy; 2026 Ashodi Scents. All rights reserved.</p>
        </div>
        <div className="footer-terms">
            <p>Terms of Service | Privacy Policy</p>
        </div>
    </div>
  )
}
