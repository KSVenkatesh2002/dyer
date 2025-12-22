import React from "react";
const skeletons = Array.from({ length: 4 });

const loading = () => {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 p-6 min-h-[calc(100vh-120px)] bg-surface/30">
      {/* Header Skeleton */}
      <div className="h-10 bg-secondary/10 w-1/3 rounded-full mb-8 ml-4 animate-pulse"></div>

      {skeletons.map((_, index) => (
        <div
          key={index}
          className="flex flex-col p-6 rounded-3xl shadow-xl shadow-gray-200/50 gap-6 bg-white/40 backdrop-blur-sm animate-pulse border border-white/20"
        >
          {/* Top row: name + dots + salary */}
          <div className="flex justify-between items-center gap-4 w-full">
            {/* Name block */}
            <div className="flex flex-row items-center gap-4 grow">
              <div className="bg-secondary/10 h-12 w-full max-w-md rounded-2xl"></div>
            </div>

            {/* Days count (dots) */}
            <div className="bg-primary/5 px-6 py-2 rounded-2xl flex flex-row items-center gap-3">
              <div className="bg-present/40 size-6 rounded-full"></div>
              <div className="bg-half/40 size-6 rounded-full"></div>
              <div className="bg-absent/40 size-6 rounded-full"></div>
            </div>

            {/* Salary block */}
            <div className="bg-primary/10 px-6 py-4 rounded-2xl w-24 h-12"></div>
          </div>

          {/* Bottom row: attendance bar */}
          <div className="w-full p-2 bg-background/50 rounded-2xl flex justify-between items-center gap-1 border border-primary/5">
            <div className="bg-present/30 w-1/4 h-10 rounded-xl"></div>
            <div className="bg-half/30 w-1/4 h-10 rounded-xl"></div>
            <div className="bg-absent/30 w-1/4 h-10 rounded-xl"></div>
            <div className="bg-holiday/30 w-1/4 h-10 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default loading;
