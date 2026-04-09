import { COURSE_THEME_1, COURSE_THEME_2, COURSE_THEME_3 } from './courseThemeColors';

const buildNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
};

const buildTasksForTitle = title => [
    {
        title: `Lerne ${title}`,
        description: `Verbringe 20 Minuten damit, ${title.toLowerCase()} zu studieren. Notiere drei Erkenntnisse, die du heute anwenden kannst.`,
        tag: 'Lernen',
        durationMinutes: 20,
    },
    {
        title: `Wende ${title} an`,
        description: `Absolviere eine fokussierte Übung, die ${title.toLowerCase()} in die Praxis umsetzt mit einem echten Produkt oder einem simulierten Brief.`,
        tag: 'Aktion',
        durationMinutes: 30,
    },
    {
        title: `Erstelle ein Ergebnis`,
        description: `Erstelle ein kleines Element, das beweist, dass du ${title.toLowerCase()} ausführen kannst (Notizen, Checkliste oder kurzer Clip).`,
        tag: 'Erstellen',
        durationMinutes: 25,
    },
    {
        title: 'Überprüfe und reflektiere',
        description: 'Bewerte dein Ergebnis nach Klarheit, Qualität und Geschwindigkeit. Notiere eine Verbesserung für morgen.',
        tag: 'Überprüfung',
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
            summary: `Tag ${day} konzentriert sich auf ${title.toLowerCase()}.`,
            weekTitle: weekTitles[weekIndex] || weekTitles[weekTitles.length - 1],
            tip: weekTips[weekIndex] || weekTips[weekTips.length - 1],
            tasks: buildTasksForTitle(title),
        };
    });

const UGC_DAY_TITLES = [
    'Orientierung und Ziele',
    'Creator-Denkweise und -Gewohnheiten',
    'Definiere deine Nische',
    'Zielgruppenrecherche',
    'Markenrecherche',
    'Content-Stil-Audit',
    'Erstelle deine Creator-Erklärung',
    'Ausrüstung und grundlegende Einrichtung',
    'Grundlagen von Beleuchtung und Audio',
    'Filmen mit dem Telefon',
    'B-Roll-Aufnahmen',
    'Bearbeitungs-Workflow',
    'Grundlagen des Drehbuchschreibens',
    'Hook-Formeln',
    'CTA und Struktur',
    'Portfolio-Planung',
    'Erstelle drei Beispielvideos',
    'Erstelle drei Beispielfotos',
    'Erstelle dein Medienkit',
    'Preise und Pakete',
    'Aufbau einer Kontaktliste',
    'Kaltakquise-Framework',
    'Nachfass-System',
    'Grundlagen der Verhandlung',
    'Wesentliche Vertragsbestandteile',
    'Lieferprozess',
    'Kundenkommunikation',
    'Leistungskennzahlen',
    'Skalierung durch Stapelverarbeitung',
    '30-Tage-Rückblick und nächster Plan',
];

const NEGOTIATION_DAY_TITLES = [
    'Überblick über die Deal-Landschaft',
    'Wertpositionierung',
    'Preiskartenstrategie',
    'Preispsychologie',
    'Verhandlungsvorbereitungs-Checkliste',
    'Discovery-Call-Framework',
    'Recherchiere Markenbudgets',
    'Definiere nicht verhandelbare Punkte',
    'Erstelle einen Angebotsentwurf',
    'Umfang und Liefergegenstände',
    'Nutzungsrechte und Lizenzen',
    'Exklusivitätsklauseln',
    'Whitelisting und Werbenutzung',
    'Überarbeitungsrichtlinie',
    'Zahlungsbedingungen',
    'Steuern und Rechnungsstellung',
    'E-Mail-Verhandlungsskripte',
    'Einwandbehandlung',
    'Bündelung und Upselling',
    'Zeitplanverhandlung',
    'Warnsignale in Verträgen',
    'Rechtliche Grundlagen für Creator',
    'Verhandlungs-Rollenspiel',
    'Abschlusstechniken',
    'Beziehungsaufbau',
    'Verlängerungen und Retainer',
    'Grenzen schützen',
    'Fallstudienerstellung',
    'Durchschnittliche Deal-Größe erhöhen',
    'Verhandlungsrückblick und Handbuch',
];

const PRODUCTION_DAY_TITLES = [
    'Überblick über den Produktions-Workflow',
    'Vorproduktionsplanung',
    'Storyboards und Shot-Listen',
    'Location-Scouting',
    'Set-Design und Requisiten',
    'Kameraeinstellungen',
    'Bildausschnitt und Komposition',
    'Beherrschung natürlicher Beleuchtung',
    'Künstliche Beleuchtungsaufbauten',
    'Best Practices für Audioaufnahmen',
    'Produktdemo-Aufnahmen',
    'Testimonial-Stil-Aufnahmen',
    'Lifestyle-Szenen-Aufnahmen',
    'Bewegung und Übergänge',
    'B-Roll-Vielfalt',
    'Bearbeitung für Tempo',
    'Grundlagen der Farbkorrektur',
    'Sounddesign',
    'Texteinblendungen und Untertitel',
    'Plattform-Formatierung',
    'Thumbnail- und Cover-Design',
    'Qualitätskontroll-Checkliste',
    'Dateiorganisation und Backups',
    'Zusammenarbeit mit Marken',
    'Stapelverarbeitungstag',
    'Wiederverwendung von Assets',
    'Fortgeschrittene Bearbeitungstechniken',
    'A/B-Testing von Kreativität',
    'Leistungsanalyse',
    'Produktionshandbuch und Skalierung',
];

