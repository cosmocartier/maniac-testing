"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

// Register GSAP plugins
gsap.registerPlugin(CustomEase);
CustomEase.create("hop", ".15, 1, .25, 1");
CustomEase.create("hop2", ".9, 0, .1, 1");

export default function LoadingScreen({ onComplete, children }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const counterRef = useRef(null);
  const containerRef = useRef(null);

  // Counter animation function
  const startLoader = () => {
    const counterElement = counterRef.current;
    const totalDuration = 2000;
    const totalSteps = 11;
    const timePerStep = totalDuration / totalSteps;

    if (counterElement) {
      counterElement.textContent = "0";
    }

    let currentStep = 0;
    function updateCounter() {
      currentStep++;
      if (currentStep <= totalSteps) {
        const progress = currentStep / totalSteps;
        let value;

        if (currentStep === totalSteps) {
          value = 100;
        } else {
          const exactValue = progress * 100;
          const minValue = Math.max(Math.floor(exactValue - 5), 1);
          const maxValue = Math.min(Math.floor(exactValue + 5), 99);
          value =
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        }
        if (counterElement) {
          counterElement.textContent = value;
        }
        if (currentStep < totalSteps) {
          setTimeout(updateCounter, timePerStep);
        }
      }
    }

    setTimeout(updateCounter, timePerStep);
  };

  // Main animation sequence
  useEffect(() => {
    if (showPreloader) {
      startLoader();

      // Set initial state
      gsap.set(".loading-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          setShowPreloader(false);
          setIsLoading(false);
          if (onComplete) onComplete();
        }
      });

      // Counter fade out
      tl.to(".count", {
        opacity: 0,
        delay: 2.5,
        duration: 0.25,
      });

      // Preloader scale down
      tl.to(".pre-loader", {
        scale: 0.5,
        ease: "hop2",
        duration: 1,
      });

      // Content reveal
      tl.to(".loading-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.5,
        ease: "hop2",
        delay: -1,
      });

      // Loader elements hide
      tl.to(".loader", {
        height: "0",
        ease: "hop2",
        duration: 1,
        delay: -1,
      });

      tl.to(".loader-bg", {
        height: "0",
        ease: "hop2",
        duration: 1,
        delay: -0.5,
      });

      tl.to(".loader-2", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop2",
        duration: 1,
      });
    }
  }, [showPreloader, onComplete]);

  // If loading is complete, show children
  if (!isLoading) {
    return children;
  }

  return (
    <div className="loading-screen" ref={containerRef}>
      {showPreloader && (
        <>
          <div className="preloader-overlay">
            <div className="pre-loader">
              <div className="loader"></div>
              <div className="loader-bg"></div>
            </div>
            <div className="count">
              <p ref={counterRef}>0</p>
            </div>
            <div className="loader-2"></div>
          </div>

          <div className="preloader-bg-img">
            <img src="/hero.gif" alt="" />
          </div>
        </>
      )}

      <div className="loading-content">
        {/* Your main content goes here */}
        {children}
      </div>
    </div>
  );
}
