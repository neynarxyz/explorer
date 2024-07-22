'use client';
import { Card, CardContent, CardHeader } from './ui/card';

export default function SkeletonHeader() {
  return (
    <div className="relative border border-white flex flex-col items-center justify-center min-h-6 min-w-40">
      <div className="h-8 w-3/5 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
}
