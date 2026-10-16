import React, { useRef } from 'react';
import { Download, Maximize2, RotateCcw } from 'lucide-react';

export function IndustrialChartContainer({
  title,
  subtitle,
  children,
  onResetZoom,
  onExportImage,
  extraControls,
  height = '340px'
}) {
  return (
    <div className="ind-card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Container Header */}
      <div className="ind-card-header" style={{ padding: '0.85rem 1.25rem' }}>
        <div>
          <h4 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {title}
          </h4>
          {subtitle && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {extraControls}

          {onResetZoom && (
            <button
              onClick={onResetZoom}
              className="ind-btn ind-btn-sm"
              title="Restaurar visualização original e zoom"
            >
              <RotateCcw size={13} />
              <span className="no-mobile">Restaurar Zoom</span>
            </button>
          )}

          {onExportImage && (
            <button
              onClick={onExportImage}
              className="ind-btn ind-btn-sm"
              title="Exportar gráfico como imagem PNG"
            >
              <Download size={13} />
              <span className="no-mobile">Exportar PNG</span>
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ height, width: '100%', position: 'relative', padding: '0.5rem 0.75rem' }}>
        {children}
      </div>
    </div>
  );
}
