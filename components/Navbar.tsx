import Link from "next/link";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/best", label: "The Lists" },
  { href: "/cities", label: "City Guides" },
  { href: "/quiz", label: "Quiz" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-paper/90 ">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto gap-6">
        <Link
          href="/"
          className="shrink-0 text-h3 font-bold text-ink font-display tracking-tight"
        >
          BestPhilippines
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-deep font-display font-semibold tracking-tight hover:text-rust transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/discover"
            className="hidden sm:inline-block text-stone-deep font-semibold px-3 py-2 hover:text-rust transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
