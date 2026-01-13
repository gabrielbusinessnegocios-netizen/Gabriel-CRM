
import React from 'react';
import { X, ShoppingBag, LogOut, ChevronRight, LayoutGrid, Download, Users, TrendingUp } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
  currentView?: string;
  stats?: {
    totalClients: number;
    totalSales: number;
  };
  onExport?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  userEmail, 
  onLogout, 
  onNavigate, 
  currentView,
  stats,
  onExport
}) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300 z-[100]" 
          onClick={onClose} 
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-[110]
        w-[300px] h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="py-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl shadow-blue-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[28px] p-1 flex items-center justify-center">
                <img 
                  src="./logo.png" 
                  alt="Gabriel CRM Logo" 
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${userEmail.charAt(0)}&background=2563eb&color=fff`; }}
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase">
            Gabriel <span className="text-blue-600">CRM</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 opacity-60">Professional Edition</p>
        </div>

        <div className="px-6 mb-8 grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/50">
            <Users className="w-5 h-5 text-blue-600 mb-1" />
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stats?.totalClients || 0}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Leads</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/50">
            <ShoppingBag className="w-5 h-5 text-emerald-500 mb-1" />
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
              {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(stats?.totalSales || 0)}
            </p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Vendas</p>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <button 
            className={`w-full h-14 px-4 flex items-center justify-between rounded-2xl font-bold transition-all active:scale-95 group ${currentView === 'kanban' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            onClick={() => onNavigate?.('kanban')}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5" />
              <span>CRM Kanban</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${currentView === 'kanban' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
          </button>

          <button 
            className={`w-full h-14 px-4 flex items-center justify-between rounded-2xl font-bold transition-all active:scale-95 group ${currentView === 'vendas' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            onClick={() => onNavigate?.('vendas')}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span>Relatório Vendas</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${currentView === 'vendas' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
          </button>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-2" />

          <button 
            onClick={onExport}
            className="w-full h-14 px-4 flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-95"
          >
            <Download className="w-5 h-5" />
            <span>Exportar Backup</span>
          </button>
        </div>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Logado como:</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-300 truncate">{userEmail}</span>
            </div>
            
            <button 
              onClick={onLogout}
              className="w-full h-12 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-rose-600 border border-rose-100 dark:border-rose-900/30 font-bold rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Sair da Conta
            </button>
          </div>
          <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-6">Version 2.0.4 • Stable</p>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:rotate-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
