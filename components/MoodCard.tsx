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
      className="group block rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className="text-2xl mb-2 block">{icon}</span>
      <h3 className="font-medium text-[15px]">{title}</h3>
      <p className="text-sm opacity-65 mt-0.5">{subtitle}</p>
    </Link>
  );
}
