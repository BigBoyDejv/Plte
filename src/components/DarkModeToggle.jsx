import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-goral-800/60 backdrop-blur-md border border-goral-400/30 text-amber-300 hover:text-white hover:bg-goral-700/60 transition-all active:scale-95 flex items-center justify-center"
      title={darkMode ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim'}
    >
      {darkMode ? (
        <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
      ) : (
        <Moon className="w-4 h-4 text-river-300" />
      )}
    </button>
  );
}
