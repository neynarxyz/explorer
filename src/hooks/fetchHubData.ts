'use client'
import axios from 'axios';
import { useCallback, useState } from 'react';
import { defaultFID, defaultHash, hubs, tokenBearer } from '@/constants';
import { fetchCastFromHub, fetchFidFromHub } from '@/lib/utils';

const useFetchHubData = () => {
    const [data, setData] = useState<any>({ apiData: null, hubData: [] });
    const [castPreview, setCastPreview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHubData = useCallback(async (fid: number | null, hash: string) => {
        const promises = hubs.map(async hub => {
            const authorData = await fetchFidFromHub(fid, hub);
            const castData = await fetchCastFromHub(hash, fid, hub);
            return { name: hub.shortname, author: authorData, cast: castData };
        });

        return Promise.all(promises);
    }, []);

    const fetchApiData = useCallback(async (fid: number | null, hash: string) => {
        let author = {}, cast = {} as any
        try {
            //TODO: clean author duration logic up
            const authorResponseTime = performance.now();
            const authorApiResponse = await axios.get(`/api/get_api_author/${fid}`, {
                headers: { 'Content-Type': 'application/json', 'Authorization': tokenBearer }
            });
            const durationInMs = performance.now() - authorResponseTime;
            author = {...authorApiResponse.data, durationInMs };

            const castApiResponse = await axios.get(`/api/get_api_cast/${hash}`, {
                headers: { 'Content-Type': 'application/json', 'Authorization': tokenBearer }
            })

            cast = castApiResponse.data
            if (cast && cast.cast) {
                setCastPreview(cast.cast);
            }
        } catch (error) {
            console.log("error in fetchApiData", error);
        }
        return { author, cast, name: "Neynar api" };
    }, []);

    const fetchData = useCallback(async (hash: string, fid: number | null) => {
        const finishedFID = fid ?? defaultFID;
        const finishedHash = hash ?? defaultHash;
        setIsLoading(true);
        const [apiData, hubData] = await Promise.all([
            fetchApiData(finishedFID, finishedHash),
            fetchHubData(finishedFID, finishedHash)
        ]);
        setData({ apiData, hubData });
        setIsLoading(false);
    }, [fetchApiData, fetchHubData]);

    return {
        isLoading,
        fetchData,
        data,
        castPreview
    };
};

export default useFetchHubData;



