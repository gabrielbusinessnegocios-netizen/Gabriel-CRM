
import { Client, ColumnDefinition } from './types';

export const INITIAL_COLUMNS: ColumnDefinition[] = [
  // Fix: Added required 'ordem' property to each column definition
  { id: 'col_1', label: 'Lead', color: 'bg-blue-500', ordem: 0 },
  { id: 'col_2', label: 'Em contato', color: 'bg-orange-500', ordem: 1 },
  { id: 'col_3', label: 'Proposta', color: 'bg-purple-500', ordem: 2 },
  { id: 'col_4', label: 'Fechado', color: 'bg-emerald-500', ordem: 3 }
];

export const AVAILABLE_COLORS = [
  { name: 'Azul', class: 'bg-blue-500' },
  { name: 'Laranja', class: 'bg-orange-500' },
  { name: 'Roxo', class: 'bg-purple-500' },
  { name: 'Verde', class: 'bg-emerald-500' },
  { name: 'Rosa', class: 'bg-rose-500' },
  { name: 'Amarelo', class: 'bg-amber-500' },
  { name: 'Índigo', class: 'bg-indigo-500' },
  { name: 'Cinza', class: 'bg-slate-400' },
  { name: 'Branco', class: 'bg-white' },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    // Fix: Updated properties to match Client interface (nome_cliente, telefone, etc)
    user_id: 'initial_user',
    nome_cliente: 'João Silva',
    telefone: '5511999999999',
    descricao: 'Interessado no plano premium',
    created_at: new Date().toISOString(),
    status: 'col_1',
    ordem: 0
  },
  {
    id: '2',
    // Fix: Updated properties to match Client interface
    user_id: 'initial_user',
    nome_cliente: 'Maria Oliveira',
    telefone: '5511888888888',
    descricao: 'Pediu orçamento detalhado',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'col_2',
    ordem: 0
  },
  {
    id: '3',
    // Fix: Updated properties to match Client interface
    user_id: 'initial_user',
    nome_cliente: 'Pedro Santos',
    telefone: '5511777777777',
    descricao: 'Negociando desconto à vista',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    status: 'col_3',
    ordem: 0
  },
  {
    id: 'ficticio_1',
    // Fix: Updated properties to match Client interface
    user_id: 'initial_user',
    nome_cliente: 'Lucas Oliveira',
    telefone: '5596991234567',
    descricao: 'Cliente interessado em Consórcio de Motocicletas. Lead vindo do Instagram.',
    created_at: new Date().toISOString(),
    status: 'col_1',
    ordem: 1,
    agendamento: {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Amanhã
      time: '14:30',
      notes: 'Ligar para confirmar o envio dos documentos da proposta.'
    }
  }
];