export const TECHNICAL_LEVELS = [
  { id: 1, name: 'Funcional' },
  { id: 2, name: 'Operacional' },
  { id: 3, name: 'Autônomo' },
  { id: 4, name: 'Estratégico' },
];

export const RESPONSIBILITY_LEVELS = [
  { id: 1, name: 'Executor' },
  { id: 2, name: 'Responsável Operacional' },
  { id: 3, name: 'Gestão de Projetos' },
  { id: 4, name: 'Referência Estratégica' },
];

export const EVALUATION_STATUS = {
  NOT_EVALUATED: 'not_evaluated',
  NOT_MEETS: 'not_meets',
  PARTIALLY_MEETS: 'partially_meets',
  FULLY_MEETS: 'fully_meets',
};

export const EVALUATION_LABELS = {
  not_evaluated: 'Não Avaliado',
  not_meets: 'Não Atende',
  partially_meets: 'Atende Parcialmente',
  fully_meets: 'Atende Completamente',
};

export const EVALUATION_PERCENT = {
  not_evaluated: null,
  not_meets: 0,
  partially_meets: 50,
  fully_meets: 100,
};

export const EVALUATION_SCORE = {
  not_evaluated: 0,
  not_meets: 0,
  partially_meets: 0.5,
  fully_meets: 1,
};

export const ACTION_STATUS = {
  NOT_STARTED: 'nao_iniciado',
  IN_PROGRESS: 'em_andamento',
  DONE: 'concluido',
  CANCELLED: 'cancelado',
};

