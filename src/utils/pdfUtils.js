import jsPDF from "jspdf";
import { CAREER_MATRIX } from "../data/careerMatrix.js";
import {
  getAreaProgress,
  getOverallProgress,
  getLevelProgress,
  suggestCurrentLevel,
  getGapsByLevel,
  getEvaluationSummary,
} from "./calculations.js";

// ── Paleta ────────────────────────────────────────────────────────────────────

const C = {
  primary: [99, 102, 241],
  s800: [30, 41, 59],
  s700: [51, 65, 85],
  s600: [71, 85, 105],
  s500: [100, 116, 139],
  s400: [148, 163, 184],
  s300: [203, 213, 225],
  s200: [226, 232, 240],
  s100: [241, 245, 249],
  s50: [248, 250, 252],
  white: [255, 255, 255],
  green: [16, 185, 129],
  greenLt: [209, 250, 229],
  amber: [245, 158, 11],
  amberLt: [254, 243, 199],
  red: [239, 68, 68],
  redLt: [254, 226, 226],
  violet: [139, 92, 246],
  violetLt: [237, 233, 254],
  indigoLt: [238, 242, 255],
  blueLt: [219, 234, 254],
  blueText: [29, 78, 216],
};

const LEVEL_THEME = {
  1: { band: [241, 245, 249], accent: [100, 116, 139], text: [51, 65, 85] },
  2: { band: [219, 234, 254], accent: [29, 78, 216], text: [29, 78, 216] },
  3: { band: [237, 233, 254], accent: [109, 40, 217], text: [109, 40, 217] },
  4: { band: [254, 243, 199], accent: [161, 98, 7], text: [120, 53, 15] },
};

const EVAL_BADGE = {
  not_evaluated: { bg: C.s100, fg: C.s500, label: "Não Avaliado" },
  not_meets: { bg: C.redLt, fg: C.red, label: "Não Atende" },
  partially_meets: { bg: C.amberLt, fg: C.amber, label: "Atende Parcialmente" },
  fully_meets: { bg: C.greenLt, fg: C.green, label: "Atende Completamente" },
};

const ACTION_BADGE = {
  nao_iniciado: { bg: C.s100, fg: C.s500, label: "Não iniciado" },
  em_andamento: { bg: C.blueLt, fg: C.blueText, label: "Em andamento" },
  concluido: { bg: C.greenLt, fg: C.green, label: "Concluído" },
  cancelado: { bg: C.redLt, fg: C.red, label: "Cancelado" },
};

// ── Primitivos ────────────────────────────────────────────────────────────────

const f = (d, c) => d.setFillColor(...c);
const t = (d, c) => d.setTextColor(...c);
const s = (d, c) => d.setDrawColor(...c);

function pbar(doc, x, y, w, h, pct, color) {
  f(doc, C.s200);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, "F");
  if (pct > 0) {
    f(doc, color);
    doc.roundedRect(
      x,
      y,
      Math.max(Math.min((w * pct) / 100, w), h),
      h,
      h / 2,
      h / 2,
      "F",
    );
  }
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

// ── Contexto de paginação ─────────────────────────────────────────────────────

function makeCtx(doc, employeeName) {
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M = 14;
  return {
    doc,
    PW,
    PH,
    M,
    CW: PW - 2 * M,
    y: 0,
    pageNum: 1,
    employeeName,
    hdr: null,
  };
}

