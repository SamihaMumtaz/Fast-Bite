import React, { useState, useEffect } from "react";
import "./StartupAnimation.css";

const StartupAnimationFastBite = ({ children }) => {

  const [showTextAnimation, setShowTextAnimation] = useState(true);
  const [showColorFlash, setShowColorFlash] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowTextAnimation(false);
      setShowColorFlash(true);
    }, 4000);

    const colorTimer = setTimeout(() => {
      setShowColorFlash(false);
    }, 6000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(colorTimer);
    };
  }, []);

  return (
    <>
      {(showTextAnimation || showColorFlash) && (
        <div className="startup-overlay">
          {showTextAnimation && (
            <>
              <svg className="logo-svg" viewBox="0 0 1000 200">
                <text x="50%" y="50%" className="svg-text">
                  FastBite
                </text>
              </svg>
              <div className="subtitle">
                Your <span>Food</span>, Fast & <span>Fresh</span>
              </div>
            </>
          )}

          {showColorFlash && <div className="full-color-flash"></div>}
        </div>
      )}

      {!showTextAnimation && !showColorFlash && children}
    </>
  )
}

export default StartupAnimationFastBite
