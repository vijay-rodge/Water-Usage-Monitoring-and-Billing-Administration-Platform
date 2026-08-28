import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const WaterUsageChart = ({ data = [], title = "Daily Consumption Trend (Liters)", threshold = 800 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 text-xs font-semibold">
        No consumption telemetry available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0]?.payload || {};
      const liters = point.liters ?? point.consumption ?? 0;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-xl text-xs space-y-1 text-white">
          <div className="font-semibold text-slate-200">{label}</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-slate-400">Consumption:</span>
            <span className="font-bold text-white font-mono">{liters.toLocaleString()} L</span>
          </div>
          {point.isAnomaly && (
            <div className="mt-1 pt-1 border-t border-red-500/30 text-red-400 font-semibold flex items-center space-x-1">
              <span>⚠️ Leak/Anomaly Detected</span>
            </div>
          )}
          {point.anomalyReason && (
            <div className="text-[11px] text-red-300 max-w-xs">{point.anomalyReason}</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <p className="text-xs text-slate-400">Continuous metered telemetry with leak alert thresholds</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-slate-600">Daily Liters</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-1 bg-red-500 border border-red-400"></div>
            <span className="text-red-600 font-mono">Spike Level ({threshold.toLocaleString()} L)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Threshold', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="liters"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorLiters)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy || !payload) return null;
                if (payload.isAnomaly) {
                  return (
                    <circle
                      key={`dot-${payload.date || Math.random()}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  );
                }
                return (
                  <circle
                    key={`dot-${payload.date || Math.random()}`}
                    cx={cx}
                    cy={cy}
                    r={2.5}
                    fill="#2563eb"
                  />
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
