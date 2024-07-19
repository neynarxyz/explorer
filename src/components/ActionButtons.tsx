import React, { useState } from 'react';
import Link from 'next/link'; // Assuming you're using Next.js for routing
import { CopyCheckIcon, CopyIcon, UserIcon, SearchIcon } from 'lucide-react';
import * as amplitude from '@amplitude/analytics-browser';
import { useClipboard } from '@/hooks/useClipboard';

const ActionButtons = ({ fid, hash, identifier }: any) => {
  const { copied, copy } = useClipboard();
  return (
    <div className="gap-0 flex justify-end">
      {fid || hash ? (
        <button
          className="font-jetbrains bg-white text-black    border border-white hover:bg-gray-200 font-jetbrains"
          onClick={() => {
            amplitude.track('Click on identifier', {
              identifier,
            });
            copy(fid ? fid.toString() : hash || '');
          }}
        >
          <div className="font-jetbrains flex flex-row px-1 h-6 items-center">
            {copied ? (
              <>
                <p className="text-md">copied&nbsp;</p>{' '}
                <CopyCheckIcon className="w-4 h-4 mr-1" />
              </>
            ) : (
              <>
                <p className="text-md">
                  copy {fid ? ' user fid' : ' cast hash'}
                </p>{' '}
                <CopyIcon className="w-3 h-3 ml-1" />
              </>
            )}
          </div>
        </button>
      ) : null}
    </div>
  );
};

export default ActionButtons;
