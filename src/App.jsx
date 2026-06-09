import { useReducer, useRef } from 'react';
import Landing from './components/Landing.jsx';
import EmployeeSetup from './components/EmployeeSetup.jsx';
import Layout from './components/Layout.jsx';
import { importFromJSON } from './utils/jsonUtils.js';

const initialState = {
  page: 'landing',
  section: 'dashboard',
  employee: { name: '', email: '', role: '', seniority: '', squad: '', manager: '' },
  objectives: { technicalLevel: '', responsibilityLevel: '' },
  evaluations: {},
  levelOverrides: { technical: null, responsibility: null },
  actions: [],
  feedbacks: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SECTION':
      return { ...state, section: action.payload };
    case 'SET_EMPLOYEE':
      return { ...state, employee: { ...state.employee, ...action.payload } };
    case 'SET_OBJECTIVES':
      return { ...state, objectives: { ...state.objectives, ...action.payload } };
    case 'START_PDI':
      return {
        ...state,
        employee: action.employee,
        objectives: action.objectives,
        evaluations: {},
        levelOverrides: { technical: null, responsibility: null },
        actions: [],
        feedbacks: [],
        page: 'pdi',
        section: 'dashboard',
      };
    case 'SET_EVALUATION': {
      const prev = state.evaluations[action.criterionId] || {};
      return {
        ...state,
        evaluations: {
          ...state.evaluations,
          [action.criterionId]: { ...prev, ...action.payload },
        },
      };
    }
    case 'SET_LEVEL_OVERRIDE':
      return {
        ...state,
        levelOverrides: { ...state.levelOverrides, [action.area]: action.value || null },
      };
    case 'ADD_ACTION':
      return {
        ...state,
        actions: [...state.actions, { ...action.payload, id: String(Date.now()) }],
      };
    case 'UPDATE_ACTION':
      return {
        ...state,
        actions: state.actions.map(a => a.id === action.id ? { ...a, ...action.payload } : a),
      };
    case 'DELETE_ACTION':
      return { ...state, actions: state.actions.filter(a => a.id !== action.id) };
    case 'ADD_FEEDBACK':
      return {
        ...state,
        feedbacks: [...state.feedbacks, { ...action.payload, id: String(Date.now()) }],
      };
    case 'DELETE_FEEDBACK':
      return { ...state, feedbacks: state.feedbacks.filter(f => f.id !== action.id) };
    case 'IMPORT_STATE':
      return { ...state, ...action.payload, page: 'pdi', section: 'dashboard' };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fileInputRef = useRef(null);

  function handleImportJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = importFromJSON(ev.target.result);
        dispatch({ type: 'IMPORT_STATE', payload: imported });
      } catch (err) {
        alert('Erro ao importar o JSON. Verifique se o arquivo está no formato correto.');
        console.error(err);
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  }

  function openImportDialog() {
    fileInputRef.current?.click();
  }

  if (state.page === 'landing') {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportJSON}
        />
        <Landing
          onNew={() => dispatch({ type: 'SET_PAGE', payload: 'setup' })}
          onImport={openImportDialog}
        />
      </>
    );
  }

  if (state.page === 'setup') {
    return (
      <EmployeeSetup
        onBack={() => dispatch({ type: 'SET_PAGE', payload: 'landing' })}
        onStart={(employee, objectives) =>
          dispatch({ type: 'START_PDI', employee, objectives })
        }
      />
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportJSON}
      />
      <Layout
        state={state}
        dispatch={dispatch}
        onImport={openImportDialog}
      />
    </>
  );
}
