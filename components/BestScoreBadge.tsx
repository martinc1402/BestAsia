interface BestScoreBadgeProps {
  score: number | null;
  size?: "sm" | "lg";
}

export default function BestScoreBadge({ score, size = "sm" }: BestScoreBadgeProps) {
  if (score == null) return null;
  const label = score.toFixed(1);

  if (size === "lg") {
    return (
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rust text-white font-bold text-h3 ">
        {label}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-rust text-white text-micro font-bold min-w-[28px] ">
      {label}
    </span>
  );
}
