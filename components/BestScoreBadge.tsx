interface BestScoreBadgeProps {
  score: number | null;
  size?: "sm" | "lg";
}

export default function BestScoreBadge({ score, size = "sm" }: BestScoreBadgeProps) {
  if (score == null) return null;
  const label = score.toFixed(1);

  if (size === "lg") {
    return (
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-terra text-white font-bold text-2xl shadow-lg">
        {label}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-terra text-white text-xs font-bold min-w-[28px] shadow-sm">
      {label}
    </span>
  );
}
