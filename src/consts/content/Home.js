import { sampleSize } from 'lodash';
import productOne from '../../../assets/images/product.jpg';
import productTwo from '../../../assets/images/product2.jpg';
import productThree from '../../../assets/images/product3.jpg';
import productFour from '../../../assets/images/product4.jpg';
import creative from '../../../assets/images/creative.jpg';
import fendi from '../../../assets/images/fendi.jpg';
import gucci from '../../../assets/images/gucci.jpg';
import redBull from '../../../assets/images/redBull.jpg';
import starBucks from '../../../assets/images/starBucks.jpg';
import {
    ageFilters,
    countryFilters,
    deliveryFormatFilters,
    genderFilters,
    languageFilters,
    projectDurationFilters,
    projectFilters,
    projectTypeFilters,
} from '../AppFilters/ProjectFilters';
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
export const BRANDS = [
    {
        id: 4,
        image: starBucks,
        name: 'Starbucks',
        shortDescription: 'Starbucks is an American coffee company',
        url: 'https://www.starbucks.com/',
        description:
          'Starbucks is an American coffee company and coffeehouse chain. Starbucks was founded in Seattle, Washington in 1971. As of 2018, the company operates 28,218 locations worldwide. Starbucks is the largest coffeehouse company in the world, with 30,000 locations in over 70 countries.',
        phone: '+1 206-318-0665',
        address: '2401 Utah Ave S, Seattle, WA 98134, United States',
        email: 'starbucks@gmail.com',
        instagram: 'https://www.instagram.com/starbucks/',
        facebook: 'https://www.facebook.com/starbucks/',
        twitter: 'https://twitter.com/starbucks',
        tiktok: 'https://www.tiktok.com/@starbucks',
        linkedin: 'https://www.linkedin.com/company/starbucks/',
    },
    {
        id: 5,
        image: creative,
        name: 'Creative',
        url: 'https://www.creative.com/',
        shortDescription: 'Creative is a Singapore-based global company',
        phone: '+1 206-318-0665',
        address: '2401 Utah Ave S, Seattle, WA 98134, United States',
        email: 'starbucks@gmail.com',
        instagram: 'https://www.instagram.com/starbucks/',
        facebook: 'https://www.facebook.com/starbucks/',
        twitter: 'https://twitter.com/starbucks',
        tiktok: 'https://www.tiktok.com/@starbucks',
        linkedin: 'https://www.linkedin.com/company/starbucks/',
        description:
          'Creative is a Singapore-based global company that designs, manufactures and markets products for the audio, video, gaming, and Internet markets. Creative is the fourth-largest manufacturer of PC sound cards in the world. Creative is the fourth-largest manufacturer of PC sound cards in the world.',
    },
    {
        id: 1,
        image: fendi,
        name: 'Fendi',
        url: 'https://www.fendi.com/',
        shortDescription: 'Fendi is an Italian luxury fashion house',
        phone: '+1 206-318-0665',
        address: '2401 Utah Ave S, Seattle, WA 98134, United States',
        email: 'starbucks@gmail.com',
        instagram: 'https://www.instagram.com/starbucks/',
        facebook: 'https://www.facebook.com/starbucks/',
        twitter: 'https://twitter.com/starbucks',
        tiktok: 'https://www.tiktok.com/@starbucks',
        linkedin: 'https://www.linkedin.com/company/starbucks/',
        description:
      'Fendi is an Italian luxury fashion house, based in Rome, founded in 1925 by Adele and Edoardo Fendi. The company is known for its fur, leather goods, and ready-to-wear. Fendi is a member of the Chambre Syndicale de la Haute Couture et de la Mode, the governing body of the French fashion industry.',
    },
    {
        id: 2,
        image: gucci,
        name: 'Gucci',
        url: 'https://www.gucci.com/',
        phone: '+1 206-318-0665',
        address: '2401 Utah Ave S, Seattle, WA 98134, United States',
        email: 'starbucks@gmail.com',
        instagram: 'https://www.instagram.com/starbucks/',
        facebook: 'https://www.facebook.com/starbucks/',
        twitter: 'https://twitter.com/starbucks',
        tiktok: 'https://www.tiktok.com/@starbucks',
        shortDescription: 'Gucci is an Italian luxury fashion house',
        description:
      'Gucci is an Italian luxury fashion house, founded by Guccio Gucci in Florence in 1921. Gucci is the most famous Italian brand in the world. Gucci is a member of the Chambre Syndicale de la Haute Couture et de la Mode, the governing body of the French fashion industry.',
    },
    {
        id: 3,
        image: redBull,
        name: 'Red Bull',
        url: 'https://www.redbull.com/',
        shortDescription: 'Red Bull is an energy drink',
        phone: '+1 206-318-0665',
        address: '2401 Utah Ave S, Seattle, WA 98134, United States',
        email: 'starbucks@gmail.com',
        instagram: 'https://www.instagram.com/starbucks/',
        facebook: 'https://www.facebook.com/starbucks/',
        twitter: 'https://twitter.com/starbucks',
        tiktok: 'https://www.tiktok.com/@starbucks',
        linkedin: 'https://www.linkedin.com/company/starbucks/',
        description:
      'Red Bull is an energy drink sold by Austrian company Red Bull GmbH, created in 1987. Red Bull has the highest market share of any energy drink in the world, with 7.5 billion cans sold in a year. Red Bull has been criticized for its high sugar content and marketing to children.',
    },

];

