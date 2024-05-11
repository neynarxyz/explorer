import { fetchCastFromNeynarAPI } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: NextRequest,
    { params: { hash } }: { params: { hash: string } },
  ) {
    if(!hash) return NextResponse.json({error: "No hash provided"}, {status: 400});
  try {
    const apiCastData = await fetchCastFromNeynarAPI(hash);
    return NextResponse.json(apiCastData);
  } catch (e) {
    console.log("error in get_channels", e);
    return NextResponse.json(e);
  }
}