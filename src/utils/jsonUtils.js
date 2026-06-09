export function exportToJSON(state) {
  return JSON.stringify(
    {
      employee: state.employee,
      objectives: state.objectives,
      levelOverrides: state.levelOverrides,
      evaluations: state.evaluations,
      actions: state.actions,
      feedbacks: state.feedbacks,
    },
    null,
    2,
  );
}

export function downloadJSON(state) {
  const json = exportToJSON(state);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (state.employee.name || 'colaborador').replace(/\s+/g, '_');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `PDI_${safeName}_${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromJSON(text) {
  const data = JSON.parse(text);
  return {
    employee: {
      name: data.employee?.name || '',
      email: data.employee?.email || '',
      role: data.employee?.role || '',
      seniority: data.employee?.seniority || '',
      squad: data.employee?.squad || '',
      manager: data.employee?.manager || '',
    },
    objectives: {
      technicalLevel: data.objectives?.technicalLevel || '',
      responsibilityLevel: data.objectives?.responsibilityLevel || '',
    },
    levelOverrides: {
      technical: data.levelOverrides?.technical || null,
      responsibility: data.levelOverrides?.responsibility || null,
    },
    evaluations: data.evaluations || {},
    actions: data.actions || [],
    feedbacks: data.feedbacks || [],
  };
}
