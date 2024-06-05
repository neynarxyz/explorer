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
    <div className="flex flex-col items-center space-y-4 p-2 mt-[25%] md:mt-[12.5%] lg:mt-[15%]">
      <div className="flex flex-col items-center space-y-4 p-5 m-5 mt-0">
        <div className="flex flex-col w-full space-y-4">
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col space-y-2 items-center justify-center w-full">
              <CastComponent cast={exampleCast} headerText="Example hash" />
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center w-full">
              <CastComponent cast={warpcastURLCast} warpcastUrl={warpcastURLCastURL} headerText="Example Warpcast cast url" />
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col space-y-2 items-center justify-center w-full">
              <ProfileComponent pfp={FIDPFP} url="3" headerText="Example FID" />
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center w-full">
              <ProfileComponent pfp={warpcastURLPFP} url={warpcastURLProfile} headerText="Example Warpcast profile url" />
            </div>
          </div>
        </div>
        <div className="w-full mt-10">
          <LatestCasts />
        </div>
      </div>
    </div>
  )
}