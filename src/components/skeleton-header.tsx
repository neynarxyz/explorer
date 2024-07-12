'use client';
import { Card, CardContent, CardHeader } from './ui/card';

export default function SkeletonHeader() {
  return (
    <Card className="rounded-lg relative border-black flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center animate-pulse">
        <CardHeader className="text-center relative md:text-lg text-sm w-full">
          <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
        </CardHeader>
        <hr className="w-full border-t border-gray-300 my-2" />
        <CardContent className="flex items-center justify-center text-6xl w-full">
          <div className="h-12 bg-gray-300 rounded-full w-12"></div>
        </CardContent>
      </div>
    </Card>
  );
}
