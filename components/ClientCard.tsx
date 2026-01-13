
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, Calendar } from 'lucide-react';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
  isDragging?: boolean;
  onClick: () => void;
  onWhatsApp: () => void;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ClientCard: React.FC<ClientCardProps> = ({ client, isDragging: isOverlay, onClick, onWhatsApp }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isOverlay ? 100 : 1,
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Hoje';
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const name = client.name || client.nome_cliente;
  const phone = client.phone || client.telefone;
  const description = client.description || client.descricao;
  const date = client.date || client.created_at;
  const scheduling = client.scheduling || client.agendamento;

  const checkHasScheduling = () => {
    if (!scheduling || !scheduling.date) return false;
    const schedDate = new Date(`${scheduling.date}T${scheduling.time || '00:00'}`);
    const now = new Date();
    return schedDate >= new Date(now.setHours(0,0,0,0));
  };

  const hasScheduling = checkHasScheduling();

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative bg-white dark:bg-slate-800 rounded-[28px] p-5 border select-none transition-all duration-300 ${
        isOverlay 
        ? 'shadow-2xl border-blue-500 cursor-grabbing scale-[1.03] rotate-1 ring-4 ring-blue-500/10' 
        : 'hover:shadow-xl lg:hover:-translate-y-1 cursor-grab border-slate-100 dark:border-slate-700/50 shadow-sm active:scale-[0.97]'
      }`}
      onClick={(e) => !isDragging && !isOverlay && onClick()}
    >
      <div className="flex flex-col pointer-events-none">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className={`flex-shrink-0 w-12 h-12 rounded-[18px] flex items-center justify-center relative transition-colors ${hasScheduling ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <User className="w-6 h-6" />
              {hasScheduling && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg shadow-rose-500/40 animate-pulse flex items-center justify-center">
                   <Calendar className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-none truncate mb-1.5">
                {name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-tight">
                {phone}
              </p>
              
              {description && (
                <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 pointer-events-auto shrink-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest whitespace-nowrap px-2 py-1 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800/50">
              {formatDate(date)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
              className={`w-10 h-10 flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] text-white rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-90 transition-all ${isDragging || isOverlay ? 'opacity-0' : 'opacity-100'}`}
              disabled={isDragging || isOverlay}
            >
              <WhatsAppIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
