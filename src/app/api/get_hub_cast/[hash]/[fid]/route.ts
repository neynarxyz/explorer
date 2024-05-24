import { neynarHub } from "@/constants";
import { fetchCastFromHub, fetchCastFromNeynarAPI } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: NextRequest,
    { params: { hash,fid } }: { params: { hash: string,fid: string } },
  ) {
    if(!hash) return NextResponse.json({error: "No hash provided"}, {status: 400});
  try {
    const apiCastData = await fetchCastFromHub(hash,parseInt(fid,10),neynarHub,false);
    return NextResponse.json(apiCastData);
  } catch (e) {
    console.log("error in get_hub_cast", e);
    return NextResponse.json(e);
  }
}