import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { IndustrialChartContainer } from './IndustrialChartContainer';
import { calculateMultiStationComparison } from '../../utils/leanEngine';

export function WorkstationComparisonChart({
  subconjuntos = [],
  activePostoId,
  onSelectPosto
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const comparison = calculateMultiStationComparison(subconjuntos);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    }

    const chart = chartInstanceRef.current;

    const stationNames = comparison.map(c => c.nome);
    const vaValues = comparison.map(c => c.vaTempo);
    const nvaValues = comparison.map(c => c.nvaTempo);
    const nvaeValues = comparison.map(c => c.nvaeTempo);

    const taktTimeRef = comparison[0]?.taktTime || 0;

    const option = {
      backgroundColor: 'transparent',
      animationDuration: 300,
      legend: {
        top: 0,
        textStyle: { color: '#929DA7', fontSize: 11 },
        itemGap: 16
      },
      grid: {
        top: 36,
        right: 25,
        bottom: 30,
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
          const idx = params[0].dataIndex;
          const st = comparison[idx];
          if (!st) return '';

          return `
            <div style="font-family: Inter, sans-serif; min-width: 190px; padding: 2px;">
              <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 6px; border-bottom: 1px solid #242B32; padding-bottom: 4px;">
                ${st.nome} (${st.numTarefas} operações)
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 3px;">
                <span>Ciclo Total:</span> <strong style="font-family: monospace; color:#63A9FF;">${st.cicloTotal} min</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 3px;">
                <span>Takt Time:</span> <strong style="font-family: monospace;">${st.taktTime} min</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 3px; color: ${st.isGargalo ? '#FF5C65' : '#39D98A'}; font-weight: 600;">
                <span>Status:</span> <span>${st.isGargalo ? `Gargalo (+${st.folgaOuGargalo} min)` : `Folga (${st.folgaOuGargalo} min)`}</span>
              </div>
              <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #242B32; font-size: 11px;">
                <span style="color:#39D98A;">VA: ${st.pctVa}%</span> • 
                <span style="color:#F5C451;">NVA: ${st.pctNva}%</span> 
                ${st.nvaeTempo > 0 ? `• <span style="color:#FF5C65;">NVAE: ${st.pctNvae}%</span>` : ''}
              </div>
            </div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: stationNames,
        axisLine: { lineStyle: { color: '#242B32' } },
        axisLabel: {
          color: (value, index) => comparison[index]?.id === activePostoId ? '#FFFFFF' : '#929DA7',
          fontWeight: (value, index) => comparison[index]?.id === activePostoId ? 700 : 500,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        name: 'Tempo Total (min)',
        nameTextStyle: { color: '#929DA7', fontSize: 11 },
        splitLine: { lineStyle: { color: '#1B2127', type: 'dashed' } },
        axisLabel: { color: '#929DA7', fontSize: 11 }
      },
      series: [
        {
          name: 'Valor Agregado (VA)',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 48,
          itemStyle: { color: '#39D98A' },
          data: vaValues
        },
        {
          name: 'S/ Valor Agregado (NVA)',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 48,
          itemStyle: { color: '#F5C451' },
          data: nvaValues
        },
        {
          name: 'Eliminar (NVAE)',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 48,
          itemStyle: { color: '#FF5C65', borderRadius: [4, 4, 0, 0] },
          data: nvaeValues,
          markLine: taktTimeRef > 0 ? {
            symbol: ['none', 'none'],
            lineStyle: { color: '#FF5C65', type: 'dashed', width: 2 },
            label: { formatter: `Takt Time (${taktTimeRef} min)`, position: 'insideEndTop', color: '#FF5C65', fontSize: 11 },
            data: [{ yAxis: taktTimeRef }]
          } : undefined
        }
      ]
    };

    chart.setOption(option);

    const handleChartClick = (params) => {
      const idx = params.dataIndex;
      const target = comparison[idx];
      if (target && onSelectPosto) {
        onSelectPosto(target.id);
      }
    };

    chart.off('click');
    chart.on('click', handleChartClick);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => resizeObserver.disconnect();
  }, [comparison, activePostoId]);

  return (
    <IndustrialChartContainer
      title="Comparativo de Balanceamento entre Postos da Linha"
      subtitle="Compara os 4 subconjuntos frente ao Takt Time (Clique em uma barra para selecionar o posto)"
      height="340px"
    >
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </IndustrialChartContainer>
  );
}
