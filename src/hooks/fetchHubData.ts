'use client'
import axios from "axios";
import { useCallback, useState } from "react";
import { hubs, tokenBearer } from "@/constants";
import { fetchCastFromHub } from "@/lib/utils";

// Assuming onSubmit should be a function provided by the component that will trigger data fetching
const useFetchHubData = () => {
    const [hubResponses, setHubResponses] = useState<any[] | null>(null);
    const [apiResponse, setApiResponse] = useState<any | null>(null);
    const [castPreview, setCastPreview] = useState<any | null>(null);

    const fetchData = useCallback(async (hash: string, fid: number | null) => {
        // First, attempt to fetch data from the API.
        const apiCastResponse = await axios.get(`/api/get_api_cast/${hash}`, { headers: { "Content-Type": "application/json","Authorization": tokenBearer } })
        if (apiCastResponse.data) {
            setApiResponse(apiCastResponse.data);
            setCastPreview(apiCastResponse.data.cast);
        }
        const apiCastData = apiCastResponse.data;
        // If the API fetch fails to return a necessary 'author' object, and no 'fid' is provided, skip fetching from hubs.
        if ((!fid && !apiCastData.cast?.author?.fid)) {
            return;
        }
        const castFID = fid || apiCastData.cast?.author.fid;
        const hubData = await Promise.all(hubs.map(async (hub) => {
            return { ...await fetchCastFromHub(hash, castFID as number, hub), hub: hub.shortname };
        }));
        if (!apiCastData) {
            const validHubData = hubData.find((hub: any) => hub.data);
            const hash = validHubData?.data?.hash;
            const hubCastData = validHubData?.data?.data
            const authorInfo = await axios.get(`/api/get_api_author/${hubCastData.fid}`, { headers: { "Content-Type": "application/json",
                "Authorization": tokenBearer
             } })
            if (hubCastData && authorInfo.data) {
                const author = authorInfo.data.author;
                const {timestamp: timestampNumber, castAddBody} = hubCastData;
                const timestamp = new Date(timestampNumber * 1000).toISOString();
                const completeCastData = {timestamp,...castAddBody, author,hash}
                setCastPreview(completeCastData);
            }
        }
        setHubResponses(hubData);
    }, []);

    return { fetchData, hubResponses, apiResponse , castPreview};
};

export default useFetchHubData;


