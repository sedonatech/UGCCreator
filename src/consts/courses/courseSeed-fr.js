import { COURSE_THEME_1, COURSE_THEME_2, COURSE_THEME_3 } from './courseThemeColors';

const buildNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
};

const buildTasksForTitle = title => [
    {
        title: `Apprendre ${title}`,
        description: `Consacrez 20 minutes à étudier ${title.toLowerCase()}. Notez trois points à retenir que vous pouvez appliquer aujourd'hui.`,
        tag: 'Apprendre',
        durationMinutes: 20,
    },
    {
        title: `Appliquer ${title}`,
        description: `Complétez un exercice ciblé qui met ${title.toLowerCase()} en pratique avec un produit réel ou un brief simulé.`,
        tag: 'Action',
        durationMinutes: 30,
    },
    {
        title: `Créer un livrable`,
        description: `Rédigez un petit élément qui prouve que vous pouvez exécuter ${title.toLowerCase()} (notes, liste de contrôle ou court clip).`,
        tag: 'Construire',
        durationMinutes: 25,
    },
    {
        title: 'Réviser et réfléchir',
        description: 'Évaluez votre production sur la clarté, la qualité et la rapidité. Notez une amélioration pour demain.',
        tag: 'Révision',
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
            summary: `Le jour ${day} se concentre sur ${title.toLowerCase()}.`,
            weekTitle: weekTitles[weekIndex] || weekTitles[weekTitles.length - 1],
            tip: weekTips[weekIndex] || weekTips[weekTips.length - 1],
            tasks: buildTasksForTitle(title),
        };
    });

const UGC_DAY_TITLES = [
    'Orientation et objectifs',
    'Mentalité et habitudes du créateur',
    'Définir votre niche',
    'Recherche d\'audience',
    'Recherche de marque',
    'Audit de style de contenu',
    'Construire votre déclaration de créateur',
    'Équipement et configuration de base',
    'Bases de l\'éclairage et de l\'audio',
    'Filmer avec un téléphone',
    'Tournage de b-roll',
    'Flux de travail de montage',
    'Bases de l\'écriture de scénario',
    'Formules d\'accroche',
    'CTA et structure',
    'Planification de portfolio',
    'Créer trois vidéos d\'exemple',
    'Créer trois photos d\'exemple',
    'Construire votre kit média',
    'Tarification et forfaits',
    'Construction de liste de prospection',
    'Cadre de proposition à froid',
    'Système de suivi',
    'Bases de la négociation',
    'Éléments essentiels du contrat',
    'Processus de livraison',
    'Communication client',
    'Métriques de performance',
    'Mise à l\'échelle par lots',
    'Révision de 30 jours et prochain plan',
];

const NEGOTIATION_DAY_TITLES = [
    'Vue d\'ensemble du paysage des contrats',
    'Positionnement de la valeur',
    'Stratégie de grille tarifaire',
    'Psychologie des prix',
    'Liste de contrôle de préparation à la négociation',
    'Cadre d\'appel de découverte',
    'Rechercher les budgets de marque',
    'Définir les non négociables',
    'Construire un plan de proposition',
    'Portée et livrables',
    'Droits d\'utilisation et licences',
    'Clauses d\'exclusivité',
    'Whitelisting et utilisation publicitaire',
    'Politique de révisions',
    'Conditions de paiement',
    'Taxes et facturation',
    'Scripts de négociation par email',
    'Gestion des objections',
    'Regroupement et ventes incitatives',
    'Négociation de calendrier',
    'Signaux d\'alarme dans les contrats',
    'Bases juridiques pour créateurs',
    'Jeu de rôle de négociation',
    'Techniques de clôture',
    'Construction de relations',
    'Renouvellements et contrats de maintien',
    'Protection des limites',
    'Création d\'étude de cas',
    'Augmenter la taille moyenne de l\'accord',
    'Révision de négociation et manuel',
];

const PRODUCTION_DAY_TITLES = [
    'Vue d\'ensemble du flux de production',
    'Planification de préproduction',
    'Storyboards et listes de plans',
    'Repérage de lieux',
    'Conception de décor et accessoires',
    'Paramètres de caméra',
    'Cadrage et composition',
    'Maîtrise de l\'éclairage naturel',
    'Configurations d\'éclairage artificiel',
    'Meilleures pratiques d\'enregistrement audio',
    'Tournage de démos de produits',
    'Tournage de style témoignage',
    'Tournage de scènes de style de vie',
    'Mouvement et transitions',
    'Variété de b-roll',
    'Montage pour le rythme',
    'Bases de la correction colorimétrique',
    'Conception sonore',
    'Incrustations de texte et sous-titres',
    'Formatage de plateforme',
    'Conception de vignettes et couvertures',
    'Liste de contrôle qualité',
    'Organisation des fichiers et sauvegardes',
    'Collaboration avec les marques',
    'Journée de production par lots',
    'Réutilisation des ressources',
    'Techniques de montage avancées',
    'Tests A/B de créativité',
    'Analyse de performance',
    'Manuel de production et mise à l\'échelle',
];

