import React, { useEffect, useRef } from 'react';

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
      text.includes('MESSAGE_TYPE_VERIFICATION')
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
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded shadow-lg relative z-50 max-w-lg md:max-w-6xl w-full mx-auto"
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {missingObjects && missingObjects.length > 0 && (
          <div className="text-red-500 mb-4">
            <strong>Missing:</strong> {missingObjects.join(', ')}
          </div>
        )}
        <div className="bg-gray-800 text-white p-4 rounded font-mono text-sm overflow-y-auto max-h-56 md:max-h-96 md:max-w-6xl max-w-lg">
          <pre
            dangerouslySetInnerHTML={{
              __html: linkify(JSON.stringify(restResponse, null, 2)),
            }}
          ></pre>
        </div>
      </div>
    </div>
  );
};

export default Modal;
