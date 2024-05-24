import { fetchCastFromNeynarAPI, isValidWarpcastUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: NextRequest,
    { params: { identifier } }: { params: { identifier: string } },
  ) {
    if(!identifier) return NextResponse.json({error: "No hash provided"}, {status: 400});
  try {
    const processedIdentifier = decodeURIComponent(identifier);
    const isURL = isValidWarpcastUrl(processedIdentifier);
    const apiCastData = await fetchCastFromNeynarAPI(processedIdentifier,isURL);
    return NextResponse.json(apiCastData);
  } catch (e) {
    console.log("error in get_channels", e);
    return NextResponse.json(e);
  }
}