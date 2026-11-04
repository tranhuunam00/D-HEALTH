import React from 'react';

export interface LabTrendChartProps {
  points: readonly number[];
  isAmber: boolean;
}

export const LabTrendChart: React.FC<LabTrendChartProps> = ({ points, isAmber }) => {
  const min = Math.min(...points) * 0.9;
  const max = Math.max(...points) * 1.1;
  const range = max - min || 1;
  const strokeColor = isAmber ? '#D97706' : '#0D9488';
  const fillColor = isAmber ? 'url(#amberGrad)' : 'url(#tealGrad)';

  const coords = points.map((val, idx) => {
    const x = 20 + idx * 60;
    const y = 70 - ((val - min) / range) * 50;
    return { x, y };
  });

  const pathD = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');
  const areaD = `${pathD} L ${coords[coords.length - 1].x} 80 L ${coords[0].x} 80 Z`;

  return (
    <svg className="w-full h-20 overflow-visible" viewBox="0 0 280 85">
      <defs>
        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D97706" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Reference Dashed Line */}
      <line x1="10" y1="42" x2="270" y2="42" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
      {/* Area fill */}
      <path d={areaD} fill={fillColor} />
      {/* Line */}
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Points */}
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="2" />
      ))}
    </svg>
  );
};

