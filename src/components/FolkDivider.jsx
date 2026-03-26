export default function FolkDivider({ className = "", light = false }) {
  const color = light ? 'bg-goral-400' : 'bg-goral-400';
  const lineColor = light ? 'bg-gradient-to-r from-transparent to-goral-400' : 'bg-gradient-to-r from-transparent to-goral-400';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`h-px flex-1 max-w-24 ${lineColor}`} />
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 ${color} rotate-45`} />
        <div className={`w-3 h-3 bg-goral-500 rotate-45`} />
        <div className={`w-2 h-2 ${color} rotate-45`} />
      </div>
      <div className={`h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-goral-400`} />
    </div>
  );
}