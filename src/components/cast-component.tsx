import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import Link from 'next/link'

export function CastComponent({ cast, warpcastUrl, headerText }: any) {
  if (!cast) return null

  const avatarImg = cast.author.pfp_url || null

  return (
    <Link href={`/${warpcastUrl ? encodeURIComponent(warpcastUrl) : cast.hash}`}>
      <Card className="w-full hover:bg-slate-100 rounded-lg max-w-md md:min-w-64">
        {headerText && headerText.length > 0 &&
          <div className="p-3 pt-1.5 pb-2 border-b border-black/75 w-full">
            <p>{headerText}</p>
          </div>
        }
        <CardHeader className="flex flex-row items-center space-x-2">
          <Avatar>
            <AvatarImage alt={`@${cast.author.username}`} src={avatarImg} />
            <AvatarFallback>{cast?.author?.username ? cast.author.username.slice(0, 2) : null}</AvatarFallback>
          </Avatar>
          <div className="font-medium text-md">{cast.author.display_name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">@{cast.author.username ?? cast.fid}</div>
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