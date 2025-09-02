"use client";
import { useEffect, useState, ReactNode } from "react";

interface LoadingScreenProps {
  isLoading?: boolean;
  onComplete?: () => void;
  children: ReactNode;
}

export default function LoadingScreen({ isLoading: parentIsLoading, onComplete, children }: LoadingScreenProps) {
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    console.log("LoadingScreen: useEffect triggered, parentIsLoading:", parentIsLoading, "internalLoading:", internalLoading);
    
    // If parent says we're not loading, respect that
    if (!parentIsLoading) {
      console.log("LoadingScreen: Parent says not loading, setting internal to false");
      setInternalLoading(false);
      return;
    }
    
    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      console.log("LoadingScreen: Timer completed, setting internalLoading to false");
      setInternalLoading(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
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
        backgroundColor: 'red',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold'
      }}
    >
      <div>
        LOADING SCREEN IS WORKING!
        <br />
        <span style={{ fontSize: '24px' }}>
          Parent isLoading: {parentIsLoading ? 'true' : 'false'}
          <br />
          Internal loading: {internalLoading ? 'true' : 'false'}
        </span>
      </div>
    </div>
  );
}
