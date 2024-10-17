import { hubs } from '@/constants';
import { fetchCastFromHub, fetchFidFromHub } from '@/lib/utils';

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  const hash = searchParams.get('hash');
  const isCast = searchParams.get('isCast') === 'true';
  let followRelationship = searchParams.get('followRelationship');

  if (followRelationship === 'null') {
    followRelationship = null;
  }

  if (!fid && !hash) {
    return new Response(
      JSON.stringify({ error: 'fid or hash must be provided' }),
      { status: 400 }
    );
  }

  try {
    const promises = hubs.map(async (hub) => {
      const authorData = await fetchFidFromHub(
        fid ? parseInt(fid) : null,
        hub,
        isCast,
        followRelationship
      );
      const castData = await fetchCastFromHub(
        hash,
        fid ? parseInt(fid) : null,
        hub,
        isCast
      );
      return { name: hub.shortname, author: authorData, cast: castData };
    });

    const hubData = await Promise.all(promises);
    return new Response(JSON.stringify({ hubData }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error fetching data from hubs' }),
      { status: 500 }
    );
  }
}
