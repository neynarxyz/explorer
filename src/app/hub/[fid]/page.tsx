"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import ReactDiffViewer from 'react-diff-viewer-continued';

interface Props {
  params: { fid: number };
  searchParams: { hub1: string, hub2: string, useGrpc: boolean};
}

export default function Page(props: Props) {
  
  const [resp1, setResp1] = useState<JSON>();
  const [resp2, setResp2] = useState<JSON>();

  const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000'

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/get_user_data/${props.params.fid}/${props.searchParams.hub1}?useGrpc=${props.searchParams.useGrpc}`)
        setResp1(response.data)
      } catch (error) {
        setResp1(error as JSON)
      }
    };

    const fetchData2 = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/get_user_data/${props.params.fid}/${props.searchParams.hub2}?useGrpc=${props.searchParams.useGrpc}`)
        setResp2(response.data)
      } catch (error) {
        setResp2(error as JSON)
      }
    };

    fetchData1();
    if (props.searchParams.hub2?.length ?? 0 > 0) {
      fetchData2()
    }
  }, [props.searchParams.hub1, props.searchParams.hub2, props.params.fid]); // Dependency array
  

  return (
    <div className="flex flex-col justify-center w-full flex-grow">
      {resp1 === undefined ? (
        <div className="flex justify-center w-full">Loading...</div>
      ) : (
        <div className="overflow-auto w-full">
          <div className="flex justify-between w-full px-8">
            <div>{props.searchParams.hub1}</div>
            <div>{props.searchParams.hub2}</div>
          </div>
          <pre className="bg-gray-800 text-white p-2 rounded w-full font-mono text-sm overflow-auto whitespace-pre-wrap">
            <ReactDiffViewer oldValue={JSON.stringify(resp1, null, 2)} newValue={JSON.stringify(resp2, null, 2)} splitView={true} />
          </pre>
        </div>
      )}
    </div>
  )
} 