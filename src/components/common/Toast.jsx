/**
 * components/common/Toast.jsx
 * Floating toast notification banner.
 */

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm ${
          isError
            ? 'bg-rose-50/95 border-rose-300 text-rose-900 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-200'
            : 'bg-emerald-50/95 border-emerald-300 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-200'
        }`}
      >
        <span className="text-xl">
          {isError ? '⚠️' : '✓'}
        </span>
        <div className="flex-1 text-sm font-medium">{toast.message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold ml-2"
          aria-label="Close toast"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
