'use client';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  calculatePercentageDifference,
  capitalizeNickname,
} from '@/lib/helpers';
import { getHubsInfo } from '@/lib/utils';
import { hubs } from '@/constants';

const HubsDataComponent = () => {
  const [hubsData, setHubsData] = useState<any>([]);
  const [medianMessages, setMedianMessages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHubsInfo();
        setHubsData(data as any);
        const neynarHub = data.find((hub: any) => hub?.nickname === 'Neynar');
        const neynarMessageCount = neynarHub?.dbStats?.numMessages || 1; // Default to 1 to avoid division by zero
        setMedianMessages(neynarMessageCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-row md:w-full h-full">
      <div className="flex flex-row items-center bg-white space-x-1 p-0.5">
        {loading
          ? // Skeleton loaders for loading state
            hubs.slice(0, 3).map((item) => (
              <div className="space-y-2 bg-gray-200 p-2" key={item.shortname}>
                <p className="text-center">
                  <Skeleton width={100} />
                </p>
                <div>
                  <p className="text-center font-bold text-md">
                    <Skeleton width={50} />
                  </p>
                </div>
              </div>
            ))
          : hubsData.map((hub: any, index: number) => {
              const percentageDifference: any = calculatePercentageDifference(
                hub?.dbStats?.numMessages,
                medianMessages
              ).toFixed(2);

              return (
                <div
                  style={{
                    backgroundColor:
                      percentageDifference == 0
                        ? '#5D5670'
                        : percentageDifference > 0
                          ? '#355E2B'
                          : '#C67A7D',
                  }}
                  className="space-y-2 min-h-14 flex items-center justify-center p-2"
                  key={index}
                >
                  <div className="w-full">
                    {hub.dbStats.numMessages !== null ? (
                      <p className="text-center font-bold text-xs md:text-sm font-jetbrains">
                        {capitalizeNickname(hub?.nickname)}&nbsp;
                        <span className="text-sm">
                          ({percentageDifference > 0 ? '+' : ''}
                          {percentageDifference}%)
                        </span>
                      </p>
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default HubsDataComponent;
