import Link from "next/link";

interface MoodCardProps {
  title: string;
  subtitle: string;
  href: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

export default function MoodCard({ title, subtitle, href, bgColor, textColor, icon }: MoodCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl p-5 hover: transition-all duration-200 "
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className="text-h3 mb-2 block">{icon}</span>
      <h3 className="font-semibold text-body-sm">{title}</h3>
      <p className="text-body-sm opacity-65 mt-0.5">{subtitle}</p>
    </Link>
  );
}
