import { useState, useEffect } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out after 4 seconds to allow a 1-second fade out transition
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    // Completely remove and unmount after 5 seconds total
    const unmountTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-container ${isFadingOut ? 'fade-out' : ''}`}>
      <h1 className="splash-logo">Velura</h1>
      <p className="splash-subtitle">Intimate Wellness</p>
    </div>
  );
}
