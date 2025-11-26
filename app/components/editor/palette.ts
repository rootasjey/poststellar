// Shared color palettes for editor components
export const textPalette = [
  '#111827', // gray-900
  '#374151', // gray-700
  '#6B7280', // gray-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // yellow-500
  '#10b981', // green-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
]

export const highlightPalette = [
  '#fff7ed', // amber-50
  '#ffedd5', // orange-50
  '#fef3c7', // yellow-50
  '#ecfeff', // cyan-50
  '#ecfccb', // lime-50
  '#eef2ff', // indigo-50
  '#56DFCF', // custom light teal
  '#FFD66B', // custom light yellow
  '#FF6363', // custom light red
]

export const backgroundPalette = [
  '#fff7ed',
  '#ffedd5',
  '#fef3c7',
  '#ecfeff',
  '#ecfccb',
  '#eef2ff',
  '#FEEBF6',
  '#EBD6FB',
  '#8F87F1',
  '#C68EFD',
]

export const DEFAULT_HIGHLIGHT = '#fef3c7'

// Human-friendly labels for the editor palettes. These are kept alongside the
// color arrays so multiple components can reuse the same labels.
export const colorLabelMap: Record<string, string> = {
  '#111827': 'Dark text',
  '#374151': 'Gray text',
  '#6B7280': 'Muted text',
  '#ef4444': 'Red text',
  '#f97316': 'Orange text',
  '#f59e0b': 'Yellow text',
  '#10b981': 'Green text',
  '#3b82f6': 'Blue text',
  '#6366f1': 'Indigo text',
  '#8b5cf6': 'Purple text',
  '#ec4899': 'Pink text',
}

export const backgroundLabelMap: Record<string, string> = {
  '#fff7ed': 'Warm background',
  '#ffedd5': 'Peach background',
  '#fef3c7': 'Sunny background',
  '#ecfeff': 'Cyan background',
  '#ecfccb': 'Lime background',
  '#eef2ff': 'Indigo background',
  '#FEEBF6': 'Soft pink background',
  '#EBD6FB': 'Lavender background',
  '#8F87F1': 'Periwinkle background',
  '#C68EFD': 'Lilac background',
}
