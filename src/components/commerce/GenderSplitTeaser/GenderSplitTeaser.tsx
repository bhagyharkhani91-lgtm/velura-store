import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSettingsStore } from '../../../stores/settingsStore';
import forHimBgDefault from '../../../assets/for_him_bg.png';
import forHerBgDefault from '../../../assets/for_her_bg.png';
import './GenderSplitTeaser.css';

export function GenderSplitTeaser() {
  const { genderSplitForHimBg, genderSplitForHerBg } = useSettingsStore();

  const forHimBg = genderSplitForHimBg || forHimBgDefault;
  const forHerBg = genderSplitForHerBg || forHerBgDefault;

  return (
    <section className="gender-split-section">
      <div className="gender-split-container">
        
        {/* Left Side: For Him */}
        <div className="gender-split-panel him-panel">
          <div 
            className="panel-bg" 
            style={{ backgroundImage: `url(${forHimBg})` }}
          />
          <div className="panel-overlay" />
          <div className="panel-content">
            <span className="panel-tag text-accent">FOR HIM</span>
            <h3 className="panel-title">BOLD. SOPHISTICATED. EMPOWERED.</h3>
            <p className="panel-description">
              Uncompromising performance and refined pleasure. Crafted to elevate confidence and intensity.
            </p>
            <Link to="/categories/men-toys" className="panel-btn btn-accent">
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="btn-icon" size={18} />
            </Link>
          </div>
        </div>

        {/* Right Side: For Her */}
        <div className="gender-split-panel her-panel">
          <div 
            className="panel-bg" 
            style={{ backgroundImage: `url(${forHerBg})` }}
          />
          <div className="panel-overlay" />
          <div className="panel-content">
            <span className="panel-tag text-rose">FOR HER</span>
            <h3 className="panel-title">SENSUAL. LUXURIOUS. UNCOMPROMISING.</h3>
            <p className="panel-description">
              Intuitively designed wellness, elegant textures, and profound connection. Crafted for ultimate discovery.
            </p>
            <Link to="/categories/women-toys" className="panel-btn btn-rose">
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="btn-icon" size={18} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
