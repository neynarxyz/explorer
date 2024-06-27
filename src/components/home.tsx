'use client';
import { CastComponent } from '@/components/cast-component';
import { ProfileComponent } from '@/components/profile-component';
import {
  FIDPFP,
  exampleCast,
  warpcastURLCast,
  warpcastURLCastURL,
  warpcastURLPFP,
  warpcastURLProfile,
} from '@/constants';
import HubsDataComponent from './hubs-data';

export default function Home() {
  return (
    <div className="w-full space-y-16">
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-center">Example hash</p>
            <div>
              <CastComponent cast={exampleCast} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-center">Example FID</p>
            <div>
              <ProfileComponent pfp={FIDPFP} url={'3'} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-center">Example Warpcast cast url</p>
            <div>
              <CastComponent
                cast={warpcastURLCast}
                warpcastUrl={warpcastURLCastURL}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-center">Example Warpcast profile url</p>
            <div>
              <ProfileComponent pfp={warpcastURLPFP} url={warpcastURLProfile} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <HubsDataComponent />
      </div>
    </div>
  );
}
