
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Trash2, User, Phone, AlignLeft, Calendar, Tag, Clock, Bell, BellOff } from 'lucide-react';
import { Client, ColumnDefinition, Schedule } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: any) => void;
  onDelete?: () => void;
  initialData?: Client | null;
  columns?: ColumnDefinition[];
}

const ClientModal: React.FC<ClientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialData, 
  columns = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    columnId: columns[0]?.id || '',
    date: new Date().toISOString(),
    hasScheduling: false,
    scheduling: {
      date: '',
      time: '',
      notes: ''
    }
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        description: initialData.description,
        columnId: initialData.columnId,
        date: initialData.date,
        hasScheduling: !!initialData.scheduling,
        scheduling: initialData.scheduling || { date: '', time: '', notes: '' }
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        description: '',
        columnId: columns[0]?.id || '',
        date: new Date().toISOString(),
        hasScheduling: false,
        scheduling: { date: '', time: '', notes: '' }
      });
    }
  }, [initialData, isOpen, columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.columnId) return;

    const payload: any = {
      name: formData.name,
      phone: formData.phone,
      description: formData.description,
      columnId: formData.columnId,
      date: formData.date,
    };

    if (formData.hasScheduling) {
      if (!formData.scheduling.date || !formData.scheduling.time) {
        alert("Por favor, preencha data e hora do agendamento.");
        return;
      }
      payload.scheduling = formData.scheduling;
    } else {
      payload.scheduling = undefined;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onSave(initialData ? { ...payload, id: initialData.id, userId: initialData.userId } : payload);
      setIsSuccess(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        
        <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {initialData ? 'Perfil do Cliente' : 'Novo Cadastro'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Gestão completa do cliente e agendamentos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <User className="w-3 h-3" /> Nome do Cliente
              </label>
              <input
                required
                type="text"
                placeholder="Ex: João da Silva"
                className="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <Phone className="w-3 h-3" /> WhatsApp / Contato
              </label>
              <input
                required
                type="tel"
                placeholder="DDD + Número"
                className="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <Tag className="w-3 h-3" /> Status da Negociação
              </label>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, columnId: column.id })}
                    className={`h-12 px-3 rounded-xl border text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
                      formData.columnId === column.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${column.color} ${formData.columnId === column.id ? 'bg-white' : ''}`} />
                    {column.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO DE AGENDAMENTO */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${formData.hasScheduling ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Agendar Atendimento</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasScheduling: !formData.hasScheduling })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasScheduling ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.hasScheduling ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {formData.hasScheduling && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Data</label>
                      <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input
                          type="date"
                          className="w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                          value={formData.scheduling.date}
                          onChange={(e) => setFormData({ ...formData, scheduling: { ...formData.scheduling, date: e.target.value } })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Horário</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="time"
                          className="w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                          value={formData.scheduling.time}
                          onChange={(e) => setFormData({ ...formData, scheduling: { ...formData.scheduling, time: e.target.value } })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Obs. do Agendamento</label>
                    <textarea
                      placeholder="Detalhes sobre o horário agendado..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-xs"
                      rows={2}
                      value={formData.scheduling.notes}
                      onChange={(e) => setFormData({ ...formData, scheduling: { ...formData.scheduling, notes: e.target.value } })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-4">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <AlignLeft className="w-3 h-3" /> Descrição Geral
              </label>
              <textarea
                rows={2}
                placeholder="Anotações gerais sobre o cliente..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </form>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            form="client-form"
            type="submit"
            disabled={isSuccess}
            className={`w-full h-14 flex items-center justify-center gap-3 rounded-2xl font-bold text-white transition-all transform active:scale-95 shadow-xl ${
              isSuccess 
              ? 'bg-emerald-500 shadow-emerald-500/20' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-6 h-6 animate-bounce" />
                Salvo com Sucesso!
              </>
            ) : (
              initialData ? 'Salvar Alterações' : 'Cadastrar e Salvar'
            )}
          </button>

          {initialData && onDelete && (
            <button
              onClick={() => { if (window.confirm('Tem certeza que deseja excluir este cliente?')) onDelete(); }}
              className="w-full h-12 flex items-center justify-center gap-2 text-rose-500 dark:text-rose-400 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Registro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
