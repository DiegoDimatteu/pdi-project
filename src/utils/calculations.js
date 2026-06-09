import {
  CAREER_MATRIX,
  EVALUATION_SCORE,
  TECHNICAL_LEVELS,
  RESPONSIBILITY_LEVELS,
  getAllCriteria,
  getCriteriaUpToLevel,
  getLevelIdByName,
} from '../data/careerMatrix.js';

export function getLevelProgress(area, levelId, evaluations) {
  const level = CAREER_MATRIX[area].find(l => l.level === levelId);
  if (!level) return 0;

  const allCriteria = level.sections.flatMap(s => s.criteria);
  if (allCriteria.length === 0) return 0;

  const score = allCriteria.reduce((sum, c) => {
    const ev = evaluations[c.id];
    return sum + (EVALUATION_SCORE[ev?.status] || 0);
  }, 0);

  return Math.round((score / allCriteria.length) * 100);
}

export function getAreaProgress(area, evaluations) {
  const allCriteria = getAllCriteria(area);
  if (allCriteria.length === 0) return 0;

  const score = allCriteria.reduce((sum, c) => {
    const ev = evaluations[c.id];
    return sum + (EVALUATION_SCORE[ev?.status] || 0);
  }, 0);

  return Math.round((score / allCriteria.length) * 100);
}

export function getOverallProgress(evaluations) {
  const tech = getAreaProgress('technical', evaluations);
  const resp = getAreaProgress('responsibility', evaluations);
  return Math.round((tech + resp) / 2);
}

export function isLevelFullyMet(area, levelId, evaluations) {
  const level = CAREER_MATRIX[area].find(l => l.level === levelId);
  if (!level) return false;

  const allCriteria = level.sections.flatMap(s => s.criteria);
  return allCriteria.every(c => evaluations[c.id]?.status === 'fully_meets');
}

export function suggestCurrentLevel(area, evaluations) {
  const levels = area === 'technical' ? TECHNICAL_LEVELS : RESPONSIBILITY_LEVELS;

  for (let i = 0; i < levels.length; i++) {
    const levelFull = isLevelFullyMet(area, levels[i].id, evaluations);
    if (!levelFull) {
      return levels[i].name;
    }
  }

  return levels[levels.length - 1].name;
}

export function getGaps(area, targetLevelName, evaluations) {
  if (!targetLevelName) return [];

  const targetLevelId = getLevelIdByName(area, targetLevelName);
  if (!targetLevelId) return [];

  const criteria = getCriteriaUpToLevel(area, targetLevelId);

  return criteria.filter(c => {
    const ev = evaluations[c.id];
    return !ev || ev.status !== 'fully_meets';
  });
}

export function getGapsByLevel(area, targetLevelName, evaluations) {
  const gaps = getGaps(area, targetLevelName, evaluations);
  const grouped = {};

  gaps.forEach(gap => {
    const key = `${gap.level}-${gap.levelName}`;
    if (!grouped[key]) {
      grouped[key] = { level: gap.level, levelName: gap.levelName, gaps: [] };
    }
    grouped[key].gaps.push(gap);
  });

  return Object.values(grouped).sort((a, b) => a.level - b.level);
}

export function getSectionProgress(area, levelId, sectionId, evaluations) {
  const level = CAREER_MATRIX[area].find(l => l.level === levelId);
  if (!level) return 0;

  const section = level.sections.find(s => s.id === sectionId);
  if (!section || section.criteria.length === 0) return 0;

  const score = section.criteria.reduce((sum, c) => {
    const ev = evaluations[c.id];
    return sum + (EVALUATION_SCORE[ev?.status] || 0);
  }, 0);

  return Math.round((score / section.criteria.length) * 100);
}

export function getEvaluationSummary(evaluations) {
  const allTech = getAllCriteria('technical');
  const allResp = getAllCriteria('responsibility');
  const all = [...allTech, ...allResp];

  const summary = {
    total: all.length,
    not_evaluated: 0,
    not_meets: 0,
    partially_meets: 0,
    fully_meets: 0,
  };

  all.forEach(c => {
    const status = evaluations[c.id]?.status || 'not_evaluated';
    summary[status] = (summary[status] || 0) + 1;
  });

  return summary;
}
