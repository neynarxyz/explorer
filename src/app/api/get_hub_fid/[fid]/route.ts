import { neynarHub } from "@/constants";
import { fetchCastFromHub, fetchCastFromNeynarAPI, fetchFidFromHub } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: NextRequest,
    { params: { fid } }: { params: { fid: string } },
  ) {
    if(!fid) return NextResponse.json({error: "No fid provided"}, {status: 400});
  try {
    const apiCastData = await fetchFidFromHub(parseInt(fid,10),neynarHub,false);
    return NextResponse.json(apiCastData);
  } catch (e) {
    console.log("error in get_hub_fid", e);
    return NextResponse.json(e);
  }
}