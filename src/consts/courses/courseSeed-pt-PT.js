const buildNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
};

const buildTasksForTitle = title => [
    {
        title: `Aprende ${title}`,
        description: `Dedica 20 minutos a estudar ${title.toLowerCase()}. Anota três conclusões que possas aplicar hoje.`,
        tag: 'Aprender',
        durationMinutes: 20,
    },
    {
        title: `Aplica ${title}`,
        description: `Completa um exercício focado que põe ${title.toLowerCase()} em prática com um produto real ou um briefing simulado.`,
        tag: 'Ação',
        durationMinutes: 30,
    },
    {
        title: `Cria um entregável`,
        description: `Redige um pequeno recurso que prove que consegues executar ${title.toLowerCase()} (notas, lista de verificação ou clip curto).`,
        tag: 'Construir',
        durationMinutes: 25,
    },
    {
        title: 'Revê e reflete',
        description: 'Avalia o teu resultado em clareza, qualidade e velocidade. Anota uma melhoria para amanhã.',
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
            summary: `O dia ${day} foca-se em ${title.toLowerCase()}.`,
            weekTitle: weekTitles[weekIndex] || weekTitles[weekTitles.length - 1],
            tip: weekTips[weekIndex] || weekTips[weekTips.length - 1],
            tasks: buildTasksForTitle(title),
        };
    });

const UGC_DAY_TITLES = [
    'Orientação e objetivos',
    'Mentalidade e hábitos do criador',
    'Define o teu nicho',
    'Pesquisa de audiência',
    'Pesquisa de marca',
    'Auditoria de estilo de conteúdo',
    'Constrói a tua declaração de criador',
    'Equipamento e configuração básica',
    'Fundamentos de iluminação e áudio',
    'Filmar com telemóvel',
    'Gravar b-roll',
    'Fluxo de trabalho de edição',
    'Fundamentos de escrita de guião',
    'Fórmulas de gancho',
    'CTA e estrutura',
    'Planeamento de portfólio',
    'Cria três vídeos de amostra',
    'Cria três fotos de amostra',
    'Constrói o teu kit de media',
    'Preços e pacotes',
    'Construção de lista de contactos',
    'Estrutura de proposta a frio',
    'Sistema de seguimento',
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
    'Lista de verificação de preparação para negociação',
    'Estrutura de chamada de descoberta',
    'Pesquisa orçamentos de marca',
    'Define não negociáveis',
    'Constrói um esboço de proposta',
    'Âmbito e entregáveis',
    'Direitos de uso e licenças',
    'Cláusulas de exclusividade',
    'Whitelisting e uso de anúncios',
    'Política de revisões',
    'Termos de pagamento',
    'Impostos e faturação',
    'Scripts de negociação por email',
    'Gestão de objeções',
    'Agrupamento e vendas adicionais',
    'Negociação de cronograma',
    'Sinais de alerta em contratos',
    'Noções legais básicas para criadores',
    'Jogo de papéis de negociação',
    'Técnicas de fecho',
    'Construção de relações',
    'Renovações e retainers',
    'Proteção de limites',
    'Criação de estudo de caso',
    'Aumenta o tamanho médio do negócio',
    'Revisão de negociação e manual',
];

const PRODUCTION_DAY_TITLES = [
    'Visão geral do fluxo de produção',
    'Planeamento de pré-produção',
    'Storyboards e listas de takes',
    'Exploração de localizações',
    'Design de cenário e adereços',
    'Configurações de câmara',
    'Enquadramento e composição',
    'Domínio de iluminação natural',
    'Configurações de iluminação artificial',
    'Melhores práticas de gravação de áudio',
    'Gravação de demonstrações de produtos',
    'Gravação de estilo testemunhal',
    'Gravação de cenas de estilo de vida',
    'Movimento e transições',
    'Variedade de b-roll',
    'Edição para ritmo',
    'Fundamentos de correção de cor',
    'Design de som',
    'Sobreposições de texto e legendas',
    'Formatação de plataforma',
    'Design de miniaturas e capas',
    'Lista de verificação de controlo de qualidade',
    'Organização de ficheiros e backups',
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
    'Semana 4: Contacto e entrega',
    'Semana 5: Escala e revisão',
];

const NEGOTIATION_WEEK_TITLES = [
    'Semana 1: Valor e preparação',
    'Semana 2: Estrutura do negócio',
    'Semana 3: Competências de negociação',
    'Semana 4: Contratos e fecho',
    'Semana 5: Retainers e crescimento',
];

const PRODUCTION_WEEK_TITLES = [
    'Semana 1: Pré-produção',
    'Semana 2: Competências de filmagem',
    'Semana 3: Domínio da edição',
    'Semana 4: Excelência de entrega',
    'Semana 5: Escala e otimização',
];

const UGC_WEEK_TIPS = [
    'A clareza supera a complexidade. Mantém cada entregável simples e focado.',
    'Pequenas repetições diárias criam impulso mais rapidamente do que sprints semanais longos.',
    'Mostra o teu processo às marcas, não apenas o resultado final.',
    'Torna a comunicação com o cliente proativa e previsível.',
    'Regista as tuas vitórias e duplica o que converte.',
];

const NEGOTIATION_WEEK_TIPS = [
    'A confiança vem de conhecer os teus números e o teu valor.',
    'Define o âmbito por escrito antes de falar de preço.',
    'O silêncio depois da tua tarifa é uma ferramenta de negociação.',
    'Protege o teu tempo com limites claros de revisão.',
    'Os retainers são construídos através da consistência e dos resultados.',
];

const PRODUCTION_WEEK_TIPS = [
    'Planeia a gravação antes de ligar a câmara.',
    'A qualidade da iluminação importa mais do que a qualidade da câmara.',
    'Edita primeiro para clareza, segundo para estilo.',
    'Constrói uma lista de verificação de entrega repetível.',
    'Processa o trabalho em lote para manter a energia criativa alta.',
];

export const COURSE_SEED = [
    {
        id: 'ugc-creator-mastery',
        order: 1,
        title: 'Domínio do Criador UGC',
        subtitle: 'Constrói o teu negócio UGC de raiz',
        shortDescription: 'Um guia completo sobre como começar a tua carreira UGC e ter muito sucesso.',
        description:
            'Transforma-te de principiante completo em criador UGC profissional em 30 dias com tarefas acionáveis diárias.',
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
        subtitle: 'Consegue melhores negócios e protege o teu valor',
        shortDescription: 'Domina a arte de negociar negócios com marcas e maximizar os teus ganhos.',
        description:
            'Aprende como estruturar, negociar e fechar negócios com marcas com confiança enquanto proteges o teu tempo.',
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
        subtitle: 'Filma, edita e entrega como um profissional',
        shortDescription: 'Técnicas de produção profissional para criar UGC de alta conversão.',
        description: 'Melhora o teu fluxo de produção com sistemas avançados de filmagem, edição e entrega.',
        icon: 'camera',
        accent: '#9333EA',
        gradient: ['#F5F3FF', '#FFFFFF', '#FDF2F8'],
        totalDays: 30,
        days: buildDays(PRODUCTION_DAY_TITLES, PRODUCTION_WEEK_TITLES, PRODUCTION_WEEK_TIPS),
        releaseAt: buildNextMonthStart(),
    },
];
