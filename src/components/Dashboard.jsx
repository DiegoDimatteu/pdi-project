import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Check, X, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import {
  getAreaProgress, getOverallProgress, getLevelProgress,
  suggestCurrentLevel, getGaps, getEvaluationSummary,
} from '../utils/calculations.js';
import { TECHNICAL_LEVELS, RESPONSIBILITY_LEVELS, ACTION_STATUS_LABELS } from '../data/careerMatrix.js';

function StatCard({ label, value, subtitle, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    violet: 'from-violet-500 to-violet-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="text-sm text-slate-500 font-medium mb-3">{label}</div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
}

function ProgressBar({ value, color = 'bg-indigo-500', height = 'h-2' }) {
  return (
    <div className={`${height} bg-slate-100 rounded-full overflow-hidden`}>
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function LevelOverrideSelect({ label, current, levels, onChange }) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(current || '');

  function save() {
    onChange(selected);
    setEditing(false);
  }
  function cancel() {
    setSelected(current || '');
    setEditing(false);
  }

  return (
    <div>
      <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
      {editing ? (
        <div className="flex items-center gap-2">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:border-indigo-400 outline-none"
          >
            {levels.map(l => (
              <option key={l.name} value={l.name}>{l.name}</option>
            ))}
          </select>
          <button onClick={save} className="p-1 text-emerald-600 hover:text-emerald-700">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={cancel} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">{current}</span>
          <button
            onClick={() => { setSelected(current || ''); setEditing(true); }}
            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Sobrescrever manualmente"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function LevelBadge({ level }) {
  const colors = {
    1: 'bg-slate-100 text-slate-600',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-violet-100 text-violet-700',
    4: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[level] || colors[1]}`}>
      Nível {level}
    </span>
  );
}

export default function Dashboard({ state, dispatch }) {
  const { employee, objectives, evaluations, levelOverrides, actions, feedbacks } = state;
  const techPct = getAreaProgress('technical', evaluations);
  const respPct = getAreaProgress('responsibility', evaluations);
  const overall = getOverallProgress(evaluations);
  const summary = getEvaluationSummary(evaluations);

  const techSuggested = suggestCurrentLevel('technical', evaluations);
  const respSuggested = suggestCurrentLevel('responsibility', evaluations);

  const currentTech = levelOverrides.technical || techSuggested;
  const currentResp = levelOverrides.responsibility || respSuggested;

  const techGaps = getGaps('technical', objectives.technicalLevel, evaluations);
  const respGaps = getGaps('responsibility', objectives.responsibilityLevel, evaluations);
  const totalGaps = techGaps.length + respGaps.length;

  const actionsByStatus = actions.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  function setLevelOverride(area, value) {
    dispatch({ type: 'SET_LEVEL_OVERRIDE', area, value });
  }

  const techLevels = TECHNICAL_LEVELS.map((l, i) => ({
    ...l,
    progress: getLevelProgress('technical', i + 1, evaluations),
  }));
  const respLevels = RESPONSIBILITY_LEVELS.map((l, i) => ({
    ...l,
    progress: getLevelProgress('responsibility', i + 1, evaluations),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{employee.name}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {employee.role && <span className="text-slate-500 text-sm">{employee.role}</span>}
          {employee.squad && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 text-sm">{employee.squad}</span>
            </>
          )}
          {employee.manager && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 text-sm">Gestor: {employee.manager}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Evolução Geral" value={`${overall}%`} color="indigo" />
        <StatCard label="Técnica" value={`${techPct}%`} color="violet" />
        <StatCard label="Responsabilidade" value={`${respPct}%`} color="emerald" />
        <StatCard label="Gaps Identificados" value={totalGaps} subtitle="critérios pendentes" color="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Capacidade Técnica
          </h3>
          <div className="flex items-start justify-between mb-4">
            <LevelOverrideSelect
              label="Nível Atual (sugerido)"
              current={currentTech}
              levels={TECHNICAL_LEVELS}
              onChange={v => setLevelOverride('technical', v)}
            />
            <div className="text-right">
              <div className="text-xs text-slate-400">Objetivo</div>
              <div className="text-sm font-semibold text-indigo-600">{objectives.technicalLevel || '—'}</div>
            </div>
          </div>
          <div className="space-y-3">
            {techLevels.map(l => (
              <div key={l.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{l.name}</span>
                  <span className="text-slate-400">{l.progress}%</span>
                </div>
                <ProgressBar value={l.progress} color="bg-indigo-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Responsabilidade Interna
          </h3>
          <div className="flex items-start justify-between mb-4">
            <LevelOverrideSelect
              label="Nível Atual (sugerido)"
              current={currentResp}
              levels={RESPONSIBILITY_LEVELS}
              onChange={v => setLevelOverride('responsibility', v)}
            />
            <div className="text-right">
              <div className="text-xs text-slate-400">Objetivo</div>
              <div className="text-sm font-semibold text-violet-600">{objectives.responsibilityLevel || '—'}</div>
            </div>
          </div>
          <div className="space-y-3">
            {respLevels.map(l => (
              <div key={l.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{l.name}</span>
                  <span className="text-slate-400">{l.progress}%</span>
                </div>
                <ProgressBar value={l.progress} color="bg-violet-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Distribuição das Avaliações</h3>
          <div className="space-y-3">
            {[
              { key: 'fully_meets', label: 'Atende Completamente', color: 'bg-emerald-500', text: 'text-emerald-700' },
              { key: 'partially_meets', label: 'Atende Parcialmente', color: 'bg-amber-400', text: 'text-amber-700' },
              { key: 'not_meets', label: 'Não Atende', color: 'bg-red-400', text: 'text-red-700' },
              { key: 'not_evaluated', label: 'Não Avaliado', color: 'bg-slate-300', text: 'text-slate-600' },
            ].map(({ key, label, color, text }) => {
              const count = summary[key] || 0;
              const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-medium ${text}`}>{label}</span>
                    <span className="text-slate-500">{count} de {summary.total} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Plano de Desenvolvimento</h3>
          {actions.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm">Nenhuma ação criada ainda.</p>
              <p className="text-slate-400 text-xs mt-1">Acesse a aba Gaps & PDI para criar ações.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[
                { key: 'em_andamento', label: 'Em andamento', Icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
                { key: 'nao_iniciado', label: 'Não iniciado', Icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
                { key: 'concluido', label: 'Concluído', Icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
                { key: 'cancelado', label: 'Cancelado', Icon: X, color: 'text-slate-500 bg-slate-100' },
              ].filter(({ key }) => actionsByStatus[key] > 0).map(({ key, label, Icon, color }) => (
                <div key={key} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${color.split(' ')[1]}`}>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${color.split(' ')[0]}`} />
                    <span className={`text-sm font-medium ${color.split(' ')[0]}`}>{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color.split(' ')[0]}`}>{actionsByStatus[key]}</span>
                </div>
              ))}
              <div className="pt-1 text-xs text-slate-400 text-center">{actions.length} ação(ões) no total</div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
