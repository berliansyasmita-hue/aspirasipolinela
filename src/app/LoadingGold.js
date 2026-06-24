"use client";

import React from "react";

export default function LoadingGold({ text = "Memuat data...", textColor = "text-gray-500" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-5">
      {/* Simple gold spinning ring */}
      <div
        className="w-12 h-12 rounded-full animate-spin"
        style={{
          border: "4px solid #FFC72C",
          borderTopColor: "transparent",
        }}
      ></div>

      {text && (
        <p className={`text-sm font-medium tracking-wide text-center max-w-xs ${textColor}`}>
          {text}
        </p>
      )}
    </div>
  );
}
