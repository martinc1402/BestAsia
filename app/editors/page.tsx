import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Masthead — BestPhilippines",
  description:
    "The Filipino editors, critics, and cooks-gone-rogue arguing over every pick on BestPhilippines.",
};

interface Editor {
  name: string;
  initials: string;
  beat: string;
  bio: string;
  location: string;
  signature: string; // a short personal line — their editorial signature
}

const EDITORS: Editor[] = [
  {
    name: "Mika Reyes",
    initials: "MR",
    beat: "Lechon, regional Filipino, heritage kitchens",
    location: "Makati · Quezon City",
    bio: "Former line cook, now full-time eater. Grew up between Cebu and Pampanga; writes about the food that travelled to Manila with her lolas. Thinks the best sinigang is still her tita's.",
    signature:
      "If a kitchen isn't arguing about tuyo oil at 3 PM, it's not really a Filipino kitchen.",
  },
  {
    name: "Kara Lim",
    initials: "KL",
    beat: "Natural wine, cocktail bars, late-night rooms",
    location: "Poblacion · BGC",
    bio: "Seven years behind the bar, four writing about them. Still lists her favourite amaro nightly. Runs Manila's quietest tasting group, argues loudly for the loud rooms.",
    signature:
      "A great bar has one of three things: a bartender who remembers you, a cocktail worth travelling for, or a door you nearly missed.",
  },
  {
    name: "JP Cuizon",
    initials: "JP",
    beat: "Karinderya, street food, the ₱100 lunch",
    location: "Binondo · Cubao · Quezon City",
    bio: "Walked the length of Aurora Boulevard for his last piece. Eats where the taxi drivers eat. Believes the definitive Manila meal is still pancit palabok standing up, in fluorescent light.",
    signature:
      "The ₱100 lunch is the real city. Everything else is the postcard.",
  },
];

export default function EditorsPage() {
  return (
    <div className="bg-bone font-[family-name:var(--font-plus-jakarta)] text-ink min-h-[80vh]">
      {/* Masthead hero */}
      <section className="max-w-screen-2xl mx-auto px-6 sm:px-10 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-14">
        <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
          The Masthead
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.045em] leading-[0.92] text-[48px] sm:text-[80px] lg:text-[104px] max-w-[920px]">
          Three people<br />
          <span className="italic text-terra">arguing</span>, so you don&apos;t have to.
        </h1>
        <p className="mt-6 text-secondary text-[15px] sm:text-[17px] leading-[1.5] max-w-[680px]">
          BestPhilippines isn&apos;t an algorithm wearing a face. Every list is
          argued over by actual Filipinos who eat out for a living — and, on
          long Mondays, for therapy.
        </p>
      </section>

      {/* Editors */}
      <section className="max-w-screen-2xl mx-auto px-6 sm:px-10 pb-20 sm:pb-24">
        <div className="space-y-10 sm:space-y-14">
          {EDITORS.map((ed, i) => (
            <article
              key={ed.name}
              className={`grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-12 pb-10 sm:pb-14 ${
                i < EDITORS.length - 1
                  ? "border-b border-outline-variant/60"
                  : ""
              }`}
            >
              <div>
                <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full bg-terra-light text-terra flex items-center justify-center shadow-[0_4px_12px_rgba(168,57,0,0.15)]">
                  <span className="font-[family-name:var(--font-noto-serif)] text-[52px] sm:text-[60px] font-black tracking-[-0.04em] leading-none">
                    {ed.initials}
                  </span>
                </div>
                <div className="mt-3.5 text-[10px] font-extrabold tracking-[0.22em] uppercase text-outline">
                  {ed.location}
                </div>
              </div>
              <div className="min-w-0 max-w-[720px]">
                <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
                  {ed.beat}
                </div>
                <h2 className="mt-2 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.03em] leading-[0.95] text-[34px] sm:text-[48px]">
                  {ed.name}
                </h2>
                <p className="mt-4 font-[family-name:var(--font-noto-serif)] italic font-medium text-ink text-[17px] sm:text-[20px] leading-[1.35] pl-4 border-l-2 border-teal">
                  {ed.signature}
                </p>
                <p className="mt-5 text-secondary text-[14px] sm:text-[15px] leading-[1.6]">
                  {ed.bio}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 sm:mt-20 rounded-[12px] bg-ink text-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-saffron">
              Pitch the editors
            </div>
            <div className="mt-1 font-[family-name:var(--font-noto-serif)] text-[22px] sm:text-[26px] font-black tracking-[-0.02em]">
              A place we&apos;re missing?
            </div>
            <p className="mt-2 text-white/70 text-[13px] sm:text-[14px]">
              We respond to every pitch. If it&apos;s good, we&apos;ll go.
            </p>
          </div>
          <Link
            href="mailto:editors@bestphilippines.co"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-[8px] bg-saffron text-volcanic text-[13px] font-extrabold hover:bg-coral hover:text-white transition-colors"
          >
            editors@bestphilippines.co →
          </Link>
        </div>
      </section>
    </div>
  );
}
