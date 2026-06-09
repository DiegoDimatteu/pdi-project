import { useState } from 'react';
import { Plus, Trash2, MessageSquare, Calendar, User } from 'lucide-react';

function FeedbackCard({ feedback, onDelete }) {
  const dateStr = feedback.date
    ? new Date(feedback.date + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="font-semibold text-sm text-slate-800">{feedback.author || 'Anônimo'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {dateStr}
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{feedback.comment}</p>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Feedbacks({ state, dispatch }) {
  const { feedbacks } = state;
  const [form, setForm] = useState({ author: '', date: '', comment: '' });
  const [showForm, setShowForm] = useState(false);
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const today = new Date().toISOString().slice(0, 10);

  function handleAdd() {
    if (!form.comment.trim()) return;
    dispatch({
      type: 'ADD_FEEDBACK',
      payload: {
        author: form.author.trim() || 'Anônimo',
        date: form.date || today,
        comment: form.comment.trim(),
      },
    });
    setForm({ author: '', date: '', comment: '' });
    setShowForm(false);
  }

  const sorted = [...feedbacks].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Feedbacks</h2>
          <p className="text-sm text-slate-500 mt-1">Histórico de feedbacks recebidos</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Feedback
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Registrar Feedback</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Autor</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={set('author')}
                  placeholder="Nome do autor do feedback"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Data</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={set('date')}
                  defaultValue={today}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Comentário *</label>
              <textarea
                rows={4}
                value={form.comment}
                onChange={set('comment')}
                placeholder="Descreva o feedback..."
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none resize-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => { setShowForm(false); setForm({ author: '', date: '', comment: '' }); }}
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              disabled={!form.comment.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Salvar Feedback
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Nenhum feedback registrado</h3>
          <p className="text-sm text-slate-400">
            Registre feedbacks para acompanhar a evolução ao longo do tempo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(feedback => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onDelete={() => dispatch({ type: 'DELETE_FEEDBACK', id: feedback.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
