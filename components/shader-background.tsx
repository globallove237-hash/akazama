"use client";

import type React from "react";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Static background - using a CSS gradient as an example */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #8B008B 50%, #DC143C 100%)",
          backgroundAttachment: "fixed"
        }}
      />
      
      {children}
    </div>
  );
}
