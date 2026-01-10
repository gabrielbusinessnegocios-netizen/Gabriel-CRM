
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Edit2, SearchX, Layout } from 'lucide-react';
import { Client, ColumnDefinition } from '../types';
import ClientCard from './ClientCard';

interface KanbanColumnProps {
  column: ColumnDefinition;
  clients: Client[];
  onClientClick: (client: Client) => void;
  onWhatsAppClick: (phone: string) => void;
  onEditColumn: (column: ColumnDefinition) => void;
  isSearching: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, clients, onClientClick, onWhatsAppClick, onEditColumn, isSearching }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: isSearching
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header Estilo "Título de Página" */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`w-3 h-3 rounded-full ${column.color} shadow-sm border border-black/5 dark:border-white/10`} />
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">
              {column.label}
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-5">
            {clients.length} {clients.length === 1 ? 'Cliente' : 'Clientes'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEditColumn(column)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-90"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Linha de separação colorida elegante */}
      <div className="px-6">
        <div className={`h-[4px] w-full ${column.color} rounded-full opacity-30`} />
      </div>

      {/* Lista de Cards (Página) */}
      <div 
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto px-6 py-4 pb-32 space-y-4 no-scrollbar min-h-[200px] transition-colors duration-200 ${isOver ? 'bg-slate-100/50 dark:bg-slate-900/30' : ''}`}
      >
        <SortableContext 
          items={clients.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientCard 
                key={client.id}
                client={client} 
                onClick={() => onClientClick(client)}
                onWhatsApp={() => onWhatsAppClick(client.phone)}
              />
            ))
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 space-y-4 pointer-events-none">
              {isSearching ? (
                <>
                  <SearchX className="w-16 h-16 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-center opacity-40">Sem resultados</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-[32px] border-2 border-dashed border-current flex items-center justify-center opacity-20">
                    <Layout className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold opacity-30">Coluna vazia</p>
                </>
              )}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
