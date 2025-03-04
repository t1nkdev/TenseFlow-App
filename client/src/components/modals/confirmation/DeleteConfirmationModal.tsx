import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset loading state when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen, itemName]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      setIsDeleting(false); // Reset on error too
    }
  };

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0066B3]/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-[#0066B3]" />
                      </div>
                      <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                        {title}
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 ml-14">
                    {message}
                    {itemName && (
                      <span className="font-medium text-gray-900 ml-1">"{itemName}"</span>
                    )}
                  </p>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleClose}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="min-w-[100px] px-6 py-2.5 text-sm font-medium rounded-lg bg-[#0066B3] text-white hover:bg-[#0066B3]/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="ml-1">Deleting</span>
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 