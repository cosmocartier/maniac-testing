"use client"

import type React from "react"

interface ButtonGlareProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  className?: string
  disabled?: boolean
}

export default function ButtonGlare({ children, onClick, className = "", disabled = false }: ButtonGlareProps) {
  return (
    <button
      className={`button-glare ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        padding: "6px 8px",
        textDecoration: "none",
        border: "none",
        color: "#ffffff",
        fontSize: "0.65rem",
        textTransform: "uppercase",
        fontFamily: "Futura, 'Trebuchet MS', Arial, sans-serif",
        fontWeight: "200",
        letterSpacing: "1px",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        opacity: disabled ? 0.5 : 1,
        width: "100%",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        lineHeight: "1",
      }}
    >
      <span
        style={{
          position: "absolute",
          display: "block",
          transition: "0.4s ease",
          top: 0,
          left: 0,
          width: 0,
          height: "0px",
          background: "#D3D3D3",
        }}
        className="border-top"
      />
      <span
        style={{
          position: "absolute",
          display: "block",
          transition: "0.4s ease",
          top: 0,
          left: 0,
          width: "0px",
          height: 0,
          background: "#D3D3D3",
        }}
        className="border-left"
      />
      <span
        style={{
          position: "absolute",
          display: "block",
          transition: "0.4s ease",
          bottom: 0,
          right: 0,
          width: 0,
          height: "0px",
          background: "#D3D3D3",
        }}
        className="border-bottom"
      />
      <span
        style={{
          position: "absolute",
          display: "block",
          transition: "0.4s ease",
          bottom: 0,
          right: 0,
          width: "0px",
          height: 0,
          background: "#D3D3D3",
        }}
        className="border-right"
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        {children}
      </span>

      <style jsx>{`
        .button-glare:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
        }
        
        .button-glare::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 0, 0, 0),
            transparent
          );
          transition: 0.5s;
          transition-delay: 0.5s;
        }
        
        .button-glare:hover:after {
          left: 100%;
        }
        
        .button-glare:hover .border-top {
          width: 100% !important;
          transform: translateX(100%);
        }
        
        .button-glare:hover .border-left {
          height: 100% !important;
          transform: translateY(100%);
        }
        
        .button-glare:hover .border-bottom {
          width: 100% !important;
          transform: translateX(-100%);
        }
        
        .button-glare:hover .border-right {
          height: 100% !important;
          transform: translateY(-100%);
        }
      `}</style>
    </button>
  )
}
