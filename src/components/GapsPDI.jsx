import { useState } from 'react';
import {
  Plus, ChevronDown, ChevronRight, Trash2, Edit2, Check, X,
  AlertCircle, Target, Code2, Users, Calendar, Clock,
} from 'lucide-react';
import { getGapsByLevel } from '../utils/calculations.js';
import { ACTION_STATUS_LABELS, EVALUATION_LABELS } from '../data/careerMatrix.js';

const STATUS_OPTIONS = [
  { value: 'nao_iniciado', label: 'Não iniciado', color: 'bg-slate-100 text-slate-600' },
  { value: 'em_andamento', label: 'Em andamento', color: 'bg-blue-100 text-blue-700' },
  { value: 'concluido', label: 'Concluído', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-600' },
];

const EVAL_COLORS = {
  not_evaluated: 'bg-slate-100 text-slate-500',
  not_meets: 'bg-red-100 text-red-600',
  partially_meets: 'bg-amber-100 text-amber-700',
};

function ActionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', status: 'nao_iniciado', deadline: '', observations: '',
  });
  const set = (f) => (v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div>
        <label className="text-xs font-medium text-slate-600 block mb-1">Título *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => set('title')(e.target.value)}
          placeholder="Descreva a ação de desenvolvimento"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none bg-white"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600 block mb-1">Descrição</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={e => set('description')(e.target.value)}
          placeholder="Detalhes sobre como executar esta ação..."
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none bg-white resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Status</label>
          <select
            value={form.status}
            onChange={e => set('status')(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 outline-none bg-white"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Prazo</label>
          <input
            type="date"
            value={form.deadline}
            onChange={e => set('deadline')(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 outline-none bg-white"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600 block mb-1">Observações</label>
        <textarea
          rows={2}
          value={form.observations}
          onChange={e => set('observations')(e.target.value)}
          placeholder="Links, referências, contexto adicional..."
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none bg-white resize-none"
        />
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => form.title.trim() && onSave(form)}
          disabled={!form.title.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Check className="w-3.5 h-3.5" /> Salvar
        </button>
      </div>
    </div>
  );
}

function ActionCard({ action, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const statusOpt = STATUS_OPTIONS.find(s => s.value === action.status) || STATUS_OPTIONS[0];

  if (editing) {
    return (
      <ActionForm
        initial={action}
        onSave={(form) => { onUpdate(form); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-slate-800">{action.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusOpt.color}`}>
              {statusOpt.label}
            </span>
          </div>
          {action.description && (
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{action.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {action.deadline && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {new Date(action.deadline + 'T12:00:00').toLocaleDateString('pt-BR')}
              </div>
            )}
            {action.observations && (
              <div className="text-xs text-slate-400 truncate max-w-xs">{action.observations}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GapItem({ gap, actions, dispatch }) {
  const [addingAction, setAddingAction] = useState(false);
  const gapActions = actions.filter(a => a.gapCriterionId === gap.id);
  const evalStatus = gap.evalStatus || 'not_evaluated';
  const evalColor = EVAL_COLORS[evalStatus] || EVAL_COLORS.not_evaluated;

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800">{gap.text}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-400">{gap.sectionName}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${evalColor}`}>
                  {EVALUATION_LABELS[evalStatus]}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setAddingAction(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-xs font-medium hover:bg-indigo-50 transition-colors flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Ação
          </button>
        </div>
      </div>

      {(gapActions.length > 0 || addingAction) && (
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 space-y-2">
          {gapActions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              onUpdate={payload => dispatch({ type: 'UPDATE_ACTION', id: action.id, payload })}
              onDelete={() => dispatch({ type: 'DELETE_ACTION', id: action.id })}
            />
          ))}
          {addingAction && (
            <ActionForm
              onSave={(form) => {
                dispatch({
                  type: 'ADD_ACTION',
                  payload: {
                    ...form,
                    gapCriterionId: gap.id,
                    gapCriterionText: gap.text,
                    gapCriterionArea: gap.area,
                  },
                });
                setAddingAction(false);
              }}
              onCancel={() => setAddingAction(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function GapGroup({ group, area, evaluations, actions, dispatch }) {
  const [open, setOpen] = useState(true);
  const LEVEL_COLORS = {
    1: 'bg-slate-100 text-slate-600 border-slate-200',
    2: 'bg-blue-100 text-blue-700 border-blue-200',
    3: 'bg-violet-100 text-violet-700 border-violet-200',
    4: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  const lc = LEVEL_COLORS[group.level] || LEVEL_COLORS[1];

  const gapsWithStatus = group.gaps.map(g => ({
    ...g,
    evalStatus: evaluations[g.id]?.status || 'not_evaluated',
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${lc}`}>
            Nível {group.level} — {group.levelName}
          </span>
          <span className="text-sm text-slate-500">{group.gaps.length} gap(s)</span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-2">
          {gapsWithStatus.map(gap => (
            <GapItem
              key={gap.id}
              gap={gap}
              actions={actions}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FreeActionSection({ actions, dispatch }) {
  const [adding, setAdding] = useState(false);
  const freeActions = actions.filter(a => !a.gapCriterionId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Ações Gerais</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ações de desenvolvimento não vinculadas a um gap específico</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Nova Ação
        </button>
      </div>
      <div className="px-5 py-4 space-y-2">
        {freeActions.map(action => (
          <ActionCard
            key={action.id}
            action={action}
            onUpdate={payload => dispatch({ type: 'UPDATE_ACTION', id: action.id, payload })}
            onDelete={() => dispatch({ type: 'DELETE_ACTION', id: action.id })}
          />
        ))}
        {adding && (
          <ActionForm
            onSave={(form) => {
              dispatch({ type: 'ADD_ACTION', payload: form });
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}
        {freeActions.length === 0 && !adding && (
          <p className="text-sm text-slate-400 py-2 text-center">
            Nenhuma ação geral criada ainda.
          </p>
        )}
      </div>
    </div>
  );
}

export default function GapsPDI({ state, dispatch }) {
  const { objectives, evaluations, actions } = state;
  const techGroups = getGapsByLevel('technical', objectives.technicalLevel, evaluations);
  const respGroups = getGapsByLevel('responsibility', objectives.responsibilityLevel, evaluations);

  const totalTech = techGroups.reduce((s, g) => s + g.gaps.length, 0);
  const totalResp = respGroups.reduce((s, g) => s + g.gaps.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Gaps & Plano de Desenvolvimento</h2>
        <p className="text-sm text-slate-500 mt-1">
          Critérios pendentes em relação ao objetivo. Crie ações de desenvolvimento para cada gap.
        </p>
      </div>

      {(!objectives.technicalLevel && !objectives.responsibilityLevel) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Objetivos não definidos</p>
            <p className="text-xs text-amber-600 mt-1">
              Os gaps são calculados com base nos objetivos de evolução. Defina os níveis desejados nas configurações do PDI.
            </p>
          </div>
        </div>
      )}

      {totalTech > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Gaps Técnicos</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              {totalTech} critérios
            </span>
            {objectives.technicalLevel && (
              <span className="text-xs text-slate-400">até {objectives.technicalLevel}</span>
            )}
          </div>
          <div className="space-y-3">
            {techGroups.map(group => (
              <GapGroup
                key={`tech-${group.level}`}
                group={group}
                area="technical"
                evaluations={evaluations}
                actions={actions}
                dispatch={dispatch}
              />
            ))}
          </div>
        </div>
      )}

      {totalTech === 0 && objectives.technicalLevel && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Sem gaps técnicos!</p>
            <p className="text-xs text-emerald-600 mt-0.5">Todos os critérios até {objectives.technicalLevel} foram atendidos.</p>
          </div>
        </div>
      )}

      {totalResp > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-violet-600" />
            <h3 className="font-semibold text-slate-800">Gaps de Responsabilidade</h3>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
              {totalResp} critérios
            </span>
            {objectives.responsibilityLevel && (
              <span className="text-xs text-slate-400">até {objectives.responsibilityLevel}</span>
            )}
          </div>
          <div className="space-y-3">
            {respGroups.map(group => (
              <GapGroup
                key={`resp-${group.level}`}
                group={group}
                area="responsibility"
                evaluations={evaluations}
                actions={actions}
                dispatch={dispatch}
              />
            ))}
          </div>
        </div>
      )}

      {totalResp === 0 && objectives.responsibilityLevel && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Sem gaps de responsabilidade!</p>
            <p className="text-xs text-emerald-600 mt-0.5">Todos os critérios até {objectives.responsibilityLevel} foram atendidos.</p>
          </div>
        </div>
      )}

      <FreeActionSection actions={actions} dispatch={dispatch} />
    </div>
  );
}
