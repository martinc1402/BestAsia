import Link from "next/link";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/best", label: "The Lists" },
  { href: "/cities", label: "City Guides" },
  { href: "/quiz", label: "Quiz" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-[20px] shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto gap-6">
        <Link
          href="/"
          className="shrink-0 text-2xl font-black text-body font-[family-name:var(--font-noto-serif)] tracking-tight"
        >
          BestPhilippines
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-600 font-[family-name:var(--font-noto-serif)] font-semibold tracking-tight hover:text-terra transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/discover"
            className="hidden sm:inline-block text-zinc-600 font-medium px-3 py-2 hover:text-terra transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
