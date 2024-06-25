import { useState, useRef } from "react";

export function useClipboard() {
    const [copied, setCopied] = useState(false);
    const ref = useRef();
  
    const copy = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
  
        if (ref.current) {
          clearTimeout(ref.current);
        }
  
        setTimeout(() => setCopied(false), 1_000);
      } catch (err) {
        // cool
      }
    };
  
    return { copy, copied };
  }