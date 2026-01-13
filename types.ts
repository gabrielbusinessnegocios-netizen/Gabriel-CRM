
export interface Schedule {
  date: string;
  time: string;
  notes?: string;
}

export interface Profile {
  id: string;
  nome?: string;
  sobrenome?: string;
  email: string;
}

export interface Client {
  id: string;
  user_id: string;
  nome_cliente: string;
  name?: string; // Mapeado na UI
  telefone: string;
  phone?: string; // Mapeado na UI
  descricao: string;
  description?: string; // Mapeado na UI
  status: string; // ID da coluna no banco
  columnId?: string; // Mapeado na UI
  ordem: number;
  agendamento?: Schedule;
  scheduling?: Schedule; // Mapeado na UI
  created_at: string;
  date?: string; // Mapeado na UI
}

export interface Sale {
  id: string;
  user_id: string;
  cliente_id: string;
  modelo: string;
  categoria: string;
  valor: number;
  mes_referencia: string;
  created_at: string;
}

export interface ColumnDefinition {
  id: string;
  user_id?: string;
  label: string;
  color: string;
  ordem: number;
}
