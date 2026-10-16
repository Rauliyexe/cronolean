import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flag,
  CheckCircle2,
  Volume2,
  VolumeX,
  Undo2,
  Sparkles,
  Edit2,
  Check,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Repeat,
  Plus,
  ArrowRight,
  Layers,
  HelpCircle,
  Search,
  Maximize2,
  Minimize2,
  Vibrate,
  Sun
} from 'lucide-react';
import {
  formatStopwatchTime,
  msToDecimalMinutes,
  classifyTask,
  normalizeText
} from '../utils/leanEngine';
import {
  DEFAULT_FREQUENT_ACTIONS,
  DEFAULT_COMPLEMENTS_CATALOG,
  CONTEXTUAL_COMPLEMENTS_MAP
} from '../data/defaultData.js';

export function StopwatchView({
  posto,
  onSaveTasksToPosto,
  dictionary,
  complementsCatalog = DEFAULT_COMPLEMENTS_CATALOG
}) {
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [lapTimeMs, setLapTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gloveMode, setGloveMode] = useState(false);

  // Mobile & Tablet specific states
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Current task description
  const [currentDesc, setCurrentDesc] = useState('');
  const [recordedLaps, setRecordedLaps] = useState([]);

  // Speed Pad state: selected action verb & toggle all complements
  const [activeVerb, setActiveVerb] = useState(null);
  const [showAllComplements, setShowAllComplements] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  // Inline editing of recorded laps
  const [editingLapId, setEditingLapId] = useState(null);
  const [editingFormData, setEditingFormData] = useState({});

  // Live classification feedback
  const [classificationResult, setClassificationResult] = useState(null);

  const timerRef = useRef(null);
  const lastTimeRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Pool of known descriptions from current post + dictionary
  const knownPhrases = [
    ...(posto.tarefas || []).map(t => t.descricao),
    ...dictionary.map(d => d.verbo),
    ...dictionary.flatMap(d => d.sinonimos || []),
    'Pegar tubo reto no rack',
    'Pegar tubo curvado no rack',
    'Posicionar tubo no ferramental',
    'Soldar olhal',
    'Pontear conjunto',
    'Aplicar antirrespingo',
    'Girar dispositivo',
    'Limpar bocal',
    'Soltar grampos',
    'Içar conjunto da lateral',
    'Preencher checklist'
  ];
  // Deduplicate
  const uniquePhrases = Array.from(new Set(knownPhrases.map(p => p.trim()))).filter(Boolean);

  // Sound generator
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
      // AudioContext blocked
    }
  };

  // Haptic Feedback for Mobile / Tablets
  const triggerHaptic = (pattern = 40) => {
    if (!hapticEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Vibration not supported or blocked
      }
    }
  };

  // Screen Wake Lock API for factory shop-floor continuous studies
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && isRunning) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
          setWakeLockActive(true);
          wakeLock.addEventListener('release', () => {
            setWakeLockActive(false);
          });
        } catch (e) {
          setWakeLockActive(false);
        }
      }
    };

    if (isRunning) {
      requestWakeLock();
    } else {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
        setWakeLockActive(false);
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isRunning]);

  // Handheld Fullscreen Mode for tablets and mobile devices
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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

    setTotalTimeMs(prev => prev + delta);
    setLapTimeMs(prev => prev + delta);

    timerRef.current = requestAnimationFrame(updateTimer);
  };

  // Real-time classification & suggestion updates
  useEffect(() => {
    if (currentDesc.trim().length >= 2) {
      const result = classifyTask(currentDesc, dictionary);
      setClassificationResult(result);

      // Suggestions filtering
      const normInput = normalizeText(currentDesc);
      const matches = uniquePhrases
        .filter(phrase => normalizeText(phrase).includes(normInput) && normalizeText(phrase) !== normInput)
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSuggestionIndex(-1);
    } else {
      setClassificationResult(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentDesc, dictionary]);

  const toggleRunning = () => {
    if (!isRunning) {
      playBeep(660, 0.1);
      triggerHaptic([30, 45, 30]);
      setIsRunning(true);
      if (inputRef.current) inputRef.current.focus();
    } else {
      playBeep(440, 0.1);
      triggerHaptic(40);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (recordedLaps.length > 0 && !window.confirm('Deseja zerar o cronômetro e descartar as medições não salvas?')) {
      return;
    }
    triggerHaptic([20, 20]);
    setIsRunning(false);
    setTotalTimeMs(0);
    setLapTimeMs(0);
    setRecordedLaps([]);
  };

  // Record LAP (One-command collection)
  const handleLap = (overrideDesc = null) => {
    if (lapTimeMs < 300 && !isRunning) return;

    const descToSave = (overrideDesc || currentDesc).trim() || `Operação #${recordedLaps.length + 1}`;
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
      abreviatura: detected.abreviatura,
      ruleSource: detected.ruleSource,
      timestamp: new Date().toLocaleTimeString()
    };

    setRecordedLaps(prev => [newLap, ...prev]);
    playBeep(1046, 0.12);
    triggerHaptic(50);

    setLapTimeMs(0);
    setCurrentDesc('');
    setShowSuggestions(false);
    setActiveVerb(null);

    // Keep focus automatically on text input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Repeat last operation
  const handleRepeatLast = () => {
    if (recordedLaps.length === 0) return;
    triggerHaptic(30);
    const lastLap = recordedLaps[0];
    setCurrentDesc(lastLap.descricao);
    if (inputRef.current) inputRef.current.focus();
  };

  // Undo last lap
  const handleUndoLastLap = () => {
    if (recordedLaps.length === 0) return;
    triggerHaptic(35);
    setRecordedLaps(prev => prev.slice(1));
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space toggles start/pause when not focused on an input
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleRunning();
      }

      // Input specific keyboard interactions
      if (e.target === inputRef.current) {
        if (e.key === 'ArrowDown' && suggestions.length > 0) {
          e.preventDefault();
          setSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
          e.preventDefault();
          setSuggestionIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (showSuggestions && suggestionIndex >= 0 && suggestions[suggestionIndex]) {
            setCurrentDesc(suggestions[suggestionIndex]);
            setShowSuggestions(false);
          } else {
            handleLap();
          }
        } else if (e.key === 'Escape') {
          setShowSuggestions(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, lapTimeMs, currentDesc, showSuggestions, suggestionIndex, suggestions]);

  // Detect active verb dynamically from current description or explicit selection
  const activeAction = useMemo(() => {
    const trimmed = currentDesc.trim();
    if (!trimmed) return activeVerb;
    const norm = normalizeText(trimmed);

    // 1. Direct match with action verbs
    const found = DEFAULT_FREQUENT_ACTIONS.find(act => {
      const vNorm = normalizeText(act.verbo);
      return norm.startsWith(vNorm);
    });
    if (found) return found;

    // 2. Synonyms and roots
    if (norm.startsWith('peg') || norm.startsWith('apanh') || norm.startsWith('busc') || norm.startsWith('retir') || norm.startsWith('colet') || norm.startsWith('alcan')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'PEGAR');
    if (norm.startsWith('posic') || norm.startsWith('enc') || norm.startsWith('mont') || norm.startsWith('coloq') || norm.startsWith('alin') || norm.startsWith('ajust')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'POSICIONAR');
    if (norm.startsWith('sold')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'SOLDAR');
    if (norm.startsWith('pont')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'PONTEAR');
    if (norm.startsWith('gir') || norm.startsWith('vir') || norm.startsWith('rotac')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'GIRAR');
    if (norm.startsWith('apert') || norm.startsWith('trav') || norm.startsWith('fix') || norm.startsWith('prend')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'APERTAR');
    if (norm.startsWith('aplic') || norm.startsWith('pulv') || norm.startsWith('borrif') || norm.startsWith('passar ant') || norm.startsWith('antirresp') || norm.startsWith('anti-resp')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'APLICAR');
    if (norm.startsWith('limp') || norm.startsWith('deseng')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'LIMPAR');
    if (norm.startsWith('acab') || norm.startsWith('esm') || norm.startsWith('lix') || norm.startsWith('escov') || norm.startsWith('rebarb') || norm.startsWith('resping') || norm.startsWith('tirar resp') || norm.startsWith('remover resp')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'ACABAR');
    if (norm.startsWith('insp') || norm.startsWith('verif') || norm.startsWith('conf') || norm.startsWith('med') || norm.startsWith('chec') || norm.startsWith('preench')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'INSPECIONAR');
    if (norm.startsWith('transp') || norm.startsWith('lev') || norm.startsWith('traz') || norm.startsWith('desloc') || norm.startsWith('mov')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'TRANSPORTAR');
    if (norm.startsWith('corrig') || norm.startsWith('refaz') || norm.startsWith('retra') || norm.startsWith('repar') || norm.startsWith('recup') || norm.startsWith('remover def')) 
      return DEFAULT_FREQUENT_ACTIONS.find(a => a.label === 'RETRABALHAR');

    return activeVerb;
  }, [currentDesc, activeVerb]);

  // Dynamic contextual complement list based on active verb
  const currentComplements = useMemo(() => {
    if (showAllComplements) {
      return complementsCatalog.map(c => ({ termo: c.termo, label: c.termo }));
    }
    const verbKey = activeAction?.label || activeVerb?.label;
    if (verbKey && CONTEXTUAL_COMPLEMENTS_MAP[verbKey]) {
      return CONTEXTUAL_COMPLEMENTS_MAP[verbKey];
    }
    // Default fallback when nothing is selected: popular factory complements
    return [
      { termo: 'tubo reto no rack', label: 'Tubo reto no rack' },
      { termo: 'no ferramental', label: 'No ferramental' },
      { termo: 'olhal', label: 'Olhal' },
      { termo: 'link', label: 'Link' },
      { termo: 'grampo', label: 'Grampo' },
      { termo: 'dispositivo', label: 'Dispositivo' },
      { termo: 'antirrespingo', label: 'Antirrespingo' },
      { termo: 'checklist', label: 'Checklist' },
      { termo: 'respingos com espátula', label: 'Respingos c/ espátula' },
      { termo: 'solda', label: 'Solda' }
    ];
  }, [activeAction, activeVerb, showAllComplements, complementsCatalog]);

  // Speed Pad: verb selection & smart verb replacement
  const handleSelectVerb = (verbItem) => {
    triggerHaptic(20);
    if (activeVerb?.label === verbItem.label && !currentDesc.trim()) {
      setActiveVerb(null);
    } else {
      setActiveVerb(verbItem);
      const trimmed = currentDesc.trim();
      if (!trimmed) {
        setCurrentDesc(verbItem.verbo + ' ');
      } else {
        const words = trimmed.split(/\s+/);
        if (words.length > 1) {
          // Replace first word with the new verb, preserve the complement!
          words[0] = verbItem.verbo;
          setCurrentDesc(words.join(' ') + ' ');
        } else {
          setCurrentDesc(verbItem.verbo + ' ');
        }
      }
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // Speed Pad: complement combination
  const handleSelectComplement = (compItem) => {
    triggerHaptic(20);
    const v = activeAction || activeVerb;
    const term = compItem.termo || compItem.label || compItem;
    let newDesc = '';

    if (v) {
      const normTerm = normalizeText(term);
      if (normTerm.startsWith('preencher') || normTerm.startsWith('corrigir') || normTerm.startsWith('tirar') || normTerm.startsWith('remover')) {
        newDesc = term.charAt(0).toUpperCase() + term.slice(1);
      } else if (normTerm.startsWith('no ') || normTerm.startsWith('na ') || normTerm.startsWith('e ') || normTerm.startsWith('com ')) {
        newDesc = `${v.verbo} ${term}`;
      } else {
        newDesc = `${v.verbo} ${term.toLowerCase()}`;
      }
    } else if (currentDesc.trim()) {
      newDesc = `${currentDesc.trim()} ${term.toLowerCase()}`;
    } else {
      newDesc = term.charAt(0).toUpperCase() + term.slice(1);
    }

    setCurrentDesc(newDesc);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Inline editing of recorded laps
  const startEditLap = (lap) => {
    setEditingLapId(lap.id);
    setEditingFormData({ ...lap });
  };

  const saveEditLap = (id) => {
    const detected = classifyTask(editingFormData.descricao, dictionary);
    setRecordedLaps(prev => prev.map(lap => {
      if (lap.id === id) {
        return {
          ...lap,
          descricao: editingFormData.descricao,
          atividade: editingFormData.atividade || detected.atividade,
          classificacao: editingFormData.classificacao || detected.classificacao,
          abreviatura: detected.abreviatura
        };
      }
      return lap;
    }));
    setEditingLapId(null);
  };

  // Save batch into workstation
  const handleSaveBatch = () => {
    if (recordedLaps.length === 0) return;
    const formatted = [...recordedLaps].reverse().map((lap, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      seq: (posto.tarefas?.length || 0) + idx + 1,
      descricao: lap.descricao,
      tempo: lap.tempoDecimalMin,
      atividade: lap.atividade,
      classificacao: lap.classificacao,
      distancia: 0,
      obs: `Coleta cronoanálise (${lap.timestamp})`
    }));

    onSaveTasksToPosto(formatted);
    setRecordedLaps([]);
    alert(`Sucesso! ${formatted.length} operações gravadas no posto "${posto.nome}".`);
  };

  return (
    <div className={`${gloveMode ? 'glove-mode' : ''} has-sticky-bar`} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Controls Header */}
      <div className="ind-card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="ind-badge ind-badge-blue">Cronoanálise Contínua</span>
              
              {/* Wake Lock Screen Indicator */}
              <span
                className="ind-badge"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                  background: wakeLockActive ? 'rgba(57, 217, 138, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  color: wakeLockActive ? 'var(--va-color)' : 'var(--text-muted)',
                  border: `1px solid ${wakeLockActive ? 'var(--va-border)' : 'var(--border-subtle)'}`
                }}
                title={wakeLockActive ? 'Tela permanecerá ativa durante a cronometragem (Wake Lock ligado)' : 'Wake Lock inativo'}
              >
                <Sun size={12} />
                <span className="no-mobile">{wakeLockActive ? 'Tela Ativa (Sem Bloqueio)' : 'Bloqueio Normal'}</span>
              </span>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Posto: <strong>{posto.nome}</strong> ({posto.descricaoConjunto || posto.nome})
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
              Coleta Ultrarrápida de Movimentos
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {/* Haptic Vibration Toggle for Mobile / Tablet */}
            <button
              onClick={() => {
                triggerHaptic(40);
                setHapticEnabled(!hapticEnabled);
              }}
              className={`ind-btn ind-btn-sm ${hapticEnabled ? 'ind-btn-primary' : ''}`}
              title={hapticEnabled ? 'Vibração tátil ativada nos botões e no LAP' : 'Ativar vibração tátil (Haptic)'}
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <Vibrate size={14} />
              <span className="no-mobile">{hapticEnabled ? 'Vibração Ativa' : 'Vibração Off'}</span>
            </button>

            {/* Fullscreen Handheld Mode */}
            <button
              onClick={toggleFullscreen}
              className="ind-btn ind-btn-sm"
              title="Tela cheia para uso portátil em celular ou tablet"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span className="no-mobile">{isFullscreen ? 'Janela' : 'Tela Cheia'}</span>
            </button>

            {/* Tablet / Glove Mode */}
            <button
              onClick={() => {
                triggerHaptic(20);
                setGloveMode(!gloveMode);
              }}
              className={`ind-btn ind-btn-sm ${gloveMode ? 'ind-btn-primary' : ''}`}
              title="Modo Chão de Fábrica com botões grandes para tablet ou uso com luvas"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <Tablet size={14} />
              <span className="no-mobile">{gloveMode ? 'Modo Luvas (Ativo)' : 'Modo Luvas'}</span>
            </button>

            {/* Audio Beeper Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="ind-btn ind-btn-sm"
              title={soundEnabled ? 'Silenciar bipes sonoros' : 'Ativar bipes sonoros'}
              style={{ padding: '0.35rem 0.65rem' }}
            >
              {soundEnabled ? <Volume2 size={14} color="var(--va-color)" /> : <VolumeX size={14} color="var(--text-dim)" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Digital Chronometer Panel */}
      <div className="ind-card" style={{ padding: gloveMode ? '2rem 1.25rem' : '1.5rem 1.25rem', textAlign: 'center', position: 'relative' }}>
        
        {/* Status Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
          <span className={`ind-badge ${isRunning ? 'ind-badge-va' : 'ind-badge-nva'}`} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
            ● {isRunning ? 'CRONOMETRANDO EM TEMPO REAL' : totalTimeMs > 0 ? 'CRONÔMETRO PAUSADO' : 'PRONTO PARA INICIAR'}
          </span>
        </div>

        {/* Fluid Responsive Digital Display (clamp for phones & tablets) */}
        <div
          className="digital-timer-display"
          style={{
            color: isRunning ? 'var(--va-color)' : 'var(--text-primary)'
          }}
        >
          {formatStopwatchTime(lapTimeMs)}
        </div>

        {/* Dual Industrial Conversion */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Minutos decimais industriais: <strong style={{ color: 'var(--analytical-blue)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>{msToDecimalMinutes(lapTimeMs)} min</strong>
          </div>
          <div style={{ color: 'var(--border-strong)' }}>|</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Tempo total acumulado: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{formatStopwatchTime(totalTimeMs)}</strong>
          </div>
        </div>

        {/* Main Stopwatch Action Buttons (Responsive Grid) */}
        <div className="stopwatch-actions-grid">
          {/* Start / Pause */}
          <button
            onClick={toggleRunning}
            className={`ind-btn ${isRunning ? 'ind-btn-danger' : 'ind-btn-success'} ind-btn-lg`}
            style={{ fontWeight: '800', minHeight: '52px' }}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            <span>{isRunning ? 'PAUSAR' : 'INICIAR'}</span>
          </button>

          {/* Big LAP Button (Primary Interaction on Desktop/Tablet) */}
          <button
            onClick={() => handleLap()}
            className="ind-btn ind-btn-primary ind-btn-lg primary-action-btn"
            style={{
              fontWeight: '800',
              fontSize: '1.15rem',
              letterSpacing: '0.02em',
              background: 'linear-gradient(180deg, #3A88E9 0%, #1A5CB0 100%)',
              border: '2px solid #63A9FF',
              boxShadow: '0 4px 20px rgba(99, 169, 255, 0.3)',
              minHeight: '52px'
            }}
            title="Registra a tarefa atual e prepara a próxima sem parar o cronômetro (Tecla Enter)"
          >
            <Flag size={22} />
            <span>REGISTRAR LAP &amp; PRÓXIMO (ENTER)</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="ind-btn ind-btn-lg"
            title="Zerar cronômetro da sessão"
            style={{ minHeight: '52px' }}
          >
            <RotateCcw size={18} />
            <span>Zerar</span>
          </button>
        </div>

      </div>

      {/* Speed Pad: Painel de Movimentos Frequentes & Complementos Contextuais */}
      <div className="ind-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            <Layers size={14} color="var(--analytical-blue)" />
            <span>Speed Pad — Movimentos Frequentes &amp; Complementos</span>
          </div>
          {recordedLaps.length > 0 && (
            <button
              onClick={handleRepeatLast}
              className="ind-btn ind-btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
              title="Repetir a descrição da última operação cronometrada"
            >
              <Repeat size={12} />
              <span>Repetir Última ({recordedLaps[0].descricao.length > 18 ? recordedLaps[0].descricao.substring(0, 16) + '...' : recordedLaps[0].descricao})</span>
            </button>
          )}
        </div>

        {/* 12 Quick Action Verbs (Responsive Touch Grid) */}
        <div className="speed-pad-grid">
          {DEFAULT_FREQUENT_ACTIONS.map(act => {
            const isSelected = (activeAction?.label || activeVerb?.label) === act.label;
            return (
              <button
                key={act.label}
                type="button"
                onClick={() => handleSelectVerb(act)}
                className={`ind-btn ind-btn-sm ${isSelected ? 'ind-btn-primary' : ''}`}
                style={{
                  fontWeight: '700',
                  borderRadius: '4px',
                  background: isSelected ? 'var(--analytical-blue)' : 'var(--bg-input)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  border: isSelected ? '1px solid #4C99FB' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 10px rgba(99, 169, 255, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {act.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Contextual Complements Bar */}
        <div style={{
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div className="complements-touch-scroll">
            <span style={{ fontSize: '0.72rem', color: 'var(--analytical-blue)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activeAction ? `Complementos p/ ${activeAction.label}:` : 'Complementos Sugeridos:'}
            </span>

            {currentComplements.map((comp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectComplement(comp)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '16px',
                  padding: '0.22rem 0.6rem',
                  fontSize: '0.74rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.12s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--analytical-blue)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(99, 169, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                  e.currentTarget.style.transform = 'none';
                }}
                title={`Adicionar "${comp.label}" à descrição da operação`}
              >
                <Plus size={11} color="var(--analytical-blue)" />
                <span>{comp.label}</span>
              </button>
            ))}
          </div>

          {/* Toggle between contextual and all */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setShowAllComplements(!showAllComplements)}
              className="ind-btn ind-btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
              title="Alternar exibição de todos os complementos do catálogo"
            >
              <Layers size={11} />
              <span>{showAllComplements ? 'Ver Contextuais' : `Todos (${complementsCatalog.length})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Operation Input with Live Industrial Intelligence Banner */}
      <div className="ind-card" style={{ padding: '1.25rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Descrição da Operação Atual</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '400' }}>
              (Pressione <kbd style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-medium)', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Enter</kbd> para registrar imediatamente)
            </span>
          </label>

          {currentDesc.trim() && (
            <button
              type="button"
              onClick={() => { setCurrentDesc(''); if (inputRef.current) inputRef.current.focus(); }}
              className="ind-btn ind-btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
            >
              <X size={12} />
              <span>Limpar</span>
            </button>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite ou selecione acima (ex: Inspecionar checklist, Soldar olhal, Pegar tubo reto)..."
            value={currentDesc}
            onChange={(e) => setCurrentDesc(e.target.value)}
            className="ind-input"
            style={{
              width: '100%',
              fontSize: '1.1rem',
              padding: '0.85rem 1.15rem',
              fontWeight: '600',
              borderColor: classificationResult
                ? (classificationResult.atividade === 'VA'
                    ? 'rgba(57, 217, 138, 0.4)'
                    : classificationResult.atividade === 'NVAE'
                    ? 'rgba(255, 92, 101, 0.4)'
                    : 'rgba(245, 196, 81, 0.4)')
                : 'var(--border-medium)'
            }}
            autoFocus
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 60,
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              {suggestions.map((sug, idx) => {
                const isSelected = idx === suggestionIndex;
                const sugClass = classifyTask(sug, dictionary);
                return (
                  <div
                    key={sug}
                    onClick={() => {
                      setCurrentDesc(sug);
                      setShowSuggestions(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    style={{
                      padding: '0.65rem 1rem',
                      background: isSelected ? 'rgba(99, 169, 255, 0.15)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={() => setSuggestionIndex(idx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Search size={13} color="var(--text-muted)" />
                      <span style={{ fontWeight: isSelected ? '700' : '500' }}>{sug}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className={`ind-badge ind-badge-${sugClass.atividade.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                        {sugClass.atividade}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {sugClass.classificacao}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PROMINENT LIVE CLASSIFICATION BANNER */}
        {classificationResult ? (
          <div style={{
            marginTop: '0.85rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                  Interpretação
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1px' }}>
                  <span>{classificationResult.classificacao}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>({classificationResult.abreviatura})</span>
                </div>
              </div>

              <div style={{ width: '1px', height: '32px', background: 'var(--border-medium)' }} />

              <div>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                  Tipo Lean Sugerido
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                  <span
                    className={`ind-badge ind-badge-${classificationResult.atividade.toLowerCase()}`}
                    style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem', fontWeight: '800' }}
                  >
                    {classificationResult.atividade === 'VA'
                      ? '● VA — Agrega Valor'
                      : classificationResult.atividade === 'NVA'
                      ? '▲ NVA — Não Agrega Valor (Necessária)'
                      : '■ NVAE — Retrabalho (Desperdício Eliminável)'}
                  </span>
                </div>
              </div>

              {classificationResult.allDetectedMotions && classificationResult.allDetectedMotions.length > 1 && (
                <>
                  <div style={{ width: '1px', height: '32px', background: 'var(--border-medium)' }} />
                  <div>
                    <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                      Movimentos Detectados ({classificationResult.allDetectedMotions.length})
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '3px', flexWrap: 'wrap' }}>
                      {classificationResult.allDetectedMotions.map((m, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.72rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {m.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div style={{ width: '1px', height: '32px', background: 'var(--border-medium)' }} />

              <div>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                  Regra Acionada
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {classificationResult.ruleSource} <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({classificationResult.scoreLabel})</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleLap()}
                className="ind-btn ind-btn-primary"
                style={{
                  fontWeight: '800',
                  fontSize: '0.88rem',
                  padding: '0.6rem 1.25rem',
                  boxShadow: '0 4px 12px rgba(76, 153, 251, 0.25)'
                }}
                title="Registrar LAP imediatamente (ou pressione Enter)"
              >
                <CheckCircle2 size={16} />
                <span>Registrar LAP (Enter)</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Sparkles size={13} color="var(--analytical-blue)" />
            <span>Digite a operação ou combine um verbo acima com um complemento para classificação instantânea.</span>
          </div>
        )}
      </div>

      {/* Recorded Laps Table with Inline Quick Edits */}
      <div className="ind-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Elementos Medidos Nesta Sessão ({recordedLaps.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Total coletado: {(recordedLaps.reduce((acc, l) => acc + l.tempoDecimalMin, 0)).toFixed(2)} min
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleUndoLastLap}
              disabled={recordedLaps.length === 0}
              className="ind-btn ind-btn-sm"
              title="Desfazer última medição registrada"
            >
              <Undo2 size={13} />
              <span>Desfazer Último</span>
            </button>

            <button
              onClick={handleSaveBatch}
              disabled={recordedLaps.length === 0}
              className="ind-btn ind-btn-success ind-btn-sm"
              title="Gravar este lote de medições no posto de trabalho"
            >
              <CheckCircle2 size={14} />
              <span>Gravar Lote no Posto ({recordedLaps.length})</span>
            </button>
          </div>
        </div>

        <div className="ind-table-wrapper" style={{ maxHeight: '250px' }}>
          <table className="ind-table">
            <thead>
              <tr>
                <th style={{ width: '45px', textAlign: 'center' }}>Seq</th>
                <th>Descrição da Operação</th>
                <th style={{ width: '130px' }}>Tempo Dec.</th>
                <th style={{ width: '110px' }}>Tempo Bruto</th>
                <th style={{ width: '90px' }}>Tipo</th>
                <th style={{ width: '130px' }}>Classe</th>
                <th style={{ width: '75px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recordedLaps.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Nenhum elemento medido ainda. Pressione <strong>INICIAR</strong> e use o Speed Pad ou digite a operação + <strong>ENTER</strong>.
                  </td>
                </tr>
              ) : (
                recordedLaps.map(lap => {
                  const isEditing = editingLapId === lap.id;

                  if (isEditing) {
                    return (
                      <tr key={lap.id} style={{ background: 'rgba(99, 169, 255, 0.12)' }}>
                        <td className="mono" style={{ textAlign: 'center', fontWeight: '700' }}>#{lap.seq}</td>
                        <td>
                          <input
                            type="text"
                            value={editingFormData.descricao}
                            onChange={(e) => setEditingFormData({ ...editingFormData, descricao: e.target.value })}
                            className="ind-input"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '0.3rem' }}
                          />
                        </td>
                        <td className="mono" style={{ color: 'var(--analytical-blue)', fontWeight: '700' }}>
                          {lap.tempoDecimalMin.toFixed(2)} min
                        </td>
                        <td className="mono" style={{ color: 'var(--text-muted)' }}>
                          {formatStopwatchTime(lap.tempoMs)}
                        </td>
                        <td>
                          <select
                            value={editingFormData.atividade || lap.atividade}
                            onChange={(e) => setEditingFormData({ ...editingFormData, atividade: e.target.value })}
                            className="ind-select"
                            style={{ fontSize: '0.75rem', padding: '0.25rem' }}
                          >
                            <option value="VA">VA</option>
                            <option value="NVA">NVA</option>
                            <option value="NVAE">NVAE</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={editingFormData.classificacao || lap.classificacao}
                            onChange={(e) => setEditingFormData({ ...editingFormData, classificacao: e.target.value })}
                            className="ind-select"
                            style={{ fontSize: '0.75rem', padding: '0.25rem' }}
                          >
                            <option value="Solda">Solda</option>
                            <option value="Montagem">Montagem</option>
                            <option value="Movimentação">Movimentação</option>
                            <option value="Operação de Dispositivo">Operação de Dispositivo</option>
                            <option value="Preparação">Preparação</option>
                            <option value="Acabamento">Acabamento</option>
                            <option value="Inspeção">Inspeção</option>
                            <option value="Retrabalho">Retrabalho</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
                            <button onClick={() => saveEditLap(lap.id)} className="ind-btn ind-btn-sm ind-btn-success" style={{ padding: '0.2rem 0.4rem' }}>
                              <Check size={12} />
                            </button>
                            <button onClick={() => setEditingLapId(null)} className="ind-btn ind-btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
                              <X size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={lap.id}>
                      <td className="mono" style={{ textAlign: 'center', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        #{lap.seq}
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        {lap.descricao}
                      </td>
                      <td className="mono" style={{ color: 'var(--analytical-blue)', fontWeight: '700' }}>
                        {lap.tempoDecimalMin.toFixed(2)} min
                      </td>
                      <td className="mono" style={{ color: 'var(--text-muted)' }}>
                        {formatStopwatchTime(lap.tempoMs)}
                      </td>
                      <td>
                        <span className={`ind-badge ind-badge-${lap.atividade.toLowerCase()}`}>
                          {lap.atividade}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {lap.classificacao}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => startEditLap(lap)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}
                          title="Editar descrição ou classificação desta medição"
                        >
                          <Edit2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Sticky Thumb Action Bar (Thumb Zone for Phones & Handheld Tablets) */}
      <div className="mobile-sticky-bottom-bar">
        <button
          type="button"
          onClick={toggleRunning}
          className={`ind-btn ${isRunning ? 'ind-btn-danger' : 'ind-btn-success'}`}
          style={{
            flex: '0 0 auto',
            minWidth: '95px',
            minHeight: '52px',
            fontWeight: '800',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isRunning ? 'PAUSAR' : 'INICIAR'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleLap()}
          className="ind-btn ind-btn-primary"
          style={{
            flex: 1,
            minHeight: '52px',
            fontWeight: '800',
            fontSize: '0.95rem',
            background: 'linear-gradient(180deg, #3A88E9 0%, #1A5CB0 100%)',
            border: '2px solid #63A9FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 16px rgba(99, 169, 255, 0.4)'
          }}
        >
          <Flag size={20} />
          <span>LAP ({msToDecimalMinutes(lapTimeMs)}m)</span>
        </button>

        {recordedLaps.length > 0 && (
          <button
            type="button"
            onClick={handleUndoLastLap}
            className="ind-btn"
            style={{
              flex: '0 0 auto',
              minHeight: '52px',
              padding: '0 0.85rem',
              background: 'var(--bg-input)',
              color: 'var(--text-secondary)'
            }}
            title="Desfazer última medição registrada"
          >
            <Undo2 size={18} />
          </button>
        )}
      </div>

    </div>
  );
}
