import { create } from 'zustand';

interface ThemeState {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    resetBackground: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    backgroundColor: 'from-sky-100 via-white to-sky-50', // Default sky blue/transparent feel
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    resetBackground: () => set({ backgroundColor: 'from-sky-100 via-white to-sky-50' }),
}));
