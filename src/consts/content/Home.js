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
  category => category?.proposals > 60,
);
