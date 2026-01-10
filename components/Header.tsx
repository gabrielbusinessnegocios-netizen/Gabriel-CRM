
import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Users, ArrowRight, PlusSquare } from 'lucide-react';
import { Client, ColumnDefinition } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  filteredClients: Client[];
  columns: ColumnDefinition[];
  onJumpToClient: (client: Client) => void;
  onAddColumn: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  isDarkMode, 
  onToggleTheme, 
  filteredClients,
  columns,
  onJumpToClient,
  onAddColumn
}) => {
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowResults(searchQuery.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getColumnInfo = (columnId: string) => {
    return columns.find(c => c.id === columnId);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 pt-10 md:pt-4">
      <div className="flex flex-col gap-3 max-w-5xl mx-auto relative" ref={containerRef}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar cliente ou telefone..."
              className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500/50 transition-all outline-none text-sm font-bold"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => searchQuery.length > 0 && setShowResults(true)}
            />
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={onAddColumn}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 border border-slate-200/50 dark:border-slate-700/50"
              title="Nova Coluna"
            >
              <PlusSquare className="w-6 h-6 text-blue-500" />
            </button>

            <button 
              onClick={onToggleTheme}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-75 overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              aria-label="Alternar tema"
            >
              <div className={`transition-all duration-500 ${isDarkMode ? 'rotate-[360deg] scale-110' : 'rotate-0 scale-100'}`}>
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-500 fill-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                )}
              </div>
            </button>
          </div>
        </div>

        {showResults && filteredClients.length > 0 && (
          <div className="absolute top-14 left-0 right-0 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[60vh] flex flex-col z-[60]">
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                {filteredClients.length} Encontrados
              </span>
            </div>
            
            <div className="overflow-y-auto no-scrollbar">
              {filteredClients.map((client) => {
                const col = getColumnInfo(client.columnId);
                return (
                  <button
                    key={client.id}
                    onClick={() => {
                      onJumpToClient(client);
                      setShowResults(false);
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 group"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {client.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {client.phone}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <div className={`w-1.5 h-1.5 rounded-full ${col?.color || 'bg-slate-400'}`} />
                          <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                            {col?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
