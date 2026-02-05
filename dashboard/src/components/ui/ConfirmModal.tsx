
import { MdWarning, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           className="relative w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Section */}
          <div className="relative shrink-0">
               {/* Header Background - Warning Theme */}
               <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-red-600/20">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
               </div>

               {/* Header Content */}
               <div className="relative z-10 flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                             <MdWarning size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-md">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md border border-white/5 hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdClose size={20} />
                    </button>
               </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex-1 bg-[#0a0a0a]">
            <p className="text-gray-300 leading-relaxed mb-8">
                {message}
            </p>

            <div className="flex items-center justify-end gap-3">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                     {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                        </>
                    ) : (
                        'Delete'
                    )}
                </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
