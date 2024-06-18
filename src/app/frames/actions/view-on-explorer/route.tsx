import { NextRequest } from "next/server";
import { frames } from "../../frames";
import { ActionMetadata } from "frames.js";
import { seo } from "@/constants";

export const GET = async (req: NextRequest) => {
  const actionMetadata: ActionMetadata = {
    action: {
      type: "post",
    },
    icon: "info",
    name: "View on Neynar Explorer",
    aboutUrl: `${seo.url}`,
    description: "View the details of a cast on Neynar Explorer",
  };

  return Response.json(actionMetadata);
};

export const POST = frames(async (ctx) => {
  const hash = ctx.message?.castId?.hash;
  return Response.json({
    message: `View on Neynar Explorer`,
    link: `${seo.url}/${hash}`,
    type: 'message'
  });
});