function drawMiniHeader(ctx) {
  const { doc, PW, M, hdr, employeeName } = ctx;
  if (!hdr) return;
  f(doc, C.s800);
  doc.rect(0, 0, PW, 11, "F");
  f(doc, hdr.color);
  doc.rect(0, 0, 3.5, 11, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  t(doc, C.white);
  doc.text(hdr.title, M, 7.5);
  doc.setFont("helvetica", "normal");
  t(doc, C.s400);
  doc.text(employeeName, PW - M, 7.5, { align: "right" });
}

function newPage(ctx) {
  ctx.doc.addPage();
  ctx.pageNum++;
  ctx.y = 14;
  drawMiniHeader(ctx);
}

function fit(ctx, needed) {
  if (ctx.y + needed > ctx.PH - 14) newPage(ctx);
}

// ── Tipografia / elementos ────────────────────────────────────────────────────

function sectionHeading(ctx, text, color) {
  fit(ctx, 16);
  const { doc, M } = ctx;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  t(doc, C.s800);
  doc.text(text, M, ctx.y + 9);
  ctx.y += 10;
  f(doc, color);
  doc.rect(M, ctx.y, 24, 1, "F");
  ctx.y += 6;
}

function subLabel(ctx, text) {
  fit(ctx, 10);
  const { doc, M, CW } = ctx;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  t(doc, C.s400);
  doc.text(text.toUpperCase(), M + 4, ctx.y + 3.5);
  const lw = doc.getTextWidth(text.toUpperCase());
  s(doc, C.s200);
  doc.setLineWidth(0.15);
  doc.line(M + 7 + lw, ctx.y + 1.5, M + CW, ctx.y + 1.5);
  ctx.y += 8;
}

function levelBand(ctx, level, progress) {
  const bandH = level.note ? 16 : 11;
  fit(ctx, bandH + 3);
  const { doc, M, CW, PW } = ctx;
  const th = LEVEL_THEME[level.level] || LEVEL_THEME[1];

  const badgeW = 9;
  f(doc, th.band);
  doc.rect(M, ctx.y, CW, bandH, "F");
  f(doc, th.accent);
  doc.rect(M, ctx.y, badgeW, bandH, "F");

  // Badge "N1" — centralizado vertical e horizontalmente na faixa
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  t(doc, C.white);
  doc.text(`N${level.level}`, M + badgeW / 2, ctx.y + bandH / 2 + 1.2, { align: "center" });

  // Nome do nível
  const titleY = level.note ? ctx.y + 6.5 : ctx.y + 7.5;
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  t(doc, th.text);
  doc.text(level.name, M + badgeW + 4, titleY);

  if (level.note) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    t(doc, th.accent);
    doc.text(level.note, M + badgeW + 4, ctx.y + 12.5);
  }

  // Barra de progresso
  const barW = 38;
  const barX = PW - M - barW - 2;
  pbar(doc, barX, ctx.y + bandH / 2 - 2, barW, 4, progress, th.accent);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  t(doc, th.accent);
  doc.text(`${progress}%`, barX - 3, ctx.y + bandH / 2 + 1.5, { align: "right" });

  ctx.y += bandH + 3;
}

// ── Critério com notas ────────────────────────────────────────────────────────

function estimateCrit(doc, text, ev, CW) {
  const BADGE_W = 40;
  const textW = CW - 14 - BADGE_W - 2;
  const tLines = doc.splitTextToSize(text, textW);
  let h = Math.max(tLines.length * 4.5, 7) + 4;
  const notes = [ev?.comment, ev?.evidence, ev?.observation].filter(Boolean);
  notes.forEach((v) => {
    h += 4.5; // label line
    h += doc.splitTextToSize(v, CW - 20).length * 4 + 3;
  });
  if (notes.length) h += 4;
  return h;
}

