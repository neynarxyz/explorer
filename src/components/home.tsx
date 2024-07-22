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
    <div className="w-full flex flex-col flex-1 justify-center items-center min-h-screen">
      <div className="md:w-1/3 w-1/2 h-full flex flex-row justify-center mb-32">
        <Search />
      </div>
    </div>
  );
}
