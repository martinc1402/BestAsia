import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Editors — BestPhilippines",
  description:
    "Martin Casey and Yahnee Ortiz — the two editors behind every pick on BestPhilippines.",
};

interface Editor {
  name: string;
  initials: string;
  role: string;
  bio: string;
  location: string;
  signature: string;
}

const EDITORS: Editor[] = [
  {
    name: "Martin Casey",
    initials: "MC",
    role: "Co-founder · Editor",
    location: "Manila",
    bio: "Forty countries of what he calls food tourism and what everyone else calls an expensive habit. He offsets the obsession at the gym, which is the only sustainable way to keep doing this for the long haul. Manila is home, and the case for Filipino food on the world stage is the argument he keeps coming back to.",
    signature:
      "Forty countries in, and Manila is still the argument I keep coming back to.",
  },
  {
    name: "Yahnee Ortiz",
    initials: "YO",
    role: "Co-founder · Editor",
    location: "Manila · Cebu",
    bio: "Born in Cebu, which means she has strong opinions about lechon and is not shy about them. She ran a successful cake business before this, so she knows how a kitchen actually works, how brutal consistency is to maintain, and why most “great” restaurants aren’t great twice in a row. Her food politics are Filipino first — sisig, kinilaw, regional rice. She is the reason the scoring rubric takes karinderya as seriously as it takes tasting menus.",
    signature:
      "Most great restaurants aren’t great twice in a row. Consistency is the brutal part.",
  },
];

export default function EditorsPage() {
  return (
    <div className="bg-bone font-[family-name:var(--font-plus-jakarta)] text-ink min-h-[80vh]">
      {/* Masthead hero */}
      <section className="max-w-screen-2xl mx-auto px-6 sm:px-10 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-14">
        <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
          The Editors
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.045em] leading-[0.92] text-[48px] sm:text-[80px] lg:text-[104px] max-w-[920px]">
          Two editors<br />
          <span className="italic text-terra">arguing,</span> so you don&apos;t have to.
        </h1>
        <p className="mt-6 text-secondary text-[15px] sm:text-[17px] leading-[1.5] max-w-[680px]">
          BestPhilippines isn&apos;t an algorithm wearing a face. Every list is
          argued over by two Filipinos who eat out more than is probably
          reasonable, and have been arguing about dinner for years.
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
                  {ed.role}
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
              We read everything. If it&apos;s good, we&apos;ll go.
            </p>
          </div>
          <Link
            href="mailto:hello@bestphilippines.co"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-[8px] bg-saffron text-volcanic text-[13px] font-extrabold hover:bg-coral hover:text-white transition-colors"
          >
            hello@bestphilippines.co →
          </Link>
        </div>
      </section>
    </div>
  );
}
