
import React, { useState, useEffect, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStart, 
  DragOverEvent, 
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates, 
} from '@dnd-kit/sortable';
import { Client, ColumnDefinition } from './types';
import { INITIAL_COLUMNS, INITIAL_CLIENTS } from './constants';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import FAB from './components/FAB';
import ClientModal from './components/ClientModal';
import ColumnModal from './components/ColumnModal';
import ClientCard from './components/ClientCard';

const App: React.FC = () => {
  // Simulação de usuário logado (Persistido no localStorage)
  const [currentUserId] = useState(() => {
    const savedId = localStorage.getItem('zapcrm_user_id');
    if (savedId) return savedId;
    const newId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('zapcrm_user_id', newId);
    return newId;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragPointerX, setDragPointerX] = useState<number | null>(null);
  
  const [columns, setColumns] = useState<ColumnDefinition[]>(() => {
    const saved = localStorage.getItem('columns');
    return saved ? JSON.parse(saved) : INITIAL_COLUMNS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('clients');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Garantir que todos tenham userId (migração de dados antigos se houver)
      const migration = parsed.map((c: any) => ({ ...c, userId: c.userId || currentUserId }));
      // Filtrar apenas dados do usuário atual
      return migration.filter((c: Client) => c.userId === currentUserId);
    }
    // Inicializar com userId se for a primeira vez
    return INITIAL_CLIENTS.map(c => ({ ...c, userId: currentUserId }));
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ColumnDefinition | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const userClients = clients.filter(c => c.userId === currentUserId);
    const sorted = [...userClients].sort((a, b) => a.order - b.order);
    
    if (!query) return sorted;

    const phoneQuery = query.replace(/\D/g, '');
    return sorted.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(query);
      const phoneMatch = phoneQuery && c.phone.replace(/\D/g, '').includes(phoneQuery);
      return nameMatch || phoneMatch;
    });
  }, [clients, searchQuery, currentUserId]);

  const handleDragStart = (event: DragStart) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeClient = clients.find(c => c.id === activeId);
    if (!activeClient) return;

    const overColumn = columns.find(col => col.id === overId);
    const overClient = clients.find(c => c.id === overId);
    const targetColumnId = overColumn ? overColumn.id : overClient?.columnId;

    if (targetColumnId && activeClient.columnId !== targetColumnId) {
      setClients(prev => {
        const activeIndex = prev.findIndex(c => c.id === activeId);
        const newClients = [...prev];
        newClients[activeIndex] = { ...newClients[activeIndex], columnId: targetColumnId };
        
        const targetColumnClients = newClients
          .filter(c => c.columnId === targetColumnId)
          .sort((a, b) => a.order - b.order);
        
        newClients.forEach(c => {
          if (c.columnId === targetColumnId) {
            const idx = targetColumnClients.findIndex(tc => tc.id === c.id);
            if (idx !== -1) c.order = idx;
          }
        });
        return newClients;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragPointerX(null);

    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      setClients((prev) => {
        const activeIndex = prev.findIndex((c) => c.id === activeId);
        const overIndex = prev.findIndex((c) => c.id === overId);
        const activeClient = prev[activeIndex];
        const overClient = prev[overIndex];

        if (!activeClient || !overClient) return prev;

        let newList = [...prev];
        const colId = overClient.columnId;
        const colItems = newList
          .filter(c => c.columnId === colId)
          .sort((a, b) => a.order - b.order);
        
        const oldIndexInCol = colItems.findIndex(c => c.id === activeId);
        const newIndexInCol = colItems.findIndex(c => c.id === overId);

        if (oldIndexInCol !== -1 && newIndexInCol !== -1) {
          const reorderedCol = arrayMove(colItems, oldIndexInCol, newIndexInCol);
          reorderedCol.forEach((item, idx) => {
            const globalIdx = newList.findIndex(c => c.id === item.id);
            newList[globalIdx] = { ...newList[globalIdx], order: idx, columnId: colId };
          });
        }
        return newList;
      });
    }
  };

  useEffect(() => {
    if (!activeId) return;
    const handlePointerMove = (e: PointerEvent) => setDragPointerX(e.clientX);
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [activeId]);

  const handleAddClient = (newClient: Omit<Client, 'id' | 'order' | 'userId'>) => {
    const columnCount = clients.filter(c => c.columnId === newClient.columnId).length;
    const clientWithId: Client = { 
      ...newClient, 
      id: Date.now().toString(),
      userId: currentUserId,
      order: columnCount 
    };
    setClients(prev => [...prev, clientWithId]);
    setIsModalOpen(false);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleAddColumn = (col: Omit<ColumnDefinition, 'id'>) => {
    const newCol = { ...col, id: `col_${Date.now()}` };
    setColumns(prev => [...prev, newCol]);
    setIsColumnModalOpen(false);
  };

  const handleUpdateColumn = (updated: ColumnDefinition) => {
    setColumns(prev => prev.map(c => c.id === updated.id ? updated : c));
    setIsColumnModalOpen(false);
    setSelectedColumn(null);
  };

  const handleDeleteColumn = (id: string) => {
    if (columns.length <= 1) {
      alert("O CRM precisa de pelo menos uma coluna.");
      return;
    }
    const remainingColumns = columns.filter(c => c.id !== id);
    const firstRemainingId = remainingColumns[0].id;
    setClients(prev => prev.map(c => c.columnId === id ? { ...c, columnId: firstRemainingId } : c));
    setColumns(remainingColumns);
    setIsColumnModalOpen(false);
    setSelectedColumn(null);
  };

  const handleJumpToClient = (client: Client) => {
    setSearchQuery('');
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const activeClient = useMemo(() => clients.find(c => c.id === activeId), [activeId, clients]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col overflow-hidden">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        filteredClients={filteredClients}
        columns={columns}
        onJumpToClient={handleJumpToClient}
        onAddColumn={() => { setSelectedColumn(null); setIsColumnModalOpen(true); }}
      />

      <main className="flex-1 relative">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <KanbanBoard 
            columns={columns}
            clients={filteredClients} 
            onClientClick={(c) => { setSelectedClient(c); setIsModalOpen(true); }}
            onWhatsAppClick={(p) => window.open(`https://wa.me/${p.replace(/\D/g, '')}`, '_blank')}
            onEditColumn={(col) => { setSelectedColumn(col); setIsColumnModalOpen(true); }}
            isSearching={!!searchQuery}
            dragPointerX={dragPointerX}
          />

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: '0.4' } },
            }),
          }}>
            {activeId && activeClient ? (
              <ClientCard client={activeClient} isDragging onClick={() => {}} onWhatsApp={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {!activeId && <FAB onClick={() => { setSelectedClient(null); setIsModalOpen(true); }} />}

      {isModalOpen && (
        <ClientModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedClient(null); }}
          onSave={selectedClient ? handleUpdateClient : handleAddClient}
          onDelete={selectedClient ? () => setClients(prev => prev.filter(c => c.id !== selectedClient.id)) : undefined}
          initialData={selectedClient}
          columns={columns}
        />
      )}

      {isColumnModalOpen && (
        <ColumnModal
          isOpen={isColumnModalOpen}
          onClose={() => { setIsColumnModalOpen(false); setSelectedColumn(null); }}
          onSave={selectedColumn ? handleUpdateColumn : handleAddColumn}
          onDelete={selectedColumn ? () => handleDeleteColumn(selectedColumn.id) : undefined}
          column={selectedColumn || { id: '', label: '', color: 'bg-blue-500' }}
          isNew={!selectedColumn}
        />
      )}
    </div>
  );
};

export default App;