const UGC_WEEK_TITLES = [
    'Semaine 1 : Fondations',
    'Semaine 2 : Bases de production',
    'Semaine 3 : Portfolio et tarification',
    'Semaine 4 : Prospection et livraison',
    'Semaine 5 : Mise à l\'échelle et révision',
];

const NEGOTIATION_WEEK_TITLES = [
    'Semaine 1 : Valeur et préparation',
    'Semaine 2 : Structure de l\'accord',
    'Semaine 3 : Compétences de négociation',
    'Semaine 4 : Contrats et clôture',
    'Semaine 5 : Contrats de maintien et croissance',
];

const PRODUCTION_WEEK_TITLES = [
    'Semaine 1 : Préproduction',
    'Semaine 2 : Compétences de tournage',
    'Semaine 3 : Maîtrise du montage',
    'Semaine 4 : Excellence de livraison',
    'Semaine 5 : Mise à l\'échelle et optimisation',
];

const UGC_WEEK_TIPS = [
    'La clarté l\'emporte sur la complexité. Gardez chaque livrable simple et ciblé.',
    'Les petites répétitions quotidiennes créent un élan plus rapidement que les longs sprints hebdomadaires.',
    'Montrez votre processus aux marques, pas seulement le résultat final.',
    'Rendez la communication client proactive et prévisible.',
    'Suivez vos victoires et doublez ce qui convertit.',
];

const NEGOTIATION_WEEK_TIPS = [
    'La confiance vient de la connaissance de vos chiffres et de votre valeur.',
    'Définissez la portée par écrit avant de parler de prix.',
    'Le silence après votre tarif est un outil de négociation.',
    'Protégez votre temps avec des limites de révision claires.',
    'Les contrats de maintien se construisent par la cohérence et les résultats.',
];

const PRODUCTION_WEEK_TIPS = [
    'Planifiez le tournage avant d\'allumer la caméra.',
    'La qualité de l\'éclairage compte plus que la qualité de la caméra.',
    'Montez d\'abord pour la clarté, ensuite pour le style.',
    'Construisez une liste de contrôle de livraison reproductible.',
    'Traitez le travail par lots pour maintenir l\'énergie créative élevée.',
];

export const COURSE_SEED = [
    {
        id: 'ugc-creator-mastery',
        order: 1,
        title: 'Maîtrise du Créateur UGC',
        subtitle: 'Construisez votre entreprise UGC à partir de zéro',
        shortDescription: 'Un guide complet sur la façon de démarrer votre carrière UGC et de réussir.',
        description:
            'Transformez-vous de débutant complet en créateur UGC professionnel en 30 jours avec des tâches quotidiennes concrètes.',
        icon: 'videocam',
        ...COURSE_THEME_1,
        totalDays: 30,
        days: buildDays(UGC_DAY_TITLES, UGC_WEEK_TITLES, UGC_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'brand-deal-negotiation',
        order: 2,
        title: 'Négociation de Contrats de Marque',
        subtitle: 'Obtenez de meilleures offres et protégez votre valeur',
        shortDescription: 'Maîtrisez l\'art de négocier des contrats de marque et de maximiser vos revenus.',
        description:
            'Apprenez à structurer, négocier et conclure des contrats de marque en toute confiance tout en protégeant votre temps.',
        icon: 'trending-up',
        ...COURSE_THEME_2,
        totalDays: 30,
        days: buildDays(NEGOTIATION_DAY_TITLES, NEGOTIATION_WEEK_TITLES, NEGOTIATION_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'content-production-pro',
        order: 3,
        title: 'Production de Contenu Pro',
        subtitle: 'Filmez, montez et livrez comme un pro',
        shortDescription: 'Techniques de production professionnelle pour créer du UGC à forte conversion.',
        description: 'Améliorez votre flux de production avec des systèmes avancés de tournage, montage et livraison.',
        icon: 'camera',
        ...COURSE_THEME_3,
        totalDays: 30,
        days: buildDays(PRODUCTION_DAY_TITLES, PRODUCTION_WEEK_TITLES, PRODUCTION_WEEK_TIPS),
        releaseAt: buildNextMonthStart(),
    },
];
