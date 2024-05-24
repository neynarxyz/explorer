import { fetchAuthorFromNeynarAPI} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params: { identifier } }: { params: { identifier: string } },
  ) {
    if(!identifier) return NextResponse.json({error: "No fid provided"}, {status: 400});
  try {
    const apiCastData = await fetchAuthorFromNeynarAPI(decodeURIComponent(identifier));
    return NextResponse.json(apiCastData);
  } catch (e) {
    console.log("error in get api author", e);
    return NextResponse.json(e);
  }
}