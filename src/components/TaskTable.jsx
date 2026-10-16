import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { classifyTask, formatMinutesAndSeconds } from '../utils/leanEngine';

export function TaskTable({
  tarefas,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  dictionary
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAtividade, setFilterAtividade] = useState('TODAS');
  const [filterClassificacao, setFilterClassificacao] = useState('TODAS');
  const [showTimeInSeconds, setShowTimeInSeconds] = useState(false);

  // New task form state
  const [newDesc, setNewDesc] = useState('');
  const [newTempo, setNewTempo] = useState('');
  const [newTimeMode, setNewTimeMode] = useState('min'); // 'min' | 'sec'
  const [newAtividade, setNewAtividade] = useState('VA');
  const [newClassificacao, setNewClassificacao] = useState('Montagem');
  const [newDistancia, setNewDistancia] = useState('');
  const [newObs, setNewObs] = useState('');

  // Editing inline state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Auto-detect classification as user types in new task description
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

    // Convert seconds to decimal minutes if selected
    if (newTimeMode === 'sec') {
      tempoNum = Number((tempoNum / 60).toFixed(2));
    }

    const newTask = {
      id: `task-${Date.now()}`,
      seq: tarefas.length + 1,
      descricao: newDesc.trim(),
      tempo: tempoNum,
      atividade: newAtividade,
      classificacao: newClassificacao,
      distancia: parseFloat((newDistancia || '0').replace(',', '.')) || 0,
      obs: newObs.trim()
    };

    onAddTask(newTask);

    // Reset inputs
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

  // Filter tasks
  const filteredTasks = tarefas.filter(t => {
    const matchesSearch = t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.obs && t.obs.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAtv = filterAtividade === 'TODAS' || t.atividade === filterAtividade;
    const matchesClass = filterClassificacao === 'TODAS' || t.classificacao === filterClassificacao;
    return matchesSearch && matchesAtv && matchesClass;
  });

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Table Header & Search/Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
            Estudo das Tarefas Elementares
          </h3>
          <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            {tarefas.length} operações cronometradas no posto
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '180px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Buscar operação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-sm"
              style={{ paddingLeft: '30px' }}
            />
          </div>

          {/* Atividade Filter */}
          <select
            value={filterAtividade}
            onChange={(e) => setFilterAtividade(e.target.value)}
            className="select"
            style={{ width: 'auto', padding: '0.375rem 0.65rem', fontSize: '0.8125rem' }}
          >
            <option value="TODAS">Todas (VA/NVA/NVAE)</option>
            <option value="VA">Apenas VA 🟢</option>
            <option value="NVA">Apenas NVA 🟡</option>
            <option value="NVAE">Apenas NVAE 🔴</option>
          </select>

          {/* Classificação Filter */}
          <select
            value={filterClassificacao}
            onChange={(e) => setFilterClassificacao(e.target.value)}
            className="select"
            style={{ width: 'auto', padding: '0.375rem 0.65rem', fontSize: '0.8125rem' }}
          >
            <option value="TODAS">Todas Operações</option>
            <option value="Solda">Solda</option>
            <option value="Montagem">Montagem</option>
            <option value="Movimentação">Movimentação</option>
            <option value="Acabamento">Acabamento</option>
            <option value="Caminhada">Caminhada</option>
            <option value="Retrabalho">Retrabalho</option>
          </select>

          {/* Toggle Unit Display */}
          <button
            onClick={() => setShowTimeInSeconds(!showTimeInSeconds)}
            className="btn btn-secondary btn-sm"
            title="Alternar exibição entre minutos decimais e segundos"
          >
            {showTimeInSeconds ? 'Ver min decimais' : 'Ver min:seg'}
          </button>

        </div>
      </div>

      {/* Main Table */}
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '0.75rem 0.6rem', width: '45px', textAlign: 'center' }}>Seq</th>
              <th style={{ padding: '0.75rem 1rem' }}>Descrição da Operação</th>
              <th style={{ padding: '0.75rem 0.8rem', width: '130px' }}>Tempo</th>
              <th style={{ padding: '0.75rem 0.8rem', width: '105px' }}>Atividade</th>
              <th style={{ padding: '0.75rem 0.8rem', width: '135px' }}>Classificação</th>
              <th style={{ padding: '0.75rem 0.8rem', width: '80px', textAlign: 'center' }}>Dist. (m)</th>
              <th style={{ padding: '0.75rem 1rem' }}>Observações</th>
              <th style={{ padding: '0.75rem 0.6rem', width: '110px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  Nenhuma tarefa encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredTasks.map((t, idx) => {
                const isEditing = editingId === t.id;

                if (isEditing) {
                  return (
                    <tr key={t.id} style={{ background: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: '700' }}>{t.seq}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          value={editFormData.descricao || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={editFormData.tempo || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, tempo: parseFloat(e.target.value) || 0 })}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <select
                          value={editFormData.atividade || 'VA'}
                          onChange={(e) => setEditFormData({ ...editFormData, atividade: e.target.value })}
                          className="select"
                          style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                        >
                          <option value="VA">VA</option>
                          <option value="NVA">NVA</option>
                          <option value="NVAE">NVAE</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <select
                          value={editFormData.classificacao || 'Montagem'}
                          onChange={(e) => setEditFormData({ ...editFormData, classificacao: e.target.value })}
                          className="select"
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
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="number"
                          step="0.5"
                          value={editFormData.distancia || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, distancia: parseFloat(e.target.value) || 0 })}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem', textAlign: 'center' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          value={editFormData.obs || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, obs: e.target.value })}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
                          <button onClick={() => saveEdit(t.id)} className="btn btn-sm btn-success" style={{ padding: '0.25rem 0.5rem' }}>
                            <Check size={13} />
                          </button>
                          <button onClick={cancelEdit} className="btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
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
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Seq */}
                    <td style={{ padding: '0.65rem 0.6rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-dim)' }}>
                      {t.seq}
                    </td>

                    {/* Descricao */}
                    <td style={{ padding: '0.65rem 1rem', fontWeight: '500' }}>
                      {t.descricao}
                    </td>

                    {/* Tempo */}
                    <td style={{ padding: '0.65rem 0.8rem', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ fontWeight: '700' }}>
                        {showTimeInSeconds ? formatMinutesAndSeconds(t.tempo) : `${t.tempo.toFixed(2)} min`}
                      </span>
                      {!showTimeInSeconds && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '0.4rem' }}>
                          ({Math.round(t.tempo * 60)}s)
                        </span>
                      )}
                    </td>

                    {/* Atividade */}
                    <td style={{ padding: '0.65rem 0.8rem' }}>
                      <span className={`badge badge-${t.atividade.toLowerCase()}`}>
                        {t.atividade}
                      </span>
                    </td>

                    {/* Classificacao */}
                    <td style={{ padding: '0.65rem 0.8rem' }}>
                      <span style={{
                        fontSize: '0.785rem',
                        fontWeight: '600',
                        color: t.classificacao === 'Solda' ? 'var(--op-solda)' :
                               t.classificacao === 'Montagem' ? 'var(--op-montagem)' :
                               t.classificacao === 'Movimentação' ? 'var(--op-movimentacao)' :
                               t.classificacao === 'Acabamento' ? 'var(--op-acabamento)' : 'var(--text-main)'
                      }}>
                        {t.classificacao}
                      </span>
                    </td>

                    {/* Distancia */}
                    <td style={{ padding: '0.65rem 0.8rem', textAlign: 'center', fontFamily: 'var(--font-mono)', color: t.distancia > 0 ? '#38bdf8' : 'var(--text-dim)' }}>
                      {t.distancia > 0 ? `${t.distancia}m` : '—'}
                    </td>

                    {/* Obs */}
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontSize: '0.785rem' }}>
                      {t.obs || '—'}
                    </td>

                    {/* Ações */}
                    <td style={{ padding: '0.65rem 0.6rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem' }}>
                        <button
                          onClick={() => startEdit(t)}
                          title="Editar tarefa"
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onMoveTask(t.id, -1)}
                          disabled={t.seq === 1}
                          title="Mover para cima"
                          style={{ background: 'none', border: 'none', color: t.seq === 1 ? 'var(--text-dim)' : 'var(--text-muted)', cursor: t.seq === 1 ? 'default' : 'pointer', padding: '3px' }}
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          onClick={() => onMoveTask(t.id, 1)}
                          disabled={t.seq === tarefas.length}
                          title="Mover para baixo"
                          style={{ background: 'none', border: 'none', color: t.seq === tarefas.length ? 'var(--text-dim)' : 'var(--text-muted)', cursor: t.seq === tarefas.length ? 'default' : 'pointer', padding: '3px' }}
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          title="Excluir tarefa"
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

      {/* Fast Add Form (Inline Footer) */}
      <form
        onSubmit={handleAddNew}
        style={{
          background: 'var(--bg-input)',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px dashed var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}>
            <Plus size={16} color="var(--primary-accent)" />
            <span>Adicionar Nova Tarefa Elementar</span>
          </div>

          {newDesc.trim().length >= 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Sparkles size={13} color="#a855f7" />
              <span>Auto-detectado:</span>
              <span className={`badge badge-${newAtividade.toLowerCase()}`}>{newAtividade}</span>
              <span style={{ fontWeight: '600' }}>{newClassificacao}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) minmax(130px, 1fr) 110px 140px 90px minmax(150px, 1fr) auto', gap: '0.6rem', alignItems: 'center' }}>
          
          {/* Descrição */}
          <input
            type="text"
            placeholder="ex: Pegar tubo reto no rack..."
            value={newDesc}
            onChange={(e) => handleDescChange(e.target.value)}
            className="input"
            required
          />

          {/* Tempo & Unidade */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <input
              type="text"
              placeholder={newTimeMode === 'min' ? 'ex: 0,67' : 'ex: 40'}
              value={newTempo}
              onChange={(e) => setNewTempo(e.target.value)}
              className="input"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            <button
              type="button"
              onClick={() => setNewTimeMode(newTimeMode === 'min' ? 'sec' : 'min')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0 0.5rem', fontSize: '0.75rem' }}
              title="Mudar unidade de entrada"
            >
              {newTimeMode}
            </button>
          </div>

          {/* Atividade */}
          <select
            value={newAtividade}
            onChange={(e) => setNewAtividade(e.target.value)}
            className="select"
          >
            <option value="VA">VA 🟢</option>
            <option value="NVA">NVA 🟡</option>
            <option value="NVAE">NVAE 🔴</option>
          </select>

          {/* Classificação */}
          <select
            value={newClassificacao}
            onChange={(e) => setNewClassificacao(e.target.value)}
            className="select"
          >
            <option value="Solda">Solda</option>
            <option value="Montagem">Montagem</option>
            <option value="Movimentação">Movimentação</option>
            <option value="Acabamento">Acabamento</option>
            <option value="Caminhada">Caminhada</option>
            <option value="Retrabalho">Retrabalho</option>
            <option value="Outro">Outro</option>
          </select>

          {/* Distância */}
          <input
            type="number"
            step="0.5"
            placeholder="m"
            value={newDistancia}
            onChange={(e) => setNewDistancia(e.target.value)}
            className="input"
            style={{ textAlign: 'center' }}
          />

          {/* Observações */}
          <input
            type="text"
            placeholder="Obs (opcional)"
            value={newObs}
            onChange={(e) => setNewObs(e.target.value)}
            className="input"
          />

          {/* Submit */}
          <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.1rem' }}>
            <Plus size={16} />
            <span>Adicionar</span>
          </button>
        </div>
      </form>

    </div>
  );
}
