import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Package, Star } from 'lucide-react';
import { Container } from '../../layout/Container/Container';
import { useSettingsStore } from '../../../stores/settingsStore';
import './Hero.css';

import heroVibe from '../../../assets/hero_luxury_vibe.png';
import heroCouplesRing from '../../../assets/hero_couples_ring.png';
import heroMassageOil from '../../../assets/hero_massage_oil.png';
import heroLuxuryDildo from '../../../assets/hero_luxury_dildo.png';

const defaultBackgrounds = [
  heroVibe,
  heroCouplesRing,
  heroMassageOil,
  heroLuxuryDildo,
];

export function Hero() {
  const { heroBanners } = useSettingsStore();
  
  const activeBanners = (heroBanners || [])
    .filter(banner => banner?.isActive)
    .map(banner => banner?.url);

  const backgrounds = activeBanners.length > 0 ? activeBanners : defaultBackgrounds;

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    setCurrentBg(0);
  }, [backgrounds.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(timer);
  }, [currentBg]); // Reset the timer whenever the background changes (e.g. manual click)

  return (
    <section className="hero-section">
      {/* Background Images with opacity transition */}
      {backgrounds.map((bg, idx) => (
        <div 
          key={idx}
          className={`hero-bg-image ${idx === currentBg ? 'active' : ''}`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}

      <div className="hero-overlay"></div>
      
      <Container className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Unleash Your<br />
            <span className="hero-title-accent">Wildest Desires</span>
          </h1>
          <p className="hero-subtitle">
            Explore our curated collection of premium intimate wellness products designed to elevate your pleasure and confidence.
          </p>
          <Link to="/products" className="hero-btn">
            Shop Now <ArrowRight size={20} />
          </Link>

          <div className="hero-badges">
            <div className="hero-badge">
              <Lock size={24} />
              <div>
                <span className="hero-badge-title">100%</span>
                <span className="hero-badge-desc">Discreet Packaging</span>
              </div>
            </div>
            <div className="hero-badge">
              <Package size={24} />
              <div>
                <span className="hero-badge-title">COD</span>
                <span className="hero-badge-desc">Available</span>
              </div>
            </div>
            <div className="hero-badge">
              <Star size={24} />
              <div>
                <span className="hero-badge-title">2L+</span>
                <span className="hero-badge-desc">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Carousel Dots */}
      <div className="hero-carousel-dots">
        {backgrounds.map((_, idx) => (
          <button 
            key={idx}
            className={`hero-dot ${idx === currentBg ? 'active' : ''}`}
            onClick={() => setCurrentBg(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Trust Bar */}
      <div className="hero-trust-bar">
        <div className="hero-trust-marquee">
          <div className="hero-trust-content">
            <span className="hero-trust-item"><Star size={16} fill="white" /> Trusted By 2 Lakh+ Customers</span>
            <span className="hero-trust-item"><Package size={16} /> 1000+ Products</span>
            <span className="hero-trust-item"><Star size={16} /> 30+ International Brands</span>
            <span className="hero-trust-item"><Star size={16} fill="white" /> 5 Star Ratings</span>
          </div>
          <div className="hero-trust-content" aria-hidden="true">
            <span className="hero-trust-item"><Star size={16} fill="white" /> Trusted By 2 Lakh+ Customers</span>
            <span className="hero-trust-item"><Package size={16} /> 1000+ Products</span>
            <span className="hero-trust-item"><Star size={16} /> 30+ International Brands</span>
            <span className="hero-trust-item"><Star size={16} fill="white" /> 5 Star Ratings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