function drawCrit(ctx, text, ev) {
  const { doc, M, CW, PW } = ctx;
  const status = ev?.status || "not_evaluated";
  const badge = EVAL_BADGE[status] || EVAL_BADGE.not_evaluated;
  const BADGE_W = 40;
  const textW = CW - 14 - BADGE_W - 2;

  fit(ctx, estimateCrit(doc, text, ev, CW));

  // Bullet
  f(doc, badge.fg);
  doc.circle(M + 5.5, ctx.y + 3.5, 1.2, "F");

  // Texto do critério
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  t(doc, C.s700);
  const tLines = doc.splitTextToSize(text, textW);
  doc.text(tLines, M + 10, ctx.y + 4);
  const textH = Math.max(tLines.length * 4.5, 7);

  // Badge de status (direita)
  const bx = PW - M - BADGE_W;
  f(doc, badge.bg);
  doc.roundedRect(bx, ctx.y + 0.5, BADGE_W, 6, 1.5, 1.5, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  t(doc, badge.fg);
  doc.text(badge.label, bx + BADGE_W / 2, ctx.y + 4.7, { align: "center" });

  ctx.y += textH + 4;

  // Notas (comentário / evidência / observação)
  const noteFields = [
    { label: "Comentário", val: ev?.comment },
    { label: "Evidência", val: ev?.evidence },
    { label: "Observação", val: ev?.observation },
  ].filter((n) => n.val);

  if (noteFields.length > 0) {
    const lineX = M + 11;
    const noteStartY = ctx.y;

    noteFields.forEach(({ label, val }) => {
      // Label em negrito
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      t(doc, C.s500);
      doc.text(`${label}:`, M + 15, ctx.y + 3.5);
      ctx.y += 5;

      // Texto da nota
      doc.setFont("helvetica", "normal");
      t(doc, C.s600);
      const nLines = doc.splitTextToSize(val, CW - 20);
      doc.text(nLines, M + 17, ctx.y + 2.5);
      ctx.y += nLines.length * 4 + 3;
    });

    // Linha vertical à esquerda das notas
    s(doc, C.s300);
    doc.setLineWidth(0.6);
    doc.line(lineX, noteStartY - 1, lineX, ctx.y - 1);

    ctx.y += 2;
  }

  ctx.y += 2;
}

// ── Seção de avaliação (técnica ou responsabilidade) ──────────────────────────

function drawEvaluationSection(ctx, area, evaluations, targetLevelName) {
  const { doc, M, CW } = ctx;
  const levels = CAREER_MATRIX[area];

  const targetLevelNames =
    area === "technical"
      ? ["Funcional", "Operacional", "Autônomo", "Estratégico"]
      : [
          "Executor",
          "Responsável Operacional",
          "Gestão de Projetos",
          "Referência Estratégica",
        ];
  const targetIdx = targetLevelNames.indexOf(targetLevelName);

  levels.forEach((level) => {
    const progress = getLevelProgress(area, level.level, evaluations);
    const isAbove = targetIdx >= 0 && level.level > targetIdx + 1;

    levelBand(ctx, level, progress);

    if (isAbove) {
      fit(ctx, 10);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "italic");
      t(doc, C.s400);
      doc.text(
        "Além do nível objetivo — avaliação opcional",
        M + 10,
        ctx.y + 3.5,
      );
      ctx.y += 8;
    }

    level.sections.forEach((section) => {
      subLabel(ctx, section.name);
      section.criteria.forEach((c) => {
        drawCrit(ctx, c.text, evaluations[c.id]);
      });
      ctx.y += 3;
    });

    ctx.y += 4;
  });
}

// ── Gaps & Plano de Desenvolvimento ──────────────────────────────────────────

