import { CastComponent } from '@/components/cast-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FIDPFP, exampleCast, warpcastURLCast, warpcastURLCastURL, warpcastURLPFP, warpcastURLProfile } from '@/constants';
import Link from 'next/link';

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
       <p className='text-center'>Example Warpcast Cast</p>
       <CastComponent cast={warpcastURLCast} warpcastUrl={warpcastURLCastURL} />
        </div>
        </div>
        <div className='flex flex-row space-x-2'>
       <div className='flex flex-col space-y-2 w-full items-center justify-center '>
       <p className='text-center'>Example FID</p>
        <Link href={`/3`}>
        <Avatar >
    <AvatarImage alt={`@dwr.eth`} src={FIDPFP} />
    <AvatarFallback>{"DW"}</AvatarFallback>
  </Avatar>
        </Link>
        </div>
        <div className='flex flex-col space-y-2 w-full items-center justify-center '>
       <p className='text-center'>Example Warpcast Profile</p>
        <Link href={`/${encodeURIComponent(warpcastURLProfile)}`}>
        <Avatar >
    <AvatarImage alt={`@dylsteck.eth`} src={warpcastURLPFP} />
    <AvatarFallback>{"DY"}</AvatarFallback>
  </Avatar>
        </Link>
        </div>
        </div>
      
      </div>
    </div>
  );
  
}
