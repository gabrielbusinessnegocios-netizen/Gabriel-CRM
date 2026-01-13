
import React, { useState, useRef, useEffect } from 'react';
import { Client, ColumnDefinition } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  columns: ColumnDefinition[];
  clients: Client[];
  onClientClick: (client: Client) => void;
  onWhatsAppClick: (phone: string) => void;
  onEditColumn: (column: ColumnDefinition) => void;
  isSearching: boolean;
  dragPointerX: number | null;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  columns, 
  clients, 
  onClientClick, 
  onWhatsAppClick, 
  onEditColumn, 
  isSearching,
  dragPointerX
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSwipeTimer = useRef<number | null>(null);
  const lastSwipeTime = useRef<number>(0);

  // Auto-Swipe para Mobile apenas
  useEffect(() => {
    if (window.innerWidth >= 1024) return; // Desativa auto-swipe no desktop

    if (dragPointerX === null || !scrollRef.current) {
      if (autoSwipeTimer.current) {
        clearTimeout(autoSwipeTimer.current);
        autoSwipeTimer.current = null;
      }
      return;
    }

    const viewportWidth = window.innerWidth;
    const threshold = viewportWidth * 0.15;
    const now = Date.now();
    const SWIPE_COOLDOWN = 600;

    if (dragPointerX > viewportWidth - threshold && activeIndex < columns.length - 1) {
      if (!autoSwipeTimer.current && now - lastSwipeTime.current > SWIPE_COOLDOWN) {
        autoSwipeTimer.current = window.setTimeout(() => {
          scrollToIndex(activeIndex + 1);
          autoSwipeTimer.current = null;
          lastSwipeTime.current = Date.now();
        }, 400);
      }
    } 
    else if (dragPointerX < threshold && activeIndex > 0) {
      if (!autoSwipeTimer.current && now - lastSwipeTime.current > SWIPE_COOLDOWN) {
        autoSwipeTimer.current = window.setTimeout(() => {
          scrollToIndex(activeIndex - 1);
          autoSwipeTimer.current = null;
          lastSwipeTime.current = Date.now();
        }, 400);
      }
    } 
    else {
      if (autoSwipeTimer.current) {
        clearTimeout(autoSwipeTimer.current);
        autoSwipeTimer.current = null;
      }
    }
  }, [dragPointerX, activeIndex, columns.length]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const pageWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * pageWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) return; // No desktop o scroll é livre
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const pageWidth = container.offsetWidth;
    const newIndex = Math.round(scrollPosition / pageWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Indicador de Paginação - Invisível no Desktop */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 py-3 bg-slate-50 dark:bg-slate-950">
        {columns.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === idx 
              ? 'w-8 bg-blue-500' 
              : 'w-2 bg-slate-300 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Viewport: Paginado no Mobile, Lista Horizontal no Desktop */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 kanban-viewport no-scrollbar overflow-x-auto lg:pb-8"
      >
        {columns.map((column) => (
          <div key={column.id} className="kanban-page h-full lg:h-full lg:w-[350px] lg:shrink-0">
            <KanbanColumn
              column={column}
              clients={clients.filter(c => c.columnId === column.id)}
              onClientClick={onClientClick}
              onWhatsAppClick={onWhatsAppClick}
              onEditColumn={onEditColumn}
              isSearching={isSearching}
            />
          </div>
        ))}
      </div>

      {/* Dica visual de borda - Mobile Apenas */}
      {dragPointerX !== null && window.innerWidth < 1024 && (
        <>
          <div className={`fixed left-0 top-0 bottom-0 w-8 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-blue-500/10 to-transparent z-[110] ${dragPointerX < window.innerWidth * 0.15 ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`fixed right-0 top-0 bottom-0 w-8 pointer-events-none transition-opacity duration-300 bg-gradient-to-l from-blue-500/10 to-transparent z-[110] ${dragPointerX > window.innerWidth * 0.85 ? 'opacity-100' : 'opacity-0'}`} />
        </>
      )}
    </div>
  );
};

export default KanbanBoard;