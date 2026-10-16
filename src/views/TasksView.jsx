import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Check,
  X,
  Edit2,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { classifyTask, formatMinutesAndSeconds } from '../utils/leanEngine';

export function TasksView({
  posto,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onDuplicateTask,
  onBatchUpdateTasks,
  dictionary,
  selectedTaskId,
  onClearSelectedTask
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAtividade, setFilterAtividade] = useState('ALL');
  const [filterClassificacao, setFilterClassificacao] = useState('ALL');
  const [showTimeInSeconds, setShowTimeInSeconds] = useState(false);

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fast add new task row state
  const [newDesc, setNewDesc] = useState('');
  const [newTempo, setNewTempo] = useState('');
  const [newAtividade, setNewAtividade] = useState('VA');
  const [newClassificacao, setNewClassificacao] = useState('Montagem');
  const [newDistancia, setNewDistancia] = useState('');
  const [newObs, setNewObs] = useState('');

  // Handle typing in new task description -> auto-detect classification
  const handleDescChange = (val) => {
    setNewDesc(val);
    if (val.trim().length >= 3) {
      const detected = classifyTask(val, dictionary);
      setNewAtividade(detected.atividade);
      setNewClassificacao(detected.classificacao);
    }
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    let tempoNum = parseFloat((newTempo || '0').replace(',', '.'));
    if (isNaN(tempoNum) || tempoNum <= 0) tempoNum = 0.5;

    const newTask = {
      id: `task-${Date.now()}`,
      seq: posto.tarefas.length + 1,
      descricao: newDesc.trim(),
      tempo: tempoNum,
      atividade: newAtividade,
      classificacao: newClassificacao,
      distancia: parseFloat((newDistancia || '0').replace(',', '.')) || 0,
      obs: newObs.trim()
    };

    onAddTask(newTask);

    setNewDesc('');
    setNewTempo('');
    setNewDistancia('');
    setNewObs('');
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditFormData({ ...t });
  };

  const saveEdit = (id) => {
    onUpdateTask(id, editFormData);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Multi-selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Batch actions
  const applyBatchAtividade = (atv) => {
    if (selectedIds.length === 0) return;
    onBatchUpdateTasks(selectedIds, { atividade: atv });
  };

  const applyBatchClassificacao = (cls) => {
    if (selectedIds.length === 0) return;
    onBatchUpdateTasks(selectedIds, { classificacao: cls });
  };

  // Filter tasks
  const filteredTasks = (posto.tarefas || []).filter(t => {
    const matchesSearch = t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.obs && t.obs.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAtv = filterAtividade === 'ALL' || t.atividade === filterAtividade;
    const matchesClass = filterClassificacao === 'ALL' || t.classificacao === filterClassificacao;
    return matchesSearch && matchesAtv && matchesClass;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Search, Filter & Batch Action Toolbar */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Pesquisar por operação ou observação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ind-input"
              style={{ width: '100%', paddingLeft: '32px' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            
            {/* Filter by Activity */}
            <select
              value={filterAtividade}
              onChange={(e) => setFilterAtividade(e.target.value)}
              className="ind-select"
              style={{ padding: '0.45rem 0.75rem' }}
            >
              <option value="ALL">Todas as Atividades (VA / NVA / NVAE)</option>
              <option value="VA">Apenas VA 🟢</option>
              <option value="NVA">Apenas NVA 🟡</option>
              <option value="NVAE">Apenas NVAE 🔴</option>
            </select>

            {/* Filter by Category */}
            <select
              value={filterClassificacao}
              onChange={(e) => setFilterClassificacao(e.target.value)}
              className="ind-select"
              style={{ padding: '0.45rem 0.75rem' }}
            >
              <option value="ALL">Todas as Categorias</option>
              <option value="Solda">Solda</option>
              <option value="Montagem">Montagem</option>
              <option value="Movimentação">Movimentação</option>
              <option value="Acabamento">Acabamento</option>
              <option value="Caminhada">Caminhada</option>
              <option value="Retrabalho">Retrabalho</option>
            </select>

            {/* Unit format toggle */}
            <button
              onClick={() => setShowTimeInSeconds(!showTimeInSeconds)}
              className="ind-btn ind-btn-sm"
              title="Alternar entre minutos decimais e segundos"
            >
              {showTimeInSeconds ? 'Exibir Min Decimais' : 'Exibir Min:Seg'}
            </button>
          </div>

        </div>

        {/* Batch Selection Banner */}
        {selectedIds.length > 0 && (
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            background: 'rgba(99, 169, 255, 0.08)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--analytical-blue)' }}>
              {selectedIds.length} {selectedIds.length === 1 ? 'linha selecionada' : 'linhas selecionadas'}:
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Definir como:</span>
              <button onClick={() => applyBatchAtividade('VA')} className="ind-btn ind-btn-sm" style={{ color: 'var(--va-color)' }}>
                VA 🟢
              </button>
              <button onClick={() => applyBatchAtividade('NVA')} className="ind-btn ind-btn-sm" style={{ color: 'var(--nva-color)' }}>
                NVA 🟡
              </button>
              <button onClick={() => applyBatchAtividade('NVAE')} className="ind-btn ind-btn-sm" style={{ color: 'var(--nvae-color)' }}>
                NVAE 🔴
              </button>

              <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)', margin: '0 4px' }} />

              <button onClick={() => applyBatchClassificacao('Solda')} className="ind-btn ind-btn-sm">Solda</button>
              <button onClick={() => applyBatchClassificacao('Montagem')} className="ind-btn ind-btn-sm">Montagem</button>
              <button onClick={() => applyBatchClassificacao('Movimentação')} className="ind-btn ind-btn-sm">Movimentação</button>
              <button onClick={() => applyBatchClassificacao('Acabamento')} className="ind-btn ind-btn-sm">Acabamento</button>

              <button
                onClick={() => setSelectedIds([])}
                className="ind-btn ind-btn-sm"
                style={{ marginLeft: '6px', color: 'var(--text-dim)' }}
              >
                Limpar seleção
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main High-Performance Operations Table */}
      <div className="ind-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Table Title Bar */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {posto.nome} — Tabela de Tarefas Elementares
            </span>
            <span className="ind-badge ind-badge-blue">
              {filteredTasks.length} de {posto.tarefas.length} operações
            </span>
          </div>

          {selectedTaskId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--analytical-blue)' }}>
              <span>Destaque ativado por gráfico</span>
              <button onClick={onClearSelectedTask} className="ind-btn ind-btn-sm" style={{ padding: '0.2rem 0.5rem' }}>
                Remover Destaque
              </button>
            </div>
          )}
        </div>

        <div className="ind-table-wrapper" style={{ maxHeight: '520px', border: 'none', borderRadius: 0 }}>
          <table className="ind-table">
            <thead>
              <tr>
                <th style={{ width: '38px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredTasks.length && filteredTasks.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ width: '45px', textAlign: 'center' }}>Seq</th>
                <th>Descrição da Operação</th>
                <th style={{ width: '130px' }}>Tempo</th>
                <th style={{ width: '95px' }}>Atividade</th>
                <th style={{ width: '130px' }}>Classificação</th>
                <th style={{ width: '75px', textAlign: 'center' }}>Dist. (m)</th>
                <th>Observações</th>
                <th style={{ width: '110px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Nenhuma operação localizada com os filtros ativos.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const isEditing = editingId === t.id;
                  const isSelected = selectedIds.includes(t.id);
                  const isInspected = selectedTaskId === t.id;

                  if (isEditing) {
                    return (
                      <tr key={t.id} style={{ background: 'rgba(99, 169, 255, 0.12)' }}>
                        <td style={{ textAlign: 'center' }}></td>
                        <td className="mono" style={{ textAlign: 'center', fontWeight: '700' }}>{t.seq}</td>
                        <td>
                          <input
                            type="text"
                            value={editFormData.descricao || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })}
                            className="ind-input"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={editFormData.tempo || 0}
                            onChange={(e) => setEditFormData({ ...editFormData, tempo: parseFloat(e.target.value) || 0 })}
                            className="ind-input ind-input-mono"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem' }}
                          />
                        </td>
                        <td>
                          <select
                            value={editFormData.atividade || 'VA'}
                            onChange={(e) => setEditFormData({ ...editFormData, atividade: e.target.value })}
                            className="ind-select"
                            style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                          >
                            <option value="VA">VA</option>
                            <option value="NVA">NVA</option>
                            <option value="NVAE">NVAE</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={editFormData.classificacao || 'Montagem'}
                            onChange={(e) => setEditFormData({ ...editFormData, classificacao: e.target.value })}
                            className="ind-select"
                            style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                          >
                            <option value="Solda">Solda</option>
                            <option value="Montagem">Montagem</option>
                            <option value="Movimentação">Movimentação</option>
                            <option value="Acabamento">Acabamento</option>
                            <option value="Caminhada">Caminhada</option>
                            <option value="Retrabalho">Retrabalho</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="number"
                            step="0.5"
                            value={editFormData.distancia || 0}
                            onChange={(e) => setEditFormData({ ...editFormData, distancia: parseFloat(e.target.value) || 0 })}
                            className="ind-input ind-input-mono"
                            style={{ width: '60px', fontSize: '0.8rem', padding: '0.35rem', textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editFormData.obs || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, obs: e.target.value })}
                            className="ind-input"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                            <button onClick={() => saveEdit(t.id)} className="ind-btn ind-btn-sm ind-btn-success" style={{ padding: '0.2rem 0.4rem' }}>
                              <Check size={13} />
                            </button>
                            <button onClick={cancelEdit} className="ind-btn ind-btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
                              <X size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={t.id}
                      className={`${isSelected ? 'selected' : ''} ${isInspected ? 'inspected-highlight' : ''}`}
                    >
                      {/* Checkbox */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(t.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      {/* Seq */}
                      <td className="mono" style={{ textAlign: 'center', fontWeight: '700', color: 'var(--text-muted)' }}>
                        #{t.seq}
                      </td>

                      {/* Descricao */}
                      <td style={{ fontWeight: '600' }}>
                        {t.descricao}
                      </td>

                      {/* Tempo */}
                      <td className="mono">
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                          {showTimeInSeconds ? formatMinutesAndSeconds(t.tempo) : `${Number(t.tempo).toFixed(2)} min`}
                        </span>
                        {!showTimeInSeconds && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                            ({Math.round(t.tempo * 60)}s)
                          </span>
                        )}
                      </td>

                      {/* Atividade */}
                      <td>
                        <span className={`ind-badge ind-badge-${t.atividade.toLowerCase()}`}>
                          {t.atividade}
                        </span>
                      </td>

                      {/* Classificacao */}
                      <td style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                        {t.classificacao}
                      </td>

                      {/* Distancia */}
                      <td className="mono" style={{ textAlign: 'center', color: t.distancia > 0 ? 'var(--analytical-blue)' : 'var(--text-dim)' }}>
                        {t.distancia > 0 ? `${t.distancia}m` : '—'}
                      </td>

                      {/* Observações */}
                      <td style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                        {t.obs || '—'}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem' }}>
                          <button
                            onClick={() => startEdit(t)}
                            title="Editar em linha"
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDuplicateTask(t.id)}
                            title="Duplicar operação"
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            onClick={() => onMoveTask(t.id, -1)}
                            disabled={t.seq === 1}
                            title="Mover para cima"
                            style={{ background: 'none', border: 'none', color: t.seq === 1 ? 'var(--text-dim)' : 'var(--text-secondary)', cursor: t.seq === 1 ? 'default' : 'pointer', padding: '3px' }}
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            onClick={() => onMoveTask(t.id, 1)}
                            disabled={t.seq === posto.tarefas.length}
                            title="Mover para baixo"
                            style={{ background: 'none', border: 'none', color: t.seq === posto.tarefas.length ? 'var(--text-dim)' : 'var(--text-secondary)', cursor: t.seq === posto.tarefas.length ? 'default' : 'pointer', padding: '3px' }}
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            title="Excluir operação"
                            style={{ background: 'none', border: 'none', color: 'var(--nvae-color)', cursor: 'pointer', padding: '3px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Fast Add New Task Row */}
        <form
          onSubmit={handleAddNew}
          style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-medium)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              + Adicionar Nova Operação ao Posto
            </span>

            {newDesc.trim().length >= 3 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                <Sparkles size={13} color="var(--analytical-blue)" />
                <span style={{ color: 'var(--text-muted)' }}>Auto-reconhecido:</span>
                <span className={`ind-badge ind-badge-${newAtividade.toLowerCase()}`}>{newAtividade}</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{newClassificacao}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 2fr) 120px 105px 135px 80px minmax(140px, 1.5fr) auto', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Descrição da operação (ex: Soldar olhal)..."
              value={newDesc}
              onChange={(e) => handleDescChange(e.target.value)}
              className="ind-input"
              required
            />

            <input
              type="text"
              placeholder="Tempo (min)"
              value={newTempo}
              onChange={(e) => setNewTempo(e.target.value)}
              className="ind-input ind-input-mono"
            />

            <select
              value={newAtividade}
              onChange={(e) => setNewAtividade(e.target.value)}
              className="ind-select"
            >
              <option value="VA">VA 🟢</option>
              <option value="NVA">NVA 🟡</option>
              <option value="NVAE">NVAE 🔴</option>
            </select>

            <select
              value={newClassificacao}
              onChange={(e) => setNewClassificacao(e.target.value)}
              className="ind-select"
            >
              <option value="Solda">Solda</option>
              <option value="Montagem">Montagem</option>
              <option value="Movimentação">Movimentação</option>
              <option value="Acabamento">Acabamento</option>
              <option value="Caminhada">Caminhada</option>
              <option value="Retrabalho">Retrabalho</option>
            </select>

            <input
              type="number"
              step="0.5"
              placeholder="m"
              value={newDistancia}
              onChange={(e) => setNewDistancia(e.target.value)}
              className="ind-input ind-input-mono"
              style={{ textAlign: 'center' }}
            />

            <input
              type="text"
              placeholder="Obs (opcional)"
              value={newObs}
              onChange={(e) => setNewObs(e.target.value)}
              className="ind-input"
            />

            <button type="submit" className="ind-btn ind-btn-primary">
              <Plus size={15} />
              <span>Inserir</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
