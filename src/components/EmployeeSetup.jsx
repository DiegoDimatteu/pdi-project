import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, TrendingUp, User, Target } from 'lucide-react';

const TECHNICAL_LEVELS = ['Funcional', 'Operacional', 'Autônomo', 'Estratégico'];
const RESPONSIBILITY_LEVELS = ['Executor', 'Responsável Operacional', 'Gestão de Projetos', 'Referência Estratégica'];

const LEVEL_DESCRIPTIONS = {
  Funcional: 'Iniciante — executa tarefas pequenas com acompanhamento',
  Operacional: 'Intermediário — resolve bugs e features com baixa supervisão',
  Autônomo: 'Sênior — atua em cenários complexos com pouca supervisão',
  Estratégico: 'Referência — lidera projetos críticos e define padrões técnicos',
  Executor: 'Executa tarefas bem definidas com supervisão frequente',
  'Responsável Operacional': 'Conduz pequenas entregas com baixa supervisão',
  'Gestão de Projetos': 'Responsabilidade ponta a ponta por projetos médios e grandes',
  'Referência Estratégica': 'Resolve problemas complexos e influencia o time',
};

function Field({ label, id, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 transition-all placeholder:text-slate-400"
      />
    </div>
  );
}

function LevelCard({ level, selected, onClick, description }) {
  return (
    <button
      type="button"
      onClick={() => onClick(level)}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 ${
        selected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`font-semibold text-sm ${selected ? 'text-indigo-700' : 'text-slate-800'}`}>
            {level}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
        }`}>
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    </button>
  );
}

export default function EmployeeSetup({ onBack, onStart }) {
  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState({
    name: '', email: '', role: '', seniority: '', squad: '', manager: '',
  });
  const [objectives, setObjectives] = useState({
    technicalLevel: '', responsibilityLevel: '',
  });

  const setEmp = (field) => (value) => setEmployee(p => ({ ...p, [field]: value }));

  const canGoStep2 = employee.name.trim() && employee.role.trim();
  const canStart = objectives.technicalLevel && objectives.responsibilityLevel;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-800">PDI Manager</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s
                    ? 'bg-emerald-500 text-white'
                    : step === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm font-medium ${step >= s ? 'text-slate-800' : 'text-slate-400'}`}>
                  {s === 1 ? 'Dados do colaborador' : 'Objetivos de evolução'}
                </span>
                {s < 2 && <div className="w-8 h-px bg-slate-300" />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {step === 1 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Dados do Colaborador</h2>
                    <p className="text-sm text-slate-500">Preencha as informações básicas</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Nome" id="name" value={employee.name} onChange={setEmp('name')} placeholder="Ex: João Silva" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="E-mail" id="email" type="email" value={employee.email} onChange={setEmp('email')} placeholder="joao@empresa.com" />
                  </div>
                  <Field label="Cargo" id="role" value={employee.role} onChange={setEmp('role')} placeholder="Ex: Engenheiro de Software" required />
                  <Field label="Senioridade Atual" id="seniority" value={employee.seniority} onChange={setEmp('seniority')} placeholder="Ex: Pleno" />
                  <Field label="Squad" id="squad" value={employee.squad} onChange={setEmp('squad')} placeholder="Ex: Pagamentos" />
                  <Field label="Gestor" id="manager" value={employee.manager} onChange={setEmp('manager')} placeholder="Ex: Maria Santos" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Objetivos de Evolução</h2>
                    <p className="text-sm text-slate-500">Defina os níveis desejados para {employee.name.split(' ')[0]}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Capacidade Técnica Desejada</h3>
                    <div className="space-y-2">
                      {TECHNICAL_LEVELS.map(level => (
                        <LevelCard
                          key={level}
                          level={level}
                          selected={objectives.technicalLevel === level}
                          onClick={l => setObjectives(p => ({ ...p, technicalLevel: l }))}
                          description={LEVEL_DESCRIPTIONS[level]}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Responsabilidade Interna Desejada</h3>
                    <div className="space-y-2">
                      {RESPONSIBILITY_LEVELS.map(level => (
                        <LevelCard
                          key={level}
                          level={level}
                          selected={objectives.responsibilityLevel === level}
                          onClick={l => setObjectives(p => ({ ...p, responsibilityLevel: l }))}
                          description={LEVEL_DESCRIPTIONS[level]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {step === 1 ? (
                <button
                  onClick={onBack}
                  className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
              ) : (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  disabled={!canGoStep2}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onStart(employee, objectives)}
                  disabled={!canStart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Criar PDI <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
