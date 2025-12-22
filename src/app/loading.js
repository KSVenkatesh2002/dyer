import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-surface/30 backdrop-blur-md overflow-hidden">
      {/* Premium Branded Animation */}
      <div className="relative flex justify-center items-center h-48 w-48">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Rotating Orbits */}
        <div className="absolute w-full h-full border-2 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute w-[80%] h-[80%] border-2 border-secondary/20 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

        {/* Core Loading Element */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-secondary font-bold text-xl tracking-widest uppercase">
              Dyer
            </span>
            <span className="text-muted-text text-xs font-medium mt-1 animate-pulse">
              Initializing...
            </span>
          </div>
        </div>

        {/* Floating Particles (Decorative) */}
        <div className="absolute -top-4 -left-4 w-4 h-4 bg-primary/30 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-secondary/20 rounded-full animate-bounce delay-700"></div>
      </div>
    </div>
  );
};

export default Loading;
