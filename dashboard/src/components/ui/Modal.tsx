
import { MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           className={`relative w-full ${maxWidth} bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
        >
          {/* Header Section with Contained Background */}
          <div className="relative shrink-0">
               {/* Header Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-blue-600/20">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
               </div>

               {/* Header Content */}
               <div className="relative z-10 flex items-center justify-between p-6">
                    <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">{title}</h3>
                    <button
                    onClick={onClose}
                    className="p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md border border-white/5 hover:border-white/10"
                    >
                    <MdClose size={20} />
                    </button>
               </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0a0a]">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
