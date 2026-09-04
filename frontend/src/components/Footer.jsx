import React from 'react';
import { Droplets, Shield, Award, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center p-1.5 text-white">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M18 4C18 4 9 15 9 21.5C9 26.5 13 30.5 18 30.5C23 30.5 27 26.5 27 21.5C27 15 18 4 18 4Z" fill="#FFFFFF" fillOpacity="0.3"/>
                  <path d="M18 7C18 7 11 16 11 21.5C11 25.4 14.1 28.5 18 28.5C21.9 28.5 25 25.4 25 21.5C25 16 18 7 18 7Z" fill="#FFFFFF"/>
                  <path d="M14 20.5C15.2 19.3 16.5 19 18 20.5C19.5 22 20.8 21.7 22 20.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-extrabold text-white tracking-tight">Aqua<span className="text-cyan-400">Flow</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Development of a Smart Water Usage Monitoring and Automated Tiered Billing Management Platform for modern apartment communities.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-cyan-400 cursor-pointer">Tiered Tariff Engine</li>
              <li className="hover:text-cyan-400 cursor-pointer">Common Area Apportionment</li>
              <li className="hover:text-cyan-400 cursor-pointer">IoT & CSV Meter Reading Pipeline</li>
              <li className="hover:text-cyan-400 cursor-pointer">Automated Anomaly & Leak Alerts</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>Java 21 / 23 & Spring Boot 3.3</li>
              <li>PostgreSQL 16 & H2 In-Memory</li>
              <li>React 19 & Vite & Tailwind CSS</li>
              <li>Recharts & Lucide React Icons</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Project Metadata</h4>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs space-y-1 text-slate-400 font-mono">
              <div className="text-cyan-400 font-bold">Infosys Springboard Major Project</div>
              <div>Author: Pair Programmer</div>
              <div>Database: PostgreSQL & H2</div>
              <div>Status: Verified & Live Ready</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 AquaFlow Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Grade Security</span>
            </span>
            <span className="flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Stack Java + React</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

