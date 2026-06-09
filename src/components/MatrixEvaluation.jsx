import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, MessageSquare, X } from 'lucide-react';
import { CAREER_MATRIX, EVALUATION_LABELS, EVALUATION_PERCENT } from '../data/careerMatrix.js';
import { getLevelProgress, getSectionProgress } from '../utils/calculations.js';

function AutoResizeTextarea({ value, onChange, placeholder, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={2}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

const STATUS_OPTIONS = ['not_evaluated', 'not_meets', 'partially_meets', 'fully_meets'];

const STATUS_STYLES = {
  not_evaluated: { btn: 'border-slate-200 text-slate-500 bg-white hover:border-slate-300', active: 'border-slate-400 bg-slate-100 text-slate-700', dot: 'bg-slate-400', bar: 'bg-slate-300' },
  not_meets: { btn: 'border-red-200 text-red-400 bg-white hover:border-red-300', active: 'border-red-400 bg-red-50 text-red-700', dot: 'bg-red-400', bar: 'bg-red-400' },
  partially_meets: { btn: 'border-amber-200 text-amber-500 bg-white hover:border-amber-300', active: 'border-amber-400 bg-amber-50 text-amber-700', dot: 'bg-amber-400', bar: 'bg-amber-400' },
  fully_meets: { btn: 'border-emerald-200 text-emerald-500 bg-white hover:border-emerald-300', active: 'border-emerald-400 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
};

const SECTION_COLORS = {
  needs: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  expected: 'text-violet-600 bg-violet-50 border-violet-100',
  differential: 'text-amber-700 bg-amber-50 border-amber-100',
  indicators: 'text-slate-600 bg-slate-50 border-slate-200',
  criteria: 'text-indigo-600 bg-indigo-50 border-indigo-100',
};

function ProgressRing({ value, size = 40 }) {
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 100 ? '#10b981' : value >= 50 ? '#f59e0b' : value > 0 ? '#6366f1' : '#e2e8f0';
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function CriterionRow({ criterion, evaluation, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const status = evaluation?.status || 'not_evaluated';
  const pct = EVALUATION_PERCENT[status];
  const styles = STATUS_STYLES[status];

  const hasNote = evaluation?.comment || evaluation?.evidence || evaluation?.observation;

  return (
    <div className="border border-slate-100 rounded-lg bg-white hover:border-slate-200 transition-colors">
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-700 leading-snug">{criterion.text}</p>
              {pct !== null && (
                <span className="text-xs font-semibold text-slate-400 flex-shrink-0">{pct}%</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate({ status: s })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100 ${
                    status === s ? STATUS_STYLES[s].active : STATUS_STYLES[s].btn
                  }`}
                >
                  {EVALUATION_LABELS[s]}
                </button>
              ))}
              <button
                onClick={() => setExpanded(e => !e)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100 flex items-center gap-1 ${
                  hasNote
                    ? 'border-indigo-200 text-indigo-600 bg-indigo-50'
                    : 'border-slate-200 text-slate-400 bg-white hover:border-slate-300'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                {hasNote ? 'Ver notas' : 'Anotar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-3 space-y-2 bg-slate-50/50">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Observação</label>
            <AutoResizeTextarea
              value={evaluation?.observation || ''}
              onChange={e => onUpdate({ observation: e.target.value })}
              placeholder="Observação..."
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-2 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none resize-none placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionBlock({ section, levelId, area, evaluations, dispatch }) {
  const [open, setOpen] = useState(true);
  const progress = getSectionProgress(area, levelId, section.id, evaluations);
  const colorClass = SECTION_COLORS[section.id] || SECTION_COLORS.criteria;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${colorClass}`}>
            {section.name}
          </span>
          <span className="text-xs text-slate-400">{section.criteria.length} critérios</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#6366f1',
              }}
            />
          </div>
          <span className="text-xs text-slate-400 w-8 text-right">{progress}%</span>
          {open ? (
            <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
          )}
        </div>
      </button>

      {open && (
        <div className="mt-2 space-y-1.5 pl-1">
          {section.criteria.map(criterion => (
            <CriterionRow
              key={criterion.id}
              criterion={criterion}
              evaluation={evaluations[criterion.id]}
              onUpdate={(payload) =>
                dispatch({
                  type: 'SET_EVALUATION',
                  criterionId: criterion.id,
                  payload,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LevelCard({ level, area, evaluations, dispatch, targetLevelName }) {
  const levels = area === 'technical'
    ? ['Funcional', 'Operacional', 'Autônomo', 'Estratégico']
    : ['Executor', 'Responsável Operacional', 'Gestão de Projetos', 'Referência Estratégica'];
  const targetIdx = levels.indexOf(targetLevelName);
  const isTarget = level.name === targetLevelName;
  const isAboveTarget = targetIdx >= 0 && levels.indexOf(level.name) > targetIdx;

  const [open, setOpen] = useState(() => !isAboveTarget);
  const progress = getLevelProgress(area, level.level, evaluations);

  const LEVEL_COLORS = {
    1: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600', ring: '#94a3b8' },
    2: { bg: 'bg-blue-50/30', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700', ring: '#3b82f6' },
    3: { bg: 'bg-violet-50/30', border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700', ring: '#8b5cf6' },
    4: { bg: 'bg-amber-50/30', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700', ring: '#f59e0b' },
  };
  const lc = LEVEL_COLORS[level.level] || LEVEL_COLORS[1];

  return (
    <div className={`rounded-xl border ${lc.border} ${lc.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <ProgressRing value={progress} />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">{level.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lc.badge}`}>
                Nível {level.level}
              </span>
              {isTarget && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                  Objetivo
                </span>
              )}
              {isAboveTarget && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                  Além do objetivo
                </span>
              )}
            </div>
            {level.note && (
              <p className="text-xs text-slate-400 mt-0.5">{level.note}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-600">{progress}%</div>
            <div className="text-xs text-slate-400">concluído</div>
          </div>
          {open ? (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100/80">
          {level.sections.map(section => (
            <SectionBlock
              key={section.id}
              section={section}
              levelId={level.level}
              area={area}
              evaluations={evaluations}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatrixEvaluation({ area, state, dispatch }) {
  const { evaluations, objectives } = state;
  const levels = CAREER_MATRIX[area];
  const targetLevel = area === 'technical' ? objectives.technicalLevel : objectives.responsibilityLevel;

  const labels = {
    technical: { title: 'Capacidade Técnica', subtitle: 'Avalie cada critério da matriz de capacidade técnica' },
    responsibility: { title: 'Responsabilidade Interna', subtitle: 'Avalie cada critério da matriz de responsabilidade' },
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{labels[area].title}</h2>
        <p className="text-sm text-slate-500 mt-1">{labels[area].subtitle}</p>
        {targetLevel && (
          <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-500">Objetivo:</span>
            <span className="text-sm font-semibold text-indigo-700">{targetLevel}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {levels.map(level => (
          <LevelCard
            key={level.level}
            level={level}
            area={area}
            evaluations={evaluations}
            dispatch={dispatch}
            targetLevelName={targetLevel}
          />
        ))}
      </div>
    </div>
  );
}