export const PROJECTS = [
    {
        id: 1,
        image: productOne,
        title: 'CoCoil',
        description: 'The light, non-greasy formula absorbs quickly, leaving your skin feeling soft, smooth, and refreshed. Whether you\'re looking to maintain your skin\'s natural moisture balance or combat the effects of harsh environmental conditions, our skin lotion is the perfect solution.',
        shortDescription: 'Our moisturizing skin lotion is a luxurious blend of natural ingredients that work together to soothe and hydrate even the driest of skin.',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
    },
    {
        id: 2,
        image: productTwo,
        title: 'Blue Orange',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Blue Orange is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'le Orange is a new way to charge your phone. It’s a wireless charging pad.',
    },
    {
        id: 3,
        image: productThree,
        title: 'Enurage',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Enurage is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Enurage is a new way. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
    },
    {
        id: 4,
        image: productFour,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 5,
        image: fendi,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 6,
        image: productOne,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
    },
    {
        id: 7,
        image: gucci,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
    },
    {
        id: 8,
        image: productThree,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 9,
        image: productFour,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 10,
        image: starBucks,
        title: 'Nexus Kicks',
        deliveryFormat: sampleSize(deliveryFormatFilters, 2),
        socials: ['facebook', 'instagram', 'twitter'],
        startDate: '01/01/2020',
        endDate: '01/02/2020',
        priceRange: {
            min: 1000,
            max: 2000,
        },
        currency: '€',
        categories: sampleSize(projectFilters, 3),
        countries: sampleSize(countryFilters, 3),
        gender: sampleSize(genderFilters, 2),
        languages: sampleSize(languageFilters, 2),
        ageRange: sampleSize(ageFilters, 2),
        projectType: sampleSize(projectTypeFilters, 1),
        deliverFormat: sampleSize(deliveryFormatFilters, 2),
        duration: sampleSize(projectDurationFilters, 2),
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses',
        shortDescription: 'Nexus Kicks is a new way',
    },
];

export const PROJECTS_CAROUSEL = PROJECTS.slice(0, 4);

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

export const PROFILE_INCOMPLETE_MESSAGE = 'Please complete your portfolio for brands to notice you!';
export const PROFILE_COMPLETE_MESSAGE = 'Your portfolio is complete!';

export const PROFILE_INCOMPLETE_TITLE = 'Portfolio Incomplete';

export const BRAND_PROFILE_INCOMPLETE_TITLE = 'Profile Incomplete';

export const BRAND_PROFILE_INCOMPLETE_MESSAGE = 'Complete your profile for creators to notice you!';

export const NO_CURRENT_PROJECT_TITLE = 'No Current Projects';

export const NO_CURRENT_PROJECT_MESSAGE = 'You have not enrolled to any project. Check out the projects page to find a project to work on!';

export const BRAND_NO_CURRENT_PROJECT_TITLE = 'No Current Projects';

export const BRAND_NO_CURRENT_PROJECT_MESSAGE = 'You have no current projects. Click  the button above to add a project!';

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
