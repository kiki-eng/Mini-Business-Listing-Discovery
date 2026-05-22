export type Category = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  backgroundColor: string;
};

export const CATEGORIES: Category[] = [
  {
    id: 'food-beverage',
    label: 'Food & Beverage',
    emoji: '🍔',
    color: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  {
    id: 'beauty',
    label: 'Beauty',
    emoji: '💄',
    color: '#DB2777',
    backgroundColor: '#FDF2F8',
  },
  {
    id: 'fashion',
    label: 'Fashion',
    emoji: '👗',
    color: '#9333EA',
    backgroundColor: '#FAF5FF',
  },
  {
    id: 'automotive',
    label: 'Automotive',
    emoji: '🚗',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  {
    id: 'fitness',
    label: 'Fitness',
    emoji: '🏋️',
    color: '#059669',
    backgroundColor: '#ECFDF5',
  },
  {
    id: 'technology',
    label: 'Technology',
    emoji: '💻',
    color: '#0891B2',
    backgroundColor: '#ECFEFF',
  },
  {
    id: 'business-services',
    label: 'Business Services',
    emoji: '💼',
    color: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find(
    (category) => category.label.toLowerCase() === label.toLowerCase(),
  );
}
