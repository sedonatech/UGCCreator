const buildNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
};

const buildTasksForTitle = title => [
    {
        title: `Aprende ${title}`,
        description: `Dedica 20 minutos a estudiar ${title.toLowerCase()}. Anota tres conclusiones que puedas aplicar hoy.`,
        tag: 'Aprende',
        durationMinutes: 20,
    },
    {
        title: `Aplica ${title}`,
        description: `Completa un ejercicio enfocado que ponga ${title.toLowerCase()} en práctica con un producto real o un brief simulado.`,
        tag: 'Acción',
        durationMinutes: 30,
    },
    {
        title: `Crea un entregable`,
        description: `Redacta un pequeño recurso que demuestre que puedes ejecutar ${title.toLowerCase()} (notas, lista de verificación o clip corto).`,
        tag: 'Construye',
        durationMinutes: 25,
    },
    {
        title: 'Revisa y reflexiona',
        description: 'Califica tu resultado en claridad, calidad y velocidad. Anota una mejora para mañana.',
        tag: 'Revisa',
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
            summary: `El día ${day} se enfoca en ${title.toLowerCase()}.`,
            weekTitle: weekTitles[weekIndex] || weekTitles[weekTitles.length - 1],
            tip: weekTips[weekIndex] || weekTips[weekTips.length - 1],
            tasks: buildTasksForTitle(title),
        };
    });

const UGC_DAY_TITLES = [
    'Orientación y objetivos',
    'Mentalidad y hábitos del creador',
    'Define tu nicho',
    'Investigación de audiencia',
    'Investigación de marca',
    'Auditoría de estilo de contenido',
    'Construye tu declaración de creador',
    'Equipo y configuración básica',
    'Fundamentos de iluminación y audio',
    'Filmación con teléfono',
    'Grabación de b-roll',
    'Flujo de trabajo de edición',
    'Fundamentos de redacción de guiones',
    'Fórmulas de gancho',
    'CTA y estructura',
    'Planificación de portafolio',
    'Crea tres videos de muestra',
    'Crea tres fotos de muestra',
    'Construye tu kit de medios',
    'Precios y paquetes',
    'Construcción de lista de contactos',
    'Marco de propuesta en frío',
    'Sistema de seguimiento',
    'Fundamentos de negociación',
    'Aspectos esenciales del contrato',
    'Proceso de entrega',
    'Comunicación con el cliente',
    'Métricas de rendimiento',
    'Escala con procesamiento por lotes',
    'Revisión de 30 días y próximo plan',
];

const NEGOTIATION_DAY_TITLES = [
    'Panorama general de acuerdos',
    'Posicionamiento de valor',
    'Estrategia de tarifa de tarifas',
    'Psicología de precios',
    'Lista de verificación de preparación para negociación',
    'Marco de llamada de descubrimiento',
    'Investiga presupuestos de marca',
    'Define no negociables',
    'Construye un esquema de propuesta',
    'Alcance y entregables',
    'Derechos de uso y licencias',
    'Cláusulas de exclusividad',
    'Uso de whitelisting y anuncios',
    'Política de revisiones',
    'Términos de pago',
    'Impuestos y facturación',
    'Scripts de negociación por email',
    'Manejo de objeciones',
    'Agrupación y ventas adicionales',
    'Negociación de cronograma',
    'Señales de alerta en contratos',
    'Conceptos legales básicos para creadores',
    'Juego de roles de negociación',
    'Técnicas de cierre',
    'Construcción de relaciones',
    'Renovaciones y retainers',
    'Protección de límites',
    'Creación de caso de estudio',
    'Incrementa el tamaño promedio del trato',
    'Revisión de negociación y manual',
];

