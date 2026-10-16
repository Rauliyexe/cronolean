import React, { useState } from 'react';
import { Plus, Copy, Trash2, Edit2, Layers, Check, X } from 'lucide-react';

export function SubconjuntoTabs({
  subconjuntos,
  activeId,
  onSelect,
  onAdd,
  onDuplicate,
  onRename,
  onDelete
}) {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');

  const startRename = (sub, e) => {
    e.stopPropagation();
    setEditingId(sub.id);
    setTempName(sub.nome);
  };

  const saveRename = (id) => {
    if (tempName.trim()) {
      onRename(id, tempName.trim());
    }
    setEditingId(null);
  };

  const cancelRename = () => {
    setEditingId(null);
  };

  return (
    <div className="tabs-container glass-card" style={{ padding: '0.5rem 0.75rem', overflowX: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', padding: '0 0.5rem', fontSize: '0.8rem', fontWeight: '600' }}>
        <Layers size={15} />
        <span>SUBCONJUNTOS:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, overflowX: 'auto', paddingBottom: '2px' }}>
        {subconjuntos.map((sub) => {
          const isActive = sub.id === activeId;
          const isEditing = editingId === sub.id;

          return (
            <div
              key={sub.id}
              onClick={() => !isEditing && onSelect(sub.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: isEditing ? 'default' : 'pointer',
                fontSize: '0.825rem',
                fontWeight: isActive ? '700' : '500',
                background: isActive ? 'var(--primary-accent)' : 'var(--bg-input)',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
                boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(sub.id);
                      if (e.key === 'Escape') cancelRename();
                    }}
                    autoFocus
                    className="input"
                    style={{ padding: '0.15rem 0.4rem', fontSize: '0.8rem', width: '100px', height: '24px' }}
                  />
                  <button onClick={() => saveRename(sub.id)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: '2px' }}>
                    <Check size={14} />
                  </button>
                  <button onClick={cancelRename} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{sub.nome}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(148, 163, 184, 0.15)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)'
                  }}>
                    {sub.tarefas.length}
                  </span>

                  {/* Actions for current tab */}
                  {isActive && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.25rem' }}>
                      <button
                        onClick={(e) => startRename(sub, e)}
                        title="Renomear aba"
                        style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.8)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicate(sub.id); }}
                        title="Duplicar este subconjunto"
                        style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.8)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                      >
                        <Copy size={12} />
                      </button>
                      {subconjuntos.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(sub.id); }}
                          title="Excluir este subconjunto"
                          style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.8)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Add new tab button */}
        <button
          onClick={onAdd}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.45rem 0.75rem', height: '32px' }}
          title="Adicionar novo subconjunto ou posto de trabalho"
        >
          <Plus size={14} />
          <span>Novo Posto</span>
        </button>
      </div>
    </div>
  );
}
