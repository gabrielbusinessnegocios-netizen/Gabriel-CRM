
import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 z-[100] transition-all active:scale-90 border-4 border-white dark:border-slate-900"
      aria-label="Adicionar cliente"
    >
      <Plus className="w-8 h-8" />
    </button>
  );
};

export default FAB;
