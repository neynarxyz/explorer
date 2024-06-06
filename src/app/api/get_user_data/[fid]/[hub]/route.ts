import { HubRpcClient, bytesToHexString, getSSLHubRpcClient } from '@farcaster/hub-nodejs';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: number, hub: string } }
) { 
  
  let body: any = ['initial']
  
  const useGrpc = request.nextUrl.searchParams.get("useGrpc") ?? ""
  if (useGrpc === "true") {
    try {
      const client = await createGrpcClient(params.hub);
  
      try {
        const userData = await client.getUserDataByFid({ fid: params.fid }, )    
        userData.map((data) => { 
          body = data.messages.map((msg) => {
            return {
              ...msg,
              hash: bytesToHexString(msg.hash),
              signature: bytesToHexString(msg.signature),
              signer: bytesToHexString(msg.signer)
            }
          })
        })
  
        client.close()
        return NextResponse.json(body)
      } catch (err) {
        client.close()
        return NextResponse.json({ error: 'Error fetching user data', details: err }, { status: 500 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching user data', details: error }, { status: 500 });
    }
  } else {
    try {
      const response = await axios.get(`https://${params.hub}:2281/v1/userDataByFid?fid=${params.fid}`)
      return NextResponse.json(response.data)
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching user data', details: error }, { status: 500 });
    }
  }
}

const createGrpcClient = async ( hub: string) : Promise<HubRpcClient> => {
  return new Promise((resolve, reject) => {
    const hubRpcEndpoint = `${hub}:2283`
    const client = getSSLHubRpcClient(hubRpcEndpoint)
    client.$.waitForReady(Date.now() + 5000, async (e) => {
      if (e) {
        console.error(`Failed to connect to ${hubRpcEndpoint}:`, e);
        reject(e);
      } else {
        console.log(`Connected to ${hubRpcEndpoint}`);
        resolve(client);
      }
    });
  });
}