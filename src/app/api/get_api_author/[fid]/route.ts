import { fetchAuthorFromNeynarAPI} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: NextRequest,
    { params: { fid } }: { params: { fid: string } },
  ) {
    if(!fid) return NextResponse.json({error: "No fid provided"}, {status: 400});
  try {
    const apiCastData = await fetchAuthorFromNeynarAPI(parseInt(fid,10));
    return NextResponse.json(apiCastData);
  } catch (e) {
    console.log("error in get api author", e);
    return NextResponse.json(e);
  }
}