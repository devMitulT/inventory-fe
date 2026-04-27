interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  points: DataPoint[];
}

const CHART_HEIGHT = 280;
const CHART_PADDING_X = 48;
const CHART_PADDING_TOP = 20;
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

const LineChart = ({ title, points }: LineChartProps) => {
  const maxValue = Math.max(...points.map((p) => p.value), 0);
  const yMax = niceCeil(maxValue);
  const yTicks = Array.from(
    { length: Y_TICKS },
    (_, i) => (yMax * (Y_TICKS - 1 - i)) / (Y_TICKS - 1),
  );

  const width = 720;
  const innerWidth = width - CHART_PADDING_X - 16;
  const innerHeight =
    CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

  const xFor = (idx: number) => {
    if (points.length <= 1) {
      return CHART_PADDING_X + innerWidth * 0.85;
    }
    return CHART_PADDING_X + (innerWidth * idx) / (points.length - 1);
  };

  const yFor = (val: number) => {
    if (yMax === 0) return CHART_PADDING_TOP + innerHeight;
    return (
      CHART_PADDING_TOP + innerHeight - (val / yMax) * innerHeight
    );
  };

  const linePath = points
    .map((p, idx) => {
      const x = xFor(idx);
      const y = yFor(p.value);
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const visibleLabels = (() => {
    if (points.length <= 7) return points.map((_, i) => i);
    const step = Math.ceil(points.length / 6);
    return points
      .map((_, i) => i)
      .filter((i) => i % step === 0 || i === points.length - 1);
  })();

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-[#000000]">{title}</h3>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          width="100%"
          height={CHART_HEIGHT}
          className="block"
        >
          {yTicks.map((tickVal, i) => {
            const y =
              CHART_PADDING_TOP +
              (innerHeight * i) / (Y_TICKS - 1);
            return (
              <g key={`y-${i}`}>
                <text
                  x={CHART_PADDING_X - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#9CA3AF"
                >
                  {Number.isInteger(tickVal)
                    ? tickVal
                    : tickVal.toFixed(0)}
                </text>
                <line
                  x1={CHART_PADDING_X}
                  x2={width - 16}
                  y1={y}
                  y2={y}
                  stroke="#F1F1F1"
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="#000000"
              strokeWidth={1.5}
            />
          )}

          {points.map((p, idx) => (
            <circle
              key={`pt-${idx}`}
              cx={xFor(idx)}
              cy={yFor(p.value)}
              r={3.5}
              fill="#000000"
            />
          ))}

          {points.map((p, idx) =>
            visibleLabels.includes(idx) ? (
              <text
                key={`x-${idx}`}
                x={xFor(idx)}
                y={CHART_HEIGHT - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#9CA3AF"
              >
                {p.label}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
};

export default LineChart;
