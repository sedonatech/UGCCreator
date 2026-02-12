const buildNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
};

const buildTasksForTitle = title => [
    {
        title: `Aprenda ${title}`,
        description: `Dedique 20 minutos estudando ${title.toLowerCase()}. Anote três conclusões que você pode aplicar hoje.`,
        tag: 'Aprender',
        durationMinutes: 20,
    },
    {
        title: `Aplique ${title}`,
        description: `Complete um exercício focado que coloca ${title.toLowerCase()} em prática com um produto real ou briefing simulado.`,
        tag: 'Ação',
        durationMinutes: 30,
    },
    {
        title: `Crie um entregável`,
        description: `Elabore um pequeno recurso que prove que você consegue executar ${title.toLowerCase()} (notas, checklist ou clipe curto).`,
        tag: 'Construir',
        durationMinutes: 25,
    },
    {
        title: 'Revise e reflita',
        description: 'Avalie seu resultado em clareza, qualidade e velocidade. Anote uma melhoria para amanhã.',
        tag: 'Revisão',
        durationMinutes: 10,
    },
];

const buildDays = (dayTitles, weekTitles, weekTips) =>
    dayTitles.map((title, index) => {
        const day = index + 1;
        const weekIndex = Math.floor(index / 7);
        return {
            day,
            title,
            summary: `O dia ${day} foca em ${title.toLowerCase()}.`,
            weekTitle: weekTitles[weekIndex] || weekTitles[weekTitles.length - 1],
            tip: weekTips[weekIndex] || weekTips[weekTips.length - 1],
            tasks: buildTasksForTitle(title),
        };
    });

const UGC_DAY_TITLES = [
    'Orientação e objetivos',
    'Mentalidade e hábitos do criador',
    'Defina seu nicho',
    'Pesquisa de audiência',
    'Pesquisa de marca',
    'Auditoria de estilo de conteúdo',
    'Construa sua declaração de criador',
    'Equipamento e configuração básica',
    'Fundamentos de iluminação e áudio',
    'Filmagem com celular',
    'Gravação de b-roll',
    'Fluxo de trabalho de edição',
    'Fundamentos de roteiro',
    'Fórmulas de gancho',
    'CTA e estrutura',
    'Planejamento de portfólio',
    'Crie três vídeos de amostra',
    'Crie três fotos de amostra',
    'Construa seu kit de mídia',
    'Preços e pacotes',
    'Construção de lista de contatos',
    'Framework de proposta fria',
    'Sistema de acompanhamento',
    'Fundamentos de negociação',
    'Essenciais do contrato',
    'Processo de entrega',
    'Comunicação com o cliente',
    'Métricas de desempenho',
    'Escala com processamento em lote',
    'Revisão de 30 dias e próximo plano',
];

const NEGOTIATION_DAY_TITLES = [
    'Panorama geral de negócios',
    'Posicionamento de valor',
    'Estratégia de tabela de preços',
    'Psicologia de preços',
    'Checklist de preparação para negociação',
    'Framework de chamada de descoberta',
    'Pesquise orçamentos de marca',
    'Defina não negociáveis',
    'Construa um esboço de proposta',
    'Escopo e entregáveis',
    'Direitos de uso e licenças',
    'Cláusulas de exclusividade',
    'Whitelisting e uso de anúncios',
    'Política de revisões',
    'Termos de pagamento',
    'Impostos e faturamento',
    'Scripts de negociação por email',
    'Gestão de objeções',
    'Pacotes e vendas adicionais',
    'Negociação de cronograma',
    'Sinais de alerta em contratos',
    'Noções legais básicas para criadores',
    'Jogo de papéis de negociação',
    'Técnicas de fechamento',
    'Construção de relacionamentos',
    'Renovações e retainers',
    'Proteção de limites',
    'Criação de estudo de caso',
    'Aumente o tamanho médio do negócio',
    'Revisão de negociação e manual',
];

const PRODUCTION_DAY_TITLES = [
    'Visão geral do fluxo de produção',
    'Planejamento de pré-produção',
    'Storyboards e listas de takes',
    'Exploração de locações',
    'Design de cenário e adereços',
    'Configurações de câmera',
    'Enquadramento e composição',
    'Domínio de iluminação natural',
    'Configurações de iluminação artificial',
    'Melhores práticas de gravação de áudio',
    'Gravação de demonstrações de produtos',
    'Gravação de estilo depoimento',
    'Gravação de cenas de estilo de vida',
    'Movimento e transições',
    'Variedade de b-roll',
    'Edição para ritmo',
    'Fundamentos de correção de cor',
    'Design de som',
    'Sobreposições de texto e legendas',
    'Formatação de plataforma',
    'Design de miniaturas e capas',
    'Checklist de controle de qualidade',
    'Organização de arquivos e backups',
    'Colaboração com marcas',
    'Dia de produção em lote',
    'Reutilização de recursos',
    'Técnicas avançadas de edição',
    'Testes A/B de criatividade',
    'Análise de desempenho',
    'Manual de produção e escala',
];

