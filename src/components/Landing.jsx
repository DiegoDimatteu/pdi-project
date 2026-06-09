import { Upload, Plus, TrendingUp, Target, BarChart3, FileText } from 'lucide-react';

export default function Landing({ onNew, onImport }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 flex flex-col">
      <header className="px-8 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">PDI Manager</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
            <Target className="w-3.5 h-3.5" />
            Plano de Desenvolvimento Individual
          </div>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight">
            Acompanhe a evolução<br />
            <span className="text-indigo-400">de carreira</span> com precisão
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Avalie critérios, identifique gaps, crie planos de ação e acompanhe
            o progresso de um colaborador com base em uma matriz estruturada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          <button
            onClick={onNew}
            className="group relative bg-indigo-600 hover:bg-indigo-500 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 border border-indigo-500"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Novo PDI</h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Crie uma avaliação do zero. Cadastre o colaborador, defina os objetivos e comece a avaliar.
            </p>
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span className="text-white text-lg">→</span>
            </div>
          </button>

          <button
            onClick={onImport}
            className="group relative bg-slate-800 hover:bg-slate-700 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-2xl hover:shadow-slate-500/10 hover:-translate-y-0.5 border border-slate-700 hover:border-slate-600"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors">
              <Upload className="w-6 h-6 text-slate-300" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Importar JSON</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Retome uma avaliação anterior. Importe o arquivo JSON para reconstruir o PDI completo.
            </p>
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <span className="text-slate-300 text-lg">→</span>
            </div>
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg text-center">
          {[
            { icon: BarChart3, label: 'Progresso automático', desc: 'Calculado por critério' },
            { icon: Target, label: 'Gaps identificados', desc: 'Baseados no objetivo' },
            { icon: FileText, label: 'Exportação JSON', desc: 'Única fonte de verdade' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-white text-sm font-medium">{label}</span>
              <span className="text-slate-500 text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
