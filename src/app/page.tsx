'use client'
import { CastComponent } from '@/components/cast-component';
import { ProfileComponent } from '@/components/profile-component';
import { FIDPFP, exampleCast, warpcastURLCast, warpcastURLCastURL, warpcastURLPFP, warpcastURLProfile } from '@/constants';


export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <div className='flex flex-col items-center space-y-4 p-5 m-5'>
      <div className='flex flex-row space-x-2'>
<div className='flex flex-col space-y-2 items-center justify-center '>

  <p className='text-center'>Example hash</p>
        <CastComponent cast={exampleCast} />
        </div>
        <div className='flex flex-col space-y-2 w-full items-center justify-center '>
       <p className='text-center'>Example Warpcast cast url</p>
       <CastComponent cast={warpcastURLCast} warpcastUrl={warpcastURLCastURL} />
        </div>
        </div>
        <div className='flex flex-row space-x-2'>
       <div className='flex flex-col space-y-2 w-full items-center justify-center '>
       <p className='text-center'>Example FID</p>
        <ProfileComponent pfp={FIDPFP} url={"3"} />
        </div>
        <div className='flex flex-col space-y-2 w-full items-center justify-center '>
       <p className='text-center'>Example Warpcast profile url</p>
       <ProfileComponent pfp={warpcastURLPFP} url={warpcastURLProfile} />
       
        </div>
        </div>
      
      </div>
    </div>
  );
  
}
