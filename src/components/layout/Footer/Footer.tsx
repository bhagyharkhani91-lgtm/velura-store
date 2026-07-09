import { Link } from 'react-router-dom';
import { Container } from '../Container/Container';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      {/* Decorative top edge */}
      <div className="footer-accent-bar" aria-hidden="true" />

      <Container>
        {/* Main footer content */}
        <div className="footer-main">
          {/* Brand column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">VELURA</Link>
            <p className="footer-tagline">
              Premium intimate wellness products designed for your pleasure and well-being.
            </p>

            {/* Social icons */}
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.01a6.33 6.33 0 0 0-.88-.07 6.34 6.34 0 1 0 6.34 6.34V9.48a8.2 8.2 0 0 0 3.76.97V7.02a4.85 4.85 0 0 1-.01-.33z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="footer-nav-group">
            {/* Shop */}
            <div className="footer-col">
              <h3 className="footer-heading">Shop</h3>
              <ul className="footer-links">
                <li><Link to="/categories/vibrators">Vibrators</Link></li>
                <li><Link to="/categories/couples">Couples</Link></li>
                <li><Link to="/categories/massage">Massage</Link></li>
                <li><Link to="/categories/accessories">Accessories</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping &amp; Returns</Link></li>
                <li><Link to="/return">Return and Exchange Policy</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-col">
              <h3 className="footer-heading">Legal</h3>
              <ul className="footer-links">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/disclaimer">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Velura. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <span className="footer-dot" aria-hidden="true" />
            <Link to="/terms">Terms</Link>
            <span className="footer-dot" aria-hidden="true" />
            <Link to="/disclaimer">Disclaimer</Link>
          </div>

          <div className="footer-badges">
            <span className="footer-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Secure Checkout
            </span>
            <span className="footer-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Discreet Shipping
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
