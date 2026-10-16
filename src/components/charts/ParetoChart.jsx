import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { IndustrialChartContainer } from './IndustrialChartContainer';
import { calculateParetoData } from '../../utils/leanEngine';

export function ParetoChart({
  tarefas = [],
  onSelectTask,
  selectedTaskId,
  postoNome = ''
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const paretoData = calculateParetoData(tarefas);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    }

    const chart = chartInstanceRef.current;

    const names = paretoData.map(p => `#${p.seq} ${p.descricao.length > 16 ? p.descricao.substring(0, 14) + '...' : p.descricao}`);
    const timeValues = paretoData.map(p => {
      const isSelected = selectedTaskId === p.id;
      return {
        value: p.tempo,
        taskData: p,
        itemStyle: {
          color: p.isVitalFew ? '#63A9FF' : '#2A3644',
          borderColor: isSelected ? '#FFFFFF' : 'transparent',
          borderWidth: isSelected ? 2 : 0,
          borderRadius: [3, 3, 0, 0]
        }
      };
    });
    const cumPercentages = paretoData.map(p => p.cumulativePct);

    const option = {
      backgroundColor: 'transparent',
      animationDuration: 300,
      grid: {
        top: 36,
        right: 48,
        bottom: 55,
        left: 45,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: '#12161A',
        borderColor: '#2F3842',
        borderWidth: 1,
        textStyle: { color: '#F3F5F6', fontSize: 12 },
        formatter: (params) => {
          if (!params || params.length === 0) return '';
          const barParam = params.find(p => p.seriesType === 'bar');
          const task = barParam?.data?.taskData;
          if (!task) return '';

          return `
            <div style="font-family: Inter, sans-serif; min-width: 200px; padding: 2px;">
              <div style="display:flex; justify-content:space-between; margin-bottom: 6px; border-bottom: 1px solid #242B32; padding-bottom: 4px;">
                <span style="font-family: monospace; font-weight:700;">Rank #${task.rank} (Seq #${task.seq})</span>
                <span style="color: ${task.isVitalFew ? '#63A9FF' : '#929DA7'}; font-weight: 700; font-size: 10px;">
                  ${task.isVitalFew ? 'VITAL FEW (80/20)' : 'TRIVIAL MANY'}
                </span>
              </div>
              <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 6px;">${task.descricao}</div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
                <div>Tempo: <strong style="font-family: monospace; color:#63A9FF;">${task.tempo} min</strong></div>
                <div>% Individual: <strong style="font-family: monospace;">${task.pctOfTotal}%</strong></div>
                <div>% Acumulado: <strong style="font-family: monospace; color:#F5C451;">${task.cumulativePct}%</strong></div>
                <div>Atividade: <strong>${task.atividade}</strong></div>
              </div>
            </div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: '#242B32' } },
        axisLabel: {
          color: '#929DA7',
          fontSize: 10,
          rotate: paretoData.length > 10 ? 35 : 0
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Tempo (min)',
          nameTextStyle: { color: '#929DA7', fontSize: 11 },
          splitLine: { lineStyle: { color: '#1B2127', type: 'dashed' } },
          axisLabel: { color: '#929DA7', fontSize: 11 }
        },
        {
          type: 'value',
          name: '% Acumulada',
          max: 100,
          min: 0,
          nameTextStyle: { color: '#929DA7', fontSize: 11 },
          splitLine: { show: false },
          axisLabel: { color: '#F5C451', fontSize: 11, formatter: '{value}%' }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          show: paretoData.length > 18,
          height: 16,
          bottom: 4,
          borderColor: '#2F3842',
          fillerColor: 'rgba(99, 169, 255, 0.15)',
          handleStyle: { color: '#63A9FF' }
        },
        { type: 'inside' }
      ],
      series: [
        {
          name: 'Tempo Individual',
          type: 'bar',
          barMaxWidth: 30,
          data: timeValues
        },
        {
          name: '% Acumulado',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#F5C451' },
          lineStyle: { width: 2.5, color: '#F5C451' },
          data: cumPercentages,
          markLine: {
            symbol: ['none', 'none'],
            lineStyle: { color: '#FF5C65', type: 'dashed', width: 1.5 },
            label: { formatter: 'Corte 80%', color: '#FF5C65', position: 'end', fontSize: 10 },
            data: [{ yAxis: 80 }]
          }
        }
      ]
    };

    chart.setOption(option);

    const handleChartClick = (params) => {
      const task = params.data?.taskData;
      if (task && onSelectTask) {
        onSelectTask(task.id);
      }
    };

    chart.off('click');
    chart.on('click', handleChartClick);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => resizeObserver.disconnect();
  }, [paretoData, selectedTaskId]);

  const handleExportImage = () => {
    if (chartInstanceRef.current) {
      const dataUrl = chartInstanceRef.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#0B0D0F'
      });
      const link = document.createElement('a');
      link.download = `pareto_${(postoNome || 'posto').toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <IndustrialChartContainer
      title="Análise de Pareto das Operações (Curva ABC)"
      subtitle="Identifica as operações críticas que concentram 80% do tempo do ciclo produtivo"
      height="360px"
      onExportImage={handleExportImage}
    >
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </IndustrialChartContainer>
  );
}
