'use client';
import { useState, useEffect } from 'react';
import { capitalizeNickname } from '@/lib/helpers';
import { getHubsInfo } from '@/lib/utils';

const HubsDataComponent = () => {
  const [hubsData, setHubsData] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHubsInfo();
        setHubsData(data as any);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-row md:w-1/2">
      <div className="flex md:flex-row flex-col md:items-start items-center justify-around w-full md:space-x-16">
        {hubsData.map((hub: any, index: number) => (
          <div className="space-y-2" key={index}>
            <p className="text-center">
              Number of Messages on {capitalizeNickname(hub?.nickname)}
            </p>
            <div>
              {hub.dbStats.numMessages !== null ? (
                <p className="text-center font-bold">
                  {hub?.dbStats?.numMessages}
                </p>
              ) : (
                <p className="text-center">Loading...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HubsDataComponent;
