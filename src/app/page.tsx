'use client'

import { CastComponent } from '@/components/cast-component'
import LatestCasts from '@/components/latest-casts'
import { ProfileComponent } from '@/components/profile-component'
import {
  FIDPFP,
  exampleCast,
  warpcastURLCast,
  warpcastURLCastURL,
  warpcastURLPFP,
  warpcastURLProfile,
} from '@/constants'

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-4 mt-10 w-full">
        <div className="flex flex-col gap-2 md:flex-row md:gap-0 justify-center md:justify-between w-[100%]">
          <CastComponent cast={exampleCast} headerText="Example hash" />
          <CastComponent cast={warpcastURLCast} warpcastUrl={warpcastURLCastURL} headerText="Example Warpcast cast url" />
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-0 justify-center md:justify-between w-[100%]">
          <ProfileComponent pfp={FIDPFP} url="3" headerText="Example FID" />
          <ProfileComponent pfp={warpcastURLPFP} url={warpcastURLProfile} headerText="Example Warpcast profile url" />
        </div>
        <LatestCasts />
    </div>
  )
}