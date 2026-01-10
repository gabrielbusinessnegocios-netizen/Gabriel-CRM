
import React, { useState, useEffect } from 'react';
import { X, Check, Layout, Palette, Trash2, PlusCircle } from 'lucide-react';
import { ColumnDefinition } from '../types';
import { AVAILABLE_COLORS } from '../constants';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: any) => void;
  onDelete?: () => void;
  column: ColumnDefinition;
  isNew?: boolean;
}

const ColumnModal: React.FC<ColumnModalProps> = ({ isOpen, onClose, onSave, onDelete, column, isNew }) => {
  const [label, setLabel] = useState(column.label);
  const [color, setColor] = useState(column.color);

  useEffect(() => {
    setLabel(column.label);
    setColor(column.color);
  }, [column, isOpen]);

  const handleSave = () => {
    if (!label.trim()) return;
    onSave(isNew ? { label, color } : { ...column, label, color });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNew ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {isNew ? <PlusCircle className="w-5 h-5" /> : <Layout className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isNew ? 'Novo Status' : 'Editar Coluna'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
              Nome do Status
            </label>
            <input
              type="text"
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Em Negociação"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
              <Palette className="w-3 h-3" /> Cor Identificadora
            </label>
            <div className="grid grid-cols-5 gap-3">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.class}
                  onClick={() => setColor(c.class)}
                  className={`relative w-full aspect-square rounded-full ${c.class} border-2 transition-all active:scale-90 ${
                    color === c.class 
                      ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {color === c.class && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={`w-4 h-4 ${c.class === 'bg-white' ? 'text-blue-500' : 'text-white'}`} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={handleSave}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isNew ? 'Criar Status' : 'Confirmar Alteração'}
          </button>
          
          {!isNew && onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Ao excluir esta coluna, todos os clientes nela serão movidos para o status inicial. Continuar?')) {
                  onDelete();
                }
              }}
              className="w-full h-10 flex items-center justify-center gap-2 text-rose-500 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir Coluna
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnModal;
