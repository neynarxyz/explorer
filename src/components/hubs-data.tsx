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

        const messageCounts = data.map(
          (hub: any) => hub?.dbStats?.numMessages || 0
        );
        const sortedCounts = messageCounts.sort(
          (a: number, b: number) => a - b
        );
        const middleIndex = Math.floor(sortedCounts.length / 2);
        const median =
          sortedCounts.length % 2 === 0
            ? (sortedCounts[middleIndex - 1] + sortedCounts[middleIndex]) / 2
            : sortedCounts[middleIndex];
        setMedianMessages(median);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-row md:w-1/2">
      <div className="flex md:flex-row flex-col md:items-start items-center justify-around w-full md:space-x-16">
        {loading
          ? // Skeleton loaders for loading state
            hubs.slice(0, 3).map((item) => (
              <div className="space-y-2" key={item.shortname}>
                <p className="text-center">
                  <Skeleton width={200} />
                </p>
                <div>
                  <p className="text-center font-bold text-md">
                    <Skeleton width={100} />
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
                <div className="space-y-2" key={index}>
                  <p className="text-center">
                    Number of Messages on {capitalizeNickname(hub?.nickname)}
                  </p>
                  <div className="w-full">
                    {hub.dbStats.numMessages !== null ? (
                      <p className="text-center font-bold text-md">
                        {hub?.dbStats?.numMessages.toLocaleString()}{' '}
                        <span
                          className="text-sm"
                          style={{
                            color:
                              percentageDifference == 0
                                ? 'gray'
                                : percentageDifference > 0
                                  ? 'green'
                                  : 'red',
                          }}
                        >
                          ({percentageDifference}%)
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
