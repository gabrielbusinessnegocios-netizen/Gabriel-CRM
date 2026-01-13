
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BellRing, PhoneCall, MessageSquareText } from 'lucide-react';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
  columnColor?: string;
  isDragging?: boolean;
  onClick: () => void;
  onWhatsApp: () => void;
}

// Ícone customizado baseado na imagem enviada pelo usuário
const CustomAvatarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="256" fill="url(#avatar_grad)" />
    <path d="M256 120c44.183 0 80 35.817 80 80s-35.817 80-80 80-80-35.817-80-80 35.817-80 80-80zM120 400c0-75.111 60.889-136 136-136s136 60.889 136 136" stroke="white" strokeWidth="24" strokeLinecap="round" />
    <defs>
      <linearGradient id="avatar_grad" x1="0" y1="512" x2="512" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00ffd2" />
        <stop offset="1" stopColor="#00a2ff" />
      </linearGradient>
    </defs>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ClientCard: React.FC<ClientCardProps> = ({ client, columnColor, isDragging: isOverlay, onClick, onWhatsApp }) => {
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
      className={`group relative bg-white dark:bg-slate-800 rounded-[30px] p-5 border select-none transition-all duration-300 ${
        isOverlay 
        ? 'shadow-2xl border-blue-500 cursor-grabbing scale-[1.03] rotate-1 ring-8 ring-blue-500/5' 
        : 'hover:shadow-2xl lg:hover:-translate-y-1.5 cursor-grab border-slate-100 dark:border-slate-700 shadow-md active:scale-[0.96]'
      }`}
      onClick={(e) => !isDragging && !isOverlay && onClick()}
    >
      <div className="flex flex-col pointer-events-none">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            {/* Avatar Container Refinado */}
            <div className="relative">
              <CustomAvatarIcon className="w-14 h-14 drop-shadow-lg transition-transform group-hover:scale-105" />
              {hasScheduling && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg shadow-rose-500/40 flex items-center justify-center animate-pulse z-10">
                   <BellRing className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-[17px] font-black text-slate-900 dark:text-slate-100 leading-tight truncate mb-1.5">
                {name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 font-black tracking-tight">
                  {phone}
                </p>
              </div>
              
              {description && (
                <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex gap-2.5 items-start">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shrink-0 mt-0.5">
                    <MessageSquareText className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4 pointer-events-auto shrink-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.15em] whitespace-nowrap px-2.5 py-1.5 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {formatDate(date)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
              className={`w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e7c6f] active:scale-90 text-white rounded-[18px] shadow-xl shadow-emerald-500/40 transition-all border-2 border-white dark:border-slate-800 ${isDragging || isOverlay ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
              disabled={isDragging || isOverlay}
            >
              <WhatsAppIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Detalhe de acabamento na borda inferior */}
      {!isOverlay && (
        <div className={`absolute bottom-0 left-10 right-10 h-[3px] rounded-t-full opacity-60 ${columnColor || 'bg-blue-500'}`} />
      )}
    </div>
  );
};

export default ClientCard;
