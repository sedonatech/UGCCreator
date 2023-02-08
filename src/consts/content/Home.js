import productOne from '../../../assets/images/product.jpg';
import productTwo from '../../../assets/images/product2.jpg';
import productThree from '../../../assets/images/product3.jpg';
import productFour from '../../../assets/images/product4.jpg';
import creative from '../../../assets/images/creative.jpg';
import fendi from '../../../assets/images/fendi.jpg';
import gucci from '../../../assets/images/gucci.jpg';
import redBull from '../../../assets/images/redBull.jpg';
import starBucks from '../../../assets/images/starBucks.jpg';

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

    },
];

export const CURRENT_PROJECTS_CAROUSEL = CURRENT_PROJECTS.slice(0, 3);
export const BRANDS = [
    {
        id: 4,
        image: starBucks,
        name: 'Starbucks',
        shortDescription: 'Starbucks is an American coffee company',
        description:
          'Starbucks is an American coffee company and coffeehouse chain. Starbucks was founded in Seattle, Washington in 1971. As of 2018, the company operates 28,218 locations worldwide. Starbucks is the largest coffeehouse company in the world, with 30,000 locations in over 70 countries.',
    },
    {
        id: 5,
        image: creative,
        name: 'Creative',
        shortDescription: 'Creative is a Singapore-based global company',
        description:
          'Creative is a Singapore-based global company that designs, manufactures and markets products for the audio, video, gaming, and Internet markets. Creative is the fourth-largest manufacturer of PC sound cards in the world. Creative is the fourth-largest manufacturer of PC sound cards in the world.',
    },
    {
        id: 1,
        image: fendi,
        name: 'Fendi',
        shortDescription: 'Fendi is an Italian luxury fashion house',
        description:
      'Fendi is an Italian luxury fashion house, based in Rome, founded in 1925 by Adele and Edoardo Fendi. The company is known for its fur, leather goods, and ready-to-wear. Fendi is a member of the Chambre Syndicale de la Haute Couture et de la Mode, the governing body of the French fashion industry.',
    },
    {
        id: 2,
        image: gucci,
        name: 'Gucci',
        shortDescription: 'Gucci is an Italian luxury fashion house',
        description:
      'Gucci is an Italian luxury fashion house, founded by Guccio Gucci in Florence in 1921. Gucci is the most famous Italian brand in the world. Gucci is a member of the Chambre Syndicale de la Haute Couture et de la Mode, the governing body of the French fashion industry.',
    },
    {
        id: 3,
        image: redBull,
        name: 'Red Bull',
        shortDescription: 'Red Bull is an energy drink',
        description:
      'Red Bull is an energy drink sold by Austrian company Red Bull GmbH, created in 1987. Red Bull has the highest market share of any energy drink in the world, with 7.5 billion cans sold in a year. Red Bull has been criticized for its high sugar content and marketing to children.',
    },

];

export const PROJECTS = [
    {
        id: 1,
        image: productOne,
        title: 'CoCoil',
        description: 'CoCoil is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'CoCoil is a new way',
    },
    {
        id: 2,
        image: productTwo,
        title: 'Blue Orange',
        description: 'Blue Orange is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Blue Orange is a new.',
    },
    {
        id: 3,
        image: productThree,
        title: 'Enurage',
        description: 'Enurage is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Enurage is a new way .',
    },
    {
        id: 4,
        image: productFour,
        title: 'Nexus Kicks',
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 5,
        image: fendi,
        title: 'Nexus Kicks',
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 6,
        image: productOne,
        title: 'Nexus Kicks',
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 7,
        image: gucci,
        title: 'Nexus Kicks',
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 8,
        image: productThree,
        title: 'Nexus Kicks',
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 9,
        image: productFour,
        title: 'Nexus Kicks',
        description: 'Nexus Kicks is a new way to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone. It’s a wireless charging pad that uses magnetic induction to charge your phone.',
        shortDescription: 'Nexus Kicks is a new way',
    },
    {
        id: 10,
        image: starBucks,
        title: 'Nexus Kicks',
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

export const PROFILE_INCOMPLETE_MESSAGE = 'Complete your profile fully to engage brands!';
export const PROFILE_COMPLETE_MESSAGE = 'Your profile is complete!';

export const PROFILE_INCOMPLETE_TITLE = 'Profile Incomplete';

export const NO_CURRENT_PROJECT_TITLE = 'No Current Projects';

export const NO_CURRENT_PROJECT_MESSAGE = 'You have no current projects. Check out the projects page to find a project to work on!';
