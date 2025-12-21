import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center bg-white/50 backdrop-blur-sm gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-primary relative z-10" />
      </div>
      <p className="text-muted-text font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loading;
