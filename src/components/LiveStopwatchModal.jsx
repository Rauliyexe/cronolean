import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Flag,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';
import { formatStopwatchTime, msToDecimalMinutes, classifyTask } from '../utils/leanEngine';

export function LiveStopwatchModal({
  isOpen,
  onClose,
  postoNome,
  onSaveTasksToPosto,
  dictionary
}) {
  if (!isOpen) return null;

  // Total session timer
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  // Current lap timer
  const [lapTimeMs, setLapTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Current task inputs
  const [currentDesc, setCurrentDesc] = useState('');
  const [recordedLaps, setRecordedLaps] = useState([]);

  // Auto classification preview
  const [previewAtividade, setPreviewAtividade] = useState('VA');
  const [previewClass, setPreviewClass] = useState('Montagem');

  const timerRef = useRef(null);
  const lastTimeRef = useRef(null);
  const inputRef = useRef(null);

  // Frequent quick phrases for rapid shop-floor clicking
  const quickChips = [
    'Pegar peças no rack',
    'Posicionar no ferramental',
    'Soldar',
    'Pontear',
    'Aplicar anti-respingo',
    'Girar dispositivo',
    'Limpar bocal',
    'Soltar grampos',
    'Içar conjunto'
  ];

  // Beep sound generator using Web Audio API
  const playBeep = (freq = 880, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext might be blocked until user gesture
    }
  };

  // Timer loop
  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      timerRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isRunning]);

  const updateTimer = (now) => {
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    setTotalTimeMs((prev) => prev + delta);
    setLapTimeMs((prev) => prev + delta);

    timerRef.current = requestAnimationFrame(updateTimer);
  };

  // Handle classification when desc changes
  useEffect(() => {
    if (currentDesc.trim().length >= 3) {
      const detected = classifyTask(currentDesc, dictionary);
      setPreviewAtividade(detected.atividade);
      setPreviewClass(detected.classificacao);
    } else {
      setPreviewAtividade('VA');
      setPreviewClass('Montagem');
    }
  }, [currentDesc, dictionary]);

  // Toggle start / pause
  const toggleRunning = () => {
    if (!isRunning) {
      playBeep(660, 0.1);
      setIsRunning(true);
      if (inputRef.current) inputRef.current.focus();
    } else {
      playBeep(440, 0.1);
      setIsRunning(false);
    }
  };

  // Reset stopwatch
  const handleReset = () => {
    setIsRunning(false);
    setTotalTimeMs(0);
    setLapTimeMs(0);
    setRecordedLaps([]);
  };

  // Record Lap
  const handleLap = () => {
    if (lapTimeMs < 300 && !isRunning) return; // avoid accidental zero clicks

    const descToSave = currentDesc.trim() || `Operação Elementar #${recordedLaps.length + 1}`;
    const detected = classifyTask(descToSave, dictionary);
    const decimalMin = msToDecimalMinutes(lapTimeMs);

    const newLap = {
      id: `lap-${Date.now()}`,
      seq: recordedLaps.length + 1,
      descricao: descToSave,
      tempoMs: lapTimeMs,
      tempoDecimalMin: decimalMin,
      atividade: detected.atividade,
      classificacao: detected.classificacao,
      timestamp: new Date().toLocaleTimeString()
    };

    setRecordedLaps((prev) => [newLap, ...prev]);
    playBeep(1046, 0.12); // High cheerful beep for lap

    // Reset lap timer, but keep total timer running!
    setLapTimeMs(0);
    setCurrentDesc('');
    if (inputRef.current) inputRef.current.focus();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space toggles start/pause when not typing in text input
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        toggleRunning();
      }
      // Enter on text input records lap
      if (e.code === 'Enter') {
        e.preventDefault();
        handleLap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, lapTimeMs, currentDesc]);

  // Save all collected laps to current post
  const handleSaveToPosto = () => {
    if (recordedLaps.length === 0) return;
    const formattedTasks = [...recordedLaps].reverse().map((lap, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      seq: idx + 1,
      descricao: lap.descricao,
      tempo: lap.tempoDecimalMin,
      atividade: lap.atividade,
      classificacao: lap.classificacao,
      distancia: 0,
      obs: `Cronometrado ao vivo (${lap.timestamp})`
    }));

    onSaveTasksToPosto(formattedTasks);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#10b981',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}>
              <Timer size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                Cronômetro de Fábrica (Modo Coleta)
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Posto Atual: <strong>{postoNome}</strong> • Tecla <kbd style={{ background: 'var(--bg-input)', padding: '1px 5px', borderRadius: '4px' }}>Espaço</kbd> para Iniciar/Pausar, <kbd style={{ background: 'var(--bg-input)', padding: '1px 5px', borderRadius: '4px' }}>Enter</kbd> para LAP
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-secondary btn-sm"
              title={soundEnabled ? 'Desativar som do bipe' : 'Ativar som do bipe'}
            >
              {soundEnabled ? <Volume2 size={16} color="#10b981" /> : <VolumeX size={16} color="var(--text-dim)" />}
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: '1.25rem' }}>
          
          {/* Main Digital Clock Display */}
          <div style={{
            background: '#040711',
            borderRadius: '16px',
            border: `2px solid ${isRunning ? '#10b981' : 'var(--border-subtle)'}`,
            boxShadow: isRunning ? '0 0 30px rgba(16, 185, 129, 0.25)' : 'none',
            padding: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tempo do Elemento Atual (Lap)
            </div>

            {/* Giant Digits */}
            <div style={{
              fontSize: '4.25rem',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.02em',
              color: isRunning ? '#34d399' : '#f8fafc',
              textShadow: isRunning ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none',
              lineHeight: 1.1,
              margin: '0.5rem 0'
            }}>
              {formatStopwatchTime(lapTimeMs)}
            </div>

            {/* Decimal Equivalent Display */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div>
                Minutos decimais (centesimal): <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{msToDecimalMinutes(lapTimeMs)} min</strong>
              </div>
              <div style={{ color: 'var(--border-strong)' }}>|</div>
              <div>
                Sessão Total: <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatStopwatchTime(totalTimeMs)}</strong>
              </div>
            </div>
          </div>

          {/* Description & Auto-Classification Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                Descrição da Tarefa que está sendo cronometrada:
              </label>

              {currentDesc.trim().length >= 3 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                  <Sparkles size={13} color="#a855f7" />
                  <span>Classificação Automática:</span>
                  <span className={`badge badge-${previewAtividade.toLowerCase()}`}>{previewAtividade}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{previewClass}</span>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="Digite a operação (ex: Pegar tubo reto no rack, Soldar olhal...)"
              value={currentDesc}
              onChange={(e) => setCurrentDesc(e.target.value)}
              className="input"
              style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
            />

            {/* Quick Click Chips */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', padding: '2px 0' }}>
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setCurrentDesc(chip)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Touch-Friendly Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: '0.75rem' }}>
            
            {/* Start / Pause */}
            <button
              onClick={toggleRunning}
              className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                height: '56px',
                fontSize: '1.05rem',
                fontWeight: '800',
                background: isRunning ? 'var(--bg-input)' : 'linear-gradient(135deg, #10b981, #059669)',
                borderColor: isRunning ? '#f59e0b' : 'transparent'
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={20} color="#f59e0b" />
                  <span>PAUSAR</span>
                </>
              ) : (
                <>
                  <Play size={20} color="#ffffff" />
                  <span>INICIAR</span>
                </>
              )}
            </button>

            {/* RECORD LAP */}
            <button
              onClick={handleLap}
              className="btn btn-primary"
              style={{
                height: '56px',
                fontSize: '1.1rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
              }}
              title="Salva o tempo do elemento atual e reinicia o cronômetro para o próximo"
            >
              <Flag size={20} />
              <span>REGISTRAR ELEMENTO (LAP)</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ height: '56px', color: 'var(--text-muted)' }}
              title="Zerar cronômetro"
            >
              <RotateCcw size={18} />
              <span>Zerar</span>
            </button>
          </div>

          {/* Laps List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Elementos Cronometrados nesta sessão ({recordedLaps.length})
              </span>
              {recordedLaps.length > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Tempo total acumulado: {(recordedLaps.reduce((acc, l) => acc + l.tempoDecimalMin, 0)).toFixed(2)} min
                </span>
              )}
            </div>

            <div style={{
              background: 'var(--bg-input)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              maxHeight: '190px',
              overflowY: 'auto'
            }}>
              {recordedLaps.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  Nenhum elemento registrado ainda. Pressione <strong>INICIAR</strong> e depois <strong>REGISTRAR ELEMENTO</strong> a cada fim de tarefa elementar.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <tbody>
                    {recordedLaps.map((lap) => (
                      <tr key={lap.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.45rem 0.75rem', width: '35px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-dim)' }}>
                          #{lap.seq}
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: '600' }}>
                          {lap.descricao}
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem', width: '100px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: '700' }}>
                          {lap.tempoDecimalMin} min
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem', width: '80px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                          {formatStopwatchTime(lap.tempoMs)}
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem', width: '70px' }}>
                          <span className={`badge badge-${lap.atividade.toLowerCase()}`}>{lap.atividade}</span>
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem', width: '110px', color: 'var(--text-muted)' }}>
                          {lap.classificacao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleSaveToPosto}
            disabled={recordedLaps.length === 0}
            className="btn btn-success"
            style={{ opacity: recordedLaps.length === 0 ? 0.5 : 1 }}
          >
            <CheckCircle size={18} />
            <span>Salvar {recordedLaps.length} Tarefas no Posto</span>
          </button>
        </div>

      </div>
    </div>
  );
}
