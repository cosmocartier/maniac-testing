"use client";
import { useEffect, useState, ReactNode, useRef } from "react";

interface LoadingScreenProps {
  isLoading?: boolean;
  onComplete?: () => void;
  children: ReactNode;
}

export default function LoadingScreen({ isLoading: parentIsLoading, onComplete, children }: LoadingScreenProps) {
  const [internalLoading, setInternalLoading] = useState(true);
  const counterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    console.log("LoadingScreen: useEffect triggered, parentIsLoading:", parentIsLoading, "internalLoading:", internalLoading);
    
    // If parent says we're not loading, respect that
    if (!parentIsLoading) {
      console.log("LoadingScreen: Parent says not loading, setting internal to false");
      setInternalLoading(false);
      return;
    }
    
    // Start the counter animation
    let currentStep = 0;
    const totalSteps = 20;
    const timePerStep = 100; // 100ms per step = 2 seconds total
    
    const updateCounter = () => {
      currentStep++;
      if (currentStep <= totalSteps && counterRef.current) {
        const progress = currentStep / totalSteps;
        const value = Math.floor(progress * 100);
        counterRef.current.textContent = value.toString();
        
        if (currentStep < totalSteps) {
          setTimeout(updateCounter, timePerStep);
        } else {
          // Counter finished, wait a bit then hide loading screen
          setTimeout(() => {
            console.log("LoadingScreen: Counter completed, setting internalLoading to false");
            setInternalLoading(false);
            if (onComplete) onComplete();
          }, 500);
        }
      }
    };

    // Start the counter
    setTimeout(updateCounter, timePerStep);

    return () => {
      // Cleanup if component unmounts
    };
  }, [parentIsLoading, onComplete]);

  console.log("LoadingScreen: render called, parentIsLoading:", parentIsLoading, "internalLoading:", internalLoading);

  // Show loading screen if either parent or internal state says we're loading
  if (!parentIsLoading && !internalLoading) {
    console.log("LoadingScreen: Both loading states false, returning children");
    return children;
  }

  console.log("LoadingScreen: Rendering loading screen UI");
  
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 3s ease-in-out infinite',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '120px', marginBottom: '20px', fontWeight: '300' }}>
          <span ref={counterRef}>0</span>%
        </div>
        <div style={{ fontSize: '24px', opacity: 0.8, fontWeight: '300' }}>
          Loading...
        </div>
        <div style={{ fontSize: '16px', marginTop: '20px', opacity: 0.6, fontWeight: '300' }}>
          Parent isLoading: {parentIsLoading ? 'true' : 'false'}
          <br />
          Internal loading: {internalLoading ? 'true' : 'false'}
        </div>
      </div>
    </div>
  );
}
