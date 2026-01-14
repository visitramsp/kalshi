"use client";
import Details from "@/components/Pages/detail/page";
import React, { Suspense } from "react";

const Index = () => {
  return (
    <Suspense fallback={<div>Loading Sale Page...</div>}>
      <Details />
    </Suspense>
  );
};

export default Index;
