import { useRef, useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

export interface LineSeries {
  name: string;
  color: string;
  points: DataPoint[];
}

interface LineChartProps {
  title: string;
  series?: LineSeries[];
  xLabels?: string[];
  /** legacy single-series support */
  points?: DataPoint[];
}

const CHART_HEIGHT = 280;
const CHART_PADDING_LEFT = 56;
const CHART_PADDING_RIGHT = 16;
const CHART_PADDING_TOP = 24;
const CHART_PADDING_BOTTOM = 36;
const Y_TICKS = 5;

const niceCeil = (n: number) => {
  if (n <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const base = n / pow;
  let nice;
  if (base <= 1) nice = 1;
  else if (base <= 2) nice = 2;
  else if (base <= 5) nice = 5;
  else nice = 10;
  return nice * pow;
};

const buildSmoothPath = (
  pts: { x: number; y: number }[],
  tension = 0.5,
) => {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const LineChart = ({ title, series, points, xLabels }: LineChartProps) => {
  const resolvedSeries: LineSeries[] = (() => {
    if (series && series.length) return series;
    return [{ name: title, color: "#000000", points: points ?? [] }];
  })();

  const labels =
    xLabels ?? resolvedSeries[0]?.points.map((p) => p.label) ?? [];
  const pointCount = labels.length;

  const allValues = resolvedSeries.flatMap((s) => s.points.map((p) => p.value));
  const maxValue = Math.max(...allValues, 0);
  const yMax = niceCeil(maxValue);
  const yTicks = Array.from(
    { length: Y_TICKS },
    (_, i) => (yMax * (Y_TICKS - 1 - i)) / (Y_TICKS - 1),
  );

  const width = 720;
  const innerWidth = width - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
  const innerHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

  const xFor = (idx: number) => {
    if (pointCount <= 1) {
      return CHART_PADDING_LEFT + innerWidth * 0.5;
    }
    return CHART_PADDING_LEFT + (innerWidth * idx) / (pointCount - 1);
  };

  const yFor = (val: number) => {
    if (yMax === 0) return CHART_PADDING_TOP + innerHeight;
    return CHART_PADDING_TOP + innerHeight - (val / yMax) * innerHeight;
  };

  const baselineY = CHART_PADDING_TOP + innerHeight;

  const visibleLabels = (() => {
    if (pointCount <= 12) return labels.map((_, i) => i);
    const step = Math.ceil(pointCount / 9);
    return labels
      .map((_, i) => i)
      .filter((i) => i % step === 0 || i === pointCount - 1);
  })();

  const showLegend = resolvedSeries.length > 1;

  const formatTick = (n: number) => {
    if (Number.isInteger(n)) return n.toLocaleString("en-IN");
    return n.toFixed(0);
  };

  const safeGradientId = (name: string | null | undefined, idx: number) =>
    `lc-grad-${String(name ?? `series-${idx}`).replace(/[^a-zA-Z0-9]/g, "-")}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const handleMove: React.MouseEventHandler<SVGRectElement> = (e) => {
    if (!svgRef.current || pointCount === 0) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return;
    const local = pt.matrixTransform(ctm.inverse());
    if (pointCount === 1) {
      setHoverIdx(0);
      return;
    }
    const ratio = (local.x - CHART_PADDING_LEFT) / innerWidth;
    const raw = Math.round(ratio * (pointCount - 1));
    const clamped = Math.max(0, Math.min(pointCount - 1, raw));
    setHoverIdx(clamped);
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-[#000000]">{title}</h3>
        {showLegend && (
          <div className="flex flex-wrap items-center gap-3">
            {resolvedSeries.map((s, idx) => {
              const displayName = s.name ?? "Unassigned";
              return (
                <div
                  key={`legend-${idx}-${displayName}`}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs font-medium text-[#4D4D4D]">
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          width="100%"
          height={CHART_HEIGHT}
          className="block"
        >
          <defs>
            {resolvedSeries.map((s, idx) => (
              <linearGradient
                key={`grad-${idx}`}
                id={safeGradientId(s.name, idx)}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          {yTicks.map((tickVal, i) => {
            const y = CHART_PADDING_TOP + (innerHeight * i) / (Y_TICKS - 1);
            return (
              <text
                key={`y-${i}`}
                x={CHART_PADDING_LEFT - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#9CA3AF"
              >
                {formatTick(tickVal)}
              </text>
            );
          })}

          {resolvedSeries.map((s, sIdx) => {
            const xy = s.points.map((p, idx) => ({
              x: xFor(idx),
              y: yFor(p.value),
            }));
            const linePath = buildSmoothPath(xy);
            const areaPath =
              xy.length > 1
                ? `${linePath} L ${xy[xy.length - 1].x} ${baselineY} L ${xy[0].x} ${baselineY} Z`
                : "";
            return (
              <g key={`series-${sIdx}`} pointerEvents="none">
                {areaPath && (
                  <path
                    d={areaPath}
                    fill={`url(#${safeGradientId(s.name, sIdx)})`}
                    stroke="none"
                  />
                )}
                {xy.length > 1 && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {xy.map((pt, idx) => (
                  <circle
                    key={`pt-${sIdx}-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoverIdx === idx ? 4.5 : 2.75}
                    fill={s.color}
                  />
                ))}
              </g>
            );
          })}

          {labels.map((label, idx) =>
            visibleLabels.includes(idx) ? (
              <text
                key={`x-${idx}`}
                x={xFor(idx)}
                y={CHART_HEIGHT - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#9CA3AF"
              >
                {label}
              </text>
            ) : null,
          )}

          {/* hover overlay: single rect that captures cursor across the plot area */}
          <rect
            x={CHART_PADDING_LEFT}
            y={CHART_PADDING_TOP}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            style={{ cursor: "crosshair" }}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIdx(null)}
          />

          {hoverIdx !== null && (() => {
            const x = xFor(hoverIdx);
            const label = labels[hoverIdx] ?? "";
            const rows = resolvedSeries.map((s) => ({
              name: s.name ?? "Unassigned",
              color: s.color,
              value: s.points[hoverIdx]?.value ?? 0,
            }));
            const lineHeight = 14;
            const padX = 10;
            const padY = 8;
            const headerHeight = 16;
            const swatchWidth = 10;
            const showRowNames = rows.length > 1;

            const formatValue = (v: number) => v.toLocaleString("en-IN");

            const rowText = (r: { name: string; value: number }) =>
              showRowNames ? `${r.name}  ${formatValue(r.value)}` : formatValue(r.value);

            const widestChars = Math.max(
              label.length,
              ...rows.map((r) => rowText(r).length),
            );
            const baseWidth = Math.max(80, widestChars * 6.6 + padX * 2);
            const boxWidth = baseWidth + (showRowNames ? swatchWidth + 6 : 0);
            const boxHeight = headerHeight + rows.length * lineHeight + padY * 2;

            let boxX = x + 12;
            if (boxX + boxWidth > width - CHART_PADDING_RIGHT) {
              boxX = x - boxWidth - 12;
            }
            if (boxX < CHART_PADDING_LEFT) boxX = CHART_PADDING_LEFT;
            const boxY = Math.max(
              CHART_PADDING_TOP,
              Math.min(
                CHART_PADDING_TOP + innerHeight - boxHeight,
                CHART_PADDING_TOP + (innerHeight - boxHeight) / 2,
              ),
            );
            return (
              <g pointerEvents="none">
                <line
                  x1={x}
                  x2={x}
                  y1={CHART_PADDING_TOP}
                  y2={baselineY}
                  stroke="#9CA3AF"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxWidth}
                  height={boxHeight}
                  rx={6}
                  ry={6}
                  fill="#111827"
                  opacity={0.96}
                />
                <text
                  x={boxX + padX}
                  y={boxY + padY + 12}
                  fontSize="11"
                  fill="#D1D5DB"
                  fontWeight={500}
                >
                  {label}
                </text>
                {rows.map((r, i) => {
                  const rowY =
                    boxY + padY + headerHeight + lineHeight * (i + 1) - 4;
                  return (
                    <g key={`tt-row-${i}`}>
                      {showRowNames && (
                        <rect
                          x={boxX + padX}
                          y={rowY - 8}
                          width={swatchWidth}
                          height={swatchWidth}
                          rx={2}
                          ry={2}
                          fill={r.color}
                        />
                      )}
                      <text
                        x={
                          boxX +
                          padX +
                          (showRowNames ? swatchWidth + 6 : 0)
                        }
                        y={rowY}
                        fontSize="11"
                        fill="#FFFFFF"
                        fontWeight={500}
                      >
                        {showRowNames
                          ? `${r.name}: ${formatValue(r.value)}`
                          : formatValue(r.value)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

export default LineChart;
