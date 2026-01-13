
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, User, Phone, AlignLeft, Calendar, Tag, Clock, AlertTriangle, ChevronDown, DollarSign, Package } from 'lucide-react';
import { Client, ColumnDefinition } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: any) => void;
  onDelete?: () => void;
  initialData?: any | null; // Usando any para facilitar o mapeamento entre UI e DB
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
  
  const [saleData, setSaleData] = useState({
    category: 'Consórcio',
    model: '',
    value: ''
  });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        name: initialData.name || initialData.nome_cliente || '',
        phone: initialData.phone || initialData.telefone || '',
        description: initialData.description || initialData.descricao || '',
        columnId: initialData.columnId || initialData.status || columns[0]?.id || '',
        date: initialData.date || initialData.created_at || new Date().toISOString(),
        hasScheduling: !!(initialData.scheduling || initialData.agendamento),
        scheduling: (initialData.scheduling || initialData.agendamento) || { date: '', time: '', notes: '' }
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
    setShowDeleteConfirm(false);
    setShowSaleForm(false);
    setSaleData({ category: 'Consórcio', model: '', value: '' });
  }, [initialData, isOpen, columns]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.phone || !formData.columnId) return;

    const payload: any = {
      id: initialData?.id,
      name: formData.name,
      phone: formData.phone,
      description: formData.description,
      columnId: formData.columnId,
      scheduling: formData.hasScheduling ? formData.scheduling : null,
      saleDetails: showSaleForm ? saleData : undefined
    };

    // Se for venda, forçar a última coluna
    if (showSaleForm && columns.length > 0) {
      payload.columnId = columns[columns.length - 1].id;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onSave(payload);
      setIsSuccess(false);
    }, 600);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        
        <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${showSaleForm ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-blue-600 shadow-blue-500/30'}`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {showSaleForm ? 'Confirmar Venda' : (initialData?.id ? 'Perfil do Cliente' : 'Novo Cadastro')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {showSaleForm ? 'Preencha os dados da negociação' : 'Gestão completa do cliente e agendamentos'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar relative">
          
          {showDeleteConfirm && (
            <div className="absolute inset-0 z-30 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Confirmar Perda?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Este registro será excluído permanentemente.</p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={handleConfirmDelete} className="w-full h-14 bg-rose-600 text-white font-bold rounded-2xl active:scale-95 transition-all">SIM, PERDIDO</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="w-full h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl active:scale-95 transition-all">CANCELAR</button>
              </div>
            </div>
          )}

          {showSaleForm && (
            <div className="absolute inset-0 z-20 bg-white dark:bg-slate-900 p-6 animate-in fade-in slide-in-from-right duration-300 flex flex-col space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select
                    className="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={saleData.category}
                    onChange={(e) => setSaleData({ ...saleData, category: e.target.value })}
                  >
                    <option value="Consórcio">Consórcio</option>
                    <option value="Liberacred">Liberacred</option>
                    <option value="Motocicletas">Motocicletas</option>
                    <option value="Motores">Motores</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="Ex: Honda CG 160 Titan"
                    className="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={saleData.model}
                    onChange={(e) => setSaleData({ ...saleData, model: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor da Venda (R$)</label>
                  <input
                    type="number"
                    placeholder="0,00"
                    className="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xl dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={saleData.value}
                    onChange={(e) => setSaleData({ ...saleData, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={() => handleSubmit()}
                  disabled={!saleData.model || !saleData.value}
                  className="w-full h-14 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <CheckCircle className="w-6 h-6" /> CONFIRMAR E FINALIZAR
                </button>
                <button onClick={() => setShowSaleForm(false)} className="w-full h-12 text-slate-500 font-bold text-sm">VOLTAR</button>
              </div>
            </div>
          )}

          <form id="client-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nome do Cliente</label>
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
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">WhatsApp / Contato</label>
              <input
                required
                type="tel"
                placeholder="5596999999999"
                className="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status da Negociação</label>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, columnId: column.id })}
                    className={`h-12 px-3 rounded-xl border text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
                      formData.columnId === column.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${column.color} ${formData.columnId === column.id ? 'bg-white' : ''}`} />
                    {column.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Agendar Atendimento</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasScheduling: !formData.hasScheduling })}
                  className={`w-12 h-6 rounded-full relative transition-colors ${formData.hasScheduling ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.hasScheduling ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {formData.hasScheduling && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                   <input
                    type="date"
                    className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    value={formData.scheduling.date}
                    onChange={(e) => setFormData({ ...formData, scheduling: { ...formData.scheduling, date: e.target.value } })}
                  />
                  <input
                    type="time"
                    className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    value={formData.scheduling.time}
                    onChange={(e) => setFormData({ ...formData, scheduling: { ...formData.scheduling, time: e.target.value } })}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-4">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
              <textarea
                rows={2}
                placeholder="Anotações gerais..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </form>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {!showSaleForm && (
            <>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowDeleteConfirm(true)} className="flex-1 h-12 bg-red-600 text-white font-bold rounded-xl active:scale-95 transition-all">PERDIDO</button>
                <button type="button" onClick={() => setShowSaleForm(true)} className="flex-1 h-12 bg-emerald-600 text-white font-bold rounded-xl active:scale-95 transition-all">VENDIDO</button>
              </div>

              <button
                form="client-form"
                type="submit"
                disabled={isSuccess}
                className={`w-full h-14 flex items-center justify-center gap-3 rounded-2xl font-bold text-white transition-all transform active:scale-95 shadow-xl ${isSuccess ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSuccess ? <CheckCircle className="w-6 h-6 animate-bounce" /> : (initialData?.id ? 'Salvar Alterações' : 'Cadastrar Cliente')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
