import { useClipboard } from '@/hooks/useClipboard';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import * as amplitude from '@amplitude/analytics-browser';

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  response: any;
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  toggleModal,
  response,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { copied, copy } = useClipboard();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        toggleModal();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, toggleModal]);

  if (!isOpen) return null;

  const { missingObjects, ...restResponse } = response;

  const linkify = (text: any) => {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const fidPattern = /"fid":\s?(\d+)/g;
    const hashPatterns = [
      /"hash":\s?"([^"]+)"/g,
      /"parentHash":\s?"([^"]+)"/g,
      /"parent_hash":\s?"([^"]+)"/g,
      /"threadHash":\s?"([^"]+)"/g,
      /"thread_hash":\s?"([^"]+)"/g,
    ];

    const shouldLinkifyHashes = !(
      text.includes('MESSAGE_TYPE_USER_DATA') ||
      text.includes('MESSAGE_TYPE_VERIFICATION') ||
      text.includes('MESSAGE_TYPE_LINK_ADD')
    );

    let linkedText = text.replace(
      urlPattern,
      (url: any) =>
        `<a href="${url}" target="_blank" class="text-blue-500">${url}</a>`
    );

    linkedText = linkedText.replace(
      fidPattern,
      (match: any, fid: any) =>
        `"fid": <a href="/${fid}" class="text-blue-500">${fid}</a>`
    );

    if (shouldLinkifyHashes) {
      hashPatterns.forEach((pattern) => {
        linkedText = linkedText.replace(pattern, (match: any, hash: any) => {
          const key = match.split(':')[0].replace(/"/g, '');
          return `"${key}": "<a href="/${hash}" class="text-blue-500">${hash}</a>"`;
        });
      });
    }

    return linkedText;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30"></div>

      <div
        ref={modalRef}
        className="relative p-6 rounded shadow-lg z-50 max-w-lg md:max-w-4xl w-full mx-auto bg-transparent"
      >
        {missingObjects && missingObjects.length > 0 && (
          <div className="text-red-500 font-jetbrains mb-4">
            <strong>Missing:</strong> {missingObjects.join(', ')}
          </div>
        )}

        <div className="bg-[#0000A8] text-white p-4 rounded  overflow-y-auto max-h-64 md:max-h-[27rem] md:max-w-6xl max-w-lg">
          <pre
            className="font-jetbrains text-xs"
            dangerouslySetInnerHTML={{
              __html: linkify(JSON.stringify(restResponse, null, 2)),
            }}
          ></pre>
        </div>

        <div className="flex justify-end flex-1 w-full">
          <button
            className="font-jetbrains bg-white text-black    border border-white hover:bg-gray-200 font-jetbrains px-2 py-1"
            onClick={() => {
              amplitude.track('Click on response', {
                response,
              });
              copy(JSON.stringify(restResponse, null, 2));
            }}
          >
            {copied ? (
              <div className="flex flex-row items-center">
                <p className="text-md">Copied&nbsp;</p>{' '}
                <CopyCheckIcon className="w-4 h-4 mr-1" />
              </div>
            ) : (
              <div className="flex flex-row items-center">
                <p className="text-md">Copy</p>{' '}
                <CopyIcon className="w-3 h-3 ml-1" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
