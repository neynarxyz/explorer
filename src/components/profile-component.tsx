//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import Link from 'next/link'

export function ProfileComponent({ pfp, url, headerText }: any) {
  if (!pfp) return null

  return (
    <Link href={`/${encodeURIComponent(url)}`}>
      <Card className="w-full hover:bg-slate-100 flex flex-col rounded-lg max-w-md md:min-w-64 md:min-h-32 items-center justify-center">
      {headerText && headerText.length > 0 &&
            <div className="pl-3 pb-1.5 border-b border-black/75 w-full">
              <p className="font-medium text-black/90">{headerText}</p>
            </div>
        }
        <CardContent className="p-4 w-full flex flex-col justify-center items-center space-y-10">
          <Avatar>
            <AvatarImage alt={`${url} PFP`} src={pfp} />
          </Avatar>
        </CardContent>
      </Card>
    </Link>
  )
}