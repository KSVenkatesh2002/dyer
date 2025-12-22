import React from "react";

const loading = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 min-h-[calc(100vh-120px)] space-y-6 bg-surface/30">
      {/* Search/Header Skeleton */}
      <div className="w-full bg-white/40 backdrop-blur-sm p-8 h-24 rounded-3xl shadow-xl shadow-gray-200/50 animate-pulse border border-white/20">
        <div className="h-8 bg-secondary/10 w-1/4 rounded-full"></div>
      </div>

      {/* List Items Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-full bg-white/40 backdrop-blur-sm p-6 h-48 rounded-3xl shadow-lg shadow-gray-200/40 animate-pulse border border-white/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-6 bg-primary/20 w-2/3 rounded-full"></div>
              <div className="h-4 bg-secondary/10 w-1/2 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-background/80 w-1/4 rounded-xl"></div>
              <div className="h-8 bg-primary/10 w-1/3 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default loading;
