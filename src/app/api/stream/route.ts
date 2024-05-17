import { HubEventType, NobleEd25519Signer, bytesToHexString, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { NextRequest, NextResponse } from 'next/server';

const onMessage = (message: any, subscribers: any[]) => {
  subscribers.forEach((subscriber: any) => {
    subscriber.enqueue(`data: ${JSON.stringify(message)}\n\n`);
  });
};

export async function GET(req: NextRequest) {
  const hubRpcEndpoint = process.env.NEYNAR_GPRC_ENDPOINT as string;
  const client = getSSLHubRpcClient(hubRpcEndpoint);

  let subscribers: any[] = [];

  client.$.waitForReady(Date.now() + 5000, async (e: any) => {
    if (e) {
      console.error(`Failed to connect to ${hubRpcEndpoint}:`, e);
      return new NextResponse('Failed to connect', { status: 500 });
    } else {

      try {
        const subscribeResult = await client.subscribe({
          eventTypes: [HubEventType.MERGE_MESSAGE],
        });

        if (subscribeResult.isOk()) {
          const stream = subscribeResult.value;

          for await (const event of stream) {
            if (event.mergeMessageBody.message.data.type === 1) {
              
              let hash = bytesToHexString(event.mergeMessageBody.message.hash) as any;
              if (hash && hash.value) {
                hash = hash.value;
              }
              const fid = event.mergeMessageBody.message.data.fid;
              if(fid > 200000) {
               continue
              }
              
              // Fetch author data
              const authorData = await client.getUserDataByFid({ fid });
              let author = {} as any;
              if (authorData.isOk()) {
                authorData.value.messages.forEach((message) => {
                  if (!message?.data?.userDataBody) return;
                  const { type, value } = message.data.userDataBody;
                  switch (type) {
                    case 1:
                      author.pfp_url = value;
                      break;
                    case 2:
                      author.display_name = value;
                      break;
                    case 3:
                      author.bio = value;
                      break;
                    case 6:
                      author.username = value;
                      break;
                    default:
                      break;
                  }
                });
              }

              onMessage({ ...event.mergeMessageBody.message.data.castAddBody, fid, hash, author }, subscribers);
            }
          }
        }
      } catch (error) {
        console.error('Subscription error:', error);
        return new NextResponse('Subscription error', { status: 500 });
      }
    }
  });

  const response = new NextResponse(
    new ReadableStream({
      start(controller) {
        subscribers.push(controller);

        controller.enqueue(': ping\n\n'); // Send initial ping to open the stream

        req.signal.onabort = () => {
          controller.close();
          subscribers = subscribers.filter((sub) => sub !== controller);
          console.log('Client disconnected');
          if (subscribers.length === 0) {
            client.close();
          }
        };
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  );

  return response;
}
