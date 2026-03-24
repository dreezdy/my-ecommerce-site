import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow_icon.png'
import hero_image from '../Assets/hero_image3.png'
import hero_image1 from '../Assets/hero_image.jpg'
import avatar1 from '../Assets/avatar1.png'
import quote from '../Assets/quote_sign.png'
import perf_img from '../Assets/perf_img.png'

export const Hero = () => {
  return (
    <>
    <div className="hero-container">
        <div className="hero">
            <div className="hero-left">
                <div className='hero-smalltxt'>
                        <span>An impression that lingers</span>
                </div>
                <div>
                    <h4>Discover Your Best</h4>
                    <h4><i>Perfume</i> Today</h4>

                    <p>
                        Selecting a perfume is a personal journey.
                        Consider your lifestyle favourite scents, and the impression you want to leave. 
                    </p>
                </div>
                <div className="hero-latest-btn">
                    <div>
                        Explore Shop
                    </div>
                    <img src={arrow_icon} alt="" />
                </div>
            </div>

            <div className="hero-right">
                <img src={hero_image} alt="" />
            </div>
        </div>

        <div className="hero-bottom">
            <div className="hero-bottom-item hero-testimonial">
                <p>
                    <img src={quote} alt="" className='hero-quote-sign'/> <br />
                    
                    I couldn't be happier with my purchase! The fragrance is absolutely divine and lasts all day. 
                    The packaging is elegant, and the customer service was top-notch. Highly recommend Ashodi Scents 
                    for anyone looking for a luxurious perfume experience.
                </p>
                <div className='hero-avatar'>
                    <img src={avatar1} alt="" />
                <div>
                    <h3>Madhu</h3>
                    <p>Verified Buyer</p>
                </div>
                </div>
            </div>


            <div className="hero-bottom-item hero-shop">
                <img src={hero_image1} alt="" className='hero-bottom-img'/>
                <div>
                    <h3>YSL Black Opium</h3>
                    <p>(27 items)</p>
                    <div className="hero-bottom-btn">
                        <div>
                            Explore Shop
                        </div>
                        <img src={arrow_icon} alt="" className='hero-cardicon'/>
                    </div>
                </div>
            </div>

            <div className="hero-bottom-item hero-shop">
                <img src={perf_img} alt="" className='hero-bottom-img'/>
                <div>
                    <h3>Valentino Donna Born</h3>
                    <p>(45 items)</p>
                    <div className="hero-bottom-btn">
                        <div>
                            Explore Shop
                        </div>
                        <img src={arrow_icon} alt="" className='hero-cardicon'/>
                    </div>
                </div>
            </div>

        </div>
    </div>

    </>

    
  )
}
