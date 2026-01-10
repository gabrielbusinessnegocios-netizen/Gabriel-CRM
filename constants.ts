
import { Client, ColumnDefinition } from './types';

export const INITIAL_COLUMNS: ColumnDefinition[] = [
  { id: 'col_1', label: 'Lead', color: 'bg-blue-500' },
  { id: 'col_2', label: 'Em contato', color: 'bg-orange-500' },
  { id: 'col_3', label: 'Proposta', color: 'bg-purple-500' },
  { id: 'col_4', label: 'Fechado', color: 'bg-emerald-500' }
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
    // Fix: Added missing 'userId' property
    userId: 'initial_user',
    name: 'João Silva',
    phone: '5511999999999',
    description: 'Interessado no plano premium',
    date: new Date().toISOString(),
    columnId: 'col_1',
    // Fix: Added missing 'order' property
    order: 0
  },
  {
    id: '2',
    // Fix: Added missing 'userId' property
    userId: 'initial_user',
    name: 'Maria Oliveira',
    phone: '5511888888888',
    description: 'Pediu orçamento detalhado',
    date: new Date(Date.now() - 86400000).toISOString(),
    columnId: 'col_2',
    // Fix: Added missing 'order' property
    order: 0
  },
  {
    id: '3',
    // Fix: Added missing 'userId' property
    userId: 'initial_user',
    name: 'Pedro Santos',
    phone: '5511777777777',
    description: 'Negociando desconto à vista',
    date: new Date(Date.now() - 172800000).toISOString(),
    columnId: 'col_3',
    // Fix: Added missing 'order' property
    order: 0
  }
];