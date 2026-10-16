import React from 'react';
import {
  LayoutDashboard,
  Timer,
  TableProperties,
  BarChart2,
  TrendingUp,
  BookOpen,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export function Sidebar({
  activeView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  totalOpsCount = 114
}) {
  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'stopwatch', label: 'Cronometragem', icon: Timer, badge: 'LIVE' },
    { id: 'tasks', label: 'Postos & Operações', icon: TableProperties },
    { id: 'yamazumi', label: 'Yamazumi & Takt', icon: BarChart2 },
    { id: 'analytics', label: 'Análise Lean & Pareto', icon: TrendingUp },
    { id: 'dictionary', label: 'Dicionário Industrial', icon: BookOpen },
    { id: 'importexport', label: 'Importação, CSV & FIS', icon: FileSpreadsheet },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside className={`industrial-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="brand-mark">
          <div className="brand-badge">
            <Cpu size={18} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: '800', lineHeight: 1.1 }}>
                CronoLean
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Industrial Intelligence
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="ind-btn ind-btn-sm"
          style={{ padding: '0.3rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)' }}
          title={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav">
        {!isCollapsed && (
          <div className="nav-section-label">Módulos de Engenharia</div>
        )}

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
              style={{
                textAlign: 'left',
                width: '100%',
                background: isActive ? '#1A222B' : 'transparent'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--analytical-blue)' : 'currentColor'} />
              {!isCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ind-badge ind-badge-va" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} color="var(--va-color)" />
            <span>Dados salvos localmente ({totalOpsCount} ops)</span>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }} title={`Dados salvos localmente (${totalOpsCount} operações)`}>
            <ShieldCheck size={16} color="var(--va-color)" />
          </div>
        )}
      </div>
    </aside>
  );
}
