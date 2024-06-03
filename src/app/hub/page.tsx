"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Page() {
  const [hubUrl1, setHubUrl1] = useState<string>("")
  const [hubUrl2, setHubUrl2] = useState<string>("")
  const [fID, setFID] = useState<string>("")
  const [error, setError] = useState<string | null>()
  const router = useRouter()

  const handleSubmit = () => {
    const fIdNumber = parseInt(fID)
    if (fIdNumber) {
      setError(null)
      router.push(`/hub/${fID}?hub1=${hubUrl1}&hub2=${hubUrl2}`)
    } else {
      setError("fID must be a number")
    }
  }

  return (
    <div className="flex-col justify-center space-y-4 p-2">
      <p>Explore User Data in Hubs</p>
      <Input 
        className=""
        placeholder="Enter fID"
        value={fID}
        onChange={(e)=>{ setFID(e.target.value) }}
      />
      <Input 
        className=""
        placeholder="Enter Hub gRPC url 1"
        value={hubUrl1}
        onChange={(e)=>{ setHubUrl1(e.target.value)}}
       />
       <Input 
        className=""
        placeholder="Enter Hub gRPC url 2 (optional)"
        value={hubUrl2}
        onChange={(e)=>{ setHubUrl2(e.target.value)}}
       />
      <Button onClick={handleSubmit}>
        Submit
      </Button>
      { error && <p className="text-red-600">{error}</p>}
    </div>
  )
}