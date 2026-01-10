
export interface Schedule {
  date: string;
  time: string;
  notes?: string;
}

export interface ColumnDefinition {
  id: string;
  label: string;
  color: string; // Tailwind class like 'bg-blue-500'
}

export interface Client {
  id: string;
  userId: string; // Identificador do usuário dono do dado
  name: string;
  phone: string;
  description: string;
  date: string;
  columnId: string;
  order: number;
  scheduling?: Schedule; // Dados de agendamento opcional
}

export interface KanbanColumnProps {
  column: ColumnDefinition;
  clients: Client[];
  onClientClick: (client: Client) => void;
  onWhatsAppClick: (phone: string) => void;
  onEditColumn: (column: ColumnDefinition) => void;
  isSearching: boolean;
}
