import { useState, useMemo } from 'react';
import { useOrdersStore } from '../../../stores/ordersStore';
import { formatPrice } from '../../../utils';

export function RecentSalesChart() {
  const { orders } = useOrdersStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate the last 7 days
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      
      const dateString = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Calculate actual orders revenue for this day
      const dayOrders = orders.filter((order) => {
        if (order.status === 'cancelled' || order.status === 'refunded') return false;
        const orderDate = order.createdAt.split('T')[0];
        return orderDate === dateString;
      });
      const actualSales = dayOrders.reduce((sum, order) => sum + order.total, 0);
      const orderCount = dayOrders.length;

      data.push({
        dayName,
        formattedDate,
        value: actualSales,
        actualSales,
        orderCount,
      });
    }
    return data;
  }, [orders]);

  // Chart layout specs
  const width = 600;
  const height = 240;
  const paddingT = 20;
  const paddingB = 30;
  const paddingL = 50;
  const paddingR = 20;

  const chartWidth = width - paddingL - paddingR;
  const chartHeight = height - paddingT - paddingB;

  // Find max value for scaling
  const maxValue = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.value));
    return maxVal > 0 ? Math.ceil(maxVal / 100) * 100 : 500;
  }, [chartData]);

  // Generate grid levels
  const yTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];

  // Calculate coordinates
  const points = useMemo(() => {
    return chartData.map((d, i) => {
      const x = paddingL + (i * chartWidth) / (chartData.length - 1);
      const y = height - paddingB - (d.value / maxValue) * chartHeight;
      return { x, y, ...d };
    });
  }, [chartData, chartWidth, chartHeight, maxValue]);

  // Smooth Bezier path string
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  // Filled area path
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = height - paddingB;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [points, linePath]);

  return (
    <div className="relative w-full">
      {/* Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 bg-surface border border-border rounded-lg px-4 py-2.5 shadow-2xl pointer-events-none transition-all duration-150 whitespace-nowrap"
          style={{
            left: `${points[hoveredIndex].x}px`,
            top: `${points[hoveredIndex].y - 12}px`,
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
              {points[hoveredIndex].formattedDate}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">
                {formatPrice(points[hoveredIndex].value)}
              </span>
              {points[hoveredIndex].orderCount > 0 && (
                <span className="text-[10px] bg-success-muted text-success border border-success/20 px-1.5 py-0.5 rounded font-bold">
                  {points[hoveredIndex].orderCount} {points[hoveredIndex].orderCount === 1 ? 'order' : 'orders'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SVG Rendering */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="overflow-visible"
      >
        <defs>
          {/* Crimson gradient fill under the line */}
          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
          {/* Glow filter for active point */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Horizontal Gridlines & Y-Axis Labels */}
        {yTicks.map((tick, index) => {
          const y = height - paddingB - (tick / maxValue) * chartHeight;
          return (
            <g key={index}>
              <line
                x1={paddingL}
                y1={y}
                x2={width - paddingR}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
                strokeDasharray="4 4"
                className="opacity-20"
              />
              <text
                x={paddingL - 10}
                y={y + 4}
                textAnchor="end"
                fill="#ffffff"
                className="text-[10px] font-medium opacity-90"
              >
                {tick >= 1000 ? `$${(tick / 1000).toFixed(1)}k` : `$${tick}`}
              </text>
            </g>
          );
        })}

        {/* X-Axis Labels */}
        {points.map((p, index) => (
          <text
            key={index}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fill="#ffffff"
            className="text-[10px] font-semibold opacity-90"
          >
            {p.dayName}
          </text>
        ))}

        {/* Filled Area */}
        <path d={areaPath} fill="url(#chart-area-grad)" />

        {/* Smooth Chart Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Interaction Hotspots (Circles) */}
        {points.map((p, index) => (
          <g
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer"
          >
            {/* Invisibly larger interactive touch area */}
            <circle
              cx={p.x}
              cy={p.y}
              r={15}
              fill="transparent"
            />
            {/* The visual dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === index ? 6 : 4}
              fill={hoveredIndex === index ? '#ffffff' : 'var(--color-accent)'}
              stroke="var(--color-accent)"
              strokeWidth={2}
              filter={hoveredIndex === index ? 'url(#glow)' : undefined}
              className="transition-all duration-150"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
