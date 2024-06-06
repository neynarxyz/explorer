'use client'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { useState } from "react";

  interface CollapsibleCodeComponentProps {
    triggerContent: React.ReactNode;
    children: React.ReactNode;
  }

  export function CollapsibleCodeComponent({ triggerContent, children }: CollapsibleCodeComponentProps) {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };
  
    return (
      <Collapsible onOpenChange={handleOpenChange}>
        <div className="flex flex-row w-full items-center justify-center">
          <CollapsibleTrigger>
            <div className="flex items-center">
              {triggerContent}
              <span className="ml-2">
                {isOpen ? '▼' : '▶'} {/* Indicator: ▼ for open, ▶ for closed */}
              </span>
            </div>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  }