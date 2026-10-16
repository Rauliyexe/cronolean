import React from 'react';
import {
  Timer,
  Upload,
  Download,
  Printer,
  BookOpen,
  Wand2,
  Sun,
  Moon,
  Layers,
  Sparkles
} from 'lucide-react';

export function Header({
  onOpenStopwatch,
  onOpenImport,
  onExportCsv,
  onOpenPrint,
  onOpenDictionary,
  onAutoClassifyAll,
  isDark,
  toggleTheme,
  subconjuntosCount
}) {
  return (
    <header className="glass-card" style={{ padding: '0.875rem 1.5rem', marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Timer size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CronoLean
              </h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)', fontSize: '0.7rem' }}>
                TRABALHO PADRÃO
              </span>
            </div>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
              Estudo de Tempos & Cronoanálise Industrial • Yamazumi & Takt Time
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Cronômetro de Fábrica */}
          <button
            onClick={onOpenStopwatch}
            className="btn btn-primary"
            style={{
              padding: '0.625rem 1.25rem',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
            title="Abrir cronômetro de chão de fábrica para tomada de tempos"
          >
            <Timer size={18} />
            <span>Cronômetro ao Vivo</span>
          </button>

          {/* Classificar Tudo (Macro automatizada) */}
          <button
            onClick={onAutoClassifyAll}
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
            title="Classificar todas as tarefas automaticamente via Dicionário Lean"
          >
            <Wand2 size={16} />
            <span>Classificar Tudo</span>
          </button>

          {/* Dicionário */}
          <button
            onClick={onOpenDictionary}
            className="btn btn-secondary"
            title="Gerenciar dicionário de verbos e regras Lean"
          >
            <BookOpen size={16} />
            <span className="no-mobile">Dicionário</span>
          </button>

          {/* Importar CSV */}
          <button
            onClick={onOpenImport}
            className="btn btn-secondary"
            title="Importar planilha CSV existente"
          >
            <Upload size={16} />
            <span className="no-mobile">Importar CSV</span>
          </button>

          {/* Exportar CSV */}
          <button
            onClick={onExportCsv}
            className="btn btn-secondary"
            title="Exportar dados para Excel (.csv)"
          >
            <Download size={16} />
            <span className="no-mobile">Exportar</span>
          </button>

          {/* Imprimir FIS */}
          <button
            onClick={onOpenPrint}
            className="btn btn-secondary"
            title="Visualizar e imprimir Folha de Trabalho Padronizado (FIS)"
          >
            <Printer size={16} />
            <span className="no-mobile">Imprimir FIS</span>
          </button>

          {/* Alternar Tema */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.625rem' }}
            title={isDark ? 'Mudar para tema Claro' : 'Mudar para tema Escuro'}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
          </button>

        </div>

      </div>
    </header>
  );
}
