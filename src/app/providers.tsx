"use client";
import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const neynarPurple = "#9B59B6";
  return (
    <>
      {children}
      <Next13ProgressBar
        height="2px"
        color={neynarPurple}
        options={{ showSpinner: true }}
        showOnShallow
      />
    </>
  );
};

export default Providers;
