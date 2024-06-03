"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import ReactDiffViewer from 'react-diff-viewer-continued';

interface Props {
  params: { fid: number };
  searchParams: { hub: string};
}

export default function Page(props: Props) {
  
  const [resp, setResp] = useState<JSON>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/get_user_data/${props.params.fid}/${props.searchParams.hub}`)
        setResp(response.data)
      } catch (error) {
        setResp(error as JSON)
      }
    };

    fetchData();
  }, [props.searchParams.hub, props.params.fid]); // Dependency array
  

  return (
    <div className="p-2">
      {resp === undefined ? (
        <div>Loading...</div>
      ) : (
        <div className="flex justify-center w-full">
          <pre className="bg-gray-800 text-white p-2 rounded w-full font-mono text-sm overflow-y-scroll overflow-x-scroll">
            <ReactDiffViewer oldValue={JSON.stringify(resp, null, 2)} newValue={JSON.stringify(resp, null, 2)} splitView={true} />
          </pre>
        </div>
      )}
    </div>
  )
} 