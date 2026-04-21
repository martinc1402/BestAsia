import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-page border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h4 className="font-medium text-sm text-body mb-3">Discover</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link href="/manila/restaurants" className="hover:text-body transition-colors">Restaurants</Link></li>
              <li><Link href="/manila/bars" className="hover:text-body transition-colors">Bars</Link></li>
              <li><Link href="/manila/cafes" className="hover:text-body transition-colors">Cafes</Link></li>
              <li><Link href="/manila/nightclubs" className="hover:text-body transition-colors">Nightclubs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm text-body mb-3">The Masthead</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link href="/editors" className="hover:text-body transition-colors">The editors</Link></li>
              <li><Link href="/best" className="hover:text-body transition-colors">The Lists</Link></li>
              <li><Link href="/quiz" className="hover:text-body transition-colors">Take the Quiz</Link></li>
              <li><Link href="mailto:editors@bestphilippines.co" className="hover:text-body transition-colors">Pitch a place</Link></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <h4 className="font-medium text-sm text-body mb-3">BestPhilippines</h4>
            <p className="text-sm text-secondary max-w-xs">
              Fewer venues. Better curation. Two editors, arguing.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-secondary/60">
            A <span className="text-secondary">BestAsia</span> project
          </p>
          <p className="text-xs text-secondary/60">&copy; 2026 BestPhilippines.co</p>
        </div>
      </div>
    </footer>
  );
}