export const ACTION_STATUS_LABELS = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const CAREER_MATRIX = {
  technical: [
    {
      level: 1,
      name: 'Funcional',
      sections: [
        {
          id: 'needs',
          name: 'Precisa ter',
          criteria: [
            { id: 'T1N1', text: 'Lógica de programação' },
            { id: 'T1N2', text: 'Git básico' },
            { id: 'T1N3', text: 'Conhecimento inicial da stack' },
            { id: 'T1N4', text: 'Capacidade de seguir tarefas pequenas' },
            { id: 'T1N5', text: 'Boa comunicação' },
            { id: 'T1N6', text: 'Interesse em aprender' },
          ],
        },
        {
          id: 'expected',
          name: 'Esperado',
          criteria: [
            { id: 'T1E1', text: 'Entrega tarefas simples com acompanhamento' },
            { id: 'T1E2', text: 'Faz perguntas quando possui dúvidas' },
            { id: 'T1E3', text: 'Aprende com feedbacks' },
            { id: 'T1E4', text: 'Segue padrões do time' },
            { id: 'T1E5', text: 'Consegue entender código existente' },
            { id: 'T1E6', text: 'Demonstra evolução constante' },
          ],
        },
        {
          id: 'indicators',
          name: 'Indicadores',
          criteria: [
            { id: 'T1I1', text: 'Dependência alta do time' },
            { id: 'T1I2', text: 'Pouca autonomia técnica' },
            { id: 'T1I3', text: 'Atua melhor em tarefas pequenas e bem definidas' },
            { id: 'T1I4', text: 'Ainda está desenvolvendo capacidade de investigação' },
          ],
        },
      ],
    },
    {
      level: 2,
      name: 'Operacional',
      note: 'Deve dominar completamente os níveis anteriores',
      sections: [
        {
          id: 'needs',
          name: 'Precisa ter',
          criteria: [
            { id: 'T2N1', text: 'Boa familiaridade com a stack' },
            { id: 'T2N2', text: 'Consumo e criação de APIs REST' },
            { id: 'T2N3', text: 'Banco de dados básico/intermediário' },
            { id: 'T2N4', text: 'Git workflow' },
            { id: 'T2N5', text: 'Testes básicos' },
            { id: 'T2N6', text: 'Entendimento de regras de negócio' },
            { id: 'T2N7', text: 'Noções básicas de autenticação/autorização' },
            { id: 'T2N8', text: 'Noções básicas de debugging' },
            { id: 'T2N9', text: 'Capacidade de leitura e manutenção de código legado simples' },
          ],
        },
        {
          id: 'expected',
          name: 'Esperado',
          criteria: [
            { id: 'T2E1', text: 'Resolve bugs simples sozinho' },
            { id: 'T2E2', text: 'Faz pequenas features ponta a ponta' },
            { id: 'T2E3', text: 'Participa de refinamentos' },
            { id: 'T2E4', text: 'Busca ajuda no momento certo' },
            { id: 'T2E5', text: 'Consegue investigar erros comuns' },
            { id: 'T2E6', text: 'Entrega seguindo padrões do time' },
            { id: 'T2E7', text: 'Começa a se preocupar com qualidade e manutenção' },
            { id: 'T2E8', text: 'Demonstra proatividade no dia a dia' },
          ],
        },
        {
          id: 'indicators',
          name: 'Indicadores',
          criteria: [
            { id: 'T2I1', text: 'Consegue trabalhar sozinho na maior parte do tempo' },
            { id: 'T2I2', text: 'Ainda depende do time para decisões técnicas maiores' },
            { id: 'T2I3', text: 'Atua melhor em escopos bem definidos' },
            { id: 'T2I4', text: 'Começa a entender impactos em produção' },
            { id: 'T2I5', text: 'Já possui autonomia operacional básica' },
          ],
        },
      ],
    },
    {
      level: 3,
      name: 'Autônomo',
      note: 'Deve dominar completamente os níveis anteriores',
      sections: [
        {
          id: 'needs',
          name: 'Precisa ter',
          criteria: [
            { id: 'T3N1', text: 'Conhecimento sólido da stack' },
            { id: 'T3N2', text: 'Modelagem de banco de dados' },
            { id: 'T3N3', text: 'Capacidade de desenhar soluções backend simples' },
            { id: 'T3N4', text: 'Automação de deploy' },
            { id: 'T3N5', text: 'Debugging avançado' },
            { id: 'T3N6', text: 'Entendimento de observabilidade/logs' },
            { id: 'T3N7', text: 'Noções de performance e segurança' },
            { id: 'T3N8', text: 'Testes automatizados consistentes' },
            { id: 'T3N9', text: 'Capacidade de realizar integrações externas' },
            { id: 'T3N10', text: 'Entendimento de arquitetura backend em aplicações reais' },
          ],
        },
        {
          id: 'expected',
          name: 'Esperado',
          criteria: [
            { id: 'T3E1', text: 'Resolve problemas com pouca supervisão' },
            { id: 'T3E2', text: 'Quebra tarefas complexas' },
            { id: 'T3E3', text: 'Investiga incidentes em produção' },
            { id: 'T3E4', text: 'Identifica riscos técnicos' },
            { id: 'T3E5', text: 'Propõe melhorias técnicas' },
            { id: 'T3E6', text: 'Consegue orientar pessoas menos experientes' },
            { id: 'T3E7', text: 'Consegue estimar impactos técnicos' },
            { id: 'T3E8', text: 'Participa de decisões técnicas locais' },
            { id: 'T3E9', text: 'Consegue lidar com cenários ambíguos' },
          ],
        },
        {
          id: 'differential',
          name: 'Diferencial',
          criteria: [
            { id: 'T3D1', text: 'Conhecimento de cloud/devops' },
            { id: 'T3D2', text: 'Capacidade de otimização de performance' },
            { id: 'T3D3', text: 'Forte preocupação com resiliência' },
            { id: 'T3D4', text: 'Boa capacidade de investigação' },
            { id: 'T3D5', text: 'Facilidade para destravar outras pessoas' },
          ],
        },
        {
          id: 'indicators',
          name: 'Indicadores',
          criteria: [
            { id: 'T3I1', text: 'Boa autonomia técnica' },
            { id: 'T3I2', text: 'Já consegue atuar em cenários ambíguos' },
            { id: 'T3I3', text: 'Toma decisões técnicas locais com segurança' },
            { id: 'T3I4', text: 'Consegue destravar outras pessoas tecnicamente' },
            { id: 'T3I5', text: 'Entende trade-offs básicos entre prazo, qualidade e complexidade' },
            { id: 'T3I6', text: 'Já influencia decisões técnicas do time' },
          ],
        },
      ],
    },
    {
      level: 4,
      name: 'Estratégico',
      note: 'Deve dominar completamente todos os níveis anteriores',
      sections: [
        {
          id: 'needs',
          name: 'Precisa ter',
          criteria: [
            { id: 'T4N1', text: 'Arquitetura avançada' },
            { id: 'T4N2', text: 'Escalabilidade' },
            { id: 'T4N3', text: 'Segurança aplicada' },
            { id: 'T4N4', text: 'Observabilidade avançada' },
            { id: 'T4N5', text: 'Gestão de risco técnico' },
            { id: 'T4N6', text: 'Design de sistemas distribuídos' },
            { id: 'T4N7', text: 'Estratégias de resiliência e performance' },
            { id: 'T4N8', text: 'Capacidade de tomada de decisão' },
            { id: 'T4N9', text: 'Visão sistêmica' },
            { id: 'T4N10', text: 'Mentoria técnica' },
          ],
        },
        {
          id: 'expected',
          name: 'Esperado',
          criteria: [
            { id: 'T4E1', text: 'Lidera projetos críticos' },
            { id: 'T4E2', text: 'Define padrões técnicos' },
            { id: 'T4E3', text: 'Resolve problemas complexos e críticos' },
            { id: 'T4E4', text: 'Influencia decisões técnicas e de negócio' },
            { id: 'T4E5', text: 'Atua em incidentes de alta criticidade' },
            { id: 'T4E6', text: 'Desenvolve tecnicamente outras pessoas' },
            { id: 'T4E7', text: 'Avalia impactos arquiteturais de longo prazo' },
            { id: 'T4E8', text: 'Equilibra velocidade de entrega e sustentabilidade técnica' },
          ],
        },
        {
          id: 'differential',
          name: 'Diferencial',
          criteria: [
            { id: 'T4D1', text: 'Comunicação executiva' },
            { id: 'T4D2', text: 'Forte senso de prioridade' },
            { id: 'T4D3', text: 'Capacidade de alinhamento entre áreas' },
            { id: 'T4D4', text: 'Influência organizacional' },
            { id: 'T4D5', text: 'Visão estratégica de produto e tecnologia' },
          ],
        },
        {
          id: 'indicators',
          name: 'Indicadores',
          criteria: [
            { id: 'T4I1', text: 'Referência técnica para múltiplos times' },
            { id: 'T4I2', text: 'Alto impacto técnico e organizacional' },
            { id: 'T4I3', text: 'Forte capacidade de tomada de decisão' },
            { id: 'T4I4', text: 'Influencia arquitetura e direção técnica da empresa' },
            { id: 'T4I5', text: 'Atua preventivamente para reduzir riscos futuros' },
          ],
        },
      ],
    },
  ],
  responsibility: [
    {
      level: 1,
      name: 'Executor',
      sections: [
        {
          id: 'criteria',
          name: 'Critérios',
          criteria: [
            { id: 'R1C1', text: 'Executa tarefas bem definidas com supervisão frequente' },
            { id: 'R1C2', text: 'Escala bloqueios rapidamente e com contexto claro' },
            { id: 'R1C3', text: 'Segue processos e padrões estabelecidos' },
            { id: 'R1C4', text: 'Ainda possui dependência técnica e organizacional do time' },
            { id: 'R1C5', text: 'Necessita acompanhamento para garantir prazo e qualidade' },
            { id: 'R1C6', text: 'Não é responsável por decisões de projeto' },
            { id: 'R1C7', text: 'Mantém comunicação frequente sobre andamento das tarefas' },
            { id: 'R1C8', text: 'Reporta dificuldades, atrasos e riscos sem deixar demandas sem visibilidade' },
            { id: 'R1C9', text: 'Sabe repassar informações básicas de forma clara para o time' },
          ],
        },
      ],
    },
    {
      level: 2,
      name: 'Responsável Operacional',
      sections: [
        {
          id: 'criteria',
          name: 'Critérios',
          criteria: [
            { id: 'R2C1', text: 'Consegue conduzir pequenas entregas com baixa supervisão' },
            { id: 'R2C2', text: 'Organiza suas demandas e acompanha prazos' },
            { id: 'R2C3', text: 'Identifica riscos simples antes do impacto' },
            { id: 'R2C4', text: 'Faz alinhamentos básicos com outras pessoas do time' },
            { id: 'R2C5', text: 'Consegue atuar em problemas conhecidos sem direcionamento constante' },
            { id: 'R2C6', text: 'Já possui responsabilidade parcial sobre qualidade e previsibilidade' },
            { id: 'R2C7', text: 'Necessita apoio em cenários complexos ou ambíguos' },
            { id: 'R2C8', text: 'Mantém stakeholders atualizados sobre andamento das entregas' },
            { id: 'R2C9', text: 'Consegue comunicar status, impedimentos e mudanças de escopo com clareza' },
            { id: 'R2C10', text: 'Garante visibilidade das demandas sob sua responsabilidade' },
          ],
        },
      ],
    },
    {
      level: 3,
      name: 'Gestão de Projetos',
      sections: [
        {
          id: 'criteria',
          name: 'Critérios',
          criteria: [
            { id: 'R3C1', text: 'Assume responsabilidade ponta a ponta por projetos médios e grandes' },
            { id: 'R3C2', text: 'Coordena dependências técnicas e alinhamentos entre áreas' },
            { id: 'R3C3', text: 'Atua preventivamente em riscos, atrasos e gargalos' },
            { id: 'R3C4', text: 'Mantém previsibilidade de entrega mesmo em cenários de pressão' },
            { id: 'R3C5', text: 'Consegue destravar o time sem depender constantemente da liderança' },
            { id: 'R3C6', text: 'Toma decisões operacionais considerando impacto no produto e negócio' },
            { id: 'R3C7', text: 'É referência de confiabilidade para projetos importantes' },
            { id: 'R3C8', text: 'Eleva o nível de organização e execução das entregas' },
            { id: 'R3C9', text: 'Garante acompanhamento contínuo dos projetos sob sua responsabilidade' },
            { id: 'R3C10', text: 'Possui autonomia para conduzir iniciativas com baixa supervisão' },
            { id: 'R3C11', text: 'Mantém comunicação constante com liderança e stakeholders' },
            { id: 'R3C12', text: 'Produz reportes claros sobre andamento, riscos e previsões' },
            { id: 'R3C13', text: 'Garante que nenhum projeto fique sem visibilidade ou acompanhamento' },
            { id: 'R3C14', text: 'Escala problemas antes que impactem prazo ou negócio' },
          ],
        },
      ],
    },
    {
      level: 4,
      name: 'Referência Estratégica',
      sections: [
        {
          id: 'criteria',
          name: 'Critérios',
          criteria: [
            { id: 'R4C1', text: 'Resolve problemas organizacionais e técnicos de alta complexidade' },
            { id: 'R4C2', text: 'Influencia processos, cultura e forma de execução do time' },
            { id: 'R4C3', text: 'Atua como referência em tomada de decisão' },
            { id: 'R4C4', text: 'Lidera iniciativas críticas com múltiplas dependências' },
            { id: 'R4C5', text: 'Cria previsibilidade operacional para liderança e produto' },
            { id: 'R4C6', text: 'Desenvolve outras pessoas e aumenta a maturidade do time' },
            { id: 'R4C7', text: 'Antecipação constante de riscos técnicos e organizacionais' },
            { id: 'R4C8', text: 'Tem forte impacto na eficiência e direcionamento do time' },
            { id: 'R4C9', text: 'Consegue equilibrar velocidade, qualidade e negócio' },
            { id: 'R4C10', text: 'Atua com autonomia praticamente total' },
            { id: 'R4C11', text: 'Garante alinhamento estratégico entre áreas e liderança' },
            { id: 'R4C12', text: 'Estrutura comunicação clara em cenários complexos ou críticos' },
            { id: 'R4C13', text: 'Cria cultura de transparência, previsibilidade e acompanhamento' },
            { id: 'R4C14', text: 'Garante fluxo constante de informações relevantes para tomada de decisão' },
            { id: 'R4C15', text: 'Evita falhas de comunicação que possam gerar retrabalho, atraso ou risco operacional' },
          ],
        },
      ],
    },
  ],
};

export function getAllCriteria(area) {
  return CAREER_MATRIX[area].flatMap(level =>
    level.sections.flatMap(section =>
      section.criteria.map(c => ({
        ...c,
        area,
        level: level.level,
        levelName: level.name,
        sectionId: section.id,
        sectionName: section.name,
      }))
    )
  );
}

export function getCriteriaUpToLevel(area, targetLevelId) {
  return CAREER_MATRIX[area]
    .filter(l => l.level <= targetLevelId)
    .flatMap(level =>
      level.sections.flatMap(section =>
        section.criteria.map(c => ({
          ...c,
          area,
          level: level.level,
          levelName: level.name,
          sectionId: section.id,
          sectionName: section.name,
        }))
      )
    );
}

export function getLevelIdByName(area, name) {
  const levels = area === 'technical' ? TECHNICAL_LEVELS : RESPONSIBILITY_LEVELS;
  const found = levels.find(l => l.name === name);
  return found ? found.id : null;
}
