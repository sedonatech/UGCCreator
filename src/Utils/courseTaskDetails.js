const normalizeTopic = value => {
    if (!value || typeof value !== 'string') return 'this topic';
    return value.trim().replace(/\s+/g, ' ');
};

const normalizeLanguage = language => {
    const normalized = (language || 'en').toLowerCase();
    if (normalized.startsWith('es')) return 'es';
    if (normalized.startsWith('fr')) return 'fr';
    if (normalized.startsWith('de')) return 'de';
    if (normalized.startsWith('pt')) return 'pt';
    return 'en';
};

const TAG_TYPE_BY_KEY = {
    learn: 'Learn',
    lernen: 'Learn',
    aprende: 'Learn',
    apprendre: 'Learn',
    aprender: 'Learn',
    action: 'Action',
    accion: 'Action',
    aktion: 'Action',
    acao: 'Action',
    build: 'Build',
    construye: 'Build',
    construire: 'Build',
    construir: 'Build',
    erstellen: 'Build',
    review: 'Review',
    revisa: 'Review',
    revision: 'Review',
    revisao: 'Review',
    uberprufung: 'Review',
};

const normalizeTagKey = value =>
    (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const toCanonicalTag = tag => TAG_TYPE_BY_KEY[normalizeTagKey(tag)] || 'Learn';

const lowerFirst = value => {
    if (!value || typeof value !== 'string') return value;
    return value.charAt(0).toLowerCase() + value.slice(1);
};

const TASK_COPY = {
    en: {
        title: {
            Learn: topic => `Understand ${topic}`,
            Action: topic => `Practice ${topic}`,
            Build: topic => `Build a small ${topic} asset`,
            Review: () => 'Review and improve',
        },
        description: {
            Learn: (topic, topicLower) =>
                `Goal: understand what ${topicLower} looks like in real UGC work. Steps: 1) Read one short guide and watch one beginner-friendly video about ${topicLower}. 2) Write three rules you want to follow when you apply it. 3) Save your sources in your notes so you can revisit them. Suggested sources: YouTube ("UGC ${topic}"), TikTok Creative Center, Meta Ads Library, and creator education blogs.`,
            Action: () =>
                'Use a real or mock product and run one focused practice session. Steps: 1) Define what "good" looks like before you start. 2) Complete one timed rep (no perfection pass). 3) Note what worked, what felt hard, and what to improve on your next attempt.',
            Build: () =>
                `Create proof of execution you can add to your portfolio. Examples: a script draft, checklist, shot list, outreach template, or 15-30 second sample clip. Keep it simple, finish it today, and save it in a folder you can share with brands later.`,
            Review: () =>
                'Score your result from 1-5 on clarity, quality, and speed. Write one change you will make tomorrow and one question to research before your next session.',
        },
        details: {
            Learn: topic => ({
                overview: `Build a clear understanding of ${lowerFirst(topic)} before you execute.`,
                whyItMatters: `When you understand ${lowerFirst(
                    topic,
                )}, you make better creative decisions and reduce wasted effort.`,
                steps: [
                    `Research ${lowerFirst(topic)} using one article and one practical video example.`,
                    'Capture three notes: what strong execution looks like, what weak execution looks like, and one pattern you noticed.',
                    'Write one simple rule you will follow the next time you create content.',
                    'Save your references in a swipe file folder for fast reuse.',
                ],
                deliverable: `A one-page note with your ${lowerFirst(
                    topic,
                )} key takeaways and personal execution rules.`,
                resources: [
                    `YouTube search: "UGC ${topic} beginner tutorial"`,
                    'TikTok Creative Center for top-performing ad examples',
                    'Meta Ads Library for real brand creative references',
                ],
                doneWhen: 'You can explain the concept in plain language and point to at least two real examples.',
            }),
            Action: topic => ({
                overview: `Practice ${lowerFirst(topic)} in a focused rep so you can build skill through execution.`,
                whyItMatters: 'Execution creates confidence faster than passive learning.',
                steps: [
                    'Pick one product (real or mock) and define a single objective for the rep.',
                    `Apply ${lowerFirst(topic)} in one timed attempt without over-editing.`,
                    'Review your output and identify one strength and one weakness.',
                    'Run a second quick pass using your improvement note.',
                ],
                deliverable: `One before/after practice result that shows how you improved ${lowerFirst(
                    topic,
                )} in one session.`,
                resources: [
                    'Phone timer for focused sprint blocks',
                    'Notion or Notes app for practice logs',
                    'A saved folder of three reference creators in your niche',
                ],
                doneWhen: 'You complete at least one full rep and record a concrete improvement for the next attempt.',
            }),
            Build: topic => ({
                overview: `Create a portfolio-ready asset that proves you can execute ${lowerFirst(topic)}.`,
                whyItMatters: 'Brands buy proof, not promises.',
                steps: [
                    'Choose one asset format: script, checklist, shot list, pitch draft, or short clip.',
                    `Build it around ${lowerFirst(topic)} with a clear beginning, middle, and end.`,
                    'Polish for clarity and save with a professional filename.',
                    'Store the final version in your portfolio folder with date and context.',
                ],
                deliverable: `One shareable ${lowerFirst(topic)} asset you can include in your portfolio or media kit.`,
                resources: [
                    'Google Drive/Dropbox folder for organized portfolio assets',
                    'Canva or CapCut templates for lightweight production',
                    'Your swipe file to model style and structure',
                ],
                doneWhen: 'Your asset is complete, saved, and ready to show to a brand or mentor for feedback.',
            }),
            Review: topic => ({
                overview: `Review your work on ${lowerFirst(topic)} so each day gets stronger than the last.`,
                whyItMatters: 'Consistent review compounds progress and reduces repeated mistakes.',
                steps: [
                    'Rate your output from 1-5 for clarity, quality, and speed.',
                    'Write what worked and what felt difficult.',
                    'Pick one adjustment for tomorrow and define how you will measure it.',
                    "Set up tomorrow's first task so you can start quickly.",
                ],
                deliverable:
                    'A daily reflection note with scores, one improvement action, and a clear plan for tomorrow.',
                resources: ['Simple scorecard in Notes/Notion', 'A recurring 10-minute end-of-session review reminder'],
                doneWhen: 'You have a specific change planned for tomorrow and a measurable way to track it.',
            }),
        },
    },
    es: {
        title: {
            Learn: topic => `Comprende ${topic}`,
            Action: topic => `Practica ${topic}`,
            Build: topic => `Crea un recurso pequeno de ${topic}`,
            Review: () => 'Revisa y mejora',
        },
        description: {
            Learn: (topic, topicLower) =>
                `Objetivo: comprender como se ve ${topicLower} en trabajo UGC real. Pasos: 1) Lee una guia corta y mira un video introductorio sobre ${topicLower}. 2) Escribe tres reglas para aplicar hoy. 3) Guarda tus fuentes en tus notas para reutilizarlas. Fuentes sugeridas: YouTube ("UGC ${topic}"), TikTok Creative Center, Meta Ads Library y blogs para creadores.`,
            Action: () =>
                'Usa un producto real o simulado y realiza una practica enfocada. Pasos: 1) Define que significa hacerlo bien. 2) Haz una repeticion cronometrada sin perfeccionismo. 3) Anota que funciono, que fue dificil y que mejoraras en el siguiente intento.',
            Build: () =>
                'Crea evidencia de ejecucion para tu portafolio. Ejemplos: guion, checklist, lista de tomas, plantilla de outreach o clip de 15-30 segundos. Mantenlo simple, terminalo hoy y guardalo en una carpeta compartible.',
            Review: () =>
                'Califica tu resultado del 1 al 5 en claridad, calidad y velocidad. Escribe un cambio para manana y una pregunta para investigar antes de la siguiente sesion.',
        },
        details: {
            Learn: topic => ({
                overview: `Construye una comprension clara de ${lowerFirst(topic)} antes de ejecutar.`,
                whyItMatters: `Cuando comprendes ${lowerFirst(
                    topic,
                )}, tomas mejores decisiones y reduces trabajo perdido.`,
                steps: [
                    `Investiga ${lowerFirst(topic)} con un articulo y un video practico.`,
                    'Anota tres ideas: que se ve fuerte, que se ve debil y un patron que notaste.',
                    'Escribe una regla simple que aplicaras en tu proxima pieza.',
                    'Guarda referencias en una carpeta para reutilizarlas rapido.',
                ],
                deliverable: `Una nota de una pagina con aprendizajes clave de ${lowerFirst(
                    topic,
                )} y tus reglas de ejecucion.`,
                resources: [
                    `Busqueda en YouTube: "UGC ${topic} tutorial"`,
                    'TikTok Creative Center para ejemplos de anuncios',
                    'Meta Ads Library para referencias reales',
                ],
                doneWhen: 'Puedes explicar el concepto con claridad y mostrar al menos dos ejemplos reales.',
            }),
            Action: topic => ({
                overview: `Practica ${lowerFirst(topic)} en una repeticion enfocada para mejorar por ejecucion.`,
                whyItMatters: 'La ejecucion construye confianza mas rapido que solo consumir contenido.',
                steps: [
                    'Elige un producto y define un objetivo unico para la practica.',
                    `Aplica ${lowerFirst(topic)} en un intento cronometrado.`,
                    'Revisa tu resultado e identifica una fortaleza y una debilidad.',
                    'Haz un segundo intento rapido con el ajuste principal.',
                ],
                deliverable: `Un resultado antes/despues que demuestre mejora en ${lowerFirst(
                    topic,
                )} durante una sesion.`,
                resources: [
                    'Temporizador del telefono',
                    'Notas/Notion para bitacora de practica',
                    '3 creadores de referencia',
                ],
                doneWhen: 'Completas al menos una repeticion y registras una mejora concreta.',
            }),
            Build: topic => ({
                overview: `Crea un recurso listo para portafolio que pruebe tu capacidad en ${lowerFirst(topic)}.`,
                whyItMatters: 'Las marcas compran pruebas, no promesas.',
                steps: [
                    'Elige formato: guion, checklist, lista de tomas, borrador de pitch o clip corto.',
                    `Construyelo alrededor de ${lowerFirst(topic)} con inicio, desarrollo y cierre.`,
                    'Pulelo para claridad y guardalo con un nombre profesional.',
                    'Guarda la version final en tu carpeta de portafolio con fecha y contexto.',
                ],
                deliverable: `Un recurso compartible de ${lowerFirst(topic)} para tu portafolio o media kit.`,
                resources: ['Google Drive/Dropbox', 'Canva o CapCut', 'Carpeta de referencias'],
                doneWhen: 'El recurso esta finalizado, guardado y listo para mostrar a una marca o mentor.',
            }),
            Review: topic => ({
                overview: `Revisa tu trabajo sobre ${lowerFirst(topic)} para mejorar cada dia.`,
                whyItMatters: 'La revision constante multiplica el progreso y evita repetir errores.',
                steps: [
                    'Califica del 1 al 5 claridad, calidad y velocidad.',
                    'Escribe que funciono y que se sintio dificil.',
                    'Define un ajuste para manana y como lo mediras.',
                    'Deja preparada la primera tarea de manana.',
                ],
                deliverable: 'Una nota de reflexion diaria con puntajes, un ajuste y plan para manana.',
                resources: ['Scorecard simple en Notas/Notion', 'Recordatorio diario de 10 minutos'],
                doneWhen: 'Tienes un cambio concreto para manana y una forma de medirlo.',
            }),
        },
    },
    fr: {
        title: {
            Learn: topic => `Comprendre ${topic}`,
            Action: topic => `Pratiquer ${topic}`,
            Build: topic => `Creer un petit livrable ${topic}`,
            Review: () => 'Reviser et ameliorer',
        },
        description: {
            Learn: (topic, topicLower) =>
                `Objectif: comprendre a quoi ressemble ${topicLower} dans un vrai contexte UGC. Etapes: 1) Lis un guide court et regarde une video debutant sur ${topicLower}. 2) Note trois regles a appliquer. 3) Sauvegarde tes sources dans tes notes. Sources suggerees: YouTube ("UGC ${topic}"), TikTok Creative Center, Meta Ads Library, blogs createurs.`,
            Action: () =>
                'Utilise un produit reel ou fictif et fais une pratique ciblee. Etapes: 1) Definis ce que signifie un bon resultat. 2) Fais un essai chronometre sans perfectionnisme. 3) Note ce qui a fonctionne, ce qui etait difficile et le point a ameliorer.',
            Build: () =>
                'Cree une preuve d execution pour ton portfolio. Exemples: script, checklist, shot list, modele de pitch ou clip de 15-30 secondes. Garde-le simple, termine-le aujourd hui et classe-le dans un dossier partageable.',
            Review: () =>
                'Note ton resultat de 1 a 5 sur clarte, qualite et rapidite. Ecris un changement pour demain et une question a rechercher avant la prochaine session.',
        },
        details: {
            Learn: topic => ({
                overview: `Construis une comprehension claire de ${lowerFirst(topic)} avant de passer a l action.`,
                whyItMatters: `Quand tu comprends ${lowerFirst(topic)}, tu prends de meilleures decisions creatives.`,
                steps: [
                    `Etudie ${lowerFirst(topic)} avec un article et une video pratique.`,
                    'Note trois points: bon execution, execution faible, et un schema recurrent.',
                    'Ecris une regle simple a appliquer a ta prochaine creation.',
                    'Sauvegarde tes references dans un dossier reutilisable.',
                ],
                deliverable: `Une note d une page avec les points cles sur ${lowerFirst(topic)} et tes regles.`,
                resources: ['Recherche YouTube UGC', 'TikTok Creative Center', 'Meta Ads Library'],
                doneWhen: 'Tu peux expliquer le concept simplement et montrer au moins deux exemples.',
            }),
            Action: topic => ({
                overview: `Pratique ${lowerFirst(topic)} sur un exercice cible pour progresser par l execution.`,
                whyItMatters: 'L execution developpe la confiance plus vite que la theorie seule.',
                steps: [
                    'Choisis un produit et un objectif unique pour la session.',
                    `Applique ${lowerFirst(topic)} dans un essai chronometre.`,
                    'Analyse le resultat: un point fort et un point faible.',
                    'Fais un deuxieme passage rapide avec ton principal ajustement.',
                ],
                deliverable: `Un resultat avant/apres montrant une progression sur ${lowerFirst(topic)}.`,
                resources: ['Minuteur', 'Notes/Notion', '3 createurs de reference'],
                doneWhen: 'Tu as termine un cycle complet et note une amelioration concrete.',
            }),
            Build: topic => ({
                overview: `Cree un livrable portfolio qui prouve ta maitrise de ${lowerFirst(topic)}.`,
                whyItMatters: 'Les marques achetent des preuves, pas des promesses.',
                steps: [
                    'Choisis un format: script, checklist, shot list, pitch ou clip court.',
                    `Structure le livrable autour de ${lowerFirst(topic)} avec debut, milieu, fin.`,
                    'Polis la clarte et enregistre le fichier avec un nom professionnel.',
                    'Classe la version finale dans ton dossier portfolio.',
                ],
                deliverable: `Un livrable partageable sur ${lowerFirst(topic)} pour portfolio ou media kit.`,
                resources: ['Google Drive/Dropbox', 'Canva/CapCut', 'Swipe file'],
                doneWhen: 'Le livrable est finalise, enregistre et pret a etre partage.',
            }),
            Review: topic => ({
                overview: `Passe en revue ton travail sur ${lowerFirst(topic)} pour progresser chaque jour.`,
                whyItMatters: 'Une revision reguliere accelere la progression et evite les erreurs repetitives.',
                steps: [
                    'Note clarte, qualite et rapidite de 1 a 5.',
                    'Ecris ce qui a fonctionne et ce qui etait difficile.',
                    'Definis un ajustement pour demain et comment le mesurer.',
                    'Prepare la premiere tache de demain.',
                ],
                deliverable: 'Une note quotidienne avec scores, ajustement et plan du lendemain.',
                resources: ['Scorecard simple', 'Rappel de revision de 10 minutes'],
                doneWhen: 'Tu as une action precise pour demain et une mesure associee.',
            }),
        },
    },
    de: {
        title: {
            Learn: topic => `Verstehe ${topic}`,
            Action: topic => `Ube ${topic}`,
            Build: topic => `Erstelle ein kleines ${topic}-Ergebnis`,
            Review: () => 'Prufe und verbessere',
        },
        description: {
            Learn: (topic, topicLower) =>
                `Ziel: Verstehen, wie ${topicLower} in echter UGC-Arbeit aussieht. Schritte: 1) Lies einen kurzen Guide und schaue ein Einsteiger-Video zu ${topicLower}. 2) Notiere drei Regeln fur deine Anwendung. 3) Speichere Quellen in deinen Notizen. Empfohlene Quellen: YouTube ("UGC ${topic}"), TikTok Creative Center, Meta Ads Library, Creator-Blogs.`,
            Action: () =>
                'Nutze ein echtes oder fiktives Produkt und mach eine fokussierte Praxis-Session. Schritte: 1) Definiere, was ein gutes Ergebnis ist. 2) Mache einen zeitlich begrenzten Versuch ohne Perfektionismus. 3) Notiere, was funktioniert hat, was schwer war und was du verbesserst.',
            Build: () =>
                'Erstelle einen Nachweis fur dein Portfolio. Beispiele: Skript, Checkliste, Shot-List, Outreach-Vorlage oder 15-30 Sekunden Clip. Halte es einfach, beende es heute und speichere es in einem teilbaren Ordner.',
            Review: () =>
                'Bewerte dein Ergebnis von 1 bis 5 in Klarheit, Qualitat und Geschwindigkeit. Notiere eine Verbesserung fur morgen und eine Frage zur weiteren Recherche.',
        },
        details: {
            Learn: topic => ({
                overview: `Baue ein klares Verstandnis von ${lowerFirst(topic)} auf, bevor du umsetzt.`,
                whyItMatters: `Wenn du ${lowerFirst(topic)} verstehst, triffst du bessere kreative Entscheidungen.`,
                steps: [
                    `Recherchiere ${lowerFirst(topic)} mit einem Artikel und einem Praxisvideo.`,
                    'Notiere drei Punkte: starke Umsetzung, schwache Umsetzung und ein erkanntes Muster.',
                    'Schreibe eine einfache Regel fur deine nachste Produktion.',
                    'Lege Referenzen in einem wiederverwendbaren Ordner ab.',
                ],
                deliverable: `Eine einseitige Notiz mit deinen wichtigsten Erkenntnissen zu ${lowerFirst(topic)}.`,
                resources: ['YouTube-Suche nach UGC-Beispielen', 'TikTok Creative Center', 'Meta Ads Library'],
                doneWhen: 'Du kannst das Thema einfach erklaren und mindestens zwei Beispiele zeigen.',
            }),
            Action: topic => ({
                overview: `Ube ${lowerFirst(
                    topic,
                )} in einer fokussierten Wiederholung, um durch Umsetzung besser zu werden.`,
                whyItMatters: 'Umsetzung baut schneller Vertrauen auf als nur Theorie.',
                steps: [
                    'Wahle ein Produkt und ein klares Ziel fur die Session.',
                    `Wende ${lowerFirst(topic)} in einem zeitlich begrenzten Versuch an.`,
                    'Analysiere dein Ergebnis: eine Starke und eine Schwache.',
                    'Mache einen zweiten schnellen Durchlauf mit deiner wichtigsten Verbesserung.',
                ],
                deliverable: `Ein Vorher/Nachher-Ergebnis, das deine Verbesserung bei ${lowerFirst(topic)} zeigt.`,
                resources: ['Timer-App', 'Notizen/Notion', '3 Referenz-Creator'],
                doneWhen:
                    'Du hast mindestens einen kompletten Durchlauf abgeschlossen und eine konkrete Verbesserung notiert.',
            }),
            Build: topic => ({
                overview: `Erstelle ein portfoliofahiges Asset, das deine Umsetzung von ${lowerFirst(topic)} beweist.`,
                whyItMatters: 'Marken kaufen Beweise, nicht Versprechen.',
                steps: [
                    'Wahle ein Format: Skript, Checkliste, Shot-List, Pitch-Entwurf oder kurzer Clip.',
                    `Baue es rund um ${lowerFirst(topic)} mit klarem Anfang, Mitte und Ende auf.`,
                    'Poliere es fur Klarheit und speichere mit professionellem Dateinamen.',
                    'Lege die finale Version in deinem Portfolio-Ordner ab.',
                ],
                deliverable: `Ein teilbares ${lowerFirst(topic)}-Asset fur Portfolio oder Media Kit.`,
                resources: ['Google Drive/Dropbox', 'Canva/CapCut', 'Swipe-File'],
                doneWhen: 'Dein Asset ist fertig, gespeichert und bereit zum Teilen.',
            }),
            Review: topic => ({
                overview: `Reflektiere deine Arbeit zu ${lowerFirst(topic)}, damit jeder Tag starker wird.`,
                whyItMatters: 'Regelmassige Reflexion beschleunigt Fortschritt und reduziert Fehler.',
                steps: [
                    'Bewerte Klarheit, Qualitat und Tempo von 1 bis 5.',
                    'Notiere, was funktioniert hat und was schwer war.',
                    'Lege eine Anpassung fur morgen fest und wie du sie misst.',
                    'Bereite die erste Aufgabe fur morgen vor.',
                ],
                deliverable: 'Eine Tagesreflexion mit Bewertung, Anpassung und Plan fur morgen.',
                resources: ['Einfache Scorecard', '10-Minuten-Erinnerung'],
                doneWhen: 'Du hast eine klare Anpassung fur morgen und eine Messmethode.',
            }),
        },
    },
    pt: {
        title: {
            Learn: topic => `Entenda ${topic}`,
            Action: topic => `Pratique ${topic}`,
            Build: topic => `Crie um pequeno recurso de ${topic}`,
            Review: () => 'Revise e melhore',
        },
        description: {
            Learn: (topic, topicLower) =>
                `Objetivo: entender como ${topicLower} aparece em trabalho UGC real. Passos: 1) Leia um guia curto e veja um video inicial sobre ${topicLower}. 2) Escreva tres regras para aplicar. 3) Salve as fontes nas suas notas. Fontes sugeridas: YouTube ("UGC ${topic}"), TikTok Creative Center, Meta Ads Library e blogs para criadores.`,
            Action: () =>
                'Use um produto real ou simulado e faca uma pratica focada. Passos: 1) Defina o que significa um bom resultado. 2) Execute uma tentativa cronometrada sem perfeccionismo. 3) Registre o que funcionou, o que foi dificil e o que melhorar.',
            Build: () =>
                'Crie prova de execucao para seu portfolio. Exemplos: roteiro, checklist, lista de takes, modelo de outreach ou clipe de 15-30 segundos. Mantenha simples, finalize hoje e salve em uma pasta compartilhavel.',
            Review: () =>
                'Avalie seu resultado de 1 a 5 em clareza, qualidade e velocidade. Escreva uma melhoria para amanha e uma pergunta para pesquisar antes da proxima sessao.',
        },
        details: {
            Learn: topic => ({
                overview: `Construa uma compreensao clara de ${lowerFirst(topic)} antes de executar.`,
                whyItMatters: `Quando voce entende ${lowerFirst(
                    topic,
                )}, toma decisoes criativas melhores e reduz retrabalho.`,
                steps: [
                    `Pesquise ${lowerFirst(topic)} com um artigo e um video pratico.`,
                    'Registre tres notas: execucao forte, execucao fraca e um padrao observado.',
                    'Escreva uma regra simples para aplicar na proxima criacao.',
                    'Salve referencias em uma pasta para reutilizacao rapida.',
                ],
                deliverable: `Uma nota de uma pagina com os principais aprendizados sobre ${lowerFirst(topic)}.`,
                resources: ['Busca no YouTube por UGC', 'TikTok Creative Center', 'Meta Ads Library'],
                doneWhen: 'Voce consegue explicar o conceito com clareza e citar pelo menos dois exemplos reais.',
            }),
            Action: topic => ({
                overview: `Pratique ${lowerFirst(topic)} em uma repeticao focada para evoluir por execucao.`,
                whyItMatters: 'Executar constroi confianca mais rapido do que apenas estudar.',
                steps: [
                    'Escolha um produto e defina um unico objetivo para a sessao.',
                    `Aplique ${lowerFirst(topic)} em uma tentativa cronometrada.`,
                    'Revise o resultado e identifique um ponto forte e um fraco.',
                    'Faca uma segunda passada rapida com sua principal melhoria.',
                ],
                deliverable: `Um resultado antes/depois mostrando evolucao em ${lowerFirst(topic)}.`,
                resources: ['Timer do celular', 'Notas/Notion', '3 criadores de referencia'],
                doneWhen: 'Voce concluiu pelo menos uma repeticao completa e registrou uma melhoria concreta.',
            }),
            Build: topic => ({
                overview: `Crie um recurso pronto para portfolio que prove sua capacidade em ${lowerFirst(topic)}.`,
                whyItMatters: 'Marcas compram prova, nao promessa.',
                steps: [
                    'Escolha um formato: roteiro, checklist, lista de takes, pitch ou clipe curto.',
                    `Estruture em torno de ${lowerFirst(topic)} com inicio, meio e fim.`,
                    'Refine para clareza e salve com nome profissional.',
                    'Guarde a versao final na pasta de portfolio com data e contexto.',
                ],
                deliverable: `Um recurso compartilhavel de ${lowerFirst(topic)} para portfolio ou media kit.`,
                resources: ['Google Drive/Dropbox', 'Canva/CapCut', 'Pasta de referencias'],
                doneWhen: 'O recurso esta finalizado, salvo e pronto para compartilhar.',
            }),
            Review: topic => ({
                overview: `Revise seu trabalho sobre ${lowerFirst(topic)} para evoluir todos os dias.`,
                whyItMatters: 'Revisao consistente acelera progresso e evita erros repetidos.',
                steps: [
                    'Dê nota de 1 a 5 para clareza, qualidade e velocidade.',
                    'Anote o que funcionou e o que foi dificil.',
                    'Defina um ajuste para amanha e como sera medido.',
                    'Deixe preparada a primeira tarefa de amanha.',
                ],
                deliverable: 'Uma reflexao diaria com notas, um ajuste e plano para o dia seguinte.',
                resources: ['Scorecard simples em Notas/Notion', 'Lembrete diario de 10 minutos'],
                doneWhen: 'Voce tem um ajuste especifico para amanha e uma forma de medir.',
            }),
        },
    },
};

const isLegacyTitle = title => {
    const value = title || '';
    return (
        /^Learn\s/i.test(value) ||
        /^Apply\s/i.test(value) ||
        /^Create a deliverable$/i.test(value) ||
        /^Review and reflect$/i.test(value) ||
        /^Aprende\s/i.test(value) ||
        /^Aplica\s/i.test(value) ||
        /^Crea un entregable$/i.test(value) ||
        /^Revisa y reflexiona$/i.test(value) ||
        /^Apprendre\s/i.test(value) ||
        /^Appliquer\s/i.test(value) ||
        /^Creer un livrable$/i.test(value) ||
        /^Créer un livrable$/i.test(value) ||
        /^Reviser et reflechir$/i.test(value) ||
        /^Réviser et réfléchir$/i.test(value) ||
        /^Lerne\s/i.test(value) ||
        /^Wende\s/i.test(value) ||
        /^Erstelle ein Ergebnis$/i.test(value) ||
        /^Uberprufe und reflektiere$/i.test(value) ||
        /^Überprüfe und reflektiere$/i.test(value) ||
        /^Aprenda\s/i.test(value) ||
        /^Aplique\s/i.test(value) ||
        /^Crie um entregavel$/i.test(value) ||
        /^Crie um entregável$/i.test(value) ||
        /^Revise e reflita$/i.test(value) ||
        /^Aprende\s/i.test(value) ||
        /^Aplica\s/i.test(value) ||
        /^Cria um entregavel$/i.test(value) ||
        /^Cria um entregável$/i.test(value) ||
        /^Reve e reflete$/i.test(value) ||
        /^Revê e reflete$/i.test(value)
    );
};

const isLegacyDescription = description => {
    const value = description || '';
    return (
        /Spend 20 minutes studying|Complete a focused exercise|Draft a small asset that proves you can execute|Score your output on clarity, quality, and speed\./i.test(
            value,
        ) ||
        /Dedica 20 minutos a estudiar|Completa un ejercicio enfocado|Redacta un pequeno recurso|Redacta un pequeño recurso|Califica tu resultado en claridad, calidad y velocidad\./i.test(
            value,
        ) ||
        /Consacrez 20 minutes a etudier|Consacrez 20 minutes à étudier|Completez un exercice cible|Complétez un exercice ciblé|Redigez un petit element|Rédigez un petit élément|Evaluez votre production|Évaluez votre production/i.test(
            value,
        ) ||
        /Verbringe 20 Minuten damit|Absolviere eine fokussierte Ubung|Absolviere eine fokussierte Übung|Erstelle ein kleines Element|Bewerte dein Ergebnis nach Klarheit/i.test(
            value,
        ) ||
        /Dedique 20 minutos estudando|Complete um exercicio focado|Complete um exercício focado|Elabore um pequeno recurso|Avalie seu resultado em clareza/i.test(
            value,
        ) ||
        /Dedica 20 minutos a estudar|Completa um exercicio focado|Completa um exercício focado|Redige um pequeno recurso|Avalia o teu resultado em clareza/i.test(
            value,
        )
    );
};

const getTaskCopy = language => TASK_COPY[normalizeLanguage(language)] || TASK_COPY.en;

const buildTaskTitle = ({ tag, topic, language = 'en' }) => {
    const resolvedTag = toCanonicalTag(tag);
    const copy = getTaskCopy(language);
    const builder = copy.title[resolvedTag] || copy.title.Learn;
    return builder(topic);
};

const buildTaskDescription = ({ tag, topic, language = 'en' }) => {
    const resolvedTag = toCanonicalTag(tag);
    const copy = getTaskCopy(language);
    const builder = copy.description[resolvedTag] || copy.description.Learn;
    return builder(topic, lowerFirst(topic));
};

export const buildTaskDetails = ({ tag, topic, language = 'en' }) => {
    const resolvedTag = toCanonicalTag(tag);
    const normalizedTopic = normalizeTopic(topic);
    const copy = getTaskCopy(language);
    const builder = copy.details[resolvedTag] || copy.details.Learn;
    return builder(normalizedTopic);
};

export const ensureTaskHasDetails = (task, dayTitle, language = 'en') => {
    const normalizedTopic = normalizeTopic(dayTitle || task?.title);
    const resolvedTag = toCanonicalTag(task?.tag);
    const fallback = buildTaskDetails({
        tag: resolvedTag,
        topic: normalizedTopic,
        language,
    });
    const existing = task?.details || {};

    return {
        ...task,
        title: isLegacyTitle(task?.title)
            ? buildTaskTitle({ tag: resolvedTag, topic: normalizedTopic, language })
            : task?.title,
        description: isLegacyDescription(task?.description)
            ? buildTaskDescription({ tag: resolvedTag, topic: normalizedTopic, language })
            : task?.description,
        details: {
            overview: existing.overview || fallback.overview,
            whyItMatters: existing.whyItMatters || fallback.whyItMatters,
            steps: Array.isArray(existing.steps) && existing.steps.length ? existing.steps : fallback.steps,
            deliverable: existing.deliverable || fallback.deliverable,
            resources:
                Array.isArray(existing.resources) && existing.resources.length
                    ? existing.resources
                    : fallback.resources,
            doneWhen: existing.doneWhen || fallback.doneWhen,
        },
    };
};
