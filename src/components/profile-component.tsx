import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.
import Link from 'next/link';

export function ProfileComponent({pfp,url}: any) {
  if(!pfp) return null;
  return (
    <Link href={`/${encodeURIComponent(url)}`}>
    <Card className="w-full hover:bg-slate-100 rounded-lg max-w-md md:min-w-64 md:min-h-32 flex items-center justify-center">
      <CardContent className="p-4 w-full flex flex-col justify-center items-center space-y-10">
      <Avatar >
    <AvatarImage alt={`${url} PFP`} src={pfp} />
  </Avatar>
      </CardContent>
    </Card>
    </Link>
  )
}

