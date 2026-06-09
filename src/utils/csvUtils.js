import { getAllCriteria } from '../data/careerMatrix.js';

function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  return lines.map(parseCSVLine);
}

export function exportToCSV(state) {
  const rows = [];

  rows.push(['PDI_BLOCO', 'colaborador']);
  rows.push(['nome', state.employee.name]);
  rows.push(['email', state.employee.email]);
  rows.push(['cargo', state.employee.role]);
  rows.push(['senioridade', state.employee.seniority]);
  rows.push(['squad', state.employee.squad]);
  rows.push(['gestor', state.employee.manager]);

  rows.push([]);
  rows.push(['PDI_BLOCO', 'objetivos']);
  rows.push(['nivel_tecnico_desejado', state.objectives.technicalLevel]);
  rows.push(['nivel_responsabilidade_desejado', state.objectives.responsibilityLevel]);
  rows.push(['nivel_tecnico_atual_override', state.levelOverrides.technical || '']);
  rows.push(['nivel_responsabilidade_atual_override', state.levelOverrides.responsibility || '']);

  rows.push([]);
  rows.push(['PDI_BLOCO', 'avaliacoes']);
  rows.push(['criterio_id', 'area', 'nivel', 'nivel_nome', 'secao_id', 'secao_nome', 'criterio_texto', 'status', 'comentario', 'evidencia', 'observacao']);

  const allTech = getAllCriteria('technical');
  const allResp = getAllCriteria('responsibility');

  [...allTech, ...allResp].forEach(c => {
    const ev = state.evaluations[c.id] || {};
    rows.push([
      c.id,
      c.area,
      c.level,
      c.levelName,
      c.sectionId,
      c.sectionName,
      c.text,
      ev.status || 'not_evaluated',
      ev.comment || '',
      ev.evidence || '',
      ev.observation || '',
    ]);
  });

  rows.push([]);
  rows.push(['PDI_BLOCO', 'acoes']);
  rows.push(['id', 'titulo', 'descricao', 'status', 'prazo', 'observacoes', 'criterio_gap_id', 'criterio_gap_texto', 'criterio_gap_area']);

  state.actions.forEach(a => {
    rows.push([
      a.id,
      a.title,
      a.description || '',
      a.status,
      a.deadline || '',
      a.observations || '',
      a.gapCriterionId || '',
      a.gapCriterionText || '',
      a.gapCriterionArea || '',
    ]);
  });

  rows.push([]);
  rows.push(['PDI_BLOCO', 'feedbacks']);
  rows.push(['id', 'autor', 'data', 'comentario']);

  state.feedbacks.forEach(f => {
    rows.push([f.id, f.author, f.date, f.comment]);
  });

  const csv = rows.map(row => row.map(escapeCSV).join(',')).join('\n');
  return csv;
}

export function downloadCSV(state) {
  const csv = exportToCSV(state);
  const BOM = '﻿';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (state.employee.name || 'colaborador').replace(/\s+/g, '_');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `PDI_${safeName}_${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromCSV(text) {
  const rows = parseCSV(text);
  const state = {
    employee: { name: '', email: '', role: '', seniority: '', squad: '', manager: '' },
    objectives: { technicalLevel: '', responsibilityLevel: '' },
    evaluations: {},
    levelOverrides: { technical: null, responsibility: null },
    actions: [],
    feedbacks: [],
  };

  let currentBlock = null;
  let headerRow = null;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || (row.length === 1 && row[0] === '')) continue;

    if (row[0] === 'PDI_BLOCO') {
      currentBlock = row[1];
      headerRow = null;
      continue;
    }

    if (currentBlock === 'colaborador') {
      const key = row[0];
      const value = row[1] || '';
      const map = {
        nome: 'name',
        email: 'email',
        cargo: 'role',
        senioridade: 'seniority',
        squad: 'squad',
        gestor: 'manager',
      };
      if (map[key]) state.employee[map[key]] = value;
    }

    if (currentBlock === 'objetivos') {
      const key = row[0];
      const value = row[1] || '';
      if (key === 'nivel_tecnico_desejado') state.objectives.technicalLevel = value;
      if (key === 'nivel_responsabilidade_desejado') state.objectives.responsibilityLevel = value;
      if (key === 'nivel_tecnico_atual_override') state.levelOverrides.technical = value || null;
      if (key === 'nivel_responsabilidade_atual_override') state.levelOverrides.responsibility = value || null;
    }

    if (currentBlock === 'avaliacoes') {
      if (row[0] === 'criterio_id') {
        headerRow = row;
        continue;
      }
      if (!headerRow) continue;
      const obj = {};
      headerRow.forEach((h, idx) => { obj[h] = row[idx] || ''; });
      const id = obj['criterio_id'];
      if (id) {
        state.evaluations[id] = {
          status: obj['status'] || 'not_evaluated',
          comment: obj['comentario'] || '',
          evidence: obj['evidencia'] || '',
          observation: obj['observacao'] || '',
        };
      }
    }

    if (currentBlock === 'acoes') {
      if (row[0] === 'id') {
        headerRow = row;
        continue;
      }
      if (!headerRow) continue;
      const obj = {};
      headerRow.forEach((h, idx) => { obj[h] = row[idx] || ''; });
      if (obj['id']) {
        state.actions.push({
          id: obj['id'],
          title: obj['titulo'] || '',
          description: obj['descricao'] || '',
          status: obj['status'] || 'nao_iniciado',
          deadline: obj['prazo'] || '',
          observations: obj['observacoes'] || '',
          gapCriterionId: obj['criterio_gap_id'] || '',
          gapCriterionText: obj['criterio_gap_texto'] || '',
          gapCriterionArea: obj['criterio_gap_area'] || '',
        });
      }
    }

    if (currentBlock === 'feedbacks') {
      if (row[0] === 'id') {
        headerRow = row;
        continue;
      }
      if (!headerRow) continue;
      const obj = {};
      headerRow.forEach((h, idx) => { obj[h] = row[idx] || ''; });
      if (obj['id']) {
        state.feedbacks.push({
          id: obj['id'],
          author: obj['autor'] || '',
          date: obj['data'] || '',
          comment: obj['comentario'] || '',
        });
      }
    }
  }

  return state;
}
