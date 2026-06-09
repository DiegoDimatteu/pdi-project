import {
  LayoutDashboard, Code2, Users, Target, MessageSquare,
  Download, Upload, TrendingUp, LogOut, FileText, Menu,
} from 'lucide-react';
import { useState } from 'react';
import { downloadJSON } from '../utils/jsonUtils.js';
import { generateAndDownloadPDF } from '../utils/pdfUtils.js';
import { getOverallProgress, getAreaProgress } from '../utils/calculations.js';
import Dashboard from './Dashboard.jsx';
import MatrixEvaluation from './MatrixEvaluation.jsx';
import GapsPDI from './GapsPDI.jsx';
import Feedbacks from './Feedbacks.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Visão Geral', Icon: LayoutDashboard },
  { id: 'technical', label: 'Capacidade Técnica', Icon: Code2 },
  { id: 'responsibility', label: 'Responsabilidade', Icon: Users },
  { id: 'gaps', label: 'Gaps & PDI', Icon: Target },
  { id: 'feedbacks', label: 'Feedbacks', Icon: MessageSquare },
];

function ProgressCircle({ value, size = 44, stroke = 4, color = '#6366f1' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

export default function Layout({ state, dispatch, onImport }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const overall = getOverallProgress(state.evaluations);
  const techPct = getAreaProgress('technical', state.evaluations);
  const respPct = getAreaProgress('responsibility', state.evaluations);

  function setSection(id) {
    dispatch({ type: 'SET_SECTION', payload: id });
    setSidebarOpen(false);
  }

  function renderContent() {
    switch (state.section) {
      case 'dashboard':
        return <Dashboard state={state} dispatch={dispatch} />;
      case 'technical':
        return <MatrixEvaluation area="technical" state={state} dispatch={dispatch} />;
      case 'responsibility':
        return <MatrixEvaluation area="responsibility" state={state} dispatch={dispatch} />;
      case 'gaps':
        return <GapsPDI state={state} dispatch={dispatch} />;
      case 'feedbacks':
        return <Feedbacks state={state} dispatch={dispatch} />;
      default:
        return <Dashboard state={state} dispatch={dispatch} />;
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-60 bg-slate-900 flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">PDI Manager</span>
          </div>
        </div>

        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <ProgressCircle value={overall} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {overall}%
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm truncate">{state.employee.name || 'Colaborador'}</div>
              <div className="text-slate-400 text-xs truncate">{state.employee.role || '—'}</div>
              {state.employee.squad && (
                <div className="text-slate-500 text-xs truncate">{state.employee.squad}</div>
              )}
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Técnica</span>
              <span className="text-slate-300 font-medium">{techPct}%</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${techPct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Responsabilidade</span>
              <span className="text-slate-300 font-medium">{respPct}%</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${respPct}%` }} />
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
                state.section === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={() => downloadJSON(state)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar JSON
          </button>
          <button
            onClick={onImport}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
          >
            <Upload className="w-4 h-4" />
            Importar JSON
          </button>
          <button
            onClick={() => generateAndDownloadPDF(state)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-all"
          >
            <FileText className="w-4 h-4" />
            Baixar Relatório PDF
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-800 text-sm">
            {NAV_ITEMS.find(n => n.id === state.section)?.label}
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
