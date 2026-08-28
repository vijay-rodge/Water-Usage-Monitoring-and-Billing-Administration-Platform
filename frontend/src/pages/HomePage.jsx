import React from 'react';
import { 
  Droplets, 
  ShieldCheck, 
  Activity, 
  TrendingDown, 
  Layers, 
  Truck, 
  AlertTriangle, 
  FileSpreadsheet, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Database,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage = ({ onOpenCalculator }) => {
  const { loginAsResident, loginAsAdmin, setActiveTab } = useAuth();

  return (
    <div className="space-y-16 py-6 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Water Resource Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Smart Water Usage Monitoring & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tiered Billing Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Eliminate water wastage in apartment communities through sub-meter telemetry, progressive tiered tariff billing, proportional tanker cost apportionment, and automated leak detection algorithms.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => loginAsResident()}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition group"
            >
              <span>Launch Resident Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => loginAsAdmin()}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Society Admin Portal</span>
            </button>

            <button
              onClick={onOpenCalculator}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Interactive Slab Simulator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Metrics / Highlights */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-3xl font-extrabold font-mono text-cyan-400">32%</div>
          <div className="text-xs font-semibold text-slate-200 mt-1">Average Water Savings</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Achieved through tiered penalty pricing & fast leak alerts</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-3xl font-extrabold font-mono text-blue-400">100%</div>
          <div className="text-xs font-semibold text-slate-200 mt-1">Fair Cost Distribution</div>
          <p className="text-[11px] text-slate-400 mt-0.5">No flat-rate unfair billing; pay only for what you consume</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-3xl font-extrabold font-mono text-emerald-400">&lt; 15 min</div>
          <div className="text-xs font-semibold text-slate-200 mt-1">Leak Spike Detection</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Algorithm flags abnormal continuous night flows instantly</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-3xl font-extrabold font-mono text-indigo-400">4-Tier</div>
          <div className="text-xs font-semibold text-slate-200 mt-1">Progressive Tariff Engine</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Configurable slabs with statutory STP and bulk pass-through</p>
        </div>
      </section>

      {/* Core Engineering Modules Overview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complete Enterprise Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered with Spring Boot 3.3, Java 21, PostgreSQL & Flyway migrations, and React 19.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Tiered Consumption Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dynamically chunks household water use into essential, standard, high, and penalty slabs with automated sewage/STP surcharges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-blue-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Bulk Water Apportionment</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tracks external tanker deliveries and apportion shared common area costs (swimming pool, garden, club) based on exact flat sq.ft.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Leak & Spike Anomaly Radar</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Statistical baseline algorithms automatically detect night-time trickles, burst pipes, and meter rollback tampering.
            </p>
          </div>
        </div>
      </section>

      {/* Database & Schema Section */}
      <section className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Relational PostgreSQL Schema</h3>
              <p className="text-xs text-slate-400">10 Normalized Tables with Foreign Keys, Constraints, and Flyway Versioning</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            PostgreSQL & H2 Dual-Dialect
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">apartments</div>
            <div className="text-[11px] text-slate-500 mt-1">48 Flats, Sqft</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">households</div>
            <div className="text-[11px] text-slate-500 mt-1">Meters, Occupancy</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">tariff_plans</div>
            <div className="text-[11px] text-slate-500 mt-1">Base & Levies</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">tariff_tiers</div>
            <div className="text-[11px] text-slate-500 mt-1">4 Progressive Tiers</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">meter_readings</div>
            <div className="text-[11px] text-slate-500 mt-1">IoT / CSV telemetry</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">bulk_purchases</div>
            <div className="text-[11px] text-slate-500 mt-1">Tanker Logistics</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">billing_cycles</div>
            <div className="text-[11px] text-slate-500 mt-1">Monthly Finalization</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">invoices</div>
            <div className="text-[11px] text-slate-500 mt-1">Itemized Bills</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">alerts</div>
            <div className="text-[11px] text-slate-500 mt-1">Anomalies & Leaks</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-cyan-400 font-bold">users</div>
            <div className="text-[11px] text-slate-500 mt-1">RBAC Security</div>
          </div>
        </div>
      </section>
    </div>
  );
};

