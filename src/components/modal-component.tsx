import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  response: any;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggleModal, response, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        toggleModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, toggleModal]);

  if (!isOpen) return null;

  const { missingObjects, ...restResponse } = response;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div ref={modalRef} className="bg-white p-6 rounded shadow-lg relative z-50 max-w-lg md:max-w-6xl w-full mx-auto">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {missingObjects && missingObjects.length > 0 && (
          <div className="text-red-500 mb-4">
            <strong>Missing:</strong> {missingObjects.join(', ')}
          </div>
        )}
        <div className="bg-gray-800 text-white p-4 rounded font-mono text-sm overflow-y-auto max-h-56 md:max-h-96 md:max-w-6xl max-w-lg">
          <pre>{JSON.stringify(restResponse, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default Modal;