function drawActionBlock(ctx, action) {
  const { doc, M, CW } = ctx;
  const ab = ACTION_BADGE[action.status] || ACTION_BADGE.nao_iniciado;

  fit(ctx, 20);

  // Título + badge de status
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  t(doc, C.s800);
  const titleLines = doc.splitTextToSize(action.title, CW - 50);
  doc.text(titleLines, M + 8, ctx.y + 4);

  // Status badge
  const bw = 34;
  f(doc, ab.bg);
  doc.roundedRect(M + CW - bw, ctx.y, bw, 6.5, 1.5, 1.5, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  t(doc, ab.fg);
  doc.text(ab.label, M + CW - bw / 2, ctx.y + 4.7, { align: "center" });

  ctx.y += titleLines.length * 4.5 + 4;

  const meta = [action.deadline && `Prazo: ${fmtDate(action.deadline)}`].filter(
    Boolean,
  );

  if (meta.length) {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    t(doc, C.s400);
    doc.text(meta.join("   ·   "), M + 8, ctx.y + 3);
    ctx.y += 6;
  }

  const textFields = [
    { label: "Descrição", val: action.description },
    { label: "Observações", val: action.observations },
  ].filter((n) => n.val);

  textFields.forEach(({ label, val }) => {
    fit(ctx, 12);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    t(doc, C.s500);
    doc.text(`${label}:`, M + 8, ctx.y + 3.5);
    ctx.y += 5;
    doc.setFont("helvetica", "normal");
    t(doc, C.s600);
    const lines = doc.splitTextToSize(val, CW - 14);
    doc.text(lines, M + 10, ctx.y + 2.5);
    ctx.y += lines.length * 4 + 3;
  });

  // Separador fino
  s(doc, C.s200);
  doc.setLineWidth(0.15);
  doc.line(M + 8, ctx.y, M + CW, ctx.y);
  ctx.y += 5;
}

function drawGapsSection(ctx, objectives, evaluations, actions) {
  const { doc, M, CW, PW } = ctx;
  const areas = [
    {
      key: "technical",
      label: "Capacidade Técnica",
      color: C.primary,
      target: objectives.technicalLevel,
    },
    {
      key: "responsibility",
      label: "Responsabilidade Interna",
      color: C.violet,
      target: objectives.responsibilityLevel,
    },
  ];

  areas.forEach(({ key, label, color, target }) => {
    const groups = getGapsByLevel(key, target, evaluations);
    if (!groups.length) {
      fit(ctx, 16);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      t(doc, C.green);
      doc.text(`✓ Sem gaps em ${label}`, M, ctx.y + 5);
      ctx.y += 12;
      return;
    }

    fit(ctx, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    t(doc, C.s800);
    doc.text(label, M, ctx.y + 7);
    ctx.y += 8;
    f(doc, color);
    doc.rect(M, ctx.y, 20, 0.8, "F");
    ctx.y += 7;

    groups.forEach((group) => {
      fit(ctx, 12);
      const th = LEVEL_THEME[group.level] || LEVEL_THEME[1];

      // Cabeçalho do grupo de nível
      f(doc, th.band);
      doc.rect(M, ctx.y, CW, 8, "F");
      f(doc, th.accent);
      doc.rect(M, ctx.y, 3, 8, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      t(doc, th.text);
      doc.text(`Nível ${group.level} — ${group.levelName}`, M + 7, ctx.y + 5.5);
      doc.setFont("helvetica", "normal");
      t(doc, C.s400);
      doc.text(`${group.gaps.length} gap(s)`, PW - M, ctx.y + 5.5, {
        align: "right",
      });
      ctx.y += 11;

      group.gaps.forEach((gap) => {
        const status = evaluations[gap.id]?.status || "not_evaluated";
        const badge = EVAL_BADGE[status];
        const gapActions = actions.filter((a) => a.gapCriterionId === gap.id);

        fit(ctx, estimateCrit(doc, gap.text, evaluations[gap.id], CW));
        drawCrit(ctx, gap.text, evaluations[gap.id]);

        // Ações vinculadas a este gap
        if (gapActions.length > 0) {
          fit(ctx, 10);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          t(doc, C.s500);
          doc.text(
            `${gapActions.length} ação(ões) vinculada(s):`,
            M + 12,
            ctx.y + 3.5,
          );
          ctx.y += 7;
          gapActions.forEach((a) => drawActionBlock(ctx, a));
        }
      });

      ctx.y += 3;
    });

    ctx.y += 6;
  });

  // Ações gerais (sem gap vinculado)
  const freeActions = actions.filter((a) => !a.gapCriterionId);
  if (freeActions.length > 0) {
    fit(ctx, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    t(doc, C.s800);
    doc.text("Ações Gerais", M, ctx.y + 7);
    ctx.y += 8;
    f(doc, C.green);
    doc.rect(M, ctx.y, 16, 0.8, "F");
    ctx.y += 7;
    freeActions.forEach((a) => drawActionBlock(ctx, a));
  }
}

// ── Feedbacks ─────────────────────────────────────────────────────────────────

function drawFeedbacks(ctx, feedbacks) {
  const { doc, M, CW } = ctx;
  const sorted = [...feedbacks].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );

  sorted.forEach((fb, i) => {
    const commentLines = doc.splitTextToSize(fb.comment || "", CW - 4);
    const blockH = 18 + commentLines.length * 4.5;
    fit(ctx, blockH);

    // Cabeçalho do feedback
    f(doc, C.s50);
    doc.rect(M, ctx.y, CW, 9, "F");
    s(doc, C.s200);
    doc.setLineWidth(0.15);
    doc.rect(M, ctx.y, CW, 9, "S");
    f(doc, C.violet);
    doc.rect(M, ctx.y, 3, 9, "F");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    t(doc, C.s800);
    doc.text(fb.author || "Anônimo", M + 7, ctx.y + 6);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    t(doc, C.s400);
    doc.text(fmtDate(fb.date), M + CW, ctx.y + 6, { align: "right" });

    ctx.y += 12;

    // Texto do feedback
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    t(doc, C.s600);
    doc.text(commentLines, M + 4, ctx.y + 4);
    ctx.y += commentLines.length * 4.5 + 7;

    // Separador
    if (i < sorted.length - 1) {
      s(doc, C.s200);
      doc.setLineWidth(0.2);
      doc.line(M, ctx.y - 2, M + CW, ctx.y - 2);
      ctx.y += 2;
    }
  });
}

// ── Capa ──────────────────────────────────────────────────────────────────────

function drawCover(ctx, state) {
  const { doc, PW, PH, M, CW } = ctx;
  const { employee, objectives, evaluations, levelOverrides } = state;

  const techPct = getAreaProgress("technical", evaluations);
  const respPct = getAreaProgress("responsibility", evaluations);
  const overall = getOverallProgress(evaluations);
  const summary = getEvaluationSummary(evaluations);
  const techSugg = suggestCurrentLevel("technical", evaluations);
  const respSugg = suggestCurrentLevel("responsibility", evaluations);
  const curTech = levelOverrides.technical || techSugg;
  const curResp = levelOverrides.responsibility || respSugg;

  // Faixa de topo
  f(doc, C.s800);
  doc.rect(0, 0, PW, 54, "F");
  f(doc, C.primary);
  doc.rect(0, 0, 4, 54, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  t(doc, C.s400);
  doc.text("PLANO DE DESENVOLVIMENTO INDIVIDUAL", M + 2, 14);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  t(doc, C.white);
  doc.text(employee.name || "Colaborador", M + 2, 30);

  const sub = [employee.role, employee.squad].filter(Boolean).join("  ·  ");
  if (sub) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    t(doc, C.s400);
    doc.text(sub, M + 2, 39);
  }
  const todayStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(8);
  t(doc, C.s500);
  doc.text(`Gerado em ${todayStr}`, M + 2, 47);

  ctx.y = 61;

  // ── Dados do colaborador
  const fields = [
    ["Cargo", employee.role],
    ["Senioridade", employee.seniority],
    ["Squad", employee.squad],
    ["Gestor", employee.manager],
    ["E-mail", employee.email],
  ].filter(([, v]) => v);

  if (fields.length) {
    sectionHeading(ctx, "Dados do Colaborador", C.primary);
    const rows = Math.ceil(fields.length / 2);
    const cardH = rows * 12 + 10;
    fit(ctx, cardH);

    // Card background + accent
    f(doc, C.indigoLt);
    doc.rect(M, ctx.y, CW, cardH, "F");
    f(doc, C.primary);
    doc.rect(M, ctx.y, 4, cardH, "F");

    const colW = CW / 2;
    const padX = 10;
    const padY = 6;
    fields.forEach(([label, val], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bx = M + 4 + padX + col * colW;
      const by = ctx.y + padY + row * 12;
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      t(doc, C.s500);
      doc.text(label.toUpperCase(), bx, by);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      t(doc, C.s800);
      doc.text(val, bx, by + 5);
    });

    ctx.y += cardH + 6;
  }

  // ── Métricas de evolução
  sectionHeading(ctx, "Resumo de Evolução", C.primary);

  const metrics = [
    { label: "Evolução Técnica",         val: `${techPct}%`, color: C.primary, light: C.indigoLt },
    { label: "Evolução Responsabilidade", val: `${respPct}%`, color: C.violet,  light: C.violetLt },
    { label: "Evolução Geral",            val: `${overall}%`, color: C.green,   light: C.greenLt  },
  ];
  const bw = (CW - 8) / 3;
  metrics.forEach((m, i) => {
    const bx = M + i * (bw + 4);
    f(doc, m.light);
    doc.roundedRect(bx, ctx.y, bw, 21, 2, 2, "F");
    s(doc, m.color);
    doc.setLineWidth(0.25);
    doc.roundedRect(bx, ctx.y, bw, 21, 2, 2, "S");
    doc.setFontSize(19);
    doc.setFont("helvetica", "bold");
    t(doc, m.color);
    doc.text(m.val, bx + bw / 2, ctx.y + 13, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    t(doc, C.s600);
    doc.text(m.label, bx + bw / 2, ctx.y + 18.5, { align: "center" });
  });
  ctx.y += 27;

  // ── Nível atual vs objetivo
  sectionHeading(ctx, "Avaliação de Nível", C.primary);

  const levelRows = [
    { area: "Capacidade Técnica",       cur: curTech, target: objectives.technicalLevel,       color: C.primary },
    { area: "Responsabilidade Interna", cur: curResp, target: objectives.responsibilityLevel,  color: C.violet  },
  ];

  levelRows.forEach((row) => {
    fit(ctx, 16);
    f(doc, C.s50);
    s(doc, C.s200);
    doc.setLineWidth(0.1);
    doc.rect(M, ctx.y, CW, 14, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    t(doc, C.s700);
    doc.text(row.area, M + 4, ctx.y + 9);

    doc.setFont("helvetica", "normal");
    t(doc, C.s500);
    const curLabel = "Atual:";
    doc.text(curLabel, M + 60, ctx.y + 9);
    doc.setFont("helvetica", "bold");
    t(doc, C.s800);
    doc.text(row.cur || "—", M + 60 + doc.getTextWidth(curLabel) + 2, ctx.y + 9);

    doc.setFont("helvetica", "normal");
    t(doc, C.s500);
    const objLabel = "Objetivo:";
    doc.text(objLabel, M + 110, ctx.y + 9);
    doc.setFont("helvetica", "bold");
    t(doc, row.color);
    doc.text(row.target || "—", M + 110 + doc.getTextWidth(objLabel) + 2, ctx.y + 9);

    ctx.y += 16;
  });

  ctx.y += 3;

  // ── Progresso por nível (barras)
  sectionHeading(ctx, "Progresso por Nível", C.primary);

  const techLvls = [
    { id: 1, name: "Funcional" },
    { id: 2, name: "Operacional" },
    { id: 3, name: "Autônomo" },
    { id: 4, name: "Estratégico" },
  ];
  const respLvls = [
    { id: 1, name: "Executor" },
    { id: 2, name: "Responsável Operacional" },
    { id: 3, name: "Gestão de Projetos" },
    { id: 4, name: "Referência Estratégica" },
  ];
  const halfW = (CW - 8) / 2;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  t(doc, C.s400);
  doc.text("CAPACIDADE TÉCNICA", M, ctx.y);
  doc.text("RESPONSABILIDADE INTERNA", M + halfW + 8, ctx.y);
  ctx.y += 5;

  for (let i = 0; i < 4; i++) {
    const ry = ctx.y + i * 9;
    const tp = getLevelProgress("technical", techLvls[i].id, evaluations);
    const rp = getLevelProgress("responsibility", respLvls[i].id, evaluations);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    t(doc, C.s700);
    doc.text(techLvls[i].name, M, ry + 3);
    pbar(doc, M + 34, ry, halfW - 50, 3, tp, C.primary);
    doc.setFont("helvetica", "bold");
    t(doc, C.s500);
    doc.text(`${tp}%`, M + halfW - 4, ry + 3, { align: "right" });

    const rx2 = M + halfW + 8;
    doc.setFont("helvetica", "normal");
    t(doc, C.s700);
    doc.text(respLvls[i].name, rx2, ry + 3);
    pbar(doc, rx2 + 40, ry, halfW - 50, 3, rp, C.violet);
    doc.setFont("helvetica", "bold");
    t(doc, C.s500);
    doc.text(`${rp}%`, PW - M, ry + 3, { align: "right" });
  }
  ctx.y += 4 * 9 + 6;

  // ── Distribuição das avaliações
  if (ctx.y + 44 < PH - 14) {
    sectionHeading(ctx, "Distribuição das Avaliações", C.primary);
    const evalRows = [
      { key: "fully_meets",    label: "Atende Completamente", color: C.green },
      { key: "partially_meets", label: "Atende Parcialmente", color: C.amber },
      { key: "not_meets",      label: "Não Atende",           color: C.red   },
      { key: "not_evaluated",  label: "Não Avaliado",         color: C.s400  },
    ];
    evalRows.forEach((row, i) => {
      const count = summary[row.key] || 0;
      const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
      const ry = ctx.y + i * 8;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      t(doc, C.s600);
      doc.text(row.label, M, ry + 3);
      pbar(doc, M + 50, ry, CW - 70, 3, pct, row.color);
      doc.setFont("helvetica", "bold");
      t(doc, C.s500);
      doc.text(`${count} (${Math.round(pct)}%)`, M + CW, ry + 3, { align: "right" });
    });
    ctx.y += 4 * 8 + 4;
  }
}

// ── Numeração de páginas ───────────────────────────────────────────────────────

function drawPageNumbers(doc) {
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M = 14;
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    const y = PH - 7;
    doc.setDrawColor(...C.s200);
    doc.setLineWidth(0.2);
    doc.line(M, y - 2.5, PW - M, y - 2.5);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.s400);
    doc.text("PDI Manager — Plano de Desenvolvimento Individual", M, y + 0.5);
    doc.text(`${i} / ${total}`, PW - M, y + 0.5, { align: "right" });
  }
}

// ── Ponto de entrada ─────────────────────────────────────────────────────────

export function generateAndDownloadPDF(state) {
  const { employee, objectives, evaluations, actions, feedbacks } = state;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const name = employee.name || "Colaborador";
  const ctx = makeCtx(doc, name);

  // ─ Página 1: Capa ─────────────────────────────────────
  drawCover(ctx, state);

  // ─ Avaliação Técnica ───────────────────────────────────
  doc.addPage();
  ctx.pageNum++;
  ctx.y = 14;
  ctx.hdr = { title: "Avaliação de Capacidade Técnica", color: C.primary };
  drawMiniHeader(ctx);

  sectionHeading(ctx, "Avaliação de Capacidade Técnica", C.primary);
  drawEvaluationSection(
    ctx,
    "technical",
    evaluations,
    objectives.technicalLevel,
  );

  // ─ Avaliação de Responsabilidade ──────────────────────
  doc.addPage();
  ctx.pageNum++;
  ctx.y = 14;
  ctx.hdr = { title: "Avaliação de Responsabilidade Interna", color: C.violet };
  drawMiniHeader(ctx);

  sectionHeading(ctx, "Avaliação de Responsabilidade Interna", C.violet);
  drawEvaluationSection(
    ctx,
    "responsibility",
    evaluations,
    objectives.responsibilityLevel,
  );

  // ─ Gaps & Plano de Desenvolvimento ────────────────────
  doc.addPage();
  ctx.pageNum++;
  ctx.y = 14;
  ctx.hdr = { title: "Gaps & Plano de Desenvolvimento", color: C.amber };
  drawMiniHeader(ctx);

  sectionHeading(ctx, "Gaps & Plano de Desenvolvimento", C.amber);
  drawGapsSection(ctx, objectives, evaluations, actions);

  // ─ Feedbacks ──────────────────────────────────────────
  if (feedbacks.length > 0) {
    doc.addPage();
    ctx.pageNum++;
    ctx.y = 14;
    ctx.hdr = {
      title: `Histórico de Feedbacks (${feedbacks.length})`,
      color: C.violet,
    };
    drawMiniHeader(ctx);

    sectionHeading(ctx, "Histórico de Feedbacks", C.violet);
    drawFeedbacks(ctx, feedbacks);
  }

  // ─ Numeração de páginas ────────────────────────────────
  drawPageNumbers(doc);

  // ─ Download ───────────────────────────────────────────
  const safeName = name.replace(/\s+/g, "_");
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`PDI_Relatorio_${safeName}_${today}.pdf`);
}
