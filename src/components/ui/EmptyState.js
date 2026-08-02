export default function EmptyState({ icon="📭", title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="font-bold text-gray-800 mb-1">{title || "Heç nə tapılmadı"}</h3>
      {subtitle && <p className="text-sm text-gray-500 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
