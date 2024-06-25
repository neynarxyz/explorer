'use client';
//NOTE: Not using this hook in the project, but it is a good example of how to render embeds from a cast.
import { useCallback, useEffect, useState } from 'react';
import { getEmbedType } from '@/lib/utils';

// Assuming onSubmit should be a function provided by the component that will trigger data fetching
const useFetchEmbedData = (embeds: any[]) => {
  const [embed, setEmbed] = useState<any | null>(null);

  const fetchEmbedData = useCallback(async () => {
    if (!embeds) {
      return;
    }
    // First, attempt to fetch data from the API.
    const embedData = await Promise.all(
      embeds.map(async (embed) => {
        return await getEmbedType(embed.url);
      })
    );
    const firstValidEmbedData = embedData.find((embed: any) => embed !== null);
    setEmbed(firstValidEmbedData);
  }, [embeds]);

  useEffect(() => {
    fetchEmbedData();
  }, [fetchEmbedData]);

  return { embed };
};

export default useFetchEmbedData;