const PRODUCTION_DAY_TITLES = [
    'Visión general del flujo de trabajo de producción',
    'Planificación de preproducción',
    'Storyboards y listas de tomas',
    'Exploración de locaciones',
    'Diseño de set y utilería',
    'Configuraciones de cámara',
    'Encuadre y composición',
    'Dominio de iluminación natural',
    'Configuraciones de iluminación artificial',
    'Mejores prácticas de grabación de audio',
    'Grabación de demostraciones de productos',
    'Grabación de estilo testimonial',
    'Grabación de escenas de estilo de vida',
    'Movimiento y transiciones',
    'Variedad de b-roll',
    'Edición para ritmo',
    'Fundamentos de corrección de color',
    'Diseño de sonido',
    'Superposiciones de texto y subtítulos',
    'Formato de plataforma',
    'Diseño de miniaturas y portadas',
    'Lista de verificación de control de calidad',
    'Organización de archivos y copias de seguridad',
    'Colaboración con marcas',
    'Día de producción por lotes',
    'Reutilización de recursos',
    'Técnicas avanzadas de edición',
    'Pruebas A/B de creatividad',
    'Análisis de rendimiento',
    'Manual de producción y escala',
];

const UGC_WEEK_TITLES = [
    'Semana 1: Fundamentos',
    'Semana 2: Fundamentos de producción',
    'Semana 3: Portafolio y precios',
    'Semana 4: Contacto y entrega',
    'Semana 5: Escala y revisión',
];

const NEGOTIATION_WEEK_TITLES = [
    'Semana 1: Valor y preparación',
    'Semana 2: Estructura del acuerdo',
    'Semana 3: Habilidades de negociación',
    'Semana 4: Contratos y cierre',
    'Semana 5: Retainers y crecimiento',
];

const PRODUCTION_WEEK_TITLES = [
    'Semana 1: Preproducción',
    'Semana 2: Habilidades de filmación',
    'Semana 3: Dominio de la edición',
    'Semana 4: Excelencia en entrega',
    'Semana 5: Escala y optimización',
];

const UGC_WEEK_TIPS = [
    'La claridad supera la complejidad. Mantén cada entregable simple y enfocado.',
    'Las repeticiones diarias pequeñas generan impulso más rápido que los sprints semanales largos.',
    'Muestra tu proceso a las marcas, no solo el resultado final.',
    'Haz que la comunicación con el cliente sea proactiva y predecible.',
    'Rastrea tus victorias y duplica lo que convierte.',
];

const NEGOTIATION_WEEK_TIPS = [
    'La confianza viene de conocer tus números y tu valor.',
    'Define el alcance por escrito antes de hablar de precio.',
    'El silencio después de tu tarifa es una herramienta de negociación.',
    'Protege tu tiempo con límites claros de revisión.',
    'Los retainers se construyen a través de la consistencia y los resultados.',
];

const PRODUCTION_WEEK_TIPS = [
    'Planifica la grabación antes de encender la cámara.',
    'La calidad de la iluminación importa más que la calidad de la cámara.',
    'Edita primero para claridad, segundo para estilo.',
    'Construye una lista de verificación de entrega repetible.',
    'Procesa el trabajo por lotes para mantener alta la energía creativa.',
];

export const COURSE_SEED = [
    {
        id: 'ugc-creator-mastery',
        order: 1,
        title: 'Dominio del Creador UGC',
        subtitle: 'Construye tu negocio UGC desde cero',
        shortDescription: 'Una guía completa sobre cómo comenzar tu carrera UGC y tener mucho éxito.',
        description:
            'Transforma de principiante completo a creador UGC profesional en 30 días con tareas accionables diarias.',
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
        title: 'Negociación de Acuerdos con Marcas',
        subtitle: 'Consigue mejores acuerdos y protege tu valor',
        shortDescription: 'Domina el arte de negociar acuerdos con marcas y maximizar tus ganancias.',
        description:
            'Aprende cómo estructurar, negociar y cerrar acuerdos con marcas con confianza mientras proteges tu tiempo.',
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
        title: 'Producción de Contenido Pro',
        subtitle: 'Graba, edita y entrega como un profesional',
        shortDescription: 'Técnicas de producción profesional para crear UGC de alta conversión.',
        description: 'Mejora tu flujo de trabajo de producción con sistemas avanzados de grabación, edición y entrega.',
        icon: 'camera',
        accent: '#9333EA',
        gradient: ['#F5F3FF', '#FFFFFF', '#FDF2F8'],
        totalDays: 30,
        days: buildDays(PRODUCTION_DAY_TITLES, PRODUCTION_WEEK_TITLES, PRODUCTION_WEEK_TIPS),
        releaseAt: buildNextMonthStart(),
    },
];
