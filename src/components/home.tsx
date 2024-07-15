'use client';
import { CastComponent } from '@/components/cast-component';
import {
  FIDPFP,
  exampleCast,
  warpcastURLCast,
  warpcastURLCastURL,
  warpcastURLPFP,
  warpcastURLProfile,
} from '@/constants';
import Link from 'next/link';
import HubsDataComponent from './hubs-data';
import { NeynarProfileCard } from '@neynar/react';
import Search from './search';

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-1 justify-around min-h-screen">
      <div className="flex-1" />
      <div className="w-full h-full flex flex-col items-center mb-32">
        <div>
          <Search />
        </div>
      </div>
      <div className="flex-1" />
    </div>
  );
}
