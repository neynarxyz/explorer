import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.

import useFetchEmbedData from "@/hooks/fetchEmbedData";

export function CastComponent({cast}: any) {
  const {embed} = useFetchEmbedData(cast?.embeds);
  if(!cast) return null;


  const avatarImg = cast.author.pfp_url ? cast.author.pfp_url : "/placeholder-avatar.jpg";  
  return (
    <Card className="w-full hover:bg-slate-100 rounded-lg max-w-md">
    <CardHeader className="flex flex-row items-center space-x-2">
  <Avatar >
    <AvatarImage alt={`@${cast.author.username}`} src={avatarImg} />
    <AvatarFallback>{cast.author.username.slice(0,2)}</AvatarFallback>
  </Avatar>
  <div className="font-medium text-md">{cast.author.display_name}</div>
  <div className="text-sm text-gray-500 dark:text-gray-400">@{cast.author.username}</div>
</CardHeader>

      <CardContent className="p-4 w-full flex flex-col justify-center items-center space-y-10">
      {embed ? (
  embed.type === "image" ? (
    <img 
      src={embed.url} 
      alt="embed" 
      className="w-28 min-w-28 min-h-28 rounded-lg"
    />
  ) : (
    <video 
      src={embed.url} 
      controls 
      className="w-32 min-w-32 min-h-32"
    />
  )
) : null}

        <p className="text-center text-sm">
          {cast.text}
        </p>
      </CardContent>
      <CardFooter className="flex items-center  justify-center p-4">
          <Button size="icon" variant="ghost">
            <ShareIcon className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
  
        {/* TODO: need to fix hub case of timestamp <div className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</div> */}
      </CardFooter>
    </Card>
  )
}


function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}
