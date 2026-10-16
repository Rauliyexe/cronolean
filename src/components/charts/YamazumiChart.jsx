import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { IndustrialChartContainer } from './IndustrialChartContainer';

export function YamazumiChart({
  tarefas = [],
  taktTimeMin = 0,
  onSelectTask,
  selectedTaskId,
  postoNome = ''
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [filterAtividade, setFilterAtividade] = useState('ALL'); // 'ALL' | 'VA' | 'NVA' | 'NVAE'

  // Filter tasks based on local quick filter
  const displayedTasks = tarefas.filter(t => {
    if (filterAtividade === 'ALL') return true;
    return t.atividade === filterAtividade;
  });

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    }

    const chart = chartInstanceRef.current;

    const categories = displayedTasks.map(t => `#${t.seq} ${t.descricao.length > 20 ? t.descricao.substring(0, 18) + '...' : t.descricao}`);
    const dataValues = displayedTasks.map(t => {
      const isSelected = selectedTaskId === t.id;
      let color = t.atividade === 'VA' ? '#39D98A' : t.atividade === 'NVAE' ? '#FF5C65' : '#F5C451';
      return {
        value: Number(t.tempo) || 0,
        taskData: t,
        itemStyle: {
          color: color,
          borderColor: isSelected ? '#FFFFFF' : 'transparent',
          borderWidth: isSelected ? 2 : 0,
          borderRadius: [3, 3, 0, 0]
        }
      };
    });

    const option = {
      backgroundColor: 'transparent',
      animationDuration: 300,
      grid: {
        top: 36,
        right: 25,
        bottom: 55,
        left: 45,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#12161A',
        borderColor: '#2F3842',
        borderWidth: 1,
        textStyle: { color: '#F3F5F6', fontSize: 12 },
        formatter: (params) => {
          if (!params || params.length === 0) return '';
          const p = params[0];
          const task = p.data?.taskData;
          if (!task) return '';

          const pctTakt = taktTimeMin > 0 ? ((task.tempo / taktTimeMin) * 100).toFixed(1) : 0;
          const badgeColor = task.atividade === 'VA' ? '#39D98A' : task.atividade === 'NVAE' ? '#FF5C65' : '#F5C451';

          return `
            <div style="font-family: Inter, sans-serif; min-width: 200px; padding: 2px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; border-bottom: 1px solid #242B32; padding-bottom: 4px;">
                <span style="font-family: monospace; font-weight: 700; color: #929DA7;">Seq #${task.seq}</span>
                <span style="background: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}55; padding: 1px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">
                  ${task.atividade}
                </span>
              </div>
              <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 8px;">${task.descricao}</div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
                <div>Tempo: <strong style="font-family: monospace; color:#63A9FF;">${task.tempo} min</strong></div>
                <div>Em segundos: <strong style="font-family: monospace;">${Math.round(task.tempo * 60)}s</strong></div>
                <div>% do Takt: <strong style="font-family: monospace;">${pctTakt}%</strong></div>
                <div>Classe: <strong>${task.classificacao}</strong></div>
              </div>
              <div style="margin-top: 6px; font-size: 10px; color: #929DA7; font-style: italic;">
                Clique para inspecionar e editar na tabela
              </div>
            </div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#242B32' } },
        axisLabel: {
          color: '#929DA7',
          fontSize: 10,
          interval: 0,
          rotate: displayedTasks.length > 15 ? 40 : 0,
          formatter: (val) => val
        }
      },
      yAxis: {
        type: 'value',
        name: 'Tempo (min)',
        nameTextStyle: { color: '#929DA7', fontSize: 11, align: 'right' },
        splitLine: { lineStyle: { color: '#1B2127', type: 'dashed' } },
        axisLine: { lineStyle: { color: '#242B32' } },
        axisLabel: { color: '#929DA7', fontSize: 11 }
      },
      dataZoom: [
        {
          type: 'slider',
          show: displayedTasks.length > 18,
          height: 18,
          bottom: 6,
          borderColor: '#2F3842',
          fillerColor: 'rgba(99, 169, 255, 0.15)',
          handleStyle: { color: '#63A9FF', borderColor: '#4C99FB' },
          textStyle: { color: '#929DA7', fontSize: 10 }
        },
        { type: 'inside' }
      ],
      series: [
        {
          name: 'Tempo da Operação',
          type: 'bar',
          barMaxWidth: 38,
          data: dataValues,
          markLine: taktTimeMin > 0 ? {
            symbol: ['none', 'none'],
            silent: false,
            lineStyle: {
              color: '#FF5C65',
              type: 'dashed',
              width: 2
            },
            label: {
              formatter: `Takt Time: ${taktTimeMin} min`,
              position: 'insideEndTop',
              color: '#FF5C65',
              fontSize: 11,
              fontWeight: 600
            },
            data: [{ yAxis: taktTimeMin }]
          } : undefined
        }
      ]
    };

    chart.setOption(option);

    // Click handler for task inspection
    const handleChartClick = (params) => {
      const task = params.data?.taskData;
      if (task && onSelectTask) {
        onSelectTask(task.id);
      }
    };

    chart.off('click');
    chart.on('click', handleChartClick);

    // Responsive auto resize
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [displayedTasks, taktTimeMin, selectedTaskId]);

  const handleResetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 100
      });
    }
  };

  const handleExportImage = () => {
    if (chartInstanceRef.current) {
      const dataUrl = chartInstanceRef.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#0B0D0F'
      });
      const link = document.createElement('a');
      link.download = `yamazumi_${(postoNome || 'posto').toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <IndustrialChartContainer
      title={`Gráfico Yamazumi — ${postoNome}`}
      subtitle={`${displayedTasks.length} tarefas elementares sequenciadas comparadas contra a linha de Takt Time (${taktTimeMin} min)`}
      height="380px"
      onResetZoom={handleResetZoom}
      onExportImage={handleExportImage}
      extraControls={
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setFilterAtividade('ALL')}
            className="ind-btn ind-btn-sm"
            style={{
              background: filterAtividade === 'ALL' ? 'var(--bg-card-hover)' : 'transparent',
              borderColor: 'transparent',
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem'
            }}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterAtividade('VA')}
            className="ind-btn ind-btn-sm"
            style={{
              background: filterAtividade === 'VA' ? 'var(--va-bg)' : 'transparent',
              borderColor: filterAtividade === 'VA' ? 'var(--va-border)' : 'transparent',
              color: 'var(--va-color)',
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem'
            }}
          >
            VA
          </button>
          <button
            onClick={() => setFilterAtividade('NVA')}
            className="ind-btn ind-btn-sm"
            style={{
              background: filterAtividade === 'NVA' ? 'var(--nva-bg)' : 'transparent',
              borderColor: filterAtividade === 'NVA' ? 'var(--nva-border)' : 'transparent',
              color: 'var(--nva-color)',
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem'
            }}
          >
            NVA
          </button>
          <button
            onClick={() => setFilterAtividade('NVAE')}
            className="ind-btn ind-btn-sm"
            style={{
              background: filterAtividade === 'NVAE' ? 'var(--nvae-bg)' : 'transparent',
              borderColor: filterAtividade === 'NVAE' ? 'var(--nvae-border)' : 'transparent',
              color: 'var(--nvae-color)',
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem'
            }}
          >
            NVAE
          </button>
        </div>
      }
    >
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </IndustrialChartContainer>
  );
}
