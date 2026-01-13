
import React, { useState, useEffect, useMemo } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStart, 
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
// Added ShoppingBag to the imports at the top
import { Loader2, ShoppingBag } from 'lucide-react';
import { Client, ColumnDefinition, Sale, Profile } from './types';
import { INITIAL_COLUMNS } from './constants';
import { supabase } from './supabase';
import { AuthScreen } from './components/AuthScreen';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import FAB from './components/FAB';
import ClientModal from './components/ClientModal';
import ColumnModal from './components/ColumnModal';
import Sidebar from './components/Sidebar';

type ViewType = 'kanban' | 'vendas';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  const [dragPointerX, setDragPointerX] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vendas, setVendas] = useState<Sale[]>([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<ColumnDefinition | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      const userId = session.user.id;
      try {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (prof) setProfile(prof);

        let { data: cols } = await supabase.from('columns').select('*').eq('user_id', userId).order('ordem');
        if (!cols || cols.length === 0) {
          const defaultCols = INITIAL_COLUMNS.map((c, idx) => ({
            user_id: userId,
            label: c.label,
            color: c.color,
            ordem: idx
          }));
          const { data: insertedCols } = await supabase.from('columns').insert(defaultCols).select();
          cols = insertedCols;
        }
        if (cols) setColumns(cols);

        const { data: clis } = await supabase.from('clientes').select('*').eq('user_id', userId).order('ordem');
        if (clis) setClients(clis);

        const { data: vnds } = await supabase.from('vendas').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (vnds) setVendas(vnds);

      } catch (err) {
        console.error('Sincronização falhou:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogout = () => supabase.auth.signOut();

  const mapClientData = (c: any): Client => ({
    ...c,
    name: c.nome_cliente,
    phone: c.telefone,
    columnId: c.status,
    description: c.descricao,
    date: c.created_at,
    scheduling: c.agendamento
  });

  const filteredClients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return clients
      .filter(c => 
        c.nome_cliente.toLowerCase().includes(query) || 
        c.telefone.includes(query) ||
        (c.descricao && c.descricao.toLowerCase().includes(query))
      )
      .map(mapClientData);
  }, [clients, searchQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeClient = clients.find(c => c.id === activeId);
    if (!activeClient) return;

    const isOverAColumn = columns.some(col => col.id === overId);
    if (isOverAColumn) {
      if (activeClient.status !== overId) {
        setClients(prev => prev.map(c => c.id === activeId ? { ...c, status: overId } : c));
      }
    } else {
      const overClient = clients.find(c => c.id === overId);
      if (overClient && activeClient.status !== overClient.status) {
        setClients(prev => prev.map(c => c.id === activeId ? { ...c, status: overClient.status } : c));
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setDragPointerX(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const currentClient = clients.find(c => c.id === activeId);
    if (currentClient) {
      await supabase.from('clientes').update({ 
        status: currentClient.status,
        ordem: clients.findIndex(c => c.id === activeId)
      }).eq('id', activeId);
    }

    if (activeId === overId) return;

    setClients((prev) => {
      const oldIndex = prev.findIndex(c => c.id === activeId);
      const newIndex = prev.findIndex(c => c.id === overId);
      const updated = arrayMove(prev, oldIndex, newIndex);
      
      updated.forEach((c, idx) => {
        if (c.ordem !== idx) {
          supabase.from('clientes').update({ ordem: idx }).eq('id', c.id).then();
        }
      });
      return updated;
    });
  };

  const handleSaveClient = async (clientData: any) => {
    if (!session?.user) return;
    
    const payload = {
      user_id: session.user.id,
      nome_cliente: clientData.name,
      telefone: clientData.phone,
      descricao: clientData.description,
      status: clientData.columnId,
      agendamento: clientData.scheduling,
    };

    if (clientData.id) {
      const { error } = await supabase.from('clientes').update(payload).eq('id', clientData.id);
      if (!error) setClients(prev => prev.map(c => c.id === clientData.id ? { ...c, ...payload } : c));
    } else {
      const { data, error } = await supabase.from('clientes').insert([{ ...payload, ordem: clients.length }]).select();
      if (!error && data) setClients(prev => [...prev, data[0]]);
    }

    if (clientData.saleDetails) {
      const salePayload = {
        user_id: session.user.id,
        cliente_id: clientData.id || '',
        modelo: clientData.saleDetails.model,
        categoria: clientData.saleDetails.category,
        valor: Number(clientData.saleDetails.value),
        mes_referencia: new Date().toISOString().substring(0, 7)
      };
      await supabase.from('vendas').insert([salePayload]);
      const { data: v } = await supabase.from('vendas').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      if (v) setVendas(v);
    }
    setSelectedClient(null);
  };

  // Fix: Added handleDeleteClient function to handle client deletion from the database and local state
  const handleDeleteClient = async (clientId: string) => {
    if (!clientId) return;
    const { error } = await supabase.from('clientes').delete().eq('id', clientId);
    if (!error) {
      setClients(prev => prev.filter(c => c.id !== clientId));
      setSelectedClient(null);
    }
  };

  // Fix: Added handleSaveColumn function to handle creation and updating of kanban columns
  const handleSaveColumn = async (columnData: any) => {
    if (!session?.user) return;
    const userId = session.user.id;
    
    const payload = {
      user_id: userId,
      label: columnData.label,
      color: columnData.color,
      ordem: columnData.ordem ?? columns.length
    };

    if (columnData.id) {
      const { error } = await supabase.from('columns').update(payload).eq('id', columnData.id);
      if (!error) {
        setColumns(prev => prev.map(col => col.id === columnData.id ? { ...col, label: payload.label, color: payload.color } : col));
      }
    } else {
      const { data, error } = await supabase.from('columns').insert([payload]).select();
      if (!error && data) setColumns(prev => [...prev, data[0]]);
    }
    setIsColumnModalOpen(false);
    setSelectedColumn(null);
  };

  // Fix: Added handleDeleteColumn function to remove columns and reassign clients to a remaining column
  const handleDeleteColumn = async (columnId: string) => {
    if (!columnId) return;
    const firstColumn = columns.find(c => c.id !== columnId);
    if (firstColumn) {
      await supabase.from('clientes').update({ status: firstColumn.id }).eq('status', columnId);
      setClients(prev => prev.map(c => c.status === columnId ? { ...c, status: firstColumn.id } : c));
    }
    
    const { error } = await supabase.from('columns').delete().eq('id', columnId);
    if (!error) {
      setColumns(prev => prev.filter(col => col.id !== columnId));
      setIsColumnModalOpen(false);
      setSelectedColumn(null);
    }
  };

  const handleExportData = () => {
    const data = {
      clientes: clients,
      vendas: vendas,
      configuracoes: columns,
      exportado_em: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_crm_${new Date().toLocaleDateString()}.json`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <Loader2 className="w-6 h-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Sincronizando Nuvem...</p>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <Sidebar 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        userEmail={profile?.nome ? `${profile.nome} ${profile.sobrenome || ''}` : session.user.email}
        onLogout={handleLogout}
        onNavigate={(view) => { setCurrentView(view as ViewType); setIsDrawerOpen(false); }}
        currentView={currentView}
        onExport={handleExportData}
      />

      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        filteredClients={filteredClients}
        columns={columns}
        onJumpToClient={(c) => setSelectedClient(c)}
        onAddColumn={() => { setSelectedColumn(null); setIsColumnModalOpen(true); }}
        onMenuClick={() => setIsDrawerOpen(true)}
        hideAddColumn={currentView === 'vendas'}
      />

      <main className="flex-1 relative">
        {currentView === 'kanban' ? (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={(e) => setDragPointerX(e.active.rect.current.translated?.left || 0)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <KanbanBoard 
              columns={columns} 
              clients={filteredClients} 
              onClientClick={(c) => setSelectedClient(c)} 
              onWhatsAppClick={(p) => window.open(`https://wa.me/${p.replace(/\D/g, '')}`, '_blank')} 
              onEditColumn={(col) => { setSelectedColumn(col); setIsColumnModalOpen(true); }} 
              isSearching={!!searchQuery}
              dragPointerX={dragPointerX}
            />
            {!selectedClient && <FAB onClick={() => setSelectedClient({} as any)} />}
          </DndContext>
        ) : (
          <div className="p-6 h-full overflow-y-auto pb-32 no-scrollbar animate-in fade-in duration-500">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Minhas Vendas</h2>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Histórico de negociações fechadas</p>
              </div>
              <div className="px-6 py-3 bg-emerald-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-500/20">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vendas.reduce((acc, v) => acc + Number(v.valor), 0))}
              </div>
            </div>
            
            <div className="grid gap-4 max-w-2xl mx-auto">
              {vendas.map(sale => (
                <div key={sale.id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{sale.categoria}</span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{sale.modelo}</h4>
                      <p className="text-xs text-slate-500 font-medium">{new Date(sale.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valor)}
                    </span>
                  </div>
                </div>
              ))}
              {vendas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-xl font-bold uppercase tracking-tighter">Nenhuma venda realizada</p>
                  <p className="text-sm font-medium">Mova um cliente para 'Fechado' para iniciar seu recorde.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedClient && (
        <ClientModal 
          isOpen={true} 
          onClose={() => setSelectedClient(null)} 
          onSave={handleSaveClient} 
          onDelete={() => handleDeleteClient(selectedClient.id)} 
          initialData={Object.keys(selectedClient).length === 0 ? null : selectedClient} 
          columns={columns} 
        />
      )}

      {isColumnModalOpen && (
        <ColumnModal 
          isOpen={isColumnModalOpen} 
          onClose={() => { setIsColumnModalOpen(false); setSelectedColumn(null); }} 
          onSave={handleSaveColumn} 
          onDelete={selectedColumn ? () => handleDeleteColumn(selectedColumn.id) : undefined} 
          column={selectedColumn || { id: '', label: '', color: 'bg-blue-500', ordem: columns.length }} 
          isNew={!selectedColumn} 
        />
      )}
    </div>
  );
};

export default App;