const UGC_WEEK_TITLES = [
    'Woche 1: Grundlagen',
    'Woche 2: Produktionsgrundlagen',
    'Woche 3: Portfolio und Preisgestaltung',
    'Woche 4: Kontaktaufnahme und Lieferung',
    'Woche 5: Skalierung und Rückblick',
];

const NEGOTIATION_WEEK_TITLES = [
    'Woche 1: Wert und Vorbereitung',
    'Woche 2: Deal-Struktur',
    'Woche 3: Verhandlungsfähigkeiten',
    'Woche 4: Verträge und Abschluss',
    'Woche 5: Retainer und Wachstum',
];

const PRODUCTION_WEEK_TITLES = [
    'Woche 1: Vorproduktion',
    'Woche 2: Aufnahmefähigkeiten',
    'Woche 3: Bearbeitungsbeherrschung',
    'Woche 4: Lieferexzellenz',
    'Woche 5: Skalierung und Optimierung',
];

const UGC_WEEK_TIPS = [
    'Klarheit schlägt Komplexität. Halte jeden Liefergegenstand einfach und fokussiert.',
    'Kleine tägliche Wiederholungen erzeugen Schwung schneller als lange wöchentliche Sprints.',
    'Zeige Marken deinen Prozess, nicht nur das Endergebnis.',
    'Mache die Kundenkommunikation proaktiv und vorhersehbar.',
    'Verfolge deine Erfolge und verdoppele, was konvertiert.',
];

const NEGOTIATION_WEEK_TIPS = [
    'Selbstvertrauen kommt davon, deine Zahlen und deinen Wert zu kennen.',
    'Definiere den Umfang schriftlich, bevor du über den Preis sprichst.',
    'Stille nach deinem Preis ist ein Verhandlungswerkzeug.',
    'Schütze deine Zeit mit klaren Überarbeitungsgrenzen.',
    'Retainer werden durch Beständigkeit und Ergebnisse aufgebaut.',
];

const PRODUCTION_WEEK_TIPS = [
    'Plane die Aufnahme, bevor du die Kamera einschaltest.',
    'Beleuchtungsqualität zählt mehr als Kameraqualität.',
    'Bearbeite zuerst für Klarheit, dann für Stil.',
    'Erstelle eine wiederholbare Liefer-Checkliste.',
    'Verarbeite Arbeit stapelweise, um die kreative Energie hoch zu halten.',
];

export const COURSE_SEED = [
    {
        id: 'ugc-creator-mastery',
        order: 1,
        title: 'UGC Creator Meisterschaft',
        subtitle: 'Baue dein UGC-Business von Grund auf',
        shortDescription: 'Ein vollständiger Leitfaden, wie du deine UGC-Karriere startest und sehr erfolgreich wirst.',
        description:
            'Verwandle dich in 30 Tagen vom absoluten Anfänger zum professionellen UGC Creator mit täglichen umsetzbaren Aufgaben.',
        icon: 'videocam',
        ...COURSE_THEME_1,
        totalDays: 30,
        days: buildDays(UGC_DAY_TITLES, UGC_WEEK_TITLES, UGC_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'brand-deal-negotiation',
        order: 2,
        title: 'Marken-Deal-Verhandlung',
        subtitle: 'Sichere bessere Deals und schütze deinen Wert',
        shortDescription: 'Meistere die Kunst der Verhandlung von Marken-Deals und maximiere deine Einnahmen.',
        description:
            'Lerne, wie du Marken-Deals mit Selbstvertrauen strukturierst, verhandelst und abschließt, während du deine Zeit schützt.',
        icon: 'trending-up',
        ...COURSE_THEME_2,
        totalDays: 30,
        days: buildDays(NEGOTIATION_DAY_TITLES, NEGOTIATION_WEEK_TITLES, NEGOTIATION_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'content-production-pro',
        order: 3,
        title: 'Content-Produktion Pro',
        subtitle: 'Filme, bearbeite und liefere wie ein Profi',
        shortDescription: 'Professionelle Produktionstechniken zur Erstellung von hochkonvertierendem UGC.',
        description: 'Verbessere deinen Produktions-Workflow mit fortgeschrittenen Aufnahme-, Bearbeitungs- und Liefersystemen.',
        icon: 'camera',
        ...COURSE_THEME_3,
        totalDays: 30,
        days: buildDays(PRODUCTION_DAY_TITLES, PRODUCTION_WEEK_TITLES, PRODUCTION_WEEK_TIPS),
        releaseAt: buildNextMonthStart(),
    },
];
