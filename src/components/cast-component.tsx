import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.
import Link from 'next/link';

export function CastComponent({cast}: any) {
  if(!cast) return null;

  const avatarImg = cast.author.pfp_url ? cast.author.pfp_url : null  
  return (
    <Link href={`/${cast.hash}/${cast.fid}`}>
    <Card className="w-full hover:bg-slate-100 rounded-lg max-w-md">
    <CardHeader className="flex flex-row items-center space-x-2">
  <Avatar >
    <AvatarImage alt={`@${cast.author.username}`} src={avatarImg} />
    <AvatarFallback>{cast?.author?.username ? cast.author.username.slice(0,2) : null}</AvatarFallback>
  </Avatar>
  <div className="font-medium text-md">{cast.author.display_name}</div>
  <div className="text-sm text-gray-500 dark:text-gray-400">@{cast.author.username ?? cast.fid}</div>
</CardHeader>

      <CardContent className="p-4 w-full flex flex-col justify-center items-center space-y-10">

        <p className="text-center text-sm">
          {cast.text}
        </p>
      </CardContent>
    </Card>
    </Link>
  )
}

