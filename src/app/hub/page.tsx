"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { hubs } from "@/constants";

export default function Page() {
  const [hubUrl1, setHubUrl1] = useState<string>("")
  const [hubOption1, setHubOption1] = useState<string>("")
  const [hubUrl2, setHubUrl2] = useState<string>("")
  const [hubOption2, setHubOption2] = useState<string>("")
  const [fID, setFID] = useState<string>("")
  const [error, setError] = useState<string | null>()
  const router = useRouter()

  const handleSubmit = ( useGrpc: boolean) => {
    const fIdNumber = parseInt(fID)
    if (fIdNumber) {
      setError(null)
      router.push(`/hub/${fID}?hub1=${hubUrl1}&hub2=${hubUrl2}&useGrpc=${useGrpc}`)
    } else {
      setError("fID must be a number")
    }
  }

  const handleOption1Select = (e: any) => {
    setHubOption1(e.target.value)
    setHubUrl1(e.target.value)
  }

  const handleOption2Select = (e: any) => {
    setHubOption2(e.target.value)
    setHubUrl2(e.target.value)
  }

  const dropdownOptions = ["",...hubs.map((h) => { return h.domain })];

  return (
    <div className="flex-col justify-center space-y-4 p-2">
      <p>Explore User Data in Hubs</p>
        <Input 
          className="max-w-48"
          placeholder="Enter fID"
          value={fID}
          onChange={(e)=>{ setFID(e.target.value) }}
        />
      <div className="flex space-x-2 items-center">
        <Input 
          className="max-w-48"
          placeholder="Enter Hub gRPC url 1"
          value={hubUrl1}
          onChange={(e)=>{ setHubUrl1(e.target.value)}}
        />
        <span>or select from</span>
        <select className="border rounded p-1" value={hubOption1} onChange={handleOption1Select}>
          {dropdownOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2 items-center">
        <Input 
          className="max-w-48"
          placeholder="Enter Hub gRPC url 2"
          value={hubUrl2}
          onChange={(e)=>{ setHubUrl2(e.target.value)}}
        />
        <span>or select from</span>
        <select className="border rounded p-1" value={hubOption2} onChange={handleOption2Select}>
          {dropdownOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => {handleSubmit(true)}}>
          Get Using gRPC
        </Button>
        <Button onClick={() => {handleSubmit(false)}}>
          Get Using HTTP
        </Button>
      </div>
      { error && <p className="text-red-600">{error}</p>}
    </div>
  )
}