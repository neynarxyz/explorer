"use client"

import axios from "axios";
import { useEffect, useState } from "react";

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
        <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-80 overflow-y-scroll overflow-x-scroll">
          {JSON.stringify(resp, null, 2)}
        </pre>
      )}
    </div>
  )
} 