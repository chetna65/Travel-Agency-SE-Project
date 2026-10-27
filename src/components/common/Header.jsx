/**
 * components/common/Header.jsx
 * Top navigation bar with role switcher (Tourist | Hotel Owner),
 * Reset data button, and Dark mode toggle.
 */

export function Header({
  activeRole,
  onRoleChange,
  onResetData,
  darkMode,
  onToggleDarkMode,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            ✈
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Travel Agency System
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sprint 1 · Modules 1 & 2
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Tourist | Hotel Owner) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onRoleChange('tourist')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
              activeRole === 'tourist'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tourist
          </button>
          <button
            onClick={() => onRoleChange('owner')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
              activeRole === 'owner'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hotel Owner
          </button>
        </div>

        {/* Right Actions: Reset Data & Dark Mode */}
        <div className="flex items-center gap-2">
          {/* Reset Data Button (Kept as required) */}
          <button
            onClick={onResetData}
            title="Reset database to initial seed data"
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition"
          >
            ↺ Reset data
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