const UGC_WEEK_TITLES = [
    'Semana 1: Fundamentos',
    'Semana 2: Fundamentos de produção',
    'Semana 3: Portfólio e preços',
    'Semana 4: Contato e entrega',
    'Semana 5: Escala e revisão',
];

const NEGOTIATION_WEEK_TITLES = [
    'Semana 1: Valor e preparação',
    'Semana 2: Estrutura do negócio',
    'Semana 3: Habilidades de negociação',
    'Semana 4: Contratos e fechamento',
    'Semana 5: Retainers e crescimento',
];

const PRODUCTION_WEEK_TITLES = [
    'Semana 1: Pré-produção',
    'Semana 2: Habilidades de filmagem',
    'Semana 3: Domínio da edição',
    'Semana 4: Excelência de entrega',
    'Semana 5: Escala e otimização',
];

const UGC_WEEK_TIPS = [
    'A clareza supera a complexidade. Mantenha cada entregável simples e focado.',
    'Pequenas repetições diárias criam impulso mais rapidamente do que sprints semanais longos.',
    'Mostre seu processo às marcas, não apenas o resultado final.',
    'Torne a comunicação com o cliente proativa e previsível.',
    'Registre suas vitórias e duplique o que converte.',
];

const NEGOTIATION_WEEK_TIPS = [
    'A confiança vem de conhecer seus números e seu valor.',
    'Defina o escopo por escrito antes de falar de preço.',
    'O silêncio depois de sua tarifa é uma ferramenta de negociação.',
    'Proteja seu tempo com limites claros de revisão.',
    'Retainers são construídos através da consistência e dos resultados.',
];

const PRODUCTION_WEEK_TIPS = [
    'Planeje a gravação antes de ligar a câmera.',
    'A qualidade da iluminação importa mais do que a qualidade da câmera.',
    'Edite primeiro para clareza, segundo para estilo.',
    'Construa um checklist de entrega repetível.',
    'Processe o trabalho em lote para manter a energia criativa alta.',
];

export const COURSE_SEED = [
    {
        id: 'ugc-creator-mastery',
        order: 1,
        title: 'Domínio do Criador UGC',
        subtitle: 'Construa seu negócio UGC do zero',
        shortDescription: 'Um guia completo sobre como começar sua carreira UGC e ter muito sucesso.',
        description:
            'Transforme-se de iniciante completo em criador UGC profissional em 30 dias com tarefas acionáveis diárias.',
        icon: 'videocam',
        accent: '#4F46E5',
        gradient: ['#EEF2FF', '#FFFFFF', '#EEF2FF'],
        totalDays: 30,
        days: buildDays(UGC_DAY_TITLES, UGC_WEEK_TITLES, UGC_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'brand-deal-negotiation',
        order: 2,
        title: 'Negociação de Negócios com Marcas',
        subtitle: 'Consiga melhores negócios e proteja seu valor',
        shortDescription: 'Domine a arte de negociar negócios com marcas e maximizar seus ganhos.',
        description:
            'Aprenda como estruturar, negociar e fechar negócios com marcas com confiança enquanto protege seu tempo.',
        icon: 'trending-up',
        accent: '#0F766E',
        gradient: ['#ECFDF5', '#FFFFFF', '#ECFEFF'],
        totalDays: 30,
        days: buildDays(NEGOTIATION_DAY_TITLES, NEGOTIATION_WEEK_TITLES, NEGOTIATION_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'content-production-pro',
        order: 3,
        title: 'Produção de Conteúdo Pro',
        subtitle: 'Filme, edite e entregue como um profissional',
        shortDescription: 'Técnicas de produção profissional para criar UGC de alta conversão.',
        description: 'Melhore seu fluxo de produção com sistemas avançados de filmagem, edição e entrega.',
        icon: 'camera',
        accent: '#9333EA',
        gradient: ['#F5F3FF', '#FFFFFF', '#FDF2F8'],
        totalDays: 30,
        days: buildDays(PRODUCTION_DAY_TITLES, PRODUCTION_WEEK_TITLES, PRODUCTION_WEEK_TIPS),
        releaseAt: buildNextMonthStart(),
    },
];
