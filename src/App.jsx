import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewView } from './views/OverviewView';
import { StopwatchView } from './views/StopwatchView';
import { TasksView } from './views/TasksView';
import { YamazumiView } from './views/YamazumiView';
import { AnalyticsView } from './views/AnalyticsView';
import { DictionaryView } from './views/DictionaryView';
import { ImportExportView } from './views/ImportExportView';
import { SettingsView } from './views/SettingsView';

import { LiveStopwatchModal } from './components/LiveStopwatchModal';
import { PrintSheetModal } from './components/PrintSheetModal';

import { INITIAL_SUBCONJUNTOS, DEFAULT_VERB_DICTIONARY, DEFAULT_COMPLEMENTS_CATALOG } from './data/defaultData';
import { calculateTaktMetrics, calculateLeanMetrics, classifyTask } from './utils/leanEngine';

export default function App() {
  // Navigation & UI state
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Subconjuntos state
  const [subconjuntos, setSubconjuntos] = useState(() => {
    const saved = localStorage.getItem('cronolean_subconjuntos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading stored subconjuntos', e);
      }
    }
    return INITIAL_SUBCONJUNTOS;
  });

  // Active subconjunto ID
  const [activeId, setActiveId] = useState(() => {
    return subconjuntos[0]?.id || 'lateral-dir';
  });

  // Verbs Dictionary state
  const [dictionary, setDictionary] = useState(() => {
    const saved = localStorage.getItem('cronolean_dictionary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading stored dictionary', e);
      }
    }
    return DEFAULT_VERB_DICTIONARY;
  });

  // Complements Catalog state
  const [complementsCatalog, setComplementsCatalog] = useState(() => {
    const saved = localStorage.getItem('cronolean_complements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading stored complements', e);
      }
    }
    return DEFAULT_COMPLEMENTS_CATALOG;
  });

  // Cross-component drill-down state
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Modals state
  const [isQuickStopwatchOpen, setIsQuickStopwatchOpen] = useState(false);
  const [isQuickPrintOpen, setIsQuickPrintOpen] = useState(false);

  // Sync subconjuntos with localStorage
  useEffect(() => {
    localStorage.setItem('cronolean_subconjuntos', JSON.stringify(subconjuntos));
  }, [subconjuntos]);

  // Sync dictionary with localStorage
  useEffect(() => {
    localStorage.setItem('cronolean_dictionary', JSON.stringify(dictionary));
  }, [dictionary]);

  // Sync complements with localStorage
  useEffect(() => {
    localStorage.setItem('cronolean_complements', JSON.stringify(complementsCatalog));
  }, [complementsCatalog]);

  // Active post
  const activePosto = subconjuntos.find(s => s.id === activeId) || subconjuntos[0];

  // Total operations count across all workstations
  const totalOpsCount = subconjuntos.reduce((acc, s) => acc + (s.tarefas ? s.tarefas.length : 0), 0);

  // Calculate metrics for active post
  const taktMetrics = calculateTaktMetrics(activePosto);
  const leanMetrics = calculateLeanMetrics(activePosto.tarefas, taktMetrics.taktTimeMin);

  // Handlers for Postos & Meta
  const handleUpdateMeta = (updatedPosto) => {
    setSubconjuntos(prev => prev.map(s => s.id === updatedPosto.id ? updatedPosto : s));
  };

  // Task manipulations
  const handleAddTask = (newTask) => {
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        return {
          ...s,
          tarefas: [...s.tarefas, newTask]
        };
      }
      return s;
    }));
  };

  const handleUpdateTask = (taskId, updatedFields) => {
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        return {
          ...s,
          tarefas: s.tarefas.map(t => t.id === taskId ? { ...t, ...updatedFields } : t)
        };
      }
      return s;
    }));
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm('Excluir esta operação elementar?')) return;
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        const remaining = s.tarefas.filter(t => t.id !== taskId);
        const reindexed = remaining.map((t, idx) => ({ ...t, seq: idx + 1 }));
        return { ...s, tarefas: reindexed };
      }
      return s;
    }));
  };

  const handleDuplicateTask = (taskId) => {
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        const idx = s.tarefas.findIndex(t => t.id === taskId);
        if (idx < 0) return s;
        const target = s.tarefas[idx];
        const clone = {
          ...target,
          id: `task-${Date.now()}`,
          descricao: `${target.descricao} (Cópia)`
        };
        const updated = [...s.tarefas];
        updated.splice(idx + 1, 0, clone);
        const reindexed = updated.map((t, i) => ({ ...t, seq: i + 1 }));
        return { ...s, tarefas: reindexed };
      }
      return s;
    }));
  };

  const handleMoveTask = (taskId, direction) => {
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        const tasks = [...s.tarefas];
        const index = tasks.findIndex(t => t.id === taskId);
        if (index < 0) return s;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= tasks.length) return s;

        const temp = tasks[index];
        tasks[index] = tasks[newIndex];
        tasks[newIndex] = temp;

        const reindexed = tasks.map((t, idx) => ({ ...t, seq: idx + 1 }));
        return { ...s, tarefas: reindexed };
      }
      return s;
    }));
  };

  const handleBatchUpdateTasks = (taskIds, fields) => {
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        return {
          ...s,
          tarefas: s.tarefas.map(t => taskIds.includes(t.id) ? { ...t, ...fields } : t)
        };
      }
      return s;
    }));
  };

  // Auto-classify all in active post
  const handleAutoClassifyAll = () => {
    let count = 0;
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        const reclassified = s.tarefas.map(t => {
          const detected = classifyTask(t.descricao, dictionary);
          count++;
          return {
            ...t,
            atividade: detected.atividade,
            classificacao: detected.classificacao
          };
        });
        return { ...s, tarefas: reclassified };
      }
      return s;
    }));
    alert(`Classificação industrial concluída! ${count} operações do posto "${activePosto.nome}" foram reavaliadas.`);
  };

  // CSV import handler
  const handleImportTasks = (importedTasks, mode, newPostoName) => {
    if (mode === 'newPosto') {
      const newId = `posto-${Date.now()}`;
      const newPosto = {
        id: newId,
        nome: newPostoName || 'Novo Posto',
        descricaoConjunto: newPostoName || 'Novo Posto',
        codigoPA: activePosto?.codigoPA || '3609000',
        codigoSubconjunto: '',
        demandaDiaria: 12,
        horasTrabalhadas: 8.8,
        minutosTrabalhados: 528,
        paradasProgramadasMin: 40,
        tempoDisponivelHoras: 8.13,
        numTurnos: 1,
        totalOperadores: 1,
        cronometristaNome: '',
        cronometristaCargo: '',
        operadorNome: '',
        operadorCargo: '',
        dataEstudo: new Date().toISOString().split('T')[0],
        revisao: '01',
        tarefas: importedTasks.map((t, idx) => ({ ...t, seq: idx + 1 }))
      };
      setSubconjuntos(prev => [...prev, newPosto]);
      setActiveId(newId);
    } else if (mode === 'append') {
      setSubconjuntos(prev => prev.map(s => {
        if (s.id === activeId) {
          const combined = [...s.tarefas, ...importedTasks];
          const reindexed = combined.map((t, idx) => ({ ...t, seq: idx + 1 }));
          return { ...s, tarefas: reindexed };
        }
        return s;
      }));
    } else {
      setSubconjuntos(prev => prev.map(s => {
        if (s.id === activeId) {
          const reindexed = importedTasks.map((t, idx) => ({ ...t, seq: idx + 1 }));
          return { ...s, tarefas: reindexed };
        }
        return s;
      }));
    }
  };

  // Reset to original 114 operations
  const handleResetAllData = () => {
    setSubconjuntos(INITIAL_SUBCONJUNTOS);
    setActiveId('lateral-dir');
    setDictionary(DEFAULT_VERB_DICTIONARY);
    setComplementsCatalog(DEFAULT_COMPLEMENTS_CATALOG);
    localStorage.removeItem('cronolean_subconjuntos');
    localStorage.removeItem('cronolean_dictionary');
    localStorage.removeItem('cronolean_complements');
    alert('Dados originais de fábrica restaurados com sucesso (114 operações)!');
  };

  // Save stopwatch batch
  const handleSaveStopwatchTasks = (newTasks) => {
    setSubconjuntos(prev => prev.map(s => {
      if (s.id === activeId) {
        const combined = [...s.tarefas, ...newTasks];
        const reindexed = combined.map((t, idx) => ({ ...t, seq: idx + 1 }));
        return { ...s, tarefas: reindexed };
      }
      return s;
    }));
  };

  return (
    <div className="app-shell">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Smart Collapsible Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedTaskId(null);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        totalOpsCount={totalOpsCount}
      />

      {/* Main Workspace Stage */}
      <div className="main-stage">
        {/* Contextual Topbar */}
        <Topbar
          activeView={activeView}
          subconjuntos={subconjuntos}
          activePostoId={activeId}
          onSelectPosto={(id) => {
            setActiveId(id);
            setSelectedTaskId(null);
          }}
          onOpenStopwatch={() => setIsQuickStopwatchOpen(true)}
          onOpenPrint={() => setIsQuickPrintOpen(true)}
          onAutoClassifyAll={handleAutoClassifyAll}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          taktMetrics={taktMetrics}
          leanMetrics={leanMetrics}
        />

        {/* Viewport content */}
        <main className="content-viewport">
          {activeView === 'overview' && (
            <OverviewView
              posto={activePosto}
              subconjuntos={subconjuntos}
              taktMetrics={taktMetrics}
              leanMetrics={leanMetrics}
              onNavigate={setActiveView}
              onSelectPosto={setActiveId}
            />
          )}

          {activeView === 'stopwatch' && (
            <StopwatchView
              posto={activePosto}
              onSaveTasksToPosto={handleSaveStopwatchTasks}
              dictionary={dictionary}
              complementsCatalog={complementsCatalog}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView
              posto={activePosto}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onDuplicateTask={handleDuplicateTask}
              onBatchUpdateTasks={handleBatchUpdateTasks}
              dictionary={dictionary}
              selectedTaskId={selectedTaskId}
              onClearSelectedTask={() => setSelectedTaskId(null)}
            />
          )}

          {activeView === 'yamazumi' && (
            <YamazumiView
              posto={activePosto}
              taktMetrics={taktMetrics}
              leanMetrics={leanMetrics}
              onNavigate={setActiveView}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              posto={activePosto}
              subconjuntos={subconjuntos}
              leanMetrics={leanMetrics}
              onSelectTask={setSelectedTaskId}
              selectedTaskId={selectedTaskId}
              onSelectPosto={setActiveId}
            />
          )}

          {activeView === 'dictionary' && (
            <DictionaryView
              dictionary={dictionary}
              onUpdateDictionary={setDictionary}
              onResetDictionary={() => setDictionary(DEFAULT_VERB_DICTIONARY)}
              onAutoClassifyAll={handleAutoClassifyAll}
              postoNome={activePosto.nome}
              complementsCatalog={complementsCatalog}
              onUpdateComplementsCatalog={setComplementsCatalog}
            />
          )}

          {activeView === 'importexport' && (
            <ImportExportView
              posto={activePosto}
              onImportTasks={handleImportTasks}
              activePostoNome={activePosto.nome}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              posto={activePosto}
              onUpdateMeta={handleUpdateMeta}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>

      {/* Quick Stopwatch Modal (Available from any screen via Topbar) */}
      <LiveStopwatchModal
        isOpen={isQuickStopwatchOpen}
        onClose={() => setIsQuickStopwatchOpen(false)}
        postoNome={activePosto.nome}
        onSaveTasksToPosto={handleSaveStopwatchTasks}
        dictionary={dictionary}
      />

      {/* Quick FIS Modal (Available from any screen via Topbar) */}
      <PrintSheetModal
        isOpen={isQuickPrintOpen}
        onClose={() => setIsQuickPrintOpen(false)}
        posto={activePosto}
      />
    </div>
  );
}
