import React from "react";

const loading = () => {
  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 flex justify-center items-start pt-10 min-h-[calc(100vh-120px)] bg-surface/50">
      <div className="space-y-8 w-full bg-white/40 backdrop-blur-sm mx-auto p-8 rounded-3xl shadow-2xl shadow-gray-200/50 relative animate-pulse border border-white/20">
        {/* Title Skeleton */}
        <div className="h-10 rounded-full bg-secondary/10 w-1/3 mb-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-4 rounded-full bg-primary/20 w-1/4"></div>
            <div className="h-14 rounded-2xl bg-background/60 border border-primary/10 w-full"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 rounded-full bg-primary/20 w-1/4"></div>
            <div className="h-14 rounded-2xl bg-background/60 border border-primary/10 w-full"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 rounded-full bg-primary/20 w-1/4"></div>
            <div className="h-14 rounded-2xl bg-background/60 border border-primary/10 w-full"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 rounded-full bg-primary/20 w-1/4"></div>
            <div className="h-14 rounded-2xl bg-background/60 border border-primary/10 w-full"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 rounded-full bg-primary/20 w-1/4"></div>
          <div className="h-28 rounded-2xl bg-background/60 border border-primary/10 w-full"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-14 bg-primary/30 rounded-2xl w-full mt-4"></div>
      </div>
    </div>
  );
};

export default loading;
