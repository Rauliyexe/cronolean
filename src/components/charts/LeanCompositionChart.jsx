import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { IndustrialChartContainer } from './IndustrialChartContainer';

export function LeanCompositionChart({
  operacoesList = [],
  onSelectCategory,
  selectedCategory
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const opColors = {
    Solda: '#63A9FF',
    Montagem: '#9D8CFF',
    Movimentação: '#F5C451',
    Caminhada: '#788896',
    Acabamento: '#2EC4B6',
    Retrabalho: '#FF5C65',
    Outro: '#64748B'
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    }

    const chart = chartInstanceRef.current;

    // Filter out operations with 0 time
    const dataItems = operacoesList.filter(op => op.tempo > 0);

    const categories = dataItems.map(d => d.nome).reverse();
    const values = dataItems.map(d => {
      const isSelected = selectedCategory === d.nome;
      return {
        value: d.tempo,
        pct: d.pct,
        name: d.nome,
        itemStyle: {
          color: opColors[d.nome] || '#64748B',
          borderColor: isSelected ? '#FFFFFF' : 'transparent',
          borderWidth: isSelected ? 2 : 0,
          borderRadius: [0, 4, 4, 0]
        }
      };
    }).reverse();

    const option = {
      backgroundColor: 'transparent',
      animationDuration: 300,
      grid: {
        top: 20,
        right: 60,
        bottom: 25,
        left: 95,
        containLabel: false
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#12161A',
        borderColor: '#2F3842',
        borderWidth: 1,
        textStyle: { color: '#F3F5F6', fontSize: 12 },
        formatter: (params) => {
          const item = params.data;
          return `
            <div style="font-family: Inter, sans-serif; padding: 2px;">
              <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">${item.name}</div>
              <div style="font-size: 11px;">Tempo Total: <strong style="color:#63A9FF; font-family: monospace;">${item.value} min</strong></div>
              <div style="font-size: 11px;">Representatividade: <strong style="font-family: monospace;">${item.pct}%</strong></div>
            </div>
          `;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Min',
        splitLine: { lineStyle: { color: '#1B2127', type: 'dashed' } },
        axisLabel: { color: '#929DA7', fontSize: 10 }
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#242B32' } },
        axisLabel: {
          color: '#F3F5F6',
          fontSize: 11,
          fontWeight: 500
        }
      },
      series: [
        {
          type: 'bar',
          data: values,
          barMaxWidth: 20,
          label: {
            show: true,
            position: 'right',
            formatter: (p) => `${p.data.value}m (${p.data.pct}%)`,
            color: '#929DA7',
            fontSize: 10,
            fontFamily: 'monospace'
          }
        }
      ]
    };

    chart.setOption(option);

    const handleChartClick = (params) => {
      const catName = params.data?.name;
      if (catName && onSelectCategory) {
        onSelectCategory(catName === selectedCategory ? null : catName);
      }
    };

    chart.off('click');
    chart.on('click', handleChartClick);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => resizeObserver.disconnect();
  }, [operacoesList, selectedCategory]);

  return (
    <IndustrialChartContainer
      title="Composição por Categoria Operacional"
      subtitle="Tempo consumido por especialidade de fabricação (Clique para filtrar na tabela)"
      height="300px"
    >
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </IndustrialChartContainer>
  );
}
