import {
    BLACK,
    BLACK_50,
    BRAND_BLUE,
} from '../../theme/Colors';

export const CATEGORIES = [
    {
        id: 1,
        title: 'Beauty',
        proposals: 30,
        icon: 'body-outline',
    },
    {
        id: 2,
        title: 'Business',
        proposals: 50,
        icon: 'briefcase-outline',
    },
    {
        id: 3,
        title: 'Education',
        proposals: 70,
        icon: 'book-outline',
    },
    {
        id: 4,
        title: 'Entertainment',
        proposals: 80,
        icon: 'headset-outline',
    },
    {
        id: 5,
        title: 'Finance',
        proposals: 90,
        icon: 'cash-outline',
    },
    {
        id: 6,
        title: 'Food & Drink',
        proposals: 30,
        icon: 'pizza-outline',
    },
    {
        id: 7,
        title: 'Health & Fitness',
        proposals: 30,
        icon: 'heart-outline',
    },
    {
        id: 8,
        title: 'Lifestyle',
        proposals: 30,
        icon: 'shirt-outline',
    },
    {
        id: 9,
        title: 'Medical',
        proposals: 30,
        icon: 'medkit-outline',
    },
    {
        id: 10,
        title: 'Music',
        proposals: 30,
        icon: 'musical-notes-outline',
    },
    {
        id: 11,
        title: 'News',
        proposals: 60,
        icon: 'newspaper-outline',
    },
    {
        id: 12,
        title: 'Photography',
        proposals: 80,
        icon: 'camera-outline',
    },
    {
        id: 13,
        title: 'Productivity',
        proposals: 69,
        icon: 'clipboard-outline',
    },
    {
        id: 14,
        title: 'Shopping',
        proposals: 78,
        icon: 'cart-outline',
    },
    {
        id: 15,
        title: 'Social Networking',
        proposals: 20,
        icon: 'people-outline',
    },
    {
        id: 16,
        title: 'Sports',
        proposals: 89,
        icon: 'football-outline',
    },
    {
        id: 17,
        title: 'Travel',
        proposals: 46,
        icon: 'airplane-outline',
    },
    {
        id: 18,
        title: 'Utilities',
        proposals: 220,
        icon: 'build-outline',
    },
];

export const TRENDING_CATEGORIES = CATEGORIES.filter(
    (category) => category?.proposals > 60,
);

export const STATUS = [
    {
        name: 'Enrolled',
        value: 'erolled',
    },
    {
        name: 'In Progress',
        value: 'inProgress',
    },
    {
        name: 'In Brand Review',
        value: 'inReview',
    },
    {
        name: 'Completed',
        value: 'completed',
    },
];
export const CURRENT_PROJECTS = [
    {
        id: 4,
        title: 'Vitamin C serum by L’Oreal for oily skin',
        brand: 'L’Oreal',
        progress: 0.4,
        status: 'High',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 2,
        currentStatus: STATUS[1],
    },
    {
        id: 5,
        title: 'Face care kit by Drunk Elephant for oily skin',
        brand: 'Drunk Elephant',
        progress: 0.2,
        status: 'Medium',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 10,
        currentStatus: STATUS[1],
    },
    {
        id: 6,
        title: 'Face care kit by Golde for oily skin',
        brand: 'Golde',
        progress: 0.9,
        status: 'Low',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 10,
        currentStatus: STATUS[0],
    },
    {
        id: 7,
        title: 'Face care kit by Neutrogena for oily skin',
        brand: 'Neutrogena',
        progress: 0.7,
        status: 'High',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 10,
        currentStatus: STATUS[0],
    },
    {
        id: 8,
        title: 'Face care kit by Klur for oily skin',
        brand: 'Klur',
        progress: 0.5,
        status: 'Medium',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 10,
        currentStatus: STATUS[0],
    },
    {
        id: 9,
        title: 'Face care kit by Alpyn Beauty for oily skin',
        brand: 'Alpyn Beauty',
        progress: 0.8,
        status: 'Medium',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 10,
        currentStatus: STATUS[2],
    },
    {
        id: 10,
        title: 'Face care kit by Alpyn Beauty for oily skin',
        brand: 'Alpyn Beauty',
        progress: 0.8,
        status: 'Medium',
        notifications: 3,
        documents: 5,
        comments: 10,
        daysLeft: 10,
        currentStatus: STATUS[3],
    },
];

export const CURRENT_PROJECTS_CAROUSEL = CURRENT_PROJECTS.slice(0, 3);

const sampleSize = (arr, n) => {
    if (!arr) return [];
    const shuffled = arr?.sort(() => 0.5 - Math.random());
    return shuffled?.slice(0, n);
};

export const STATS = [
    {
        id: '1',
        title: 'Total Projects',
        value: 12,
        icon: 'cube-outline',
        color: '#E6FAF7',
    },
    {
        id: '2',
        title: 'Total Proposals',
        value: 12,
        icon: 'clipboard-outline',
        color: '#FFDE9F',
    },
    {
        id: '3',
        title: 'Total Brands',
        value: 120,
        icon: 'briefcase-outline',
        color: '#E7FAFD',
    },
    {
        id: '5',
        title: 'Total Payouts',
        value: 120,
        icon: 'card-outline',
        color: '#FDE9F9',
    },
];

export const PROFILE_INCOMPLETE_MESSAGE = 'Please update your portfolio for brands to notice you!';
export const PROFILE_COMPLETE_MESSAGE = 'Your portfolio is complete!';

export const PROFILE_INCOMPLETE_TITLE = 'Portfolio Incomplete';

export const BRAND_PROFILE_INCOMPLETE_TITLE = 'Profile Incomplete';

export const BRAND_PROFILE_INCOMPLETE_MESSAGE = 'Update your profile for creators to notice you!';

export const NO_CURRENT_PROJECT_TITLE = 'No Current Projects';

export const NO_CURRENT_PROJECT_MESSAGE = 'You have not enrolled to any project. Check out the projects page to find a project to work on!';

export const BRAND_NO_CURRENT_PROJECT_TITLE = 'No Current Projects';

export const BRAND_NO_CURRENT_PROJECT_MESSAGE = 'You have no current UGC projects with any creator on this platform. Click  the button above to add a project!';

export const FEED_CATEGORIES = [
    {
        name: 'All',
        value: 'all',
    },
    {
        name: 'Ideas',
        value: 'ideas',
    },
    {
        name: 'Tips',
        value: 'tips',
    },
    {
        name: 'Video Lessons',
        value: 'videoLessons',
    },
    {
        name: 'Photo Editing',
        value: 'photoEditing',
    },
    {
        name: 'Hooks',
        value: 'hooks',

    },
    {
        name: 'CTA',
        value: 'ctaTips',
    },

];

export const DEFAULT_AVATARS = [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
];

export const chartData = {
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            data: [100, 120, 20, 40, 240, 349],
            color: (opacity = 1) => BLACK, // optional
            strokeWidth: 2, // optional
        },
    ],

};

export const chartConfig = {
    backgroundGradientFrom: BRAND_BLUE,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: BRAND_BLUE,
    backgroundGradientToOpacity: 0.2,
    color: (opacity = 1) => BLACK_50,
    strokeWidth: 2,
    useShadowColorFromDataset: false, // optional
};
