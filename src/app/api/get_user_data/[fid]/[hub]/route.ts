import { HubRpcClient, bytesToHexString, getSSLHubRpcClient } from '@farcaster/hub-nodejs';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { fid: number, hub: string } }
) { 
  
  let body: any = ['initial']
  const client = await createClient(params.hub);
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
}

const createClient = async ( hub: string) : Promise<HubRpcClient> => {
